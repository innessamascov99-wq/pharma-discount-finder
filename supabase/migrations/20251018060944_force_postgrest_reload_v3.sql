/*
  # Force PostgREST Schema Reload - V3

  1. Changes
    - Add check constraints to force schema detection
    - Update table ownership
    - Grant all permissions
    - Send reload notifications

  2. Purpose
    - Make PostgREST recognize the drugs table
*/

-- Add check constraint to force schema change
ALTER TABLE drugs DROP CONSTRAINT IF EXISTS drugs_active_check;
ALTER TABLE drugs ADD CONSTRAINT drugs_active_check CHECK (active IN (true, false));

-- Ensure proper ownership
ALTER TABLE drugs OWNER TO postgres;
ALTER TABLE programs OWNER TO postgres;
ALTER TABLE drugs_programs OWNER TO postgres;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant table permissions
GRANT SELECT ON drugs TO anon, authenticated;
GRANT SELECT ON programs TO anon, authenticated;
GRANT SELECT ON drugs_programs TO anon, authenticated;

-- Update statistics
ANALYZE drugs;
ANALYZE programs;
ANALYZE drugs_programs;

-- Add comments
COMMENT ON TABLE drugs IS 'Pharmaceutical drugs table v3';
COMMENT ON TABLE programs IS 'Assistance programs table v3';

-- Send reload notifications
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
