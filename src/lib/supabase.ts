import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration error:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseAnonKey ? 'Set' : 'Missing'
  });
  throw new Error('Missing Supabase environment variables');
}

const CORRECT_SUPABASE_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const OLD_SUPABASE_URL = 'asqsltuwmqdvayjmwsjs';

if (supabaseUrl !== CORRECT_SUPABASE_URL) {
  console.error('CRITICAL: Incorrect Supabase URL detected!');
  console.error('Expected:', CORRECT_SUPABASE_URL);
  console.error('Got:', supabaseUrl);
  throw new Error('Incorrect Supabase URL configuration');
}

const localStorageKeys = Object.keys(localStorage);
const oldUrlKeys = localStorageKeys.filter(key => key.includes(OLD_SUPABASE_URL));

if (oldUrlKeys.length > 0) {
  console.warn('Found cached data with old Supabase URL. Clearing...');
  oldUrlKeys.forEach(key => {
    console.log('Removing old key:', key);
    localStorage.removeItem(key);
  });
  console.log('Old Supabase cache cleared. Please refresh the page.');
}

console.log('Supabase client initialized with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: `sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token`
  }
});
