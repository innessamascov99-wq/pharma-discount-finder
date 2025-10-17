import { createClient } from '@supabase/supabase-js';

const CORRECT_PROJECT_REF = 'nuhfqkhplldontxtoxkg';
const CORRECT_SUPABASE_URL = `https://${CORRECT_PROJECT_REF}.supabase.co`;
const WRONG_PROJECT_REF = 'asqsltuwmqdvayjmwsjs';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

if (supabaseUrl.includes(WRONG_PROJECT_REF)) {
  throw new Error(
    `CRITICAL ERROR: Wrong Supabase database detected!\n` +
    `Found: ${supabaseUrl}\n` +
    `Expected: ${CORRECT_SUPABASE_URL}\n` +
    `Please update your .env file with the correct VITE_SUPABASE_URL.`
  );
}

if (supabaseUrl !== CORRECT_SUPABASE_URL) {
  console.warn(
    `WARNING: Unexpected Supabase URL detected.\n` +
    `Found: ${supabaseUrl}\n` +
    `Expected: ${CORRECT_SUPABASE_URL}\n` +
    `The application may not work correctly.`
  );
}

const projectRef = new URL(supabaseUrl).hostname.split('.')[0];

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: `sb-${projectRef}-auth-token`
  }
});
