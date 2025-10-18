/*
  # Force PostgREST to Expose public.drugs Table

  This migration ensures PostgREST's schema cache properly recognizes the drugs table.

  1. Actions Taken
    - Grant explicit usage on public schema to anon/authenticated roles
    - Re-grant all table permissions to anon/authenticated
    - Add comment to drugs table to trigger schema cache refresh
    - Send NOTIFY signal to PostgREST to reload schema

  2. Purpose
    - Ensure PostgREST REST API can properly serve the drugs table
    - Force schema cache refresh in PostgREST
*/

-- Explicitly grant schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Ensure all privileges are granted on tables
GRANT ALL PRIVILEGES ON TABLE public.drugs TO anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.programs TO anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.drugs_programs TO anon, authenticated;

-- Add a comment to trigger schema change detection
COMMENT ON TABLE public.drugs IS 'Pharmaceutical drugs/medications database - PostgREST exposed';
COMMENT ON TABLE public.programs IS 'Pharmaceutical assistance programs - PostgREST exposed';
COMMENT ON TABLE public.drugs_programs IS 'Junction table linking drugs to programs - PostgREST exposed';

-- Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
