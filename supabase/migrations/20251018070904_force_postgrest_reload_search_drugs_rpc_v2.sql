/*
  # Force PostgREST to reload search_drugs_rpc in schema cache
  
  1. Actions
    - Drop and recreate the function to force schema refresh
    - Send multiple reload signals to PostgREST
    - Ensure permissions are correctly set
  
  2. Notes
    - This should make the function visible in the PostgREST schema cache
    - The function will be identical but freshly registered
*/

-- Drop the function
DROP FUNCTION IF EXISTS public.search_drugs_rpc(text);

-- Recreate with all columns
CREATE OR REPLACE FUNCTION public.search_drugs_rpc(search_query text)
RETURNS TABLE(
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
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO anon;
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO service_role;

-- Add comment to the function
COMMENT ON FUNCTION public.search_drugs_rpc(text) IS 'Search drugs by medication name, generic name, drug class, or indication';

-- Force PostgREST reload via multiple methods
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Send multiple reload signals
DO $$
BEGIN
  PERFORM pg_notify('pgrst', 'reload schema');
  PERFORM pg_notify('pgrst', 'reload config');
  PERFORM pg_sleep(0.1);
  PERFORM pg_notify('pgrst', 'reload schema');
END $$;
