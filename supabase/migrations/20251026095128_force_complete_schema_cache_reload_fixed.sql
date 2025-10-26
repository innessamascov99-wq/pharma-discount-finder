/*
  # Force Complete PostgREST Schema Cache Reload

  This migration forces PostgREST to reload its schema cache by:
  1. Creating a dummy table to trigger cache invalidation
  2. Sending reload notification to PostgREST
  3. Granting necessary permissions
  4. Cleaning up
*/

-- Create temporary table to trigger schema change
CREATE TABLE IF NOT EXISTS _cache_reload_trigger_temp (
  id serial PRIMARY KEY,
  reload_timestamp timestamptz DEFAULT now()
);

-- Insert a marker
INSERT INTO _cache_reload_trigger_temp (reload_timestamp) VALUES (now());

-- Notify PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';

-- Drop the temporary table
DROP TABLE IF EXISTS _cache_reload_trigger_temp;

-- Grant execute permissions on all RPC functions to anon and authenticated users
GRANT EXECUTE ON FUNCTION get_user_statistics(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_top_programs(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_all_recent_activity(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION log_user_activity(text, text, uuid, uuid, text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_last_login() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION toggle_user_blocked(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION set_user_admin(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_recent_activity(integer) TO anon, authenticated;

-- Add comments to tables to force schema reload detection
COMMENT ON TABLE users IS 'User profiles - Cache reload triggered';
COMMENT ON TABLE drugs IS 'Medications database - Cache reload triggered';
COMMENT ON TABLE programs IS 'Discount programs - Cache reload triggered';
COMMENT ON TABLE user_programs IS 'User program enrollments - Cache reload triggered';
COMMENT ON TABLE user_activity IS 'User activity tracking - Cache reload triggered';
