/*
  # Force Schema Cache Refresh for Search Functions
  
  This migration recreates the search functions to force PostgREST to reload the schema cache.
  
  1. Changes
    - Drop and recreate search_drugs function
    - Drop and recreate search_programs function  
    - Drop and recreate get_programs_for_drug function
    - Grant execute permissions to anon and authenticated roles
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS search_drugs(text);
DROP FUNCTION IF EXISTS search_programs(text);
DROP FUNCTION IF EXISTS get_programs_for_drug(uuid);

-- Recreate search_drugs function
CREATE OR REPLACE FUNCTION search_drugs(search_query text)
RETURNS TABLE (
  id uuid,
  medication_name text,
  generic_name text,
  manufacturer text,
  drug_class text,
  indication text,
  dosage_forms text,
  common_dosages text,
  typical_retail_price text,
  fda_approval_date date,
  description text,
  side_effects text,
  warnings text,
  active boolean,
  created_at timestamptz,
  updated_at timestamptz,
  similarity real
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.medication_name,
    d.generic_name,
    d.manufacturer,
    d.drug_class,
    d.indication,
    d.dosage_forms,
    d.common_dosages,
    d.typical_retail_price,
    d.fda_approval_date,
    d.description,
    d.side_effects,
    d.warnings,
    d.active,
    d.created_at,
    d.updated_at,
    GREATEST(
      similarity(LOWER(d.medication_name), LOWER(search_query)),
      similarity(LOWER(d.generic_name), LOWER(search_query)),
      similarity(LOWER(d.drug_class), LOWER(search_query)),
      similarity(LOWER(d.indication), LOWER(search_query))
    )::real as similarity
  FROM drugs d
  WHERE 
    d.active = true
    AND (
      LOWER(d.medication_name) % LOWER(search_query)
      OR LOWER(d.generic_name) % LOWER(search_query)
      OR LOWER(d.drug_class) % LOWER(search_query)
      OR LOWER(d.indication) % LOWER(search_query)
      OR LOWER(d.medication_name) LIKE LOWER('%' || search_query || '%')
      OR LOWER(d.generic_name) LIKE LOWER('%' || search_query || '%')
      OR LOWER(d.drug_class) LIKE LOWER('%' || search_query || '%')
      OR LOWER(d.indication) LIKE LOWER('%' || search_query || '%')
    )
  ORDER BY similarity DESC, d.medication_name ASC
  LIMIT 20;
END;
$$;

-- Recreate search_programs function
CREATE OR REPLACE FUNCTION search_programs(search_query text)
RETURNS TABLE (
  id uuid,
  program_name text,
  program_type text,
  description text,
  manufacturer text,
  eligibility_criteria text,
  income_requirements text,
  insurance_requirements text,
  discount_details text,
  program_url text,
  phone_number text,
  email text,
  enrollment_process text,
  required_documents text,
  coverage_duration text,
  renewal_required boolean,
  active boolean,
  created_at timestamptz,
  updated_at timestamptz,
  similarity real
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.program_name,
    p.program_type,
    p.description,
    p.manufacturer,
    p.eligibility_criteria,
    p.income_requirements,
    p.insurance_requirements,
    p.discount_details,
    p.program_url,
    p.phone_number,
    p.email,
    p.enrollment_process,
    p.required_documents,
    p.coverage_duration,
    p.renewal_required,
    p.active,
    p.created_at,
    p.updated_at,
    GREATEST(
      similarity(LOWER(p.program_name), LOWER(search_query)),
      similarity(LOWER(p.manufacturer), LOWER(search_query)),
      similarity(LOWER(p.description), LOWER(search_query))
    )::real as similarity
  FROM programs p
  WHERE 
    p.active = true
    AND (
      LOWER(p.program_name) % LOWER(search_query)
      OR LOWER(p.manufacturer) % LOWER(search_query)
      OR LOWER(p.description) % LOWER(search_query)
      OR LOWER(p.program_name) LIKE LOWER('%' || search_query || '%')
      OR LOWER(p.manufacturer) LIKE LOWER('%' || search_query || '%')
      OR LOWER(p.description) LIKE LOWER('%' || search_query || '%')
    )
  ORDER BY similarity DESC, p.program_name ASC
  LIMIT 20;
END;
$$;

-- Recreate get_programs_for_drug function
CREATE OR REPLACE FUNCTION get_programs_for_drug(drug_id_param uuid)
RETURNS TABLE (
  id uuid,
  program_name text,
  program_type text,
  description text,
  manufacturer text,
  eligibility_criteria text,
  income_requirements text,
  insurance_requirements text,
  discount_details text,
  program_url text,
  phone_number text,
  email text,
  enrollment_process text,
  required_documents text,
  coverage_duration text,
  renewal_required boolean,
  active boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.program_name,
    p.program_type,
    p.description,
    p.manufacturer,
    p.eligibility_criteria,
    p.income_requirements,
    p.insurance_requirements,
    p.discount_details,
    p.program_url,
    p.phone_number,
    p.email,
    p.enrollment_process,
    p.required_documents,
    p.coverage_duration,
    p.renewal_required,
    p.active,
    p.created_at,
    p.updated_at
  FROM programs p
  INNER JOIN drugs_programs dp ON dp.program_id = p.id
  WHERE 
    dp.drug_id = drug_id_param
    AND p.active = true
  ORDER BY p.program_name ASC;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION search_drugs(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_programs(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_programs_for_drug(uuid) TO anon, authenticated;
