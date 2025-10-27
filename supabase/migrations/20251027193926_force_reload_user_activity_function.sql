/*
  # Force PostgREST Schema Cache Reload for User Activity Function

  1. Changes
    - Drop and recreate log_user_activity function to force cache invalidation
    - Recreate with exact same signature and logic
    - Add dummy schema change to trigger PostgREST reload

  2. Security
    - No security changes, maintaining existing grants
*/

-- Drop existing function
DROP FUNCTION IF EXISTS public.log_user_activity(text, text, uuid, uuid, text, jsonb);

-- Recreate function with exact same logic
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_action_type text,
  p_medication_name text DEFAULT NULL,
  p_drug_id uuid DEFAULT NULL,
  p_program_id uuid DEFAULT NULL,
  p_search_query text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_activity_id uuid;
BEGIN
  -- Get current user ID from auth context
  v_user_id := auth.uid();
  
  -- If user is not authenticated, return NULL
  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Insert activity log
  INSERT INTO public.user_activity (
    user_id,
    action_type,
    medication_name,
    drug_id,
    program_id,
    search_query,
    metadata
  ) VALUES (
    v_user_id,
    p_action_type,
    p_medication_name,
    p_drug_id,
    p_program_id,
    p_search_query,
    p_metadata
  )
  RETURNING id INTO v_activity_id;
  
  RETURN v_activity_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.log_user_activity(text, text, uuid, uuid, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_user_activity(text, text, uuid, uuid, text, jsonb) TO anon;

-- Add comment to function
COMMENT ON FUNCTION public.log_user_activity IS 'Logs user activity for tracking searches, views, and interactions';

-- Force schema cache reload by creating and dropping a dummy table
CREATE TABLE IF NOT EXISTS _cache_reload_trigger_activity (id int);
DROP TABLE IF EXISTS _cache_reload_trigger_activity;

-- Notify PostgREST of schema change
NOTIFY pgrst, 'reload schema';
