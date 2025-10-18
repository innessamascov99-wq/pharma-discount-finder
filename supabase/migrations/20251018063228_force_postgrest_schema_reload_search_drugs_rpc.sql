/*
  # Force PostgREST Schema Cache Reload for search_drugs_rpc
  
  1. Purpose
    - Force PostgREST to reload its schema cache and expose the search_drugs_rpc function
    - Ensure the function is accessible via REST API and Supabase client
  
  2. Changes
    - Drop and recreate the search_drugs_rpc function with proper SECURITY DEFINER
    - Grant explicit EXECUTE permissions to anon and authenticated roles
    - Notify PostgREST of schema changes using pgrst.reload_schema()
  
  3. Security
    - Function uses SECURITY DEFINER to bypass RLS for search operations
    - Only allows SELECT operations, no data modification
    - Accessible to anonymous and authenticated users
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.search_drugs_rpc(text);

-- Recreate the function with proper permissions
CREATE OR REPLACE FUNCTION public.search_drugs_rpc(search_query text)
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
SET search_path = public
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

-- Grant execute permissions to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO anon;
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO authenticated;

-- Add function comment for documentation
COMMENT ON FUNCTION public.search_drugs_rpc(text) IS 'Search drugs by medication name, generic name, manufacturer, indication, or description. Returns up to 50 active drugs.';

-- Notify PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
