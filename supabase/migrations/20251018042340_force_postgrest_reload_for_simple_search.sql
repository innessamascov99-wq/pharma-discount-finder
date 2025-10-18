/*
  # Force PostgREST Schema Cache Reload

  1. Purpose
    - Force PostgREST to reload its schema cache to recognize new RPC functions
    - Ensure simple_search_drugs and simple_search_programs are available via REST API

  2. Actions
    - Send reload signal to PostgREST
    - Verify function permissions are correct
*/

-- Send reload signal to PostgREST
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Re-grant permissions to ensure they're fresh
GRANT EXECUTE ON FUNCTION public.simple_search_drugs(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.simple_search_drugs(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.simple_search_programs(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.simple_search_programs(TEXT) TO authenticated;
