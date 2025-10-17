/*
  # Refresh search_pharma_simple function to clear schema cache

  1. Purpose
    - Drop and recreate the search_pharma_simple function
    - Forces Supabase to refresh its schema cache
    - Resolves "function not found in schema cache" errors

  2. Changes
    - DROP and recreate search_pharma_simple function
    - Same logic, just forces cache refresh
*/

-- Drop the function if it exists
DROP FUNCTION IF EXISTS public.search_pharma_simple(text);

-- Recreate the function
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
    GREATEST(
      CASE WHEN LOWER(p.medication_name) = query_lower THEN 1.0 ELSE 0.0 END,
      CASE WHEN LOWER(p.medication_name) LIKE query_lower || '%' THEN 0.95 ELSE 0.0 END,
      CASE WHEN LOWER(p.generic_name) = query_lower THEN 0.9 ELSE 0.0 END,
      similarity(LOWER(p.medication_name), query_lower) * 0.85,
      similarity(LOWER(p.generic_name), query_lower) * 0.75,
      CASE WHEN LOWER(p.medication_name) LIKE '%' || query_lower || '%' THEN 0.7 ELSE 0.0 END,
      CASE WHEN LOWER(p.generic_name) LIKE '%' || query_lower || '%' THEN 0.6 ELSE 0.0 END,
      CASE WHEN LOWER(p.manufacturer) LIKE '%' || query_lower || '%' THEN 0.5 ELSE 0.0 END,
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

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.search_pharma_simple(text) TO anon;
GRANT EXECUTE ON FUNCTION public.search_pharma_simple(text) TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.search_pharma_simple IS 'Fast pharmaceutical program search using trigram matching. Returns up to 20 results sorted by relevance.';
