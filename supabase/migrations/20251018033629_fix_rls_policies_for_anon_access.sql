/*
  # Fix RLS Policies for Anonymous Access

  1. Changes
    - Update RLS policies on drugs, programs, and drugs_programs tables
    - Change from `TO public` to `TO anon, authenticated`
    - This allows both anonymous and authenticated users to access data
    - Ensures the anon key works properly for search functionality

  2. Security
    - Maintains read-only access for public data
    - No changes to write permissions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active drugs" ON drugs;
DROP POLICY IF EXISTS "Anyone can view active programs" ON programs;
DROP POLICY IF EXISTS "Anyone can view drug-program relationships" ON drugs_programs;

-- Create new policies with explicit anon and authenticated roles
CREATE POLICY "Allow anon and authenticated to view active drugs"
  ON drugs
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Allow anon and authenticated to view active programs"
  ON programs
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Allow anon and authenticated to view drug-program relationships"
  ON drugs_programs
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Ensure functions are executable by anon role
GRANT EXECUTE ON FUNCTION search_drugs(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_programs(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_programs_for_drug(uuid) TO anon, authenticated;
