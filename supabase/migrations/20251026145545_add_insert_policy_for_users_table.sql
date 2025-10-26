/*
  # Add INSERT policy for users table

  1. Security
    - Add policy to allow authenticated users to insert their own profile
    - This ensures that if the trigger fails, users can still create their profile
    - Only allows users to insert a record with their own auth.uid()
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can create own profile" ON users;

-- Create policy for users to insert their own profile
CREATE POLICY "Users can create own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
