import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cuxpvjlizjufetgufbiy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1eHB2amxpemp1ZmV0Z3VmYml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNTE3MjIsImV4cCI6MjA3NTgyNzcyMn0.4RBXq8NlWDl9j2uSGZ8jsA2vLvCoxCGTIXd_fNz04NY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
