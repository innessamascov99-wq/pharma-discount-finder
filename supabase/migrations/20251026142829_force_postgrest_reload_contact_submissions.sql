/*
  # Force PostgREST Schema Cache Reload for Contact Submissions

  1. Changes
    - Add a dummy comment to the contact_submissions table to trigger PostgREST cache reload
    - Notify PostgREST of schema changes
  
  2. Purpose
    - Make contact_submissions table visible in the API schema cache
*/

-- Add a comment to trigger schema cache reload
COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions from users';

-- Notify PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';
