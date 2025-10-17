/*
  # Fresh Start - Drop All Existing Tables

  1. Tables to Drop
    - pharma_programs
    - programs
    - user_activity
    - saved_programs
    - user_profiles
    - contact_submissions
    - customer

  2. Security
    - All RLS policies will be dropped automatically with tables
    - All indexes and functions will be cleaned up
*/

DROP TABLE IF EXISTS user_activity CASCADE;
DROP TABLE IF EXISTS saved_programs CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS pharma_programs CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS customer CASCADE;

DROP FUNCTION IF EXISTS search_pharma_simple CASCADE;
DROP FUNCTION IF EXISTS search_pharma_programs CASCADE;
DROP FUNCTION IF EXISTS match_pharma_programs CASCADE;
