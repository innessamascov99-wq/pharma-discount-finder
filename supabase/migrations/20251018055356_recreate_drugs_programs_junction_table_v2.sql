/*
  # Recreate drugs_programs Junction Table - V2

  1. Purpose
    - Recreate junction table after drugs table was recreated
    - Restore foreign key relationships

  2. Changes
    - Backup, drop, recreate with foreign keys, restore data
*/

-- Create backup
CREATE TABLE IF NOT EXISTS drugs_programs_backup AS SELECT * FROM drugs_programs;

-- Drop existing table
DROP TABLE IF EXISTS drugs_programs CASCADE;

-- Recreate with foreign keys
CREATE TABLE drugs_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_id uuid NOT NULL REFERENCES drugs(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(drug_id, program_id)
);

-- Restore data
INSERT INTO drugs_programs (id, drug_id, program_id, created_at)
SELECT id, drug_id, program_id, created_at 
FROM drugs_programs_backup
ON CONFLICT DO NOTHING;

-- Drop backup
DROP TABLE drugs_programs_backup;

-- Enable RLS
ALTER TABLE drugs_programs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Allow anon and authenticated to view relationships"
  ON drugs_programs
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Grant permissions
GRANT SELECT ON drugs_programs TO anon;
GRANT SELECT ON drugs_programs TO authenticated;

-- Create indexes
CREATE INDEX idx_drugs_programs_drug_id ON drugs_programs(drug_id);
CREATE INDEX idx_drugs_programs_program_id ON drugs_programs(program_id);

-- Force reload
NOTIFY pgrst, 'reload schema';
