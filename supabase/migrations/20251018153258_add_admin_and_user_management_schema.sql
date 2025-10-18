/*
  # Admin and User Management Schema
  
  1. Updates to Tables
    - Add `is_admin` boolean to users table for admin role management
    - Add `is_blocked` boolean to users table for user blocking
    - Add `last_login` timestamp to track user activity
    - Create `admin_actions` audit table to track admin operations
    
  2. New Tables
    - `admin_actions`
      - `id` (uuid, primary key)
      - `admin_id` (uuid) - Admin who performed action
      - `target_user_id` (uuid) - User who was affected
      - `action_type` (text) - Type of action: block, unblock, grant_admin, revoke_admin
      - `created_at` (timestamptz)
    
  3. Security
    - Add RLS policies for admin-only access to user management
    - Add admin_actions audit logging policies
    - Grant admins ability to view all users and activity
*/

-- Add new columns to users table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE users ADD COLUMN is_admin boolean NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'is_blocked'
  ) THEN
    ALTER TABLE users ADD COLUMN is_blocked boolean NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE users ADD COLUMN last_login timestamptz;
  END IF;
END $$;

-- Create admin_actions audit table
CREATE TABLE IF NOT EXISTS admin_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE admin_actions IS 'Audit log of all admin actions for compliance and tracking';

CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target_user_id ON admin_actions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON admin_actions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_is_blocked ON users(is_blocked);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login DESC);

-- Enable RLS on admin_actions
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update users policies to allow admins to view all users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update user admin status"
  ON users FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Policies for admin_actions
CREATE POLICY "Admins can view all admin actions"
  ON admin_actions FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert admin actions"
  ON admin_actions FOR INSERT
  TO authenticated
  WITH CHECK (is_admin() AND auth.uid() = admin_id);

-- Function to toggle user blocked status
CREATE OR REPLACE FUNCTION toggle_user_blocked(target_user_id uuid, block_status boolean)
RETURNS void AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can block/unblock users';
  END IF;

  -- Update user blocked status
  UPDATE users 
  SET is_blocked = block_status 
  WHERE id = target_user_id;

  -- Log admin action
  INSERT INTO admin_actions (admin_id, target_user_id, action_type, details)
  VALUES (
    auth.uid(), 
    target_user_id, 
    CASE WHEN block_status THEN 'block' ELSE 'unblock' END,
    jsonb_build_object('blocked', block_status)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to grant/revoke admin access
CREATE OR REPLACE FUNCTION set_user_admin(target_user_id uuid, admin_status boolean)
RETURNS void AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can grant/revoke admin access';
  END IF;

  -- Update user admin status
  UPDATE users 
  SET is_admin = admin_status 
  WHERE id = target_user_id;

  -- Log admin action
  INSERT INTO admin_actions (admin_id, target_user_id, action_type, details)
  VALUES (
    auth.uid(), 
    target_user_id, 
    CASE WHEN admin_status THEN 'grant_admin' ELSE 'revoke_admin' END,
    jsonb_build_object('is_admin', admin_status)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics for admin dashboard
CREATE OR REPLACE FUNCTION get_user_statistics(days_back integer DEFAULT 30)
RETURNS TABLE (
  date date,
  new_users bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as date,
    COUNT(*) as new_users
  FROM users
  WHERE created_at >= NOW() - (days_back || ' days')::interval
  GROUP BY DATE(created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top programs by search activity
CREATE OR REPLACE FUNCTION get_top_programs(limit_count integer DEFAULT 10)
RETURNS TABLE (
  medication_name text,
  search_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ua.medication_name,
    COUNT(*) as search_count
  FROM user_activity ua
  WHERE ua.action_type = 'search' OR ua.action_type = 'viewed'
  GROUP BY ua.medication_name
  ORDER BY search_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;