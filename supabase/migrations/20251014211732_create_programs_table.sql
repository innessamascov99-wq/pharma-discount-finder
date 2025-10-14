/*
  # Create Programs Table for Educational Platform

  1. New Tables
    - `programs`
      - `id` (uuid, primary key) - Unique identifier for each program
      - `program_name` (text) - Name of the educational program
      - `description` (text) - Detailed description of the program
      - `category` (text) - Program category (e.g., Business, Technology, etc.)
      - `duration` (text) - Duration of the program
      - `skills` (text) - Skills covered in the program
      - `prerequisites` (text) - Required prerequisites
      - `difficulty_level` (text) - Difficulty level (Beginner, Intermediate, Advanced)
      - `price` (numeric) - Program price
      - `rating` (numeric) - Program rating (0-5)
      - `enrollment_count` (integer) - Number of enrollments
      - `provider` (text) - Program provider/institution
      - `certification` (text) - Certification type
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `programs` table
    - Add policy for public read access to programs
    - Add policy for authenticated users to manage programs

  3. Indexes
    - Index on category for faster filtering
    - Index on difficulty_level for quick searches
    - Index on rating for sorting
*/

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL,
  duration text NOT NULL DEFAULT '',
  skills text NOT NULL DEFAULT '',
  prerequisites text NOT NULL DEFAULT '',
  difficulty_level text NOT NULL,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  rating numeric(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  enrollment_count integer DEFAULT 0,
  provider text NOT NULL DEFAULT '',
  certification text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to all programs
CREATE POLICY "Anyone can view programs"
  ON programs
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Authenticated users can insert programs
CREATE POLICY "Authenticated users can insert programs"
  ON programs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update programs
CREATE POLICY "Authenticated users can update programs"
  ON programs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete programs
CREATE POLICY "Authenticated users can delete programs"
  ON programs
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);
CREATE INDEX IF NOT EXISTS idx_programs_difficulty ON programs(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_programs_rating ON programs(rating DESC);
CREATE INDEX IF NOT EXISTS idx_programs_enrollment ON programs(enrollment_count DESC);