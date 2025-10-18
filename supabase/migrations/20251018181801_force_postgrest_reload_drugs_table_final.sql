/*
  # Force PostgREST Schema Cache Reload for Drugs Table
  
  1. Issue
    - PostgREST error: "could not find public.drugs in schema cache"
    - Table exists but not exposed via API
    
  2. Solution
    - Send NOTIFY signal to reload PostgREST schema cache
    - This forces PostgREST to recognize the drugs table
*/

-- Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';

-- Verify drugs table exists and has correct permissions
DO $$
BEGIN
  RAISE NOTICE 'Drugs table exists: %', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'drugs');
  RAISE NOTICE 'Drugs table has RLS: %', EXISTS(SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'drugs' AND rowsecurity = true);
END $$;
