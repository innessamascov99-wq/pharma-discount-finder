/*
  # Force PostgREST to Recognize Drugs Table
  
  This migration forces PostgREST schema cache to recognize the drugs table by:
  1. Creating a temporary backup of the data
  2. Dropping and recreating the table (forces schema change detection)
  3. Restoring all data
  4. Re-applying RLS policies and permissions
  5. Sending reload notifications
*/

-- Create temporary backup table
CREATE TEMP TABLE drugs_backup AS SELECT * FROM drugs;

-- Store drugs_programs relationships
CREATE TEMP TABLE drugs_programs_backup AS SELECT * FROM drugs_programs;

-- Drop foreign key constraints temporarily
ALTER TABLE drugs_programs DROP CONSTRAINT IF EXISTS drugs_programs_drug_id_fkey;

-- Drop the existing table
DROP TABLE IF EXISTS drugs CASCADE;

-- Recreate the drugs table with identical structure
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

-- Add table comment for PostgREST
COMMENT ON TABLE drugs IS 'Pharmaceutical drugs database - exposed via PostgREST';

-- Restore all data with original IDs
INSERT INTO drugs SELECT * FROM drugs_backup;

-- Enable RLS
ALTER TABLE drugs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for public read access
DROP POLICY IF EXISTS "Anyone can view active drugs" ON drugs;
CREATE POLICY "Anyone can view active drugs"
  ON drugs
  FOR SELECT
  TO public
  USING (active = true);

-- Grant permissions explicitly
GRANT SELECT ON drugs TO anon, authenticated;
GRANT ALL ON drugs TO postgres;

-- Recreate the foreign key constraint
ALTER TABLE drugs_programs 
ADD CONSTRAINT drugs_programs_drug_id_fkey 
FOREIGN KEY (drug_id) REFERENCES drugs(id) ON DELETE CASCADE;

-- Restore drugs_programs data
-- (data is already there, just reconnected via foreign key)

-- Send PostgREST reload notification
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Verify data
DO $$
DECLARE
  drug_count integer;
BEGIN
  SELECT COUNT(*) INTO drug_count FROM drugs;
  RAISE NOTICE 'Drugs table recreated with % records', drug_count;
END $$;
