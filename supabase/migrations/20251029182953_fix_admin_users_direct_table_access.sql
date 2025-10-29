/*
  # Fix Admin Users Direct Table Access

  1. Changes
    - Ensures admins can query users table directly without RPC functions
    - Simplifies RLS policies to avoid function dependencies
    - Maintains security by checking is_admin column directly

  2. Security
    - Admins can SELECT all users
    - Admins can UPDATE any user (block status, admin status)
    - Users can only view and update their own profile
    - Prevents privilege escalation
*/

-- Drop existing complex policies
DROP POLICY IF EXISTS "Users can view own profile or admins view all" ON users;
DROP POLICY IF EXISTS "Admins can update user admin status" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create simplified admin-friendly policies

-- SELECT policy: Users see own profile, admins see all
CREATE POLICY "Users can view own profile or admins view all"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM users admin_check 
      WHERE admin_check.id = auth.uid() 
      AND admin_check.is_admin = true
    )
  );

-- UPDATE policy: Users can update own profile (except is_admin), admins can update any user
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM users admin_check 
      WHERE admin_check.id = auth.uid() 
      AND admin_check.is_admin = true
    )
  )
  WITH CHECK (
    -- Users can update own profile but not change is_admin status
    (auth.uid() = id AND is_admin = (SELECT is_admin FROM users WHERE id = auth.uid())) OR
    -- Admins can update any field on any user
    EXISTS (
      SELECT 1 FROM users admin_check 
      WHERE admin_check.id = auth.uid() 
      AND admin_check.is_admin = true
    )
  );

-- Force PostgREST to recognize changes
COMMENT ON TABLE users IS 'User profiles with admin and block status - Updated for direct access';
