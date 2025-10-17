/*
  # Create Programs Table

  1. New Tables
    - `programs`
      - `id` (uuid, primary key)
      - `program_name` (text) - Name of the discount/assistance program
      - `program_type` (text) - Type: copay_card, patient_assistance, discount_card, etc.
      - `description` (text) - Detailed program description
      - `manufacturer` (text) - Pharmaceutical company offering the program
      - `eligibility_criteria` (text) - Who qualifies
      - `income_requirements` (text) - Income limits if applicable
      - `insurance_requirements` (text) - Insurance requirements
      - `discount_details` (text) - Amount of discount or assistance
      - `program_url` (text) - Official program website
      - `phone_number` (text) - Contact phone
      - `email` (text) - Contact email
      - `enrollment_process` (text) - How to apply/enroll
      - `required_documents` (text) - Documents needed
      - `coverage_duration` (text) - How long coverage lasts
      - `renewal_required` (boolean) - Whether renewal is needed
      - `active` (boolean) - Program is currently active
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `programs` table
    - Public read access to active programs
    - Only admins can modify programs
*/

CREATE TABLE IF NOT EXISTS programs (
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
  renewal_required boolean DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE programs IS 'Pharmaceutical discount and patient assistance programs';

CREATE INDEX IF NOT EXISTS idx_programs_manufacturer ON programs(manufacturer);
CREATE INDEX IF NOT EXISTS idx_programs_program_type ON programs(program_type);
CREATE INDEX IF NOT EXISTS idx_programs_active ON programs(active);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active programs"
  ON programs
  FOR SELECT
  TO public
  USING (active = true);
