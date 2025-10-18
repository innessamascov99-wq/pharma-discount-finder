/*
  # User Profile Auto-creation and Login Tracking
  
  1. Triggers
    - Create user profile automatically on auth.users signup
    - Update last_login timestamp on user login
    
  2. Functions
    - handle_new_user() - Creates user profile in users table
    - update_last_login() - Updates last_login timestamp
*/

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to update last login timestamp
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET last_login = NOW()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_last_login() TO authenticated;