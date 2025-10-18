/*
  # Force PostgREST to Recognize search_drugs_rpc Function
  
  1. Changes
    - Drop all existing search functions completely
    - Create fresh search_drugs_rpc function with explicit permissions
    - Set function as STABLE (cacheable, no side effects)
    - Grant execute to anon, authenticated, and service_role
    - Force schema cache reload via multiple methods
  
  2. Security
    - RLS bypassed via SECURITY DEFINER
    - Only returns active drugs
    - Limited to 20 results
*/

-- Drop any existing search functions
DROP FUNCTION IF EXISTS public.search_drugs_rpc(text) CASCADE;
DROP FUNCTION IF EXISTS public.search_pharma_simple(text) CASCADE;
DROP FUNCTION IF EXISTS public.search_pharma_programs(text) CASCADE;

-- Create the function with all required attributes
CREATE FUNCTION public.search_drugs_rpc(search_query text)
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

-- Grant execute permissions to all roles
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO anon;
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO postgres;

-- Add comment for documentation
COMMENT ON FUNCTION public.search_drugs_rpc(text) IS 'Search drugs by name, generic name, class, or indication. Returns up to 20 active drugs.';

-- Force PostgREST schema cache reload using multiple methods
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Also try signaling via pg_notify
SELECT pg_notify('pgrst', 'reload schema');
