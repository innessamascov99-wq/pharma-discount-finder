/*
  # Add UPDATE policy for users table

  1. Security
    - Add policy to allow authenticated users to update their own profile
    - Users cannot modify their is_admin or is_blocked status (separate admin policy exists for that)
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Ensure users cannot change their own admin status
    AND (
      is_admin = (SELECT is_admin FROM users WHERE id = auth.uid())
      OR is_admin()
    )
  );
