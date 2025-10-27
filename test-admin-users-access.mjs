import { createClient } from '@supabase/supabase-js';

const CORRECT_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const CORRECT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(CORRECT_URL, CORRECT_ANON_KEY);

async function testAdminUsersAccess() {
  console.log('🔍 Testing Admin Users Access...\n');

  // Test 1: Try to login as admin
  console.log('Test 1: Login as admin...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'pharma.admin@gmail.com',
    password: 'Admin@123456'
  });

  if (authError) {
    console.error('❌ Login failed:', authError.message);
    console.log('\nTrying alternate admin account...');

    const { data: authData2, error: authError2 } = await supabase.auth.signInWithPassword({
      email: 'admin@pharma.com',
      password: 'Admin@123456'
    });

    if (authError2) {
      console.error('❌ Alternate login failed:', authError2.message);
      return;
    }

    console.log('✅ Logged in as:', authData2.user?.email);
    console.log('   User ID:', authData2.user?.id);
  } else {
    console.log('✅ Logged in as:', authData.user?.email);
    console.log('   User ID:', authData.user?.id);
  }

  // Test 2: Check if user is marked as admin
  console.log('\nTest 2: Checking admin status in users table...');
  const { data: { session } } = await supabase.auth.getSession();

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, is_admin, is_blocked')
    .eq('id', session?.user?.id)
    .maybeSingle();

  if (userError) {
    console.error('❌ Failed to check admin status:', userError.message);
  } else {
    console.log('✅ User record found:');
    console.log('   Email:', userData?.email);
    console.log('   Is Admin:', userData?.is_admin);
    console.log('   Is Blocked:', userData?.is_blocked);
  }

  // Test 3: Try to fetch all users
  console.log('\nTest 3: Fetching all users...');
  const { data: allUsers, error: allUsersError, count } = await supabase
    .from('users')
    .select('id, email, is_admin, is_blocked, created_at', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (allUsersError) {
    console.error('❌ Failed to fetch users:', allUsersError.message);
    console.error('   Error details:', JSON.stringify(allUsersError, null, 2));
  } else {
    console.log('✅ Successfully fetched users!');
    console.log('   Total users in query result:', allUsers?.length);
    console.log('   Total count:', count);
    console.log('\n   First 5 users:');
    allUsers?.slice(0, 5).forEach((user, idx) => {
      console.log(`   ${idx + 1}. ${user.email} (Admin: ${user.is_admin}, Blocked: ${user.is_blocked})`);
    });
  }

  // Test 4: Test the is_admin() function directly
  console.log('\nTest 4: Testing is_admin() function...');
  const { data: isAdminResult, error: isAdminError } = await supabase
    .rpc('is_admin');

  if (isAdminError) {
    console.error('❌ is_admin() function error:', isAdminError.message);
  } else {
    console.log('✅ is_admin() returned:', isAdminResult);
  }

  // Test 5: Try with search filter
  console.log('\nTest 5: Testing search filter...');
  const { data: searchResults, error: searchError } = await supabase
    .from('users')
    .select('id, email, is_admin')
    .or('email.ilike.%admin%,first_name.ilike.%admin%');

  if (searchError) {
    console.error('❌ Search failed:', searchError.message);
  } else {
    console.log('✅ Search results:', searchResults?.length, 'users found');
    searchResults?.forEach(user => {
      console.log(`   - ${user.email} (Admin: ${user.is_admin})`);
    });
  }

  console.log('\n✅ All tests completed!');
}

testAdminUsersAccess().catch(console.error);
