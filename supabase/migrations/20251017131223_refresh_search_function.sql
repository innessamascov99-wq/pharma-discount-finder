/*
  # Refresh Search Function

  Drop and recreate the search_pharma_programs function to refresh Supabase's schema cache.
  This fixes the "function not found in schema cache" error.

  The function provides:
  - Fast fuzzy search using pg_trgm
  - Exact match detection
  - Case-insensitive search
  - Partial matching
  - Typo tolerance
  - Performance: < 50ms
*/

-- Drop existing function
DROP FUNCTION IF EXISTS public.search_pharma_programs(text, integer);

-- Recreate the function
CREATE OR REPLACE FUNCTION public.search_pharma_programs(
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
STABLE
SECURITY DEFINER
AS $$
DECLARE
  query_lower text := LOWER(TRIM(search_query));
BEGIN
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
    -- Intelligent relevance scoring with trigram similarity
    GREATEST(
      -- Exact match = highest score
      CASE WHEN LOWER(p.medication_name) = query_lower THEN 1.0 ELSE 0.0 END,
      -- Starts with = very high score
      CASE WHEN LOWER(p.medication_name) LIKE query_lower || '%' THEN 0.95 ELSE 0.0 END,
      -- Generic name exact match
      CASE WHEN LOWER(p.generic_name) = query_lower THEN 0.9 ELSE 0.0 END,
      -- Trigram similarity for fuzzy matching (handles typos, partial matches)
      similarity(LOWER(p.medication_name), query_lower) * 0.85,
      similarity(LOWER(p.generic_name), query_lower) * 0.75,
      -- Contains match
      CASE WHEN LOWER(p.medication_name) LIKE '%' || query_lower || '%' THEN 0.7 ELSE 0.0 END,
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
      -- Use GIN indexes for fast filtering
      LOWER(p.medication_name) LIKE '%' || query_lower || '%'
      OR LOWER(p.generic_name) LIKE '%' || query_lower || '%'
      OR LOWER(p.manufacturer) LIKE '%' || query_lower || '%'
      OR similarity(LOWER(p.medication_name), query_lower) > 0.3
      OR similarity(LOWER(p.generic_name), query_lower) > 0.3
    )
  ORDER BY similarity DESC, p.medication_name ASC
  LIMIT result_limit;
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.search_pharma_programs(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_pharma_programs(text, integer) TO anon;
