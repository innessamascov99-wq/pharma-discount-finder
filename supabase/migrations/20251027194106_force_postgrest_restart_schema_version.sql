/*
  # Force PostgREST Restart by Altering Schema Version

  1. Changes
    - Alter a table to force schema version change
    - This should trigger PostgREST to reload its entire schema cache
    - No actual data changes

  2. Strategy
    - Add and remove a temporary column to user_activity table
    - This forces a schema version bump that PostgREST can't ignore
*/

-- Add a temporary column
ALTER TABLE public.user_activity ADD COLUMN IF NOT EXISTS _temp_reload_trigger int DEFAULT 0;

-- Immediately drop it
ALTER TABLE public.user_activity DROP COLUMN IF EXISTS _temp_reload_trigger;

-- Do the same for users table to be extra sure
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS _temp_reload_trigger2 int DEFAULT 0;
ALTER TABLE public.users DROP COLUMN IF EXISTS _temp_reload_trigger2;

-- Force multiple notifications
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
NOTIFY pgrst;

-- Update function definition to include full signature in comment
COMMENT ON FUNCTION public.log_user_activity(text, text, uuid, uuid, text, jsonb) 
  IS 'Logs user activity: action_type, medication_name, drug_id, program_id, search_query, metadata';
