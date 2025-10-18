/*
  # Force PostgREST Schema Cache Refresh
  
  1. Approach
    - Alter function to trigger cache invalidation
    - Send multiple reload signals with delays
    - Touch pg_proc to update modification time
  
  2. Goal
    - Force PostgREST to recognize search_drugs_rpc in its schema cache
*/

-- Alter the function to trigger PostgREST detection
ALTER FUNCTION public.search_drugs_rpc(text) VOLATILE;
SELECT pg_sleep(0.2);

ALTER FUNCTION public.search_drugs_rpc(text) STABLE;
SELECT pg_sleep(0.2);

-- Send reload signals
DO $$
BEGIN
  PERFORM pg_notify('pgrst', 'reload schema');
  PERFORM pg_sleep(0.3);
  PERFORM pg_notify('pgrst', 'reload config');
  PERFORM pg_sleep(0.3);
  PERFORM pg_notify('pgrst', 'reload schema');
END $$;

-- Additional NOTIFY commands
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
