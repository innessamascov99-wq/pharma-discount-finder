/*
  # Fix Admin Email Configuration Consistency

  1. Changes
    - Update the handle_new_user trigger to recognize the same admin emails as frontend
    - Frontend uses: 'diabetic.admin@gmail.com', 'diabeticdiscount@gmail.com', 'admin@diabetic.com'
    - Trigger was using: 'pharmadiscountfinder@gmail.com', 'pharma.admin@gmail.com'
    - This synchronizes both to use the same admin email list
  
  2. Security
    - No changes to RLS policies
    - Only affects automatic admin assignment during user creation
*/

-- Drop and recreate the handle_new_user function with correct admin emails
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  first_name_val text;
  last_name_val text;
  email_val text;
  full_name_val text;
  is_admin_val boolean := false;
BEGIN
  -- Get email (always present)
  email_val := NEW.email;
  
  -- Check if this is an admin email (matching frontend admin emails)
  IF LOWER(email_val) IN ('diabetic.admin@gmail.com', 'diabeticdiscount@gmail.com', 'admin@diabetic.com') THEN
    is_admin_val := true;
  END IF;
  
  -- Extract first_name and last_name from raw_user_meta_data
  first_name_val := NEW.raw_user_meta_data->>'first_name';
  last_name_val := NEW.raw_user_meta_data->>'last_name';
  
  -- If not found, try full_name (Google OAuth often uses this)
  IF first_name_val IS NULL THEN
    full_name_val := NEW.raw_user_meta_data->>'full_name';
    
    IF full_name_val IS NOT NULL AND full_name_val != '' THEN
      first_name_val := split_part(full_name_val, ' ', 1);
      IF position(' ' in full_name_val) > 0 THEN
        last_name_val := substring(full_name_val from position(' ' in full_name_val) + 1);
      END IF;
    END IF;
  END IF;
  
  -- If still not found, try 'name' field
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
  
  -- Insert into public.users table
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
$$;
