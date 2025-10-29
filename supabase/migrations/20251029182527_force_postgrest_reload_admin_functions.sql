/*
  # Force PostgREST Schema Cache Reload for Admin Functions

  1. Changes
    - Forces PostgREST to recognize admin RPC functions
    - Creates a dummy schema change to trigger cache invalidation
    - Ensures admin_get_all_users, toggle_user_blocked, and set_user_admin are available via API

  2. Security
    - All functions are already protected by is_admin() checks
    - No changes to existing security policies
*/

-- Force PostgREST schema cache reload by making a dummy comment change
COMMENT ON FUNCTION admin_get_all_users IS 'Get all users with pagination and search - API exposed';
COMMENT ON FUNCTION toggle_user_blocked IS 'Block or unblock a user - API exposed';
COMMENT ON FUNCTION set_user_admin IS 'Grant or revoke admin privileges - API exposed';
COMMENT ON FUNCTION is_admin IS 'Check if current user is admin - Helper function';

-- Notify PostgREST of schema changes
NOTIFY pgrst, 'reload schema';
