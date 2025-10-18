/*
  # Consolidate All User Data into Single Users Table
  
  1. Updates
    - Drop user_profiles table if it exists (consolidating into users)
    - Recreate handle_new_user() trigger to work for ALL auth methods
    - Extract user data from raw_user_meta_data for both email/password and OAuth
    
  2. Trigger Behavior
    - Automatically creates user record in users table on signup
    - Works for email/password signup (extracts first_name, last_name from metadata)
    - Works for Google OAuth (extracts name from Google profile data)
    - Works for any other OAuth provider
    
  3. Single Source of Truth
    - public.users table contains ALL user data
    - No duplicate tables or profile tables
    - Consistent data structure regardless of auth method
*/

-- Drop user_profiles table if it exists (no longer needed)
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Recreate handle_new_user() function to consolidate all user data
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  first_name_val text;
  last_name_val text;
  email_val text;
BEGIN
  -- Get email (always present)
  email_val := NEW.email;
  
  -- Try to extract first_name and last_name from raw_user_meta_data
  first_name_val := NEW.raw_user_meta_data->>'first_name';
  last_name_val := NEW.raw_user_meta_data->>'last_name';
  
  -- If not found, try full_name (common in OAuth providers like Google)
  IF first_name_val IS NULL AND NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN
    first_name_val := split_part(NEW.raw_user_meta_data->>'full_name', ' ', 1);
    last_name_val := substring(NEW.raw_user_meta_data->>'full_name' from position(' ' in NEW.raw_user_meta_data->>'full_name') + 1);
  END IF;
  
  -- If still null, try 'name' field (another common OAuth field)
  IF first_name_val IS NULL AND NEW.raw_user_meta_data->>'name' IS NOT NULL THEN
    first_name_val := split_part(NEW.raw_user_meta_data->>'name', ' ', 1);
    last_name_val := substring(NEW.raw_user_meta_data->>'name' from position(' ' in NEW.raw_user_meta_data->>'name') + 1);
  END IF;
  
  -- If still null, use email username as first name
  IF first_name_val IS NULL THEN
    first_name_val := split_part(email_val, '@', 1);
  END IF;
  
  -- Insert into public.users table (single source of truth)
  INSERT INTO public.users (id, email, first_name, last_name, created_at, updated_at)
  VALUES (NEW.id, email_val, first_name_val, last_name_val, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, users.last_name),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists and is active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Add comment for clarity
COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates user record in public.users for ALL auth methods (email/password, Google OAuth, etc.)';
