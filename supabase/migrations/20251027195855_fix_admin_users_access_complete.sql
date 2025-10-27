/*
  # Fix Admin Users Access - Complete Solution

  This migration ensures admins can properly access the users list.

  ## Changes

  1. **Verify RLS is enabled** on users table
  2. **Grant necessary permissions** to authenticated role
  3. **Create helper RPC function** for admin to get all users
  4. **Update is_admin() function** to ensure it works properly
  5. **Force PostgREST cache reload**

  ## Security

  - RLS remains enabled and enforced
  - Only authenticated users with is_admin=true can access all users
  - Regular users can only see their own profile
*/

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT SELECT ON users TO anon;

-- Recreate is_admin() function with proper security settings
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
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

-- Grant execute permission on is_admin function
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated, anon;

-- Create a dedicated RPC function for admins to get all users
-- This bypasses any RLS complexity issues
CREATE OR REPLACE FUNCTION public.admin_get_all_users(
  search_term text DEFAULT NULL,
  page_number int DEFAULT 1,
  page_size int DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  last_name text,
  phone text,
  date_of_birth date,
  is_admin boolean,
  is_blocked boolean,
  last_login timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  total_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  offset_val int;
  total_count_val bigint;
BEGIN
  -- Check if the caller is an admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Calculate offset for pagination
  offset_val := (page_number - 1) * page_size;

  -- Get total count
  IF search_term IS NOT NULL AND search_term != '' THEN
    SELECT COUNT(*) INTO total_count_val
    FROM users u
    WHERE u.email ILIKE '%' || search_term || '%'
       OR u.first_name ILIKE '%' || search_term || '%'
       OR u.last_name ILIKE '%' || search_term || '%';
  ELSE
    SELECT COUNT(*) INTO total_count_val FROM users;
  END IF;

  -- Return paginated results with total count
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    u.date_of_birth,
    u.is_admin,
    u.is_blocked,
    u.last_login,
    u.created_at,
    u.updated_at,
    total_count_val as total_count
  FROM users u
  WHERE 
    (search_term IS NULL OR search_term = '' OR
     u.email ILIKE '%' || search_term || '%' OR
     u.first_name ILIKE '%' || search_term || '%' OR
     u.last_name ILIKE '%' || search_term || '%')
  ORDER BY u.created_at DESC
  LIMIT page_size
  OFFSET offset_val;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION admin_get_all_users(text, int, int) TO authenticated;

-- Force PostgREST to recognize the new function
NOTIFY pgrst, 'reload schema';

-- Create a dummy table update to force cache refresh
DO $$
BEGIN
  PERFORM pg_notify('pgrst', 'reload schema');
  PERFORM pg_notify('pgrst', 'reload config');
END $$;
