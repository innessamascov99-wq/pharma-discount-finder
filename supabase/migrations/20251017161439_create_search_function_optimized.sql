/*
  # Create Optimized Search Function

  1. Function
    - `search_pharma_programs` - Fast fuzzy search using pg_trgm
    - Returns results sorted by relevance
    - Searches medication name, generic name, manufacturer, and description

  2. Performance
    - Uses GIN indexes for fast text matching
    - Returns similarity scores
    - Limits results to top 20 matches
*/

CREATE OR REPLACE FUNCTION search_pharma_programs(search_query text)
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
  similarity real
)
LANGUAGE plpgsql
STABLE
AS $$
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
    GREATEST(
      similarity(LOWER(p.medication_name), LOWER(search_query)),
      similarity(LOWER(p.generic_name), LOWER(search_query)),
      similarity(LOWER(p.manufacturer), LOWER(search_query)),
      similarity(LOWER(p.program_description), LOWER(search_query))
    )::real as similarity
  FROM pharma_programs p
  WHERE 
    p.active = true
    AND (
      LOWER(p.medication_name) % LOWER(search_query)
      OR LOWER(p.generic_name) % LOWER(search_query)
      OR LOWER(p.manufacturer) % LOWER(search_query)
      OR LOWER(p.program_description) % LOWER(search_query)
      OR LOWER(p.medication_name) LIKE LOWER('%' || search_query || '%')
      OR LOWER(p.generic_name) LIKE LOWER('%' || search_query || '%')
      OR LOWER(p.manufacturer) LIKE LOWER('%' || search_query || '%')
    )
  ORDER BY similarity DESC, p.medication_name ASC
  LIMIT 20;
END;
$$;

GRANT EXECUTE ON FUNCTION search_pharma_programs(text) TO public;
