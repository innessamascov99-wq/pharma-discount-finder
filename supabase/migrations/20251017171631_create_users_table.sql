/*
  # Create Users Table

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - References auth.users
      - `email` (text, unique) - User email
      - `first_name` (text) - User's first name
      - `last_name` (text) - User's last name
      - `phone` (text) - Contact phone number
      - `date_of_birth` (date) - Birth date for eligibility checks
      - `address_line1` (text) - Street address
      - `address_line2` (text) - Apartment, suite, etc.
      - `city` (text) - City
      - `state` (text) - State/Province
      - `zip_code` (text) - ZIP/Postal code
      - `country` (text) - Country
      - `insurance_type` (text) - Type of insurance (commercial, medicare, medicaid, uninsured)
      - `insurance_provider` (text) - Insurance company name
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `users` table
    - Users can only view and update their own profile
    - Authenticated users required for all access
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  date_of_birth date,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  zip_code text,
  country text DEFAULT 'USA',
  insurance_type text,
  insurance_provider text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE users IS 'User profile information for pharmaceutical program eligibility';

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_insurance_type ON users(insurance_type);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);
