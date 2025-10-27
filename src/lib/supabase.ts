import { createClient } from '@supabase/supabase-js';

// LOCKED CONFIGURATION - All services use this database
// Database: https://nuhfqkhplldontxtoxkg.supabase.co
// Project ID: nuhfqkhplldontxtoxkg
const CORRECT_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const CORRECT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

// User authentication database
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || CORRECT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || CORRECT_ANON_KEY;

// Drugs database (using same database as auth)
const drugsSupabaseUrl = import.meta.env.VITE_DRUGS_SUPABASE_URL || supabaseUrl;
const drugsSupabaseAnonKey = import.meta.env.VITE_DRUGS_SUPABASE_ANON_KEY || supabaseAnonKey;

// Validate we're using the correct database
if (supabaseUrl !== CORRECT_URL) {
  console.warn(`WARNING: Using ${supabaseUrl} instead of ${CORRECT_URL}`);
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing user database Supabase environment variables');
}

if (!drugsSupabaseUrl || !drugsSupabaseAnonKey) {
  throw new Error('Missing drugs database Supabase environment variables');
}

// Client for user authentication and user-related data
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  db: {
    schema: 'public',
  },
});

// Client for drugs/programs search operations
export const searchSupabase = createClient(drugsSupabaseUrl, drugsSupabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public',
  },
});
