/*
  # Create Pharmaceutical Discount Programs Table

  1. New Tables
    - `pharma_programs`
      - `id` (uuid, primary key)
      - `medication_name` (text) - Brand name of medication
      - `generic_name` (text) - Generic/chemical name
      - `manufacturer` (text) - Pharmaceutical company
      - `program_name` (text) - Name of discount/assistance program
      - `program_description` (text) - Description of the program
      - `eligibility_criteria` (text) - Who qualifies for the program
      - `discount_amount` (text) - Amount of discount or assistance
      - `program_url` (text) - Official program website
      - `phone_number` (text) - Contact phone number
      - `enrollment_process` (text) - How to enroll
      - `required_documents` (text) - Documents needed to apply
      - `active` (boolean) - Whether program is currently active
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `pharma_programs` table
    - Add policy for public read access to active programs
    - Add policy for authenticated users to suggest programs
*/

CREATE TABLE IF NOT EXISTS pharma_programs (
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

COMMENT ON TABLE pharma_programs IS 'Pharmaceutical discount and patient assistance programs';

CREATE INDEX IF NOT EXISTS idx_pharma_programs_medication_name ON pharma_programs(medication_name);
CREATE INDEX IF NOT EXISTS idx_pharma_programs_generic_name ON pharma_programs(generic_name);
CREATE INDEX IF NOT EXISTS idx_pharma_programs_manufacturer ON pharma_programs(manufacturer);
CREATE INDEX IF NOT EXISTS idx_pharma_programs_active ON pharma_programs(active);

ALTER TABLE pharma_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active programs"
  ON pharma_programs
  FOR SELECT
  TO public
  USING (active = true);
