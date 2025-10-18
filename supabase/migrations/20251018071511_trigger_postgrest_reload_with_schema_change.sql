/*
  # Trigger PostgREST reload by making a schema change
  
  1. Actions
    - Create and drop a temporary table to force schema reload
    - This causes PostgREST to completely refresh its cache
  
  2. Notes
    - Creating/dropping objects forces PostgREST to reload
*/

-- Create a temporary table
CREATE TABLE IF NOT EXISTS _postgrest_reload_trigger (
  id serial PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);

-- Grant access
GRANT SELECT ON _postgrest_reload_trigger TO anon;

-- Send reload signal
NOTIFY pgrst, 'reload schema';

-- Drop the table after a moment
DO $$
BEGIN
  PERFORM pg_sleep(0.5);
  DROP TABLE IF EXISTS _postgrest_reload_trigger;
  PERFORM pg_notify('pgrst', 'reload schema');
END $$;

-- Verify our function exists
DO $$
DECLARE
  func_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'search_drugs_rpc'
  ) INTO func_exists;
  
  IF NOT func_exists THEN
    RAISE EXCEPTION 'Function search_drugs_rpc does not exist!';
  END IF;
  
  RAISE NOTICE 'Function search_drugs_rpc exists and is ready';
END $$;
