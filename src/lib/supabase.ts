import { createClient } from '@supabase/supabase-js';

const CORRECT_PROJECT_REF = 'nuhfqkhplldontxtoxkg';
const CORRECT_SUPABASE_URL = `https://${CORRECT_PROJECT_REF}.supabase.co`;
const CORRECT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';
const WRONG_PROJECT_REF = 'asqsltuwmqdvayjmwsjs';
const STORAGE_KEY = `sb-${CORRECT_PROJECT_REF}-auth-token`;

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes(WRONG_PROJECT_REF)) {
  console.warn('Environment variables not set or using wrong database. Using correct values.');
  supabaseUrl = CORRECT_SUPABASE_URL;
  supabaseAnonKey = CORRECT_ANON_KEY;
}

if (supabaseUrl !== CORRECT_SUPABASE_URL) {
  console.warn(
    `WARNING: Unexpected Supabase URL detected.\n` +
    `Found: ${supabaseUrl}\n` +
    `Expected: ${CORRECT_SUPABASE_URL}\n` +
    `Forcing correct configuration.`
  );
  supabaseUrl = CORRECT_SUPABASE_URL;
  supabaseAnonKey = CORRECT_ANON_KEY;
}

if (typeof window !== 'undefined') {
  const oldStorageKey = `sb-${WRONG_PROJECT_REF}-auth-token`;
  if (localStorage.getItem(oldStorageKey)) {
    console.log('Removing old auth cache from wrong database');
    localStorage.removeItem(oldStorageKey);
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: STORAGE_KEY
  }
});
