/*
  # Fix pharma_programs API access
  
  This migration ensures the pharma_programs table is properly accessible through the Supabase API
  by explicitly granting permissions and refreshing the schema cache.
  
  1. Changes
    - Revoke and re-grant all necessary permissions to API roles
    - Ensure RLS policies are properly configured
    - Force PostgREST schema cache reload
*/

-- Ensure the table has proper grants for all roles
GRANT ALL ON pharma_programs TO anon, authenticated, service_role;

-- Verify RLS is enabled
ALTER TABLE pharma_programs ENABLE ROW LEVEL SECURITY;

-- Recreate the public read policy to ensure it's active
DROP POLICY IF EXISTS "Anyone can view active programs" ON pharma_programs;
CREATE POLICY "Anyone can view active programs"
  ON pharma_programs
  FOR SELECT
  TO public
  USING (active = true);

-- Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
