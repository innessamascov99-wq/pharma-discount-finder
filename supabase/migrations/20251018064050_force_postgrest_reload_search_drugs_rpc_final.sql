/*
  # Force PostgREST Schema Cache Reload for search_drugs_rpc
  
  1. Changes
    - Drop and recreate search_drugs_rpc function to force PostgREST detection
    - Add explicit SECURITY DEFINER
    - Grant execute permissions to anon and authenticated roles
    - Send NOTIFY to pgrst schema cache channel
  
  2. Security
    - Function is SECURITY DEFINER so it runs with creator privileges
    - Explicitly grants execute to anon role for public access
*/

-- Drop existing function
DROP FUNCTION IF EXISTS public.search_drugs_rpc(text);

-- Recreate the function with explicit permissions
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

-- Grant execute permissions explicitly
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO anon;
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO service_role;

-- Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
