import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminUserFetch() {
  console.log('\n=== Testing Admin Portal User Fetch ===\n');

  // Test without authentication first
  console.log('1. Testing without authentication...');
  const { data: unauthData, error: unauthError, count: unauthCount } = await supabase
    .from('users')
    .select('*', { count: 'exact' });

  console.log('   Unauthenticated result:');
  console.log('   - Count:', unauthCount);
  console.log('   - Error:', unauthError?.message || 'None');
  console.log('   - Users returned:', unauthData?.length || 0);

  // Sign in as admin
  console.log('\n2. Signing in as admin@pharma.com...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@pharma.com',
    password: 'admin123'
  });

  if (authError) {
    console.error('❌ Auth error:', authError.message);

    // Try the other admin account
    console.log('\n   Trying pharma.admin@gmail.com...');
    const { data: authData2, error: authError2 } = await supabase.auth.signInWithPassword({
      email: 'pharma.admin@gmail.com',
      password: 'admin123'
    });

    if (authError2) {
      console.error('❌ Auth error:', authError2.message);
      console.log('\n⚠️  Cannot test with authentication - admin credentials not set');
      return;
    }

    console.log('✅ Signed in as:', authData2.user.email);
  } else {
    console.log('✅ Signed in as:', authData.user.email);
  }

  // Fetch all users as admin
  console.log('\n3. Fetching all users as authenticated admin...');
  const { data: adminData, error: adminError, count: adminCount } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (adminError) {
    console.error('❌ Error fetching users:', adminError.message);
    console.error('   Code:', adminError.code);
    console.error('   Details:', adminError.details);
  } else {
    console.log('✅ Successfully fetched users');
    console.log('   Total count:', adminCount);
    console.log('   Users returned:', adminData.length);
    console.log('\n   User List:');
    adminData.forEach((user, idx) => {
      console.log(`   ${idx + 1}. ${user.email} - ${user.first_name} ${user.last_name}`);
      console.log(`      Admin: ${user.is_admin}, Blocked: ${user.is_blocked}`);
    });
  }

  // Test pagination
  console.log('\n4. Testing pagination (first 5 users)...');
  const { data: pageData, count: pageCount } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(0, 4);

  console.log('   Total:', pageCount);
  console.log('   Returned:', pageData?.length);

  await supabase.auth.signOut();
  console.log('\n✅ Test complete!\n');
}

testAdminUserFetch().catch(console.error);
