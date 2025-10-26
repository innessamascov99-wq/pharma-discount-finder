/*
  # Recreate Contact Submissions Table with Correct Schema

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key) - Unique identifier for each submission
      - `full_name` (text) - Contact's full name
      - `email` (text) - Contact's email address
      - `message` (text) - Message content
      - `read` (boolean) - Whether admin has read the message
      - `created_at` (timestamptz) - Timestamp of submission
  
  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for anonymous users to insert contact submissions
    - Add policy for admins to view all contact submissions
  
  3. Schema Cache
    - Force PostgREST to reload schema cache
*/

-- Drop table if exists to force fresh creation
DROP TABLE IF EXISTS contact_submissions CASCADE;

-- Create contact submissions table
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone (anon or authenticated) can submit contact form
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Admins can view all contact submissions
CREATE POLICY "Admins can view all contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Add table comment
COMMENT ON TABLE contact_submissions IS 'Contact form submissions from website visitors - v2';

-- Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
