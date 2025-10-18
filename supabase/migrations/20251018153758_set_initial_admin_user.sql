/*
  # Set Initial Admin User
  
  Sets the admin user to pharmadiscountfinder@gmail.com if the user exists.
  This maintains backward compatibility with the existing admin email check.
*/

-- Update the admin status for the initial admin user if they exist
UPDATE users 
SET is_admin = true 
WHERE email = 'pharmadiscountfinder@gmail.com';

-- If the user doesn't exist yet, this will do nothing
-- The admin status will be granted when they sign up or can be granted through the admin panel