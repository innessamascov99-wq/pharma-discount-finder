import { createClient } from '@supabase/supabase-js';

// LOCKED CONFIGURATION - All services use this database
// Database: https://asqsltuwmqdvayjmwsjs.supabase.co
// Project ID: asqsltuwmqdvayjmwsjs
const CORRECT_URL = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const CORRECT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

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
