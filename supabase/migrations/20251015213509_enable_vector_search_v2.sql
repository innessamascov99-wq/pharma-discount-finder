/*
  # Enable Vector Search for Pharmacy Programs

  1. Extensions
    - Enable `vector` extension for pgvector support
  
  2. Schema Changes
    - Add `embedding` column to `pharma_programs` table for storing text embeddings
    - Add `search_text` column to combine searchable fields
  
  3. Indexes
    - Create vector similarity index using cosine distance
    - Create text search index for hybrid search
  
  4. Functions
    - Create function to generate search text automatically
    - Create function for vector similarity search
  
  5. Triggers
    - Auto-update search_text when records change
*/

-- Enable the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to pharma_programs table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pharma_programs' AND column_name = 'embedding'
  ) THEN
    ALTER TABLE pharma_programs ADD COLUMN embedding vector(384);
  END IF;
END $$;

-- Add search_text column for combined searchable content
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pharma_programs' AND column_name = 'search_text'
  ) THEN
    ALTER TABLE pharma_programs ADD COLUMN search_text text;
  END IF;
END $$;

-- Create function to generate search text
CREATE OR REPLACE FUNCTION generate_pharma_search_text(record pharma_programs)
RETURNS text AS $$
BEGIN
  RETURN COALESCE(record.medication_name, '') || ' ' ||
         COALESCE(record.generic_name, '') || ' ' ||
         COALESCE(record.manufacturer, '') || ' ' ||
         COALESCE(record.program_name, '') || ' ' ||
         COALESCE(record.program_description, '') || ' ' ||
         COALESCE(record.eligibility_criteria, '');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create trigger function to auto-update search_text
CREATE OR REPLACE FUNCTION update_pharma_search_text_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_text := generate_pharma_search_text(NEW);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS update_pharma_search_text ON pharma_programs;

-- Create trigger
CREATE TRIGGER update_pharma_search_text
  BEFORE INSERT OR UPDATE ON pharma_programs
  FOR EACH ROW
  EXECUTE FUNCTION update_pharma_search_text_trigger();

-- Update existing records to populate search_text
UPDATE pharma_programs
SET search_text = generate_pharma_search_text(pharma_programs.*);

-- Create vector similarity search function
CREATE OR REPLACE FUNCTION search_pharma_programs_vector(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.3,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  medication_name text,
  generic_name text,
  manufacturer text,
  program_name text,
  program_description text,
  eligibility_criteria text,
  discount_amount text,
  program_url text,
  phone_number text,
  enrollment_process text,
  required_documents text,
  active boolean,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pharma_programs.id,
    pharma_programs.medication_name,
    pharma_programs.generic_name,
    pharma_programs.manufacturer,
    pharma_programs.program_name,
    pharma_programs.program_description,
    pharma_programs.eligibility_criteria,
    pharma_programs.discount_amount,
    pharma_programs.program_url,
    pharma_programs.phone_number,
    pharma_programs.enrollment_process,
    pharma_programs.required_documents,
    pharma_programs.active,
    1 - (pharma_programs.embedding <=> query_embedding) as similarity
  FROM pharma_programs
  WHERE pharma_programs.active = true
    AND pharma_programs.embedding IS NOT NULL
    AND 1 - (pharma_programs.embedding <=> query_embedding) > match_threshold
  ORDER BY pharma_programs.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS pharma_programs_embedding_idx 
  ON pharma_programs 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Create text search index
CREATE INDEX IF NOT EXISTS pharma_programs_search_text_idx 
  ON pharma_programs 
  USING gin(to_tsvector('english', search_text));
