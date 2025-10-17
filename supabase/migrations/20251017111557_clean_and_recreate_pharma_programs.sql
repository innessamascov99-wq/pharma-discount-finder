/*
  # Clean Slate: Recreate Pharma Programs Table
  
  1. Cleanup
     - Drop all existing pharma-related functions
     - Drop all existing pharma-related indexes
     - Drop pharma_programs table if exists
  
  2. New Table Creation
     - `pharma_programs` with clean, simple structure
     - Essential columns only for medication assistance programs
  
  3. Security
     - Enable RLS
     - Add public read-only policy for active programs
  
  4. Search Function
     - Simple text-based search function
     - No vector embeddings (avoiding complexity)
*/

-- Drop all functions first (to avoid dependency issues)
DROP FUNCTION IF EXISTS generate_pharma_program_embeddings() CASCADE;
DROP FUNCTION IF EXISTS generate_pharma_search_text(record) CASCADE;
DROP FUNCTION IF EXISTS update_pharma_search_text_trigger() CASCADE;
DROP FUNCTION IF EXISTS search_pharma_programs_vector(text, integer, numeric) CASCADE;
DROP FUNCTION IF EXISTS search_pharma_programs_optimized(text, integer) CASCADE;
DROP FUNCTION IF EXISTS search_pharma_programs_simple(text, integer) CASCADE;
DROP FUNCTION IF EXISTS search_pharma_programs(text, integer) CASCADE;

-- Drop the table (this will drop all indexes automatically)
DROP TABLE IF EXISTS pharma_programs CASCADE;

-- Create fresh table
CREATE TABLE pharma_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_name text NOT NULL,
  generic_name text NOT NULL,
  manufacturer text NOT NULL,
  program_name text NOT NULL,
  program_description text NOT NULL DEFAULT '',
  eligibility_criteria text NOT NULL DEFAULT '',
  discount_amount text NOT NULL DEFAULT '',
  program_url text NOT NULL DEFAULT '',
  phone_number text NOT NULL DEFAULT '',
  enrollment_process text NOT NULL DEFAULT '',
  required_documents text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create simple indexes for search performance
CREATE INDEX idx_pharma_medication_name ON pharma_programs(medication_name);
CREATE INDEX idx_pharma_generic_name ON pharma_programs(generic_name);
CREATE INDEX idx_pharma_manufacturer ON pharma_programs(manufacturer);
CREATE INDEX idx_pharma_active ON pharma_programs(active) WHERE active = true;

-- Enable RLS
ALTER TABLE pharma_programs ENABLE ROW LEVEL SECURITY;

-- Public can read active programs
CREATE POLICY "Public can view active programs"
  ON pharma_programs
  FOR SELECT
  TO public
  USING (active = true);

-- Admin can do everything (for future admin panel)
CREATE POLICY "Authenticated users can manage programs"
  ON pharma_programs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create simple search function
CREATE OR REPLACE FUNCTION search_pharma_programs(
  search_query text,
  result_limit integer DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  medication_name text,
  generic_name text,
  manufacturer text,
  program_name text,
  program_description text,
  eligibility_criteria text,
  discount_amount text,
  program_url text,
  phone_number text,
  enrollment_process text,
  required_documents text,
  active boolean,
  created_at timestamptz,
  updated_at timestamptz,
  similarity numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.*,
    CASE
      WHEN LOWER(p.medication_name) = LOWER(search_query) THEN 1.0
      WHEN LOWER(p.medication_name) LIKE LOWER(search_query) || '%' THEN 0.9
      WHEN LOWER(p.generic_name) = LOWER(search_query) THEN 0.85
      WHEN LOWER(p.generic_name) LIKE LOWER(search_query) || '%' THEN 0.8
      WHEN LOWER(p.medication_name) LIKE '%' || LOWER(search_query) || '%' THEN 0.7
      WHEN LOWER(p.generic_name) LIKE '%' || LOWER(search_query) || '%' THEN 0.6
      WHEN LOWER(p.manufacturer) LIKE '%' || LOWER(search_query) || '%' THEN 0.5
      WHEN LOWER(p.program_name) LIKE '%' || LOWER(search_query) || '%' THEN 0.4
      WHEN LOWER(p.program_description) LIKE '%' || LOWER(search_query) || '%' THEN 0.3
      ELSE 0.1
    END::numeric AS similarity
  FROM pharma_programs p
  WHERE 
    p.active = true
    AND (
      LOWER(p.medication_name) LIKE '%' || LOWER(search_query) || '%'
      OR LOWER(p.generic_name) LIKE '%' || LOWER(search_query) || '%'
      OR LOWER(p.manufacturer) LIKE '%' || LOWER(search_query) || '%'
      OR LOWER(p.program_name) LIKE '%' || LOWER(search_query) || '%'
      OR LOWER(p.program_description) LIKE '%' || LOWER(search_query) || '%'
    )
  ORDER BY similarity DESC
  LIMIT result_limit;
END;
$$;

-- Grant execute to everyone
GRANT EXECUTE ON FUNCTION search_pharma_programs TO public, anon, authenticated;
