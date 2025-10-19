import { createClient } from '@supabase/supabase-js';

// CRITICAL: These database URLs must NEVER change
// User authentication database (Login and Google Auth) - https://nuhfqkhplldontxtoxkg.supabase.co
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Drugs database (Drug search) - https://asqsltuwmqdvayjmwsjs.supabase.co
const drugsSupabaseUrl = import.meta.env.VITE_DRUGS_SUPABASE_URL;
const drugsSupabaseAnonKey = import.meta.env.VITE_DRUGS_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing user authentication database environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)');
}

if (!drugsSupabaseUrl || !drugsSupabaseAnonKey) {
  throw new Error('Missing drugs database environment variables (VITE_DRUGS_SUPABASE_URL, VITE_DRUGS_SUPABASE_ANON_KEY)');
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
