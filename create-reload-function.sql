-- Create a function that can be called via RPC to reload PostgREST
CREATE OR REPLACE FUNCTION public.reload_postgrest_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Send reload signals
  NOTIFY pgrst, 'reload schema';
  NOTIFY pgrst, 'reload config';
END;
$$;

-- Grant execute to anon so it can be called from frontend
GRANT EXECUTE ON FUNCTION public.reload_postgrest_cache() TO anon;
GRANT EXECUTE ON FUNCTION public.reload_postgrest_cache() TO authenticated;

-- Now you can call it via:
-- SELECT reload_postgrest_cache();
-- Or via RPC: POST /rest/v1/rpc/reload_postgrest_cache
