/*
  # Force complete PostgREST schema reload
  
  1. Actions
    - Create a new public table to force schema detection
    - Update table ownership and permissions
    - Recreate views and functions with explicit schema references
    - Send schema reload signals
  
  2. Notes
    - This creates a dummy table that PostgREST must recognize
    - The presence of a new table forces a complete schema rescan
*/

-- Create a dummy table that will force PostgREST to reload
CREATE TABLE IF NOT EXISTS public.postgrest_cache_reload (
  id serial PRIMARY KEY,
  reload_timestamp timestamptz DEFAULT now(),
  message text
);

-- Make it publicly readable
ALTER TABLE public.postgrest_cache_reload ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all to read reload table"
  ON public.postgrest_cache_reload
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.postgrest_cache_reload TO anon;
GRANT SELECT ON public.postgrest_cache_reload TO authenticated;

-- Insert a record
INSERT INTO public.postgrest_cache_reload (message) 
VALUES ('PostgREST schema cache reload forced at ' || now()::text);

-- Now explicitly expose drugs and programs tables
COMMENT ON TABLE public.drugs IS 'Pharmaceutical drugs table - exposed for PostgREST API';
COMMENT ON TABLE public.programs IS 'Assistance programs table - exposed for PostgREST API';

-- Re-grant all permissions explicitly
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.drugs TO anon, authenticated;
GRANT SELECT ON public.programs TO anon, authenticated;
GRANT SELECT ON public.postgrest_cache_reload TO anon, authenticated;

-- Ensure all sequences are accessible
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Recreate the RPC functions with explicit SECURITY INVOKER
DROP FUNCTION IF EXISTS public.search_drugs_rpc(text);
CREATE FUNCTION public.search_drugs_rpc(search_query text)
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
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
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
$$;

-- Grant execute on the function
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO anon, authenticated;

-- Add detailed comments
COMMENT ON FUNCTION public.search_drugs_rpc(text) IS 'Search drugs by medication name, generic name, drug class, or indication';
COMMENT ON TABLE public.drugs IS 'Pharmaceutical drugs and medications database';
COMMENT ON COLUMN public.drugs.medication_name IS 'Brand name of the medication';
COMMENT ON COLUMN public.drugs.generic_name IS 'Generic/chemical name of the drug';
COMMENT ON COLUMN public.drugs.active IS 'Whether the drug record is active and visible';

-- Force PostgREST to reload by sending multiple signals
DO $$
BEGIN
  -- Send reload signals with delays
  PERFORM pg_notify('pgrst', 'reload schema');
  PERFORM pg_sleep(0.2);
  PERFORM pg_notify('pgrst', 'reload config');
  PERFORM pg_sleep(0.2);
  PERFORM pg_notify('pgrst', 'reload schema');
END $$;

-- Final reload
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
