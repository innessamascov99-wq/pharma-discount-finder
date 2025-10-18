/*
  # Create search_drugs_rpc function with automatic schema reload trigger
  
  1. Purpose
    - Create the search_drugs_rpc function that PostgREST will expose
    - Use a different approach to force schema cache reload
  
  2. Strategy
    - Drop and recreate with a comment change to trigger PostgREST detection
    - Ensure proper permissions and security settings
  
  3. Security
    - SECURITY DEFINER to bypass RLS
    - Explicit grants to anon and authenticated roles
*/

-- Drop the function completely
DROP FUNCTION IF EXISTS public.search_drugs_rpc(text) CASCADE;

-- Wait a moment for the drop to be processed
DO $$ 
BEGIN 
  PERFORM pg_sleep(0.1); 
END $$;

-- Create the function with a unique comment to force detection
CREATE FUNCTION public.search_drugs_rpc(search_query text)
RETURNS TABLE (
  id uuid,
  medication_name text,
  generic_name text,
  manufacturer text,
  drug_class text,
  indication text,
  dosage_forms text,
  common_dosages text,
  typical_retail_price text,
  fda_approval_date date,
  description text,
  side_effects text,
  warnings text,
  active boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.medication_name,
    d.generic_name,
    d.manufacturer,
    d.drug_class,
    d.indication,
    d.dosage_forms,
    d.common_dosages,
    d.typical_retail_price,
    d.fda_approval_date,
    d.description,
    d.side_effects,
    d.warnings,
    d.active,
    d.created_at,
    d.updated_at
  FROM drugs d
  WHERE 
    d.active = true
    AND (
      d.medication_name ILIKE '%' || search_query || '%'
      OR d.generic_name ILIKE '%' || search_query || '%'
      OR d.manufacturer ILIKE '%' || search_query || '%'
      OR d.indication ILIKE '%' || search_query || '%'
      OR d.description ILIKE '%' || search_query || '%'
    )
  ORDER BY d.medication_name
  LIMIT 50;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc TO anon;
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc TO service_role;

-- Add a unique comment with timestamp to force schema detection
COMMENT ON FUNCTION public.search_drugs_rpc(text) IS 'RPC: Search drugs by name, generic, manufacturer, indication - Created at 2025-10-18T06:32:00Z';

-- Send notification to PostgREST
NOTIFY pgrst, 'reload schema';

-- Also try the ddl_command_end event
DO $$
BEGIN
  PERFORM pg_notify('pgrst', 'reload config');
  PERFORM pg_notify('pgrst', 'reload schema');
END $$;
