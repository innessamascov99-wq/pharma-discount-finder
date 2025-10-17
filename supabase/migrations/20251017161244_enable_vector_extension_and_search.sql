/*
  # Enable Vector Extension and Text Search

  1. Extensions
    - Enable pg_trgm for fuzzy text search
    - Create GIN indexes for text search

  2. Indexes
    - Add text search indexes on searchable fields
    - Optimize for full-text search performance
*/

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_pharma_programs_medication_name_trgm 
  ON pharma_programs USING gin (medication_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_pharma_programs_generic_name_trgm 
  ON pharma_programs USING gin (generic_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_pharma_programs_manufacturer_trgm 
  ON pharma_programs USING gin (manufacturer gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_pharma_programs_program_description_trgm 
  ON pharma_programs USING gin (program_description gin_trgm_ops);
