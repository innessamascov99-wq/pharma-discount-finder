/*
  # Fix Circular Reference in Users Table RLS

  1. Problem
    - Current RLS policy has circular reference: checking if user is admin requires querying users table, which triggers RLS again
    - This causes infinite recursion or prevents admins from viewing all users

  2. Solution
    - Create a SECURITY DEFINER function that bypasses RLS to check admin status
    - Use this function in the RLS policy to avoid circular reference

  3. Changes
    - Drop existing problematic SELECT policy
    - Create `is_user_admin()` function with SECURITY DEFINER
    - Create new SELECT policy using the safe function
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users and admins can view users" ON users;

-- Create a function that checks admin status without triggering RLS
CREATE OR REPLACE FUNCTION is_user_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM users 
    WHERE id = user_id 
    AND is_admin = true
  );
$$;

-- Create a clean SELECT policy using the safe function
CREATE POLICY "Users can view own profile or admins view all"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id 
    OR 
    is_user_admin(auth.uid())
  );

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_user_admin(uuid) TO authenticated;
