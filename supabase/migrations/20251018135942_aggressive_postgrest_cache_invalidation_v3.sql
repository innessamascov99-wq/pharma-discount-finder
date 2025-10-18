/*
  # Aggressive PostgREST Cache Invalidation v3
  
  Multiple techniques to force PostgREST schema cache reload without VACUUM.
*/

-- 1. Ensure authenticator role has access (PostgREST uses this role)
GRANT USAGE ON SCHEMA public TO authenticator, anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticator, anon, authenticated;

-- 2. Explicitly grant on our tables to all relevant roles
GRANT ALL ON drugs TO postgres, authenticator;
GRANT SELECT ON drugs TO anon, authenticated, public;

GRANT ALL ON programs TO postgres, authenticator;
GRANT SELECT ON programs TO anon, authenticated, public;

GRANT ALL ON drugs_programs TO postgres, authenticator;
GRANT SELECT ON drugs_programs TO anon, authenticated, public;

GRANT ALL ON users TO postgres, authenticator;
GRANT SELECT ON users TO authenticated;

-- 3. Add a temporary column and immediately drop it (forces schema change detection)
DO $$
BEGIN
  -- Trigger schema change for drugs
  ALTER TABLE drugs ADD COLUMN IF NOT EXISTS _temp_trigger_cache text DEFAULT '';
  ALTER TABLE drugs DROP COLUMN IF EXISTS _temp_trigger_cache;
  
  -- Trigger schema change for programs
  ALTER TABLE programs ADD COLUMN IF NOT EXISTS _temp_trigger_cache text DEFAULT '';
  ALTER TABLE programs DROP COLUMN IF EXISTS _temp_trigger_cache;
  
  -- Trigger schema change for drugs_programs
  ALTER TABLE drugs_programs ADD COLUMN IF NOT EXISTS _temp_trigger_cache text DEFAULT '';
  ALTER TABLE drugs_programs DROP COLUMN IF EXISTS _temp_trigger_cache;
END $$;

-- 4. Update table comments
COMMENT ON TABLE drugs IS 'Pharmaceutical drugs - PostgREST API exposed';
COMMENT ON TABLE programs IS 'Pharmaceutical programs - PostgREST API exposed';
COMMENT ON TABLE drugs_programs IS 'Drug-Program relationships - PostgREST API exposed';

-- 5. Create a dummy schema change by creating and dropping a view
CREATE OR REPLACE VIEW _postgrest_reload_trigger AS
SELECT 
  'drugs' as table_name,
  COUNT(*) as record_count
FROM drugs
UNION ALL
SELECT 'programs', COUNT(*) FROM programs
UNION ALL
SELECT 'drugs_programs', COUNT(*) FROM drugs_programs;

DROP VIEW IF EXISTS _postgrest_reload_trigger;

-- 6. Send multiple reload notifications with different payloads
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
NOTIFY pgrst;
NOTIFY pgrst, 'reload schema';

-- 7. Force analyze on tables
ANALYZE drugs;
ANALYZE programs;
ANALYZE drugs_programs;

-- 8. Another round of notifications
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
