import { createClient } from '@supabase/supabase-js';

// User authentication database
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

// Drugs database
const drugsSupabaseUrl = import.meta.env.VITE_DRUGS_SUPABASE_URL || 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const drugsSupabaseAnonKey = import.meta.env.VITE_DRUGS_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

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
