/*
  # Recreate Admin RPC Functions to Force PostgREST Cache Recognition

  This migration recreates all admin RPC functions with explicit security settings
  to ensure PostgREST recognizes them in the schema cache.
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS get_user_statistics(integer);
DROP FUNCTION IF EXISTS get_top_programs(integer);
DROP FUNCTION IF EXISTS get_all_recent_activity(integer);

-- Recreate get_user_statistics function
CREATE OR REPLACE FUNCTION get_user_statistics(days_back integer DEFAULT 30)
RETURNS TABLE (
  date text,
  new_users integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_char(date_series.date, 'YYYY-MM-DD') as date,
    COALESCE(COUNT(u.id)::integer, 0) as new_users
  FROM generate_series(
    CURRENT_DATE - (days_back || ' days')::interval,
    CURRENT_DATE,
    '1 day'::interval
  ) AS date_series(date)
  LEFT JOIN users u ON DATE(u.created_at) = date_series.date
  GROUP BY date_series.date
  ORDER BY date_series.date;
END;
$$;

-- Recreate get_top_programs function
CREATE OR REPLACE FUNCTION get_top_programs(limit_count integer DEFAULT 10)
RETURNS TABLE (
  medication_name text,
  search_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(ua.medication_name, 'Unknown') as medication_name,
    COUNT(*)::bigint as search_count
  FROM user_activity ua
  WHERE ua.action_type = 'search'
    AND ua.medication_name IS NOT NULL
  GROUP BY ua.medication_name
  ORDER BY COUNT(*) DESC
  LIMIT limit_count;
END;
$$;

-- Recreate get_all_recent_activity function
CREATE OR REPLACE FUNCTION get_all_recent_activity(limit_count integer DEFAULT 50)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  user_email text,
  action_type text,
  medication_name text,
  drug_id uuid,
  program_id uuid,
  search_query text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ua.id,
    ua.user_id,
    au.email as user_email,
    ua.action_type,
    ua.medication_name,
    ua.drug_id,
    ua.program_id,
    ua.search_query,
    ua.created_at
  FROM user_activity ua
  LEFT JOIN auth.users au ON ua.user_id = au.id
  ORDER BY ua.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_user_statistics(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_top_programs(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_all_recent_activity(integer) TO anon, authenticated;

-- Add function comments
COMMENT ON FUNCTION get_user_statistics(integer) IS 'Returns user registration statistics for the specified number of days';
COMMENT ON FUNCTION get_top_programs(integer) IS 'Returns the most searched medications';
COMMENT ON FUNCTION get_all_recent_activity(integer) IS 'Returns recent user activity across the platform';

-- Trigger PostgREST cache reload
NOTIFY pgrst, 'reload schema';
