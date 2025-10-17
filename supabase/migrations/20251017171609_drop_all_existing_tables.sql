/*
  # Drop All Existing Tables - Complete Fresh Start

  1. Drop All Tables
    - pharma_programs
    - All other existing tables
    - All functions and indexes will cascade

  2. Clean State
    - Remove all RLS policies
    - Remove all functions
    - Start completely fresh
*/

DROP TABLE IF EXISTS pharma_programs CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS user_activity CASCADE;
DROP TABLE IF EXISTS saved_programs CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS drugs CASCADE;

DROP FUNCTION IF EXISTS search_pharma_programs CASCADE;
DROP FUNCTION IF EXISTS search_pharma_simple CASCADE;
DROP FUNCTION IF EXISTS match_pharma_programs CASCADE;
DROP FUNCTION IF EXISTS search_programs CASCADE;
DROP FUNCTION IF EXISTS search_drugs CASCADE;
