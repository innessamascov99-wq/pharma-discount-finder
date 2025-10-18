/*
  # Force PostgREST schema cache reload
  
  1. Actions
    - Send multiple reload signals to PostgREST
    - Make a schema change that forces PostgREST to notice
    - Re-grant permissions to ensure they're registered
  
  2. Notes
    - This should make all RPC functions visible in the REST API
*/

-- Re-grant all permissions to ensure PostgREST sees them
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO anon;
GRANT EXECUTE ON FUNCTION public.search_drugs_rpc(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_programs_rpc(text) TO anon;
GRANT EXECUTE ON FUNCTION public.search_programs_rpc(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_drugs_rpc() TO anon;
GRANT EXECUTE ON FUNCTION public.get_all_drugs_rpc() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_programs_for_drug_rpc(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_programs_for_drug_rpc(uuid) TO authenticated;

-- Send reload signals
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Multiple reloads to ensure PostgREST picks up the changes
DO $$
DECLARE
  i INTEGER;
BEGIN
  FOR i IN 1..5 LOOP
    PERFORM pg_notify('pgrst', 'reload schema');
    PERFORM pg_sleep(0.1);
  END LOOP;
END $$;

-- Add a comment to trigger schema change detection
COMMENT ON FUNCTION public.search_drugs_rpc(text) IS 'Search drugs by name, class, or indication - Updated to trigger cache reload';
COMMENT ON FUNCTION public.search_programs_rpc(text) IS 'Search programs by name, manufacturer, or description';
COMMENT ON FUNCTION public.get_all_drugs_rpc() IS 'Get all active drugs';
COMMENT ON FUNCTION public.get_programs_for_drug_rpc(uuid) IS 'Get all programs for a specific drug';

-- Final reload
NOTIFY pgrst, 'reload schema';
