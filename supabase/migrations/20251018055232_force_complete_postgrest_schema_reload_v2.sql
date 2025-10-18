/*
  # Force Complete PostgREST Schema Reload - V2

  1. Changes
    - Update table comment to force schema reload
    - Update table statistics to trigger cache invalidation
    - Grant explicit permissions to ensure PostgREST can see the table
    - Send NOTIFY signals to PostgREST

  2. Purpose
    - Aggressively force PostgREST to recognize the drugs table
    - Resolve persistent schema cache error
*/

-- Update table comment to force change detection
COMMENT ON TABLE drugs IS 'Pharmaceutical drugs table - schema reload forced v2';

-- Update table statistics
ANALYZE drugs;

-- Ensure anon role has explicit SELECT permission
GRANT SELECT ON drugs TO anon;
GRANT SELECT ON drugs TO authenticated;

-- Add column comment to trigger schema change
COMMENT ON COLUMN drugs.id IS 'Primary key - schema reload v2';

-- Send reload notifications
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
