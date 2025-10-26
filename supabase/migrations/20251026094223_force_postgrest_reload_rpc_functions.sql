/*
  # Force PostgREST Schema Cache Reload for RPC Functions

  This migration forces PostgREST to recognize all RPC functions by:
  1. Creating a dummy schema change to invalidate the cache
  2. Notifying PostgREST via pgrst schema event
*/

-- Create a temporary table to trigger schema cache reload
CREATE TABLE IF NOT EXISTS _postgrest_cache_reload_trigger (
  id serial PRIMARY KEY,
  reload_at timestamptz DEFAULT now()
);

-- Insert a record to mark the reload
INSERT INTO _postgrest_cache_reload_trigger (reload_at) VALUES (now());

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- Clean up the trigger table
DROP TABLE IF EXISTS _postgrest_cache_reload_trigger;
