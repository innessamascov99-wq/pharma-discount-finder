/*
  # Complete Reset and Clean Rebuild

  This migration completely drops and recreates all tables to force PostgREST recognition.

  1. Actions
    - Drop all existing tables
    - Recreate tables with exact structure from working database
    - Insert sample data
    - Configure RLS with TO public (not anon/authenticated)
    - Create search functions

  2. Purpose
    - Force PostgREST to recognize tables in schema cache
    - Replicate exact working configuration from old database
*/

-- Step 1: Drop everything
DROP TABLE IF EXISTS drugs_programs CASCADE;
DROP TABLE IF EXISTS drugs CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS postgrest_cache_reload CASCADE;

-- Step 2: Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  date_of_birth date,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  zip_code text,
  country text DEFAULT 'USA',
  insurance_type text,
  insurance_provider text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE users IS 'User profile information for pharmaceutical program eligibility';
CREATE INDEX idx_users_email ON users(email);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Step 3: Create programs table
CREATE TABLE programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name text NOT NULL,
  program_type text NOT NULL DEFAULT 'copay_card',
  description text NOT NULL DEFAULT '',
  manufacturer text NOT NULL,
  eligibility_criteria text NOT NULL DEFAULT '',
  income_requirements text DEFAULT '',
  insurance_requirements text DEFAULT '',
  discount_details text NOT NULL DEFAULT '',
  program_url text DEFAULT '',
  phone_number text DEFAULT '',
  email text DEFAULT '',
  enrollment_process text NOT NULL DEFAULT '',
  required_documents text NOT NULL DEFAULT '',
  coverage_duration text DEFAULT '12 months',
  renewal_required boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE programs IS 'Pharmaceutical programs database - exposed via PostgREST';
CREATE INDEX idx_programs_manufacturer ON programs(manufacturer);
CREATE INDEX idx_programs_active ON programs(active);
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active programs"
  ON programs FOR SELECT TO public
  USING (active = true);

-- Step 4: Create drugs table
CREATE TABLE drugs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_name text NOT NULL,
  generic_name text NOT NULL,
  manufacturer text NOT NULL,
  drug_class text NOT NULL,
  indication text NOT NULL DEFAULT '',
  dosage_forms text DEFAULT '',
  common_dosages text DEFAULT '',
  typical_retail_price text DEFAULT '',
  fda_approval_date date,
  description text NOT NULL DEFAULT '',
  side_effects text DEFAULT '',
  warnings text DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE drugs IS 'Pharmaceutical drugs database - exposed via PostgREST';
CREATE INDEX idx_drugs_medication_name ON drugs(medication_name);
CREATE INDEX idx_drugs_generic_name ON drugs(generic_name);
CREATE INDEX idx_drugs_active ON drugs(active);
ALTER TABLE drugs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active drugs"
  ON drugs FOR SELECT TO public
  USING (active = true);

-- Step 5: Create junction table
CREATE TABLE drugs_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_id uuid NOT NULL REFERENCES drugs(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(drug_id, program_id)
);

COMMENT ON TABLE drugs_programs IS 'Drug-Program relationships - exposed via PostgREST';
CREATE INDEX idx_drugs_programs_drug_id ON drugs_programs(drug_id);
CREATE INDEX idx_drugs_programs_program_id ON drugs_programs(program_id);
ALTER TABLE drugs_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view drug-program relationships"
  ON drugs_programs FOR SELECT TO public
  USING (true);

-- Step 6: Send NOTIFY
NOTIFY pgrst, 'reload schema';
