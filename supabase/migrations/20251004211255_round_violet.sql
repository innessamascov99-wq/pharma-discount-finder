/*
  # Create signup table for user registration

  1. New Tables
    - `signup`
      - `id` (uuid, primary key)
      - `email` (varchar, unique, not null)
      - `password_hash` (text, not null)
      - `first_name` (varchar, not null)
      - `last_name` (varchar, not null)
      - `age` (integer, not null, must be >= 18)
      - `state` (varchar, not null, 2-character state code)
      - `insurance_status` (varchar, not null, constrained values)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Indexes
    - Email lookup index for faster authentication
    - State index for analytics and filtering

  3. Constraints
    - Age must be 18 or older
    - Insurance status must be one of predefined values
    - Email must be unique

  4. Security
    - Enable RLS on signup table
    - Users can view their own data
    - Allow insert for new signups
    - Users can update their own data
*/

-- Create the signup table
CREATE TABLE IF NOT EXISTS signup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  state VARCHAR(2) NOT NULL,
  insurance_status VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_signup_email ON signup(email);
CREATE INDEX IF NOT EXISTS idx_signup_state ON signup(state);

-- Add constraint to validate insurance status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_insurance_status' 
    AND table_name = 'signup'
  ) THEN
    ALTER TABLE signup ADD CONSTRAINT valid_insurance_status 
      CHECK (insurance_status IN (
        'Commercially Insured',
        'Medicare',
        'Medicaid',
        'Uninsured',
        'Prefer not to say'
      ));
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE signup ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own data
CREATE POLICY "Users can view own signup data"
  ON signup
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Allow insert for new signups
CREATE POLICY "Enable insert for new signups"
  ON signup
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own signup data"
  ON signup
  FOR UPDATE
  USING (auth.uid() = id);