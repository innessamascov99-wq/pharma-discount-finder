/*
  # Force PostgREST to recognize drugs and programs tables
  
  1. Actions
    - Add comments to tables to trigger schema change
    - Re-enable RLS to force recognition
    - Send multiple reload signals
  
  2. Notes
    - This should make tables visible in PostgREST's schema cache
*/

-- Add/update comments on tables to trigger schema change detection
COMMENT ON TABLE public.drugs IS 'Pharmaceutical drugs and medications - Updated for schema cache';
COMMENT ON TABLE public.programs IS 'Pharmaceutical assistance programs - Updated for schema cache';

-- Disable and re-enable RLS to trigger PostgREST
ALTER TABLE public.drugs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.drugs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.programs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Re-create the policies
DROP POLICY IF EXISTS "Allow anon and authenticated to view active drugs" ON public.drugs;
CREATE POLICY "Allow anon and authenticated to view active drugs"
  ON public.drugs
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

DROP POLICY IF EXISTS "Allow anon and authenticated to view active programs" ON public.programs;
CREATE POLICY "Allow anon and authenticated to view active programs"
  ON public.programs
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Grant table permissions explicitly
GRANT SELECT ON public.drugs TO anon;
GRANT SELECT ON public.drugs TO authenticated;
GRANT SELECT ON public.programs TO anon;
GRANT SELECT ON public.programs TO authenticated;

-- Add comments on columns to force more schema changes
COMMENT ON COLUMN public.drugs.medication_name IS 'Brand name of the medication';
COMMENT ON COLUMN public.drugs.generic_name IS 'Generic/chemical name';
COMMENT ON COLUMN public.programs.program_name IS 'Name of the assistance program';

-- Send multiple reload signals
DO $$
DECLARE
  i INTEGER;
BEGIN
  FOR i IN 1..10 LOOP
    PERFORM pg_notify('pgrst', 'reload schema');
    PERFORM pg_sleep(0.05);
  END LOOP;
END $$;

-- Final reload signals
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
