/*
  # Create RPC Functions for Search

  1. Purpose
    - Create database functions that PostgREST can call via RPC
    - Bypass the table cache issue by using function calls
    - Functions will be immediately available via /rpc/ endpoint

  2. Functions Created
    - search_drugs_rpc: Search drugs by query
    - search_programs_rpc: Search programs by query
    - get_all_drugs_rpc: Get all active drugs
    - get_programs_for_drug_rpc: Get programs for a specific drug
*/

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS search_drugs_rpc(text);
DROP FUNCTION IF EXISTS search_programs_rpc(text);
DROP FUNCTION IF EXISTS get_all_drugs_rpc();
DROP FUNCTION IF EXISTS get_programs_for_drug_rpc(uuid);

-- Search drugs function
CREATE OR REPLACE FUNCTION search_drugs_rpc(search_query text)
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
  updated_at timestamptz
)
LANGUAGE plpgsql
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
    d.updated_at
  FROM drugs d
  WHERE d.active = true
  AND (
    d.medication_name ILIKE '%' || search_query || '%'
    OR d.generic_name ILIKE '%' || search_query || '%'
    OR d.drug_class ILIKE '%' || search_query || '%'
    OR d.indication ILIKE '%' || search_query || '%'
  )
  ORDER BY d.medication_name
  LIMIT 20;
END;
$$;

-- Search programs function
CREATE OR REPLACE FUNCTION search_programs_rpc(search_query text)
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
  WHERE p.active = true
  AND (
    p.program_name ILIKE '%' || search_query || '%'
    OR p.manufacturer ILIKE '%' || search_query || '%'
    OR p.description ILIKE '%' || search_query || '%'
  )
  ORDER BY p.program_name
  LIMIT 20;
END;
$$;

-- Get all drugs function
CREATE OR REPLACE FUNCTION get_all_drugs_rpc()
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
  updated_at timestamptz
)
LANGUAGE plpgsql
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
    d.updated_at
  FROM drugs d
  WHERE d.active = true
  ORDER BY d.medication_name;
END;
$$;

-- Get programs for drug function
CREATE OR REPLACE FUNCTION get_programs_for_drug_rpc(drug_uuid uuid)
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
  WHERE dp.drug_id = drug_uuid
  AND p.active = true
  ORDER BY p.program_name;
END;
$$;

-- Grant execute permissions to anon and authenticated
GRANT EXECUTE ON FUNCTION search_drugs_rpc(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_programs_rpc(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_all_drugs_rpc() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_programs_for_drug_rpc(uuid) TO anon, authenticated;

-- Add comment
COMMENT ON FUNCTION search_drugs_rpc IS 'Search drugs by medication name, generic name, class, or indication';
COMMENT ON FUNCTION search_programs_rpc IS 'Search programs by name, manufacturer, or description';

-- Force schema reload
NOTIFY pgrst, 'reload schema';
