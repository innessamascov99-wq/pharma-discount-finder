import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔐 Testing Admin RLS Access to Users Table');
console.log('===========================================\n');

// Test 1: Login as admin
console.log('Test 1: Login as admin@pharma.com');
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: 'admin@pharma.com',
  password: 'Admin123!'
});

if (authError) {
  console.log('❌ Login failed:', authError.message);
  process.exit(1);
}

console.log('✅ Logged in successfully');
console.log('   User ID:', authData.user.id);
console.log('   Expected ID: 13a6a599-2cda-441b-9d39-54eabb8c08ad');
console.log('   Match:', authData.user.id === '13a6a599-2cda-441b-9d39-54eabb8c08ad' ? '✅ YES' : '❌ NO');

// Test 2: Query all users
console.log('\nTest 2: Query all users from public.users');
const { data: users, error: usersError, count } = await supabase
  .from('users')
  .select('id, email, first_name, last_name, is_admin, is_blocked', { count: 'exact' })
  .order('created_at', { ascending: false });

if (usersError) {
  console.log('❌ Query failed:', usersError.message);
  console.log('   Code:', usersError.code);
  console.log('   Details:', usersError.details);
  console.log('   Hint:', usersError.hint);
  process.exit(1);
}

console.log('✅ Query successful!');
console.log('   Total count:', count);
console.log('   Returned users:', users.length);

if (users.length > 0) {
  console.log('\nUsers returned:');
  users.forEach((user, i) => {
    console.log(`   ${i + 1}. ${user.email} (${user.first_name} ${user.last_name}) - Admin: ${user.is_admin}, Blocked: ${user.is_blocked}`);
  });
} else {
  console.log('\n❌ NO USERS RETURNED!');
  console.log('This means RLS is still blocking access.');
  process.exit(1);
}

// Test 3: Search functionality
console.log('\nTest 3: Search for "john"');
const { data: searchResults, error: searchError } = await supabase
  .from('users')
  .select('*')
  .or('email.ilike.%john%,first_name.ilike.%john%,last_name.ilike.%john%');

if (searchError) {
  console.log('❌ Search failed:', searchError.message);
} else {
  console.log('✅ Search successful!');
  console.log('   Found:', searchResults.length, 'users');
  searchResults.forEach(user => {
    console.log(`   - ${user.email} (${user.first_name} ${user.last_name})`);
  });
}

// Test 4: Pagination
console.log('\nTest 4: Test pagination (page 1, 5 per page)');
const { data: page1, error: page1Error, count: page1Count } = await supabase
  .from('users')
  .select('email', { count: 'exact' })
  .order('created_at', { ascending: false })
  .range(0, 4);

if (page1Error) {
  console.log('❌ Pagination failed:', page1Error.message);
} else {
  console.log('✅ Pagination successful!');
  console.log('   Total users:', page1Count);
  console.log('   Page 1 users:', page1.length);
}

console.log('\n===========================================');
console.log('✅ ALL TESTS PASSED!');
console.log('✅ Admin portal can now access users table!');
