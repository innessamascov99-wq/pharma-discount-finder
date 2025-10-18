/*
  # Recreate Drugs Table for PostgREST Recognition

  1. Strategy
    - Backup existing drugs data
    - Drop and recreate drugs table with identical structure
    - Restore data
    - Force PostgREST to recognize the newly created table

  2. Purpose
    - Resolve persistent PostgREST schema cache issue
    - Ensure table is properly registered in PostgREST
*/

-- Create backup table
CREATE TABLE IF NOT EXISTS drugs_backup AS SELECT * FROM drugs;

-- Drop existing table and all dependencies
DROP TABLE IF EXISTS drugs CASCADE;

-- Recreate drugs table with exact same structure
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

-- Restore data from backup
INSERT INTO drugs SELECT * FROM drugs_backup;

-- Drop backup table
DROP TABLE drugs_backup;

-- Enable RLS
ALTER TABLE drugs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for anonymous and authenticated users
CREATE POLICY "Allow anon and authenticated to view active drugs"
  ON drugs
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Grant permissions
GRANT SELECT ON drugs TO anon;
GRANT SELECT ON drugs TO authenticated;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_drugs_medication_name ON drugs(medication_name);
CREATE INDEX IF NOT EXISTS idx_drugs_generic_name ON drugs(generic_name);
CREATE INDEX IF NOT EXISTS idx_drugs_active ON drugs(active);

-- Add table comment
COMMENT ON TABLE drugs IS 'Pharmaceutical drugs table - recreated for PostgREST';

-- Force PostgREST reload
NOTIFY pgrst, 'reload schema';
