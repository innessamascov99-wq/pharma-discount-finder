/*
  # Grant Execute Permissions for Search Function
  
  1. Security
    - Grant EXECUTE permission on search_pharma_simple function to anon and authenticated roles
    - Allows public users to search pharma programs without authentication
*/

GRANT EXECUTE ON FUNCTION search_pharma_simple(text) TO anon, authenticated;
