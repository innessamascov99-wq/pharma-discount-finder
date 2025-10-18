import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔐 Testing Login Credentials\n');
console.log('Database:', supabaseUrl);
console.log('---\n');

// Test 1: Sign up a new test user
console.log('Test 1: Creating test user...');
const testEmail = `test_${Date.now()}@example.com`;
const testPassword = 'TestPassword123!';

const { data: signupData, error: signupError } = await supabase.auth.signUp({
  email: testEmail,
  password: testPassword,
});

if (signupError) {
  console.log('❌ Signup Error:', signupError.message);
} else {
  console.log('✅ User created:', signupData.user?.email);
  console.log('   User ID:', signupData.user?.id);
}

console.log('\n---\n');

// Test 2: Sign in with the test user
console.log('Test 2: Signing in with test user...');
const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
  email: testEmail,
  password: testPassword,
});

if (loginError) {
  console.log('❌ Login Error:', loginError.message);
} else {
  console.log('✅ Login successful!');
  console.log('   Email:', loginData.user?.email);
  console.log('   Session:', loginData.session ? 'Active' : 'None');
}

console.log('\n---\n');

// Test 3: Check current session
console.log('Test 3: Checking current session...');
const { data: sessionData } = await supabase.auth.getSession();

if (sessionData.session) {
  console.log('✅ Session found');
  console.log('   User:', sessionData.session.user.email);
} else {
  console.log('❌ No active session');
}

console.log('\n---\n');

// Test 4: Sign out
console.log('Test 4: Signing out...');
const { error: signoutError } = await supabase.auth.signOut();

if (signoutError) {
  console.log('❌ Signout Error:', signoutError.message);
} else {
  console.log('✅ Signed out successfully');
}

console.log('\n=== Test Complete ===');
