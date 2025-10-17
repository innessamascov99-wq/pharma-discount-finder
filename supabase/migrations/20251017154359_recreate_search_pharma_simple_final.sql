/*
  # Recreate search_pharma_simple function for frontend integration

  1. Purpose
    - Drop and recreate the search_pharma_simple function
    - Ensure proper RLS policies and permissions for anon users
    - Enable frontend (Bolt) to connect and search Supabase data

  2. Changes
    - DROP existing function completely
    - Recreate with SECURITY DEFINER to bypass RLS
    - Grant EXECUTE to anon and authenticated roles
    - Ensure pharma_programs table has proper RLS policies for function access

  3. Security
    - Function uses SECURITY DEFINER to allow anon users to search
    - Returns only active programs
    - No sensitive data exposure
*/

-- Drop existing function
DROP FUNCTION IF EXISTS public.search_pharma_simple(text);

-- Recreate the search function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.search_pharma_simple(search_query text)
RETURNS TABLE(
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
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  query_lower text := LOWER(TRIM(search_query));
BEGIN
  -- Return empty result if search query is empty
  IF query_lower = '' THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.medication_name,
    p.generic_name,
    p.manufacturer,
    p.program_name,
    p.program_description,
    p.eligibility_criteria,
    p.discount_amount,
    p.program_url,
    p.phone_number,
    p.enrollment_process,
    p.required_documents,
    p.active,
    p.created_at,
    p.updated_at,
    GREATEST(
      -- Exact match gets highest score
      CASE WHEN LOWER(p.medication_name) = query_lower THEN 1.0 ELSE 0.0 END,
      -- Starts with query
      CASE WHEN LOWER(p.medication_name) LIKE query_lower || '%' THEN 0.95 ELSE 0.0 END,
      -- Generic name exact match
      CASE WHEN LOWER(p.generic_name) = query_lower THEN 0.9 ELSE 0.0 END,
      -- Trigram similarity for medication name
      similarity(LOWER(p.medication_name), query_lower) * 0.85,
      -- Trigram similarity for generic name
      similarity(LOWER(p.generic_name), query_lower) * 0.75,
      -- Contains in medication name
      CASE WHEN LOWER(p.medication_name) LIKE '%' || query_lower || '%' THEN 0.7 ELSE 0.0 END,
      -- Contains in generic name
      CASE WHEN LOWER(p.generic_name) LIKE '%' || query_lower || '%' THEN 0.6 ELSE 0.0 END,
      -- Manufacturer match
      CASE WHEN LOWER(p.manufacturer) LIKE '%' || query_lower || '%' THEN 0.5 ELSE 0.0 END,
      -- Trigram on manufacturer
      similarity(LOWER(p.manufacturer), query_lower) * 0.4
    )::numeric AS similarity
  FROM pharma_programs p
  WHERE 
    p.active = true
    AND (
      LOWER(p.medication_name) LIKE '%' || query_lower || '%'
      OR LOWER(p.generic_name) LIKE '%' || query_lower || '%'
      OR LOWER(p.manufacturer) LIKE '%' || query_lower || '%'
      OR similarity(LOWER(p.medication_name), query_lower) > 0.3
      OR similarity(LOWER(p.generic_name), query_lower) > 0.3
    )
  ORDER BY similarity DESC, p.medication_name ASC
  LIMIT 20;
END;
$$;

-- Grant execute permissions to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.search_pharma_simple(text) TO anon;
GRANT EXECUTE ON FUNCTION public.search_pharma_simple(text) TO authenticated;

-- Ensure RLS is enabled on pharma_programs (if not already)
ALTER TABLE pharma_programs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to active programs" ON pharma_programs;

-- Create a permissive policy for anon users to read active programs
CREATE POLICY "Allow public read access to active programs"
  ON pharma_programs
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Add helpful comment
COMMENT ON FUNCTION public.search_pharma_simple IS 'Search pharmaceutical assistance programs using trigram matching. Accessible by anonymous users. Returns up to 20 results sorted by relevance.';
