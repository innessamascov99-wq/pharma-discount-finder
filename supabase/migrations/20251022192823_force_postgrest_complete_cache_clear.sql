/*
  # Force Complete PostgREST Cache Clear

  This migration forces a complete PostgREST schema cache refresh by:
  1. Adding a new temporary column to drugs table
  2. Updating a row to trigger change detection
  3. Removing the temporary column
  4. Notifying PostgREST to reload

  This should force PostgREST to recognize the current schema.
*/

-- Add and remove a temporary column to force schema change detection
ALTER TABLE drugs ADD COLUMN temp_cache_clear_col text DEFAULT 'temp';

-- Update a row to ensure the change is detected
UPDATE drugs SET temp_cache_clear_col = 'cleared' WHERE id = (SELECT id FROM drugs LIMIT 1);

-- Remove the temporary column
ALTER TABLE drugs DROP COLUMN temp_cache_clear_col;

-- Send multiple reload signals
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
SELECT pg_notify('pgrst', 'reload schema');
SELECT pg_notify('pgrst', 'reload config');