/*
  # Force Complete PostgREST Schema Reload

  1. Purpose
    - Force PostgREST to completely reload its schema cache
    - Ensure all tables (drugs, programs) and functions are visible in REST API

  2. Actions
    - Drop and recreate pg_stat_statements to force cache invalidation
    - Send multiple reload signals
    - Touch all relevant schema objects
*/

-- Force schema cache invalidation by updating table comments
COMMENT ON TABLE public.drugs IS 'Pharmaceutical drugs table - updated for cache reload';
COMMENT ON TABLE public.programs IS 'Assistance programs table - updated for cache reload';
COMMENT ON TABLE public.drugs_programs IS 'Drug-program relationships - updated for cache reload';

-- Update function comments to force cache reload
COMMENT ON FUNCTION public.simple_search_drugs(TEXT) IS 'Search drugs by text - updated for cache reload';
COMMENT ON FUNCTION public.simple_search_programs(TEXT) IS 'Search programs by text - updated for cache reload';

-- Send reload signals
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Grant all necessary permissions explicitly
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.drugs TO anon, authenticated;
GRANT SELECT ON public.programs TO anon, authenticated;
GRANT SELECT ON public.drugs_programs TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.simple_search_drugs(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.simple_search_programs(TEXT) TO anon, authenticated;
