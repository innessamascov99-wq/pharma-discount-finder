import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('\n=== Diagnosing Admin Portal Issue ===\n');
console.log('Database:', supabaseUrl);

// Test 1: Check if we can see users while NOT logged in (should fail with RLS)
console.log('\n1. Testing anonymous access (should be blocked by RLS)...');
const { data: anonData, error: anonError } = await supabase
  .from('users')
  .select('email')
  .limit(1);

if (anonError) {
  console.log('✅ RLS is working - anonymous access blocked');
  console.log('   Error:', anonError.message);
} else {
  console.log('🚨 WARNING: RLS might be disabled - anonymous access allowed!');
  console.log('   Data:', anonData);
}

// Test 2: Check available auth methods
console.log('\n2. Checking available authentication methods...');
console.log('   You can create an admin account by:');
console.log('   a) Using Supabase Dashboard to create a user');
console.log('   b) Using the signup page in your app');
console.log('   c) Then manually setting is_admin=true in the database');

// Test 3: Check if admin users exist in auth.users
console.log('\n3. Checking if admin account exists in auth.users...');
const { data: authCheck } = await supabase.auth.admin.listUsers();
if (authCheck) {
  console.log('   Cannot check auth.users with anon key (need service role key)');
}

console.log('\n=== Recommendation ===');
console.log('DO NOT disable RLS! Instead:');
console.log('1. Create/login as admin@diabetic.com');
console.log('2. The application-level checks will verify admin status');
console.log('3. RLS provides an additional security layer');
console.log('\nTo create admin account:');
console.log('  - Option A: Run this SQL in Supabase Dashboard SQL Editor:');
console.log(`
    -- Create auth user (if doesn't exist)
    -- Then set admin status
    UPDATE users
    SET is_admin = true
    WHERE email = 'admin@diabetic.com';
`);
console.log('  - Option B: Use Supabase Dashboard Authentication UI to:');
console.log('    1. Create user admin@diabetic.com');
console.log('    2. Then run UPDATE query above');
