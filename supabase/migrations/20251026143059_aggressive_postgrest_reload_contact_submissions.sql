/*
  # Aggressive PostgREST Schema Cache Reload for Contact Submissions

  1. Changes
    - Create a dummy table to trigger schema change detection
    - Drop the dummy table immediately
    - Add index to contact_submissions to trigger cache reload
    - Notify PostgREST multiple times
  
  2. Purpose
    - Force PostgREST to recognize the contact_submissions table in its API
*/

-- Create and drop a dummy table to trigger schema change
CREATE TABLE IF NOT EXISTS _dummy_trigger_reload (id serial PRIMARY KEY);
DROP TABLE IF EXISTS _dummy_trigger_reload;

-- Add an index to contact_submissions to trigger cache reload
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at 
ON contact_submissions(created_at DESC);

-- Add another index
CREATE INDEX IF NOT EXISTS idx_contact_submissions_read 
ON contact_submissions(read);

-- Update table comment to trigger change detection
COMMENT ON TABLE contact_submissions IS 'Contact form submissions from website visitors - schema reloaded';

-- Grant explicit permissions to anon role
GRANT INSERT ON contact_submissions TO anon;
GRANT INSERT ON contact_submissions TO authenticated;

-- Notify PostgREST multiple times
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
