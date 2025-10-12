/*
  # Create Knowledge Base Table

  1. New Tables
    - `knowledge_base`
      - `id` (uuid, primary key) - Unique identifier for each KB article
      - `category` (text) - Category of the article (e.g., "Login Issues", "Password Reset")
      - `title` (text) - Title of the KB article
      - `symptoms` (text[]) - Array of symptoms related to the issue
      - `solutions` (text[]) - Array of solution steps
      - `keywords` (text[]) - Searchable keywords for the article
      - `priority` (integer) - Display priority (lower number = higher priority)
      - `is_active` (boolean) - Whether the article is active/published
      - `created_at` (timestamptz) - When the article was created
      - `updated_at` (timestamptz) - When the article was last updated

  2. Security
    - Enable RLS on `knowledge_base` table
    - Add policy for public read access (anyone can read KB articles)
    - Add policy for authenticated users to suggest updates (future feature)

  3. Indexes
    - Create indexes on category, keywords, and is_active for fast searching
*/

-- Create the knowledge_base table
CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  symptoms text[] DEFAULT '{}',
  solutions text[] DEFAULT '{}',
  keywords text[] DEFAULT '{}',
  priority integer DEFAULT 100,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_kb_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_kb_keywords ON knowledge_base USING gin(keywords);
CREATE INDEX IF NOT EXISTS idx_kb_is_active ON knowledge_base(is_active);
CREATE INDEX IF NOT EXISTS idx_kb_priority ON knowledge_base(priority);

-- Enable Row Level Security
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active KB articles
CREATE POLICY "Anyone can read active KB articles"
  ON knowledge_base
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can read all KB articles (including inactive)
CREATE POLICY "Authenticated users can read all KB articles"
  ON knowledge_base
  FOR SELECT
  TO authenticated
  USING (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_kb_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER kb_updated_at_trigger
  BEFORE UPDATE ON knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION update_kb_updated_at();
