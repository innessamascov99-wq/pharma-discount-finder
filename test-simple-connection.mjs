import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3NDk4NzIsImV4cCI6MjA0NDMyNTg3Mn0.b-h8bVQdlZxafqxmBJdTB9FN_H_XPQ4VcLgQ6uHR2eM';

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 20) + '...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

// Test basic connection
console.log('Test 1: Fetch users table without auth...');
const { data, error } = await supabase
  .from('users')
  .select('email')
  .limit(1);

if (error) {
  console.error('❌ Error:', error);
} else {
  console.log('✅ Success! Found users:', data);
}

// Test auth.getSession
console.log('\nTest 2: Check current session...');
const { data: sessionData } = await supabase.auth.getSession();
console.log('Session:', sessionData.session ? 'Logged in' : 'Not logged in');

process.exit(0);
