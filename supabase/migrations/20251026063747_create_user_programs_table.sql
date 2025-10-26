/*
  # Create User Programs Table

  1. New Tables
    - `user_programs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `program_id` (uuid, foreign key to programs)
      - `drug_id` (uuid, foreign key to drugs, optional)
      - `enrollment_date` (timestamp)
      - `status` (text: 'active', 'expired', 'cancelled')
      - `renewal_date` (timestamp, optional)
      - `notes` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_programs` table
    - Add policy for users to read their own enrolled programs
    - Add policy for users to create their own program enrollments
    - Add policy for users to update their own program enrollments
    - Add policy for admins to read all program enrollments

  3. Indexes
    - Index on user_id for faster queries
    - Index on program_id for analytics
    - Index on status for filtering active programs
*/

CREATE TABLE IF NOT EXISTS user_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  drug_id uuid REFERENCES drugs(id) ON DELETE SET NULL,
  enrollment_date timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  renewal_date timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, program_id)
);

-- Enable RLS
ALTER TABLE user_programs ENABLE ROW LEVEL SECURITY;

-- Users can view their own enrolled programs
CREATE POLICY "Users can view own enrolled programs"
  ON user_programs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can enroll in programs
CREATE POLICY "Users can enroll in programs"
  ON user_programs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own program enrollments
CREATE POLICY "Users can update own enrollments"
  ON user_programs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all program enrollments
CREATE POLICY "Admins can view all enrollments"
  ON user_programs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_programs_user_id ON user_programs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_programs_program_id ON user_programs(program_id);
CREATE INDEX IF NOT EXISTS idx_user_programs_status ON user_programs(status);
CREATE INDEX IF NOT EXISTS idx_user_programs_user_status ON user_programs(user_id, status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_user_programs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_programs_updated_at
  BEFORE UPDATE ON user_programs
  FOR EACH ROW
  EXECUTE FUNCTION update_user_programs_updated_at();

COMMENT ON TABLE user_programs IS 'Tracks which programs users are enrolled in and their enrollment status';
