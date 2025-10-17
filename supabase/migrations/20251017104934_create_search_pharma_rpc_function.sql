/*
  # Create RPC function for pharma program search
  
  This migration creates a database function that can be called via RPC
  to search pharma programs, bypassing any PostgREST schema cache issues.
  
  1. New Functions
    - `search_pharma_programs(search_query text, result_limit int)` - Returns matching programs
*/

-- Drop function if exists
DROP FUNCTION IF EXISTS search_pharma_programs(text, int);

-- Create search function
CREATE OR REPLACE FUNCTION search_pharma_programs(
  search_query text,
  result_limit int DEFAULT 20
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
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  lower_search_term text;
BEGIN
  lower_search_term := lower(trim(search_query));
  
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
    p.updated_at
  FROM pharma_programs p
  WHERE p.active = true
    AND (
      lower(p.medication_name) LIKE '%' || lower_search_term || '%'
      OR lower(p.generic_name) LIKE '%' || lower_search_term || '%'
      OR lower(p.manufacturer) LIKE '%' || lower_search_term || '%'
      OR lower(p.program_name) LIKE '%' || lower_search_term || '%'
      OR lower(p.program_description) LIKE '%' || lower_search_term || '%'
    )
  ORDER BY 
    CASE 
      WHEN lower(p.medication_name) = lower_search_term THEN 1
      WHEN lower(p.medication_name) LIKE lower_search_term || '%' THEN 2
      WHEN lower(p.generic_name) = lower_search_term THEN 3
      WHEN lower(p.generic_name) LIKE lower_search_term || '%' THEN 4
      ELSE 5
    END,
    p.medication_name
  LIMIT result_limit;
END;
$$;

-- Grant execute permission to all roles
GRANT EXECUTE ON FUNCTION search_pharma_programs(text, int) TO anon, authenticated, service_role;
