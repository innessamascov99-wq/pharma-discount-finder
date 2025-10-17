import { createClient } from '@supabase/supabase-js';

// LOCKED CONFIGURATION - DO NOT CHANGE
// All database migrations and data are in this project
const CORRECT_PROJECT_REF = 'nuhfqkhplldontxtoxkg';
const CORRECT_SUPABASE_URL = `https://${CORRECT_PROJECT_REF}.supabase.co`;
const CORRECT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

// Storage key for authentication
const STORAGE_KEY = `sb-${CORRECT_PROJECT_REF}-auth-token`;

// List of old/incorrect project refs to clean up
const OLD_PROJECT_REFS = ['asqsltuwmqdvayjmwsjs'];

// ALWAYS use the correct URL, ignore environment variables to prevent accidental changes
const supabaseUrl = CORRECT_SUPABASE_URL;
const supabaseAnonKey = CORRECT_ANON_KEY;

// Clear cached credentials from old/incorrect projects
if (typeof window !== 'undefined') {
  console.log('🔒 Supabase client locked to:', CORRECT_SUPABASE_URL);

  // Clear old authentication tokens
  OLD_PROJECT_REFS.forEach((oldRef) => {
    const oldStorageKey = `sb-${oldRef}-auth-token`;
    if (localStorage.getItem(oldStorageKey)) {
      console.log('🧹 Clearing old cached credentials for:', oldRef);
      localStorage.removeItem(oldStorageKey);
    }
  });

  // Clear any other Supabase-related items from old projects
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      OLD_PROJECT_REFS.forEach((oldRef) => {
        if (key.includes(oldRef)) {
          keysToRemove.push(key);
        }
      });
    }
  }

  keysToRemove.forEach((key) => {
    console.log('🧹 Clearing old cache key:', key);
    localStorage.removeItem(key);
  });

  if (keysToRemove.length > 0) {
    console.log('✅ Cleared', keysToRemove.length, 'old cached items');
  }
}

// Log configuration for debugging
console.log('Supabase Configuration:', {
  url: supabaseUrl,
  project: CORRECT_PROJECT_REF,
  storageKey: STORAGE_KEY,
});

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: STORAGE_KEY,
  },
});

// Verify connection on initialization
if (typeof window !== 'undefined') {
  supabase
    .from('pharma_programs')
    .select('count', { count: 'exact', head: true })
    .eq('active', true)
    .then(({ count, error }) => {
      if (error) {
        console.error('❌ Supabase connection error:', error.message);
      } else {
        console.log('✅ Supabase connected successfully. Active programs:', count);
      }
    });
}
