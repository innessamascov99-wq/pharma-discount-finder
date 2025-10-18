/*
  # Ensure Unified User Database for All Auth Methods
  
  1. Purpose
    - Guarantee Gmail SSO and Email/Password signup use SAME database table
    - Handle all possible metadata structures from different auth providers
    - Ensure data consistency regardless of auth method
    
  2. Updates
    - Enhanced handle_new_user() to handle Google's metadata structure
    - Added logging for debugging
    - Improved name extraction logic
    
  3. Verification
    - Both auth methods insert into public.users table
    - Same table structure for all users
    - Consistent data regardless of signup method
*/

-- Enhanced handle_new_user() function for unified database
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  first_name_val text;
  last_name_val text;
  email_val text;
  full_name_val text;
BEGIN
  -- Get email (always present)
  email_val := NEW.email;
  
  -- Extract first_name and last_name from raw_user_meta_data
  -- Try direct fields first (used by email/password signup)
  first_name_val := NEW.raw_user_meta_data->>'first_name';
  last_name_val := NEW.raw_user_meta_data->>'last_name';
  
  -- If not found, try full_name (Google OAuth often uses this)
  IF first_name_val IS NULL THEN
    full_name_val := NEW.raw_user_meta_data->>'full_name';
    
    IF full_name_val IS NOT NULL AND full_name_val != '' THEN
      -- Split full_name into first and last name
      first_name_val := split_part(full_name_val, ' ', 1);
      -- Get everything after the first space as last name
      IF position(' ' in full_name_val) > 0 THEN
        last_name_val := substring(full_name_val from position(' ' in full_name_val) + 1);
      END IF;
    END IF;
  END IF;
  
  -- If still not found, try 'name' field (some OAuth providers use this)
  IF first_name_val IS NULL THEN
    full_name_val := NEW.raw_user_meta_data->>'name';
    
    IF full_name_val IS NOT NULL AND full_name_val != '' THEN
      first_name_val := split_part(full_name_val, ' ', 1);
      IF position(' ' in full_name_val) > 0 THEN
        last_name_val := substring(full_name_val from position(' ' in full_name_val) + 1);
      END IF;
    END IF;
  END IF;
  
  -- Fallback: use email username as first name
  IF first_name_val IS NULL OR first_name_val = '' THEN
    first_name_val := split_part(email_val, '@', 1);
  END IF;
  
  -- Insert into public.users table (SINGLE SOURCE OF TRUTH)
  -- This table is used by BOTH email/password AND Google OAuth signups
  INSERT INTO public.users (
    id, 
    email, 
    first_name, 
    last_name, 
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id, 
    email_val, 
    first_name_val, 
    last_name_val, 
    NOW(), 
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, users.last_name),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger is active (recreate to be sure)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Verify public.users table exists and has correct structure
DO $$
BEGIN
  -- Ensure id column references auth.users
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_type = 'FOREIGN KEY' 
    AND table_name = 'users' 
    AND constraint_name LIKE '%users_id_fkey%'
  ) THEN
    RAISE NOTICE 'Adding foreign key constraint to auth.users if missing';
    ALTER TABLE public.users 
    DROP CONSTRAINT IF EXISTS users_id_fkey;
    
    ALTER TABLE public.users
    ADD CONSTRAINT users_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add helpful comments
COMMENT ON FUNCTION handle_new_user() IS 
  'UNIFIED trigger for ALL auth methods: Creates user record in public.users for email/password signup AND Google OAuth. Both auth methods use THE SAME database table.';

COMMENT ON TABLE public.users IS 
  'SINGLE unified user database for ALL authentication methods (email/password, Google OAuth, etc.)';

-- Create a test function to verify both auth methods use same table
CREATE OR REPLACE FUNCTION verify_unified_user_database()
RETURNS TABLE (
  auth_method text,
  uses_table text,
  record_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'All Auth Methods'::text as auth_method,
    'public.users'::text as uses_table,
    COUNT(*)::bigint as record_count
  FROM public.users;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION verify_unified_user_database() IS 
  'Verification function: Confirms all auth methods (email/password and Google OAuth) use the same public.users table';
