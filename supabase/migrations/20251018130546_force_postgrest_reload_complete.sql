/*
  # Force PostgREST Schema Cache Reload
  
  This migration forces PostgREST to reload its schema cache by:
  1. Sending a NOTIFY signal to the pgrst channel
  2. Making a schema change that triggers cache invalidation
  3. Re-granting permissions to ensure API visibility
  
  This should make all tables and RPC functions immediately visible via the REST API.
*/

-- Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- Make a harmless schema change to trigger cache reload
COMMENT ON TABLE drugs IS 'Pharmaceutical drugs database - PostgREST cache reload triggered';
COMMENT ON TABLE programs IS 'Pharmaceutical programs database - PostgREST cache reload triggered';
COMMENT ON TABLE drugs_programs IS 'Drug-Program relationships - PostgREST cache reload triggered';
COMMENT ON TABLE users IS 'User profiles - PostgREST cache reload triggered';

-- Re-grant all permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON drugs TO anon, authenticated;
GRANT SELECT ON programs TO anon, authenticated;
GRANT SELECT ON drugs_programs TO anon, authenticated;
GRANT SELECT ON users TO authenticated;

-- Grant execute on all functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Force another reload notification
NOTIFY pgrst, 'reload config';
