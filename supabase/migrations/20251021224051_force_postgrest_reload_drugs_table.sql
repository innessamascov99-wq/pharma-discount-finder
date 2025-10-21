/*
  # Force PostgREST Schema Cache Reload
  
  Forces PostgREST to recognize the drugs table by making a schema change.
*/

-- Ensure RLS policies allow anonymous read access
DROP POLICY IF EXISTS "Allow anonymous read access to drugs" ON public.drugs;
CREATE POLICY "Allow anonymous read access to drugs"
  ON public.drugs
  FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Allow anonymous read access to programs" ON public.programs;
CREATE POLICY "Allow anonymous read access to programs"
  ON public.programs
  FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Allow anonymous read access to drugs_programs" ON public.drugs_programs;
CREATE POLICY "Allow anonymous read access to drugs_programs"
  ON public.drugs_programs
  FOR SELECT
  TO anon
  USING (true);

-- Notify PostgREST of schema changes
NOTIFY pgrst, 'reload schema';
