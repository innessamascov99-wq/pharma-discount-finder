/*
  # Force PostgREST Schema Cache Reload for Users Table

  1. Issue
    - PostgREST is not recognizing the users table columns correctly
    - Queries return empty results or column not found errors

  2. Solution
    - Trigger PostgREST schema cache reload by making a schema change
    - Add a comment to force cache invalidation
*/

-- Force PostgREST to reload schema cache by modifying table comment
COMMENT ON TABLE public.users IS 'User profiles and account information - Cache reload trigger';

-- Notify PostgREST of schema changes
NOTIFY pgrst, 'reload schema';
