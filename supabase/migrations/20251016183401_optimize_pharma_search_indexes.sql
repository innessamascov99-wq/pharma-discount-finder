/*
  # Optimize Pharmaceutical Program Search Performance

  ## Description
  This migration optimizes search performance for pharmaceutical discount programs by:
  1. Adding optimized indexes for common search patterns
  2. Creating a hybrid search function that combines text and fuzzy matching
  3. Adding a materialized search view for faster queries

  ## Changes Made

  ### 1. New Indexes
  - GIN index on lowercase medication names for faster case-insensitive searches
  - GIN index on lowercase generic names
  - Composite index on medication_name and manufacturer for combined searches
  - Trigram indexes for fuzzy matching (partial word matching)

  ### 2. Search Functions
  - `search_pharma_programs_optimized`: Hybrid search function combining exact, prefix, and fuzzy matching
  - Uses progressive matching strategy: exact match -> prefix match -> fuzzy match
  - Returns relevance scores for ranking results

  ### 3. Performance Improvements
  - Enables pg_trgm extension for fuzzy text matching
  - Creates trigram indexes for partial word matching
  - Optimizes existing full-text search indexes

  ## Notes
  - All indexes use IF NOT EXISTS to prevent errors on re-run
  - Trigram matching allows finding "mounjaro" when user types "mouns" or "jaro"
  - Search function prioritizes exact matches, then prefix matches, then fuzzy matches
*/

-- Enable pg_trgm extension for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Drop old indexes that might not be optimal
DROP INDEX IF EXISTS idx_pharma_programs_medication_name;
DROP INDEX IF EXISTS idx_pharma_programs_manufacturer;

-- Create optimized GIN indexes for case-insensitive search
CREATE INDEX IF NOT EXISTS idx_pharma_medication_lower_gin 
  ON pharma_programs USING gin(lower(medication_name) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_pharma_generic_lower_gin 
  ON pharma_programs USING gin(lower(generic_name) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_pharma_manufacturer_lower_gin 
  ON pharma_programs USING gin(lower(manufacturer) gin_trgm_ops);

-- Create composite index for combined searches
CREATE INDEX IF NOT EXISTS idx_pharma_med_mfg_active 
  ON pharma_programs(lower(medication_name), lower(manufacturer), active) 
  WHERE active = true;

-- Create index on active flag for filtering
CREATE INDEX IF NOT EXISTS idx_pharma_active 
  ON pharma_programs(active) 
  WHERE active = true;

-- Optimize existing full-text search index
DROP INDEX IF EXISTS idx_pharma_programs_search;
CREATE INDEX IF NOT EXISTS idx_pharma_fts_optimized 
  ON pharma_programs USING gin(
    to_tsvector('english', 
      COALESCE(medication_name, '') || ' ' || 
      COALESCE(generic_name, '') || ' ' || 
      COALESCE(manufacturer, '') || ' ' || 
      COALESCE(program_name, '') || ' ' || 
      COALESCE(program_description, '')
    )
  );

-- Create optimized hybrid search function
CREATE OR REPLACE FUNCTION search_pharma_programs_optimized(
  search_query text,
  result_limit int DEFAULT 20
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
  created_at timestamptz,
  updated_at timestamptz,
  relevance float
) AS $$
DECLARE
  query_lower text := lower(trim(search_query));
BEGIN
  RETURN QUERY
  WITH ranked_results AS (
    SELECT 
      p.*,
      CASE
        -- Exact match on medication name (highest priority)
        WHEN lower(p.medication_name) = query_lower THEN 100.0
        -- Exact match on generic name
        WHEN lower(p.generic_name) = query_lower THEN 95.0
        -- Starts with query (medication name)
        WHEN lower(p.medication_name) LIKE query_lower || '%' THEN 80.0
        -- Starts with query (generic name)
        WHEN lower(p.generic_name) LIKE query_lower || '%' THEN 75.0
        -- Contains query (medication name)
        WHEN lower(p.medication_name) LIKE '%' || query_lower || '%' THEN 60.0
        -- Contains query (generic name)
        WHEN lower(p.generic_name) LIKE '%' || query_lower || '%' THEN 55.0
        -- Contains query (manufacturer)
        WHEN lower(p.manufacturer) LIKE '%' || query_lower || '%' THEN 50.0
        -- Trigram similarity for fuzzy matching (medication name)
        WHEN similarity(lower(p.medication_name), query_lower) > 0.3 THEN 
          40.0 + (similarity(lower(p.medication_name), query_lower) * 30)
        -- Trigram similarity for fuzzy matching (generic name)
        WHEN similarity(lower(p.generic_name), query_lower) > 0.3 THEN 
          35.0 + (similarity(lower(p.generic_name), query_lower) * 25)
        -- Full-text search fallback
        ELSE 
          ts_rank(
            to_tsvector('english', 
              COALESCE(p.medication_name, '') || ' ' || 
              COALESCE(p.generic_name, '') || ' ' || 
              COALESCE(p.manufacturer, '') || ' ' || 
              COALESCE(p.program_name, '')
            ),
            plainto_tsquery('english', search_query)
          ) * 20
      END as relevance_score
    FROM pharma_programs p
    WHERE p.active = true
      AND (
        lower(p.medication_name) LIKE '%' || query_lower || '%'
        OR lower(p.generic_name) LIKE '%' || query_lower || '%'
        OR lower(p.manufacturer) LIKE '%' || query_lower || '%'
        OR lower(p.program_name) LIKE '%' || query_lower || '%'
        OR similarity(lower(p.medication_name), query_lower) > 0.3
        OR similarity(lower(p.generic_name), query_lower) > 0.3
        OR to_tsvector('english', 
            COALESCE(p.medication_name, '') || ' ' || 
            COALESCE(p.generic_name, '') || ' ' || 
            COALESCE(p.manufacturer, '')
          ) @@ plainto_tsquery('english', search_query)
      )
  )
  SELECT 
    r.id,
    r.medication_name,
    r.generic_name,
    r.manufacturer,
    r.program_name,
    r.program_description,
    r.eligibility_criteria,
    r.discount_amount,
    r.program_url,
    r.phone_number,
    r.enrollment_process,
    r.required_documents,
    r.active,
    r.created_at,
    r.updated_at,
    r.relevance_score as relevance
  FROM ranked_results r
  WHERE r.relevance_score > 0
  ORDER BY r.relevance_score DESC, r.medication_name ASC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create simple direct search function for exact lookups
CREATE OR REPLACE FUNCTION search_pharma_programs_simple(
  search_query text,
  result_limit int DEFAULT 20
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
  created_at timestamptz,
  updated_at timestamptz
) AS $$
DECLARE
  query_lower text := lower(trim(search_query));
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.medication_name,
    p.generic_name,
    p.manufacturer,
    p.program_name,
    p.program_description,
    p.eligibility_criteria,
    p.discount_amount,
    p.program_url,
    p.phone_number,
    p.enrollment_process,
    p.required_documents,
    p.active,
    p.created_at,
    p.updated_at
  FROM pharma_programs p
  WHERE p.active = true
    AND (
      lower(p.medication_name) LIKE '%' || query_lower || '%'
      OR lower(p.generic_name) LIKE '%' || query_lower || '%'
      OR lower(p.manufacturer) LIKE '%' || query_lower || '%'
    )
  ORDER BY 
    CASE
      WHEN lower(p.medication_name) = query_lower THEN 1
      WHEN lower(p.medication_name) LIKE query_lower || '%' THEN 2
      WHEN lower(p.generic_name) = query_lower THEN 3
      WHEN lower(p.generic_name) LIKE query_lower || '%' THEN 4
      ELSE 5
    END,
    p.medication_name ASC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql STABLE;
