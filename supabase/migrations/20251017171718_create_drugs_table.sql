/*
  # Create Drugs Table

  1. New Tables
    - `drugs`
      - `id` (uuid, primary key)
      - `medication_name` (text) - Brand name of medication
      - `generic_name` (text) - Generic/chemical name
      - `manufacturer` (text) - Pharmaceutical company
      - `drug_class` (text) - Therapeutic class
      - `indication` (text) - What condition it treats
      - `dosage_forms` (text) - Pills, injection, inhaler, etc.
      - `common_dosages` (text) - Typical dosing information
      - `typical_retail_price` (text) - Estimated retail cost
      - `fda_approval_date` (date) - When FDA approved
      - `description` (text) - Detailed drug information
      - `side_effects` (text) - Common side effects
      - `warnings` (text) - Important warnings
      - `active` (boolean) - Drug is currently available
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Relations
    - drugs_programs junction table to link drugs to programs

  3. Security
    - Enable RLS on `drugs` table
    - Public read access to active drugs
    - Search-optimized with text indexes
*/

CREATE TABLE IF NOT EXISTS drugs (
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

COMMENT ON TABLE drugs IS 'Pharmaceutical drug information and details';

CREATE INDEX IF NOT EXISTS idx_drugs_medication_name ON drugs(medication_name);
CREATE INDEX IF NOT EXISTS idx_drugs_generic_name ON drugs(generic_name);
CREATE INDEX IF NOT EXISTS idx_drugs_manufacturer ON drugs(manufacturer);
CREATE INDEX IF NOT EXISTS idx_drugs_drug_class ON drugs(drug_class);
CREATE INDEX IF NOT EXISTS idx_drugs_active ON drugs(active);

ALTER TABLE drugs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active drugs"
  ON drugs
  FOR SELECT
  TO public
  USING (active = true);

CREATE TABLE IF NOT EXISTS drugs_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_id uuid NOT NULL REFERENCES drugs(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(drug_id, program_id)
);

COMMENT ON TABLE drugs_programs IS 'Junction table linking drugs to assistance programs';

CREATE INDEX IF NOT EXISTS idx_drugs_programs_drug_id ON drugs_programs(drug_id);
CREATE INDEX IF NOT EXISTS idx_drugs_programs_program_id ON drugs_programs(program_id);

ALTER TABLE drugs_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view drug-program relationships"
  ON drugs_programs
  FOR SELECT
  TO public
  USING (true);
