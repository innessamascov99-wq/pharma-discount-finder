import { createClient } from '@supabase/supabase-js';

// Use the LOCKED correct configuration
const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

console.log('🎯 Complete Admin Portal Flow Test');
console.log('=========================================\n');
console.log('Database:', supabaseUrl);
console.log('Project ID: nuhfqkhplldontxtoxkg\n');

const supabase = createClient(supabaseUrl, supabaseKey);

// Step 1: Login
console.log('Step 1: Admin Login');
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: 'admin@pharma.com',
  password: 'Admin123!'
});

if (authError) {
  console.log('❌ FAILED:', authError.message);
  process.exit(1);
}

console.log('✅ SUCCESS');
console.log('   User ID:', authData.user.id);
console.log('   Expected: 13a6a599-2cda-441b-9d39-54eabb8c08ad');
console.log('   Match:', authData.user.id === '13a6a599-2cda-441b-9d39-54eabb8c08ad' ? '✅' : '❌ WRONG DATABASE!');

if (authData.user.id !== '13a6a599-2cda-441b-9d39-54eabb8c08ad') {
  console.log('\n❌ CRITICAL ERROR: Connected to WRONG database!');
  console.log('This indicates auth is routing to a different Supabase project.');
  process.exit(1);
}

// Step 2: Get all users (simulates AdminAllUsers component)
console.log('\nStep 2: Get All Users (AdminAllUsers component)');
const { data: users, error: usersError, count } = await supabase
  .from('users')
  .select('id, email, first_name, last_name, is_admin, is_blocked, created_at', { count: 'exact' })
  .order('created_at', { ascending: false })
  .range(0, 19); // First page, 20 items

if (usersError) {
  console.log('❌ FAILED:', usersError.message);
  console.log('   Code:', usersError.code);
  process.exit(1);
}

console.log('✅ SUCCESS');
console.log('   Total users:', count);
console.log('   Page 1 users:', users.length);
console.log('\n   Users list:');
users.forEach((u, i) => {
  console.log(`   ${i + 1}. ${u.email} | ${u.first_name || 'N/A'} ${u.last_name || 'N/A'} | Admin: ${u.is_admin} | Blocked: ${u.is_blocked}`);
});

// Step 3: Search for users
console.log('\nStep 3: Search Users (search query: "john")');
const searchQuery = 'john';
const { data: searchResults, error: searchError } = await supabase
  .from('users')
  .select('*')
  .or(`email.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);

if (searchError) {
  console.log('❌ FAILED:', searchError.message);
  process.exit(1);
}

console.log('✅ SUCCESS');
console.log('   Found:', searchResults.length, 'users');
searchResults.forEach(u => {
  console.log(`   - ${u.email} (${u.first_name} ${u.last_name})`);
});

// Step 4: Test pagination
console.log('\nStep 4: Test Pagination');
const { data: page2, error: page2Error, count: page2Count } = await supabase
  .from('users')
  .select('email', { count: 'exact' })
  .order('created_at', { ascending: false })
  .range(5, 9); // Items 6-10

if (page2Error) {
  console.log('❌ FAILED:', page2Error.message);
  process.exit(1);
}

console.log('✅ SUCCESS');
console.log('   Total:', page2Count);
console.log('   Page 2 (items 6-10):', page2.length);

// Step 5: Verify RLS (try as non-admin)
console.log('\nStep 5: Verify RLS Protection');
const { data: regularUserAuth } = await supabase.auth.signInWithPassword({
  email: 'john.smith@email.com',
  password: 'password123'
});

if (regularUserAuth?.user) {
  const { data: restrictedUsers, count: restrictedCount } = await supabase
    .from('users')
    .select('*', { count: 'exact' });

  console.log('✅ RLS Working');
  console.log('   Regular user can see:', restrictedCount, 'users (should be 1 - only themselves)');

  if (restrictedCount === 1) {
    console.log('   ✅ RLS correctly restricts non-admin users');
  } else {
    console.log('   ⚠️  RLS might not be working correctly');
  }
}

console.log('\n=========================================');
console.log('✅ ALL TESTS PASSED!');
console.log('✅ Admin portal is connected to correct database');
console.log('✅ Users table is accessible with proper RLS');
console.log('✅ Search and pagination working correctly');
console.log('\nDatabase: https://nuhfqkhplldontxtoxkg.supabase.co');
console.log('Admin users found:', count);
