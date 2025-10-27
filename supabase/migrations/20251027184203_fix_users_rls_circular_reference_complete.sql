/*
  # Fix RLS Circular Reference Issue - Complete Solution

  1. Problem
    - The is_user_admin() and is_admin() functions create circular references with RLS policies
    - When querying users table, RLS calls these functions, which query users table again
    - This causes infinite recursion and query failures

  2. Solution
    - Drop all policies that depend on these functions
    - Recreate functions as SECURITY DEFINER (bypasses RLS)
    - Recreate all policies

  3. Changes
    - Drop all dependent policies on users, admin_actions, and user_activity tables
    - Recreate is_user_admin() and is_admin() as SECURITY DEFINER
    - Recreate all policies
*/

-- Drop all policies that depend on is_admin() or is_user_admin()
DROP POLICY IF EXISTS "Users can view own profile or admins view all" ON users;
DROP POLICY IF EXISTS "Admins can update user admin status" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all admin actions" ON admin_actions;
DROP POLICY IF EXISTS "Admins can insert admin actions" ON admin_actions;
DROP POLICY IF EXISTS "Admins can view all activity" ON user_activity;

-- Drop the existing functions
DROP FUNCTION IF EXISTS is_user_admin(uuid);
DROP FUNCTION IF EXISTS is_admin();

-- Create SECURITY DEFINER functions that bypass RLS
CREATE OR REPLACE FUNCTION is_user_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM users 
    WHERE id = user_id 
    AND is_admin = true
  );
END;
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM users 
    WHERE id = auth.uid() 
    AND is_admin = true
  );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION is_user_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Recreate users table policies
CREATE POLICY "Users can view own profile or admins view all"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    (auth.uid() = id) OR is_user_admin(auth.uid())
  );

CREATE POLICY "Admins can update user admin status"
  ON users
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    (auth.uid() = id) AND 
    (is_admin = (SELECT is_admin FROM users WHERE id = auth.uid()) OR is_admin())
  );

-- Recreate admin_actions policies (if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_actions') THEN
    EXECUTE 'CREATE POLICY "Admins can view all admin actions"
      ON admin_actions
      FOR SELECT
      TO authenticated
      USING (is_admin())';
    
    EXECUTE 'CREATE POLICY "Admins can insert admin actions"
      ON admin_actions
      FOR INSERT
      TO authenticated
      WITH CHECK (is_admin())';
  END IF;
END $$;

-- Recreate user_activity policies (if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_activity') THEN
    EXECUTE 'CREATE POLICY "Admins can view all activity"
      ON user_activity
      FOR SELECT
      TO authenticated
      USING (is_admin())';
  END IF;
END $$;
