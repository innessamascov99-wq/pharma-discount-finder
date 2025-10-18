/*
  # Set Admin Account for pharmadiscountfinder@gmail.com
  
  1. Purpose
    - Automatically set pharmadiscountfinder@gmail.com as admin
    - Works for both existing and new signups
    - Ensures admin access regardless of signup method (email/password or Google OAuth)
    
  2. Changes
    - Updates handle_new_user() trigger to check for admin email
    - Sets is_admin=true for pharmadiscountfinder@gmail.com
    - Updates any existing user with that email to admin
*/

-- Update handle_new_user() function to automatically set admin for specific email
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  first_name_val text;
  last_name_val text;
  email_val text;
  full_name_val text;
  is_admin_val boolean := false;
BEGIN
  -- Get email (always present)
  email_val := NEW.email;
  
  -- Check if this is the admin email
  IF LOWER(email_val) = 'pharmadiscountfinder@gmail.com' THEN
    is_admin_val := true;
  END IF;
  
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
  INSERT INTO public.users (
    id, 
    email, 
    first_name, 
    last_name,
    is_admin,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id, 
    email_val, 
    first_name_val, 
    last_name_val,
    is_admin_val,
    NOW(), 
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, users.last_name),
    is_admin = EXCLUDED.is_admin,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update any existing user with the admin email to be admin
UPDATE public.users 
SET is_admin = true, updated_at = NOW()
WHERE LOWER(email) = 'pharmadiscountfinder@gmail.com';

-- Create index on email for faster admin checks
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON public.users(LOWER(email));

COMMENT ON FUNCTION handle_new_user() IS 
  'UNIFIED trigger for ALL auth methods: Creates user in public.users. Automatically sets pharmadiscountfinder@gmail.com as admin.';
