/*
  # Force PostgREST Schema Cache Reload for Drugs Table

  1. Changes
    - Add a comment to the drugs table to force PostgREST to reload schema
    - Send NOTIFY signal to PostgREST to reload schema cache immediately

  2. Purpose
    - Resolve "Could not find the table 'public.drugs' in the schema cache" error
    - Ensure PostgREST API recognizes all tables
*/

-- Add/update comment on drugs table to trigger schema reload
COMMENT ON TABLE drugs IS 'Pharmaceutical drugs table - cache reload forced';

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
