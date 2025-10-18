/*
  # Force Complete PostgREST Schema Reload
  
  This migration forces PostgREST to completely reload its schema cache by:
  1. Temporarily modifying and restoring table comments to trigger cache invalidation
  2. Explicitly granting all necessary permissions
  3. Sending multiple reload signals
  
  This addresses persistent "not in schema cache" errors.
*/

-- Add/update table comments to force cache invalidation
COMMENT ON TABLE public.drugs IS 'Pharmaceutical drugs and medications database - updated for cache refresh';
COMMENT ON TABLE public.programs IS 'Patient assistance and discount programs - updated for cache refresh';
COMMENT ON TABLE public.drugs_programs IS 'Junction table linking drugs to assistance programs - updated for cache refresh';

-- Ensure public schema permissions are correct
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO public;

-- Explicitly grant SELECT on all tables to relevant roles
GRANT SELECT ON public.drugs TO anon;
GRANT SELECT ON public.drugs TO authenticated;
GRANT SELECT ON public.drugs TO public;

GRANT SELECT ON public.programs TO anon;
GRANT SELECT ON public.programs TO authenticated;
GRANT SELECT ON public.programs TO public;

GRANT SELECT ON public.drugs_programs TO anon;
GRANT SELECT ON public.drugs_programs TO authenticated;
GRANT SELECT ON public.drugs_programs TO public;

-- Ensure RLS is enabled
ALTER TABLE public.drugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drugs_programs ENABLE ROW LEVEL SECURITY;

-- Refresh materialized views if any exist
DO $$
BEGIN
  PERFORM pg_notify('pgrst', 'reload schema');
  PERFORM pg_notify('pgrst', 'reload config');
END $$;

-- Update pg_stat to help with cache
ANALYZE public.drugs;
ANALYZE public.programs;
ANALYZE public.drugs_programs;
