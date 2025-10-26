/*
  # Create User Activity Tracking Table

  1. New Tables
    - `user_activity`
      - `id` (uuid, primary key) - Unique identifier for each activity
      - `user_id` (uuid) - References auth.users(id), nullable for anonymous browsing
      - `action_type` (text) - Type of action: 'search', 'viewed', 'clicked_program'
      - `medication_name` (text) - Name of the medication searched or viewed
      - `drug_id` (uuid) - References drugs table if applicable
      - `program_id` (uuid) - References programs table if applicable
      - `search_query` (text) - Original search query if action_type is 'search'
      - `metadata` (jsonb) - Additional contextual information
      - `created_at` (timestamptz) - Timestamp of activity
  
  2. Indexes
    - Index on user_id for fast user activity queries
    - Index on medication_name for analytics
    - Index on action_type for filtering
    - Index on created_at for chronological sorting
  
  3. Security
    - Enable RLS on user_activity table
    - Users can view their own activity
    - Admins can view all activity
    - Authenticated users can insert their own activity
*/

-- Create user_activity table
CREATE TABLE IF NOT EXISTS user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  medication_name text,
  drug_id uuid REFERENCES drugs(id) ON DELETE SET NULL,
  program_id uuid REFERENCES programs(id) ON DELETE SET NULL,
  search_query text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE user_activity IS 'Tracks user browsing and search activity for analytics and recent activity display';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_medication_name ON user_activity(medication_name);
CREATE INDEX IF NOT EXISTS idx_user_activity_action_type ON user_activity(action_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_drug_id ON user_activity(drug_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_program_id ON user_activity(program_id);

-- Enable RLS
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own activity
CREATE POLICY "Users can view own activity"
  ON user_activity FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all activity
CREATE POLICY "Admins can view all activity"
  ON user_activity FOR SELECT
  TO authenticated
  USING (is_admin());

-- Users can insert their own activity
CREATE POLICY "Users can insert own activity"
  ON user_activity FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow anonymous users to insert activity (optional, for tracking before login)
CREATE POLICY "Anonymous users can insert activity"
  ON user_activity FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  p_action_type text,
  p_medication_name text DEFAULT NULL,
  p_drug_id uuid DEFAULT NULL,
  p_program_id uuid DEFAULT NULL,
  p_search_query text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  activity_id uuid;
BEGIN
  INSERT INTO user_activity (
    user_id,
    action_type,
    medication_name,
    drug_id,
    program_id,
    search_query,
    metadata
  ) VALUES (
    auth.uid(),
    p_action_type,
    p_medication_name,
    p_drug_id,
    p_program_id,
    p_search_query,
    p_metadata
  )
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's recent activity
CREATE OR REPLACE FUNCTION get_user_recent_activity(limit_count integer DEFAULT 20)
RETURNS TABLE (
  id uuid,
  action_type text,
  medication_name text,
  drug_id uuid,
  program_id uuid,
  search_query text,
  metadata jsonb,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ua.id,
    ua.action_type,
    ua.medication_name,
    ua.drug_id,
    ua.program_id,
    ua.search_query,
    ua.metadata,
    ua.created_at
  FROM user_activity ua
  WHERE ua.user_id = auth.uid()
  ORDER BY ua.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all recent activity (admin only)
CREATE OR REPLACE FUNCTION get_all_recent_activity(limit_count integer DEFAULT 50)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  user_email text,
  action_type text,
  medication_name text,
  drug_id uuid,
  program_id uuid,
  search_query text,
  created_at timestamptz
) AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can view all activity';
  END IF;

  RETURN QUERY
  SELECT 
    ua.id,
    ua.user_id,
    u.email as user_email,
    ua.action_type,
    ua.medication_name,
    ua.drug_id,
    ua.program_id,
    ua.search_query,
    ua.created_at
  FROM user_activity ua
  LEFT JOIN users u ON ua.user_id = u.id
  ORDER BY ua.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;