/*
  # Generate Embeddings for Pharmaceutical Programs
  
  ## Summary
  This migration generates vector embeddings for all pharmaceutical programs that don't have embeddings yet.
  It uses Supabase AI's built-in 'gte-small' model to create 384-dimensional embeddings.
  
  ## What It Does
  1. Creates a function to generate embeddings using Supabase AI
  2. Processes all active programs without embeddings
  3. Updates each record with its generated embedding
  
  ## Technical Details
  - Model: gte-small (384 dimensions)
  - Input: Combined text from medication name, generic name, manufacturer, program name, description, and eligibility
  - Processing: mean_pool and normalize enabled for optimal search performance
*/

-- Create function to generate and update embeddings
CREATE OR REPLACE FUNCTION generate_pharma_program_embeddings()
RETURNS TABLE (
  processed_count int,
  success_count int,
  error_count int
) AS $$
DECLARE
  v_program RECORD;
  v_search_text TEXT;
  v_embedding vector(384);
  v_processed int := 0;
  v_success int := 0;
  v_error int := 0;
BEGIN
  -- Loop through all programs that need embeddings
  FOR v_program IN 
    SELECT * FROM pharma_programs 
    WHERE active = true AND embedding IS NULL
  LOOP
    BEGIN
      -- Build search text from available fields
      v_search_text := CONCAT_WS(' ',
        v_program.medication_name,
        v_program.generic_name,
        v_program.manufacturer,
        v_program.program_name,
        v_program.program_description,
        v_program.eligibility_criteria
      );
      
      -- Generate embedding using Supabase AI
      v_embedding := ai.gte_small_embedding(v_search_text);
      
      -- Update the program with the embedding
      UPDATE pharma_programs
      SET embedding = v_embedding
      WHERE id = v_program.id;
      
      v_success := v_success + 1;
      RAISE NOTICE 'Generated embedding for: %', v_program.medication_name;
      
    EXCEPTION WHEN OTHERS THEN
      v_error := v_error + 1;
      RAISE NOTICE 'Error processing %: %', v_program.medication_name, SQLERRM;
    END;
    
    v_processed := v_processed + 1;
  END LOOP;
  
  RETURN QUERY SELECT v_processed, v_success, v_error;
END;
$$ LANGUAGE plpgsql;

-- Generate embeddings for all programs
DO $$
DECLARE
  v_result RECORD;
BEGIN
  SELECT * INTO v_result FROM generate_pharma_program_embeddings();
  RAISE NOTICE 'Embedding generation complete: % processed, % success, % errors', 
    v_result.processed_count, v_result.success_count, v_result.error_count;
END $$;
