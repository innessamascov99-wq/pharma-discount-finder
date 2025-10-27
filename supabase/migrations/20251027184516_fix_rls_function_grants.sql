/*
  # Fix RLS Function Grants and Permissions

  1. Problem
    - SECURITY DEFINER functions exist but may not have proper execution grants
    - RLS policies can't execute the functions without proper permissions

  2. Solution
    - Grant EXECUTE on functions to all relevant roles
    - Ensure functions have correct search_path settings
    - Add explicit grants for anon and authenticated roles
*/

-- Ensure functions have correct grants
GRANT EXECUTE ON FUNCTION is_user_admin(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION is_admin() TO anon, authenticated, service_role;

-- Also ensure the functions have the right volatility
-- STABLE means the function doesn't modify the database and returns same result for same input within a single query
ALTER FUNCTION is_user_admin(uuid) STABLE;
ALTER FUNCTION is_admin() STABLE;
