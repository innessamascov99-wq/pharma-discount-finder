/*
  # Create User Activity and Saved Programs Tables

  1. New Tables
    - `saved_programs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `program_id` (uuid, references pharma_programs)
      - `created_at` (timestamp)
    
    - `user_activity`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `medication_name` (text)
      - `action_type` (text) - viewed, saved, downloaded, etc.
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create saved_programs table
CREATE TABLE IF NOT EXISTS saved_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES pharma_programs(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, program_id)
);

-- Create user_activity table
CREATE TABLE IF NOT EXISTS user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_name text NOT NULL,
  action_type text NOT NULL DEFAULT 'viewed',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE saved_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Policies for saved_programs
CREATE POLICY "Users can view own saved programs"
  ON saved_programs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved programs"
  ON saved_programs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved programs"
  ON saved_programs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for user_activity
CREATE POLICY "Users can view own activity"
  ON user_activity FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity"
  ON user_activity FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_programs_user_id ON saved_programs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);
