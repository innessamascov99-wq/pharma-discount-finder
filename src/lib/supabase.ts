import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

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

if (typeof window !== 'undefined') {
  supabase
    .from('drugs')
    .select('count', { count: 'exact', head: true })
    .eq('active', true)
    .then(({ count, error }) => {
      if (error) {
        console.error('Supabase connection error:', error.message);
      } else {
        console.log('Supabase connected successfully. Active drugs:', count);
      }
    });
}
