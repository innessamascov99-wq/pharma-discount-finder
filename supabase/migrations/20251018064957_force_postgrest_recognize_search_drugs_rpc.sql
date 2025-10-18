/*
  # Force PostgREST to Recognize search_drugs_rpc
  
  1. Approach
    - Drop and recreate the function to trigger PostgREST detection
    - Use ALTER FUNCTION to change attributes (forces cache invalidation)
    - Send multiple NOTIFY signals to PostgREST
    - Add pg_sleep to allow time for cache refresh
  
  2. Function Details
    - SECURITY DEFINER: Runs with creator privileges (bypasses RLS)
    - STABLE: Indicates function doesn't modify database
    - Public schema with explicit search_path
*/

-- First, drop the function completely
DROP FUNCTION IF EXISTS public.search_drugs_rpc(text) CASCADE;

-- Wait a moment for PostgREST to process the drop
SELECT pg_sleep(0.1);

-- Recreate with all attributes
CREATE OR REPLACE FUNCTION public.search_drugs_rpc(search_query text)
RETURNS TABLE (
  id uuid,
  medication_name text,
  generic_name text,
  manufacturer text,
  drug_class text,
  indication text,
  typical_retail_price text,
  active boolean,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
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
    d.typical_retail_price,
    d.active,
    d.created_at
  FROM public.drugs d
  WHERE d.active = true
    AND (
      d.medication_name ILIKE '%' || search_query || '%'
      OR d.generic_name ILIKE '%' || search_query || '%'
      OR d.drug_class ILIKE '%' || search_query || '%'
      OR d.indication ILIKE '%' || search_query || '%'
    )
  ORDER BY d.medication_name
  LIMIT 20;
END;
$$;

-- Grant permissions explicitly to all roles
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO anon;
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO service_role;

-- Add function comment
COMMENT ON FUNCTION public.search_drugs_rpc IS 'Search drugs by medication name, generic name, drug class, or indication';

-- Try multiple ways to signal PostgREST
DO $$
BEGIN
  PERFORM pg_notify('pgrst', 'reload schema');
  PERFORM pg_notify('pgrst', 'reload config');
  PERFORM pg_sleep(0.1);
  PERFORM pg_notify('pgrst', 'reload schema');
END $$;

-- Also use NOTIFY command
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
