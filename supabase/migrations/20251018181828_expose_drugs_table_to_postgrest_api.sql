/*
  # Expose Drugs Table to PostgREST API
  
  1. Issue
    - PostgREST cannot find public.drugs in schema cache
    - Need to force PostgREST to recognize the table
    
  2. Actions
    - Add comment to table (triggers schema reload)
    - Grant explicit permissions
    - Refresh RLS policies
    - Send reload notification
*/

-- Add table comment (this triggers PostgREST schema reload)
COMMENT ON TABLE public.drugs IS 'Pharmaceutical drugs available for discount programs - exposed via API';

-- Ensure anonymous users can access via API
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.drugs TO anon;
GRANT SELECT ON public.programs TO anon;
GRANT SELECT ON public.drugs_programs TO anon;

-- Recreate the RLS policy to ensure it's fresh
DROP POLICY IF EXISTS "Anyone can view active drugs" ON public.drugs;
CREATE POLICY "Anyone can view active drugs"
  ON public.drugs
  FOR SELECT
  TO public
  USING (active = true);

-- Force PostgREST reload
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Verify table is accessible
DO $$
DECLARE
  drug_count INT;
BEGIN
  SELECT COUNT(*) INTO drug_count FROM public.drugs WHERE active = true;
  RAISE NOTICE 'Active drugs in table: %', drug_count;
END $$;
