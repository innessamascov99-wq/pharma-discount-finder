/*
  # Create Admin RPC Function for User Management

  1. Purpose
    - Provide a reliable way for admins to query all users
    - Bypass PostgREST schema cache issues
    - Maintain security with proper admin checks

  2. Functions
    - get_all_users_admin: Get all users with pagination and search
    - Security: SECURITY DEFINER to bypass RLS while maintaining admin check
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_all_users_admin(text, integer, integer);

-- Create function to get all users (admin only)
CREATE OR REPLACE FUNCTION get_all_users_admin(
  search_query text DEFAULT '',
  page_number integer DEFAULT 1,
  page_size integer DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  last_name text,
  phone text,
  date_of_birth date,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  zip_code text,
  country text,
  insurance_type text,
  insurance_provider text,
  is_admin boolean,
  is_blocked boolean,
  last_login timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  total_count bigint
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  v_is_admin boolean;
  v_offset integer;
BEGIN
  -- Check if current user is admin
  SELECT u.is_admin INTO v_is_admin
  FROM public.users u
  WHERE u.id = auth.uid();

  IF NOT COALESCE(v_is_admin, false) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Calculate offset for pagination
  v_offset := (page_number - 1) * page_size;

  -- Return users with search and pagination
  RETURN QUERY
  WITH total AS (
    SELECT COUNT(*) as cnt
    FROM public.users u
    WHERE 
      search_query = '' OR
      u.email ILIKE '%' || search_query || '%' OR
      u.first_name ILIKE '%' || search_query || '%' OR
      u.last_name ILIKE '%' || search_query || '%'
  )
  SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    u.date_of_birth,
    u.address_line1,
    u.address_line2,
    u.city,
    u.state,
    u.zip_code,
    u.country,
    u.insurance_type,
    u.insurance_provider,
    u.is_admin,
    u.is_blocked,
    u.last_login,
    u.created_at,
    u.updated_at,
    total.cnt as total_count
  FROM public.users u
  CROSS JOIN total
  WHERE 
    search_query = '' OR
    u.email ILIKE '%' || search_query || '%' OR
    u.first_name ILIKE '%' || search_query || '%' OR
    u.last_name ILIKE '%' || search_query || '%'
  ORDER BY u.created_at DESC
  LIMIT page_size
  OFFSET v_offset;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_all_users_admin(text, integer, integer) TO authenticated;

-- Add comment
COMMENT ON FUNCTION get_all_users_admin IS 'Admin-only function to retrieve all users with search and pagination';
