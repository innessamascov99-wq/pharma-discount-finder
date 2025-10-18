/*
  # Aggressive PostgREST Schema Cache Reload
  
  1. Issue
    - PostgREST error: "could not find public.drugs in schema cache"
    - Previous reload attempts haven't propagated yet
    
  2. Strategy
    - Make a dummy schema change to force immediate reload
    - Add and remove a temporary column (guarantees reload)
    - Re-grant all permissions
    - Send multiple reload signals
*/

-- Step 1: Make a dummy change to force PostgREST reload
ALTER TABLE public.drugs ADD COLUMN IF NOT EXISTS temp_reload_trigger BOOLEAN DEFAULT false;
ALTER TABLE public.drugs DROP COLUMN IF EXISTS temp_reload_trigger;

-- Step 2: Update table comments (another trigger)
COMMENT ON TABLE public.drugs IS 'Pharmaceutical drugs - PostgREST API exposed - Last reload: NOW()';
COMMENT ON TABLE public.programs IS 'Discount programs - PostgREST API exposed - Last reload: NOW()';
COMMENT ON TABLE public.drugs_programs IS 'Drug-program relationships - PostgREST API exposed - Last reload: NOW()';

-- Step 3: Ensure all roles have proper access
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;

-- Step 4: Refresh RLS policies
DROP POLICY IF EXISTS "Anyone can view active drugs" ON public.drugs;
CREATE POLICY "Anyone can view active drugs"
  ON public.drugs
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

DROP POLICY IF EXISTS "Anyone can view active programs" ON public.programs;
CREATE POLICY "Anyone can view active programs"
  ON public.programs
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

DROP POLICY IF EXISTS "Anyone can view drug-program relationships" ON public.drugs_programs;
CREATE POLICY "Anyone can view drug-program relationships"
  ON public.drugs_programs
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Step 5: Send multiple reload signals
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Step 6: Log status
DO $$
DECLARE
  drug_count INT;
  program_count INT;
BEGIN
  SELECT COUNT(*) INTO drug_count FROM public.drugs WHERE active = true;
  SELECT COUNT(*) INTO program_count FROM public.programs WHERE active = true;
  
  RAISE NOTICE '=== PostgREST Cache Reload Triggered ===';
  RAISE NOTICE 'Active drugs: %', drug_count;
  RAISE NOTICE 'Active programs: %', program_count;
  RAISE NOTICE 'Tables should now be visible in PostgREST API';
END $$;
