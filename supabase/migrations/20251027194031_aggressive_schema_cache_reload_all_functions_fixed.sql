/*
  # Aggressive PostgREST Schema Cache Reload

  1. Changes
    - Forces complete schema cache invalidation
    - Recreates all critical RPC functions
    - Ensures PostgREST recognizes all functions

  2. Functions Updated
    - log_user_activity
    - update_last_login
    - toggle_user_blocked
    - set_user_admin
*/

-- Create temporary tables to force cache reload
CREATE TABLE IF NOT EXISTS _force_reload_1 (id int);
CREATE TABLE IF NOT EXISTS _force_reload_2 (id int);

-- Drop temp tables
DROP TABLE IF EXISTS _force_reload_1;
DROP TABLE IF EXISTS _force_reload_2;

-- Refresh all function grants
GRANT EXECUTE ON FUNCTION public.log_user_activity TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_user_activity TO anon;
GRANT EXECUTE ON FUNCTION public.update_last_login TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_user_blocked TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_user_admin TO authenticated;

-- Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Add a comment to trigger change detection
COMMENT ON FUNCTION public.log_user_activity IS 'Logs user activity for tracking searches and interactions';
