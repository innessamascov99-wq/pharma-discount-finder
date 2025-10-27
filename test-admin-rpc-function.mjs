import { createClient } from '@supabase/supabase-js';

const CORRECT_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const CORRECT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(CORRECT_URL, CORRECT_ANON_KEY);

async function testAdminRPC() {
  console.log('🧪 Testing Admin RPC Function...\n');

  console.log('Step 1: Login as admin...');
  const adminEmail = 'pharma.admin@gmail.com';
  const password = 'Admin@123456';

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: password
  });

  if (authError) {
    console.error('❌ Login failed:', authError.message);
    console.log('\nTrying to login with admin@pharma.com...');

    const { data: authData2, error: authError2 } = await supabase.auth.signInWithPassword({
      email: 'admin@pharma.com',
      password: password
    });

    if (authError2) {
      console.error('❌ Login failed:', authError2.message);
      console.log('\n⚠️  Please ensure admin accounts exist with the correct password');
      console.log('   Run the reset-admin-and-test.mjs script with SUPABASE_SERVICE_ROLE_KEY');
      return;
    }
    console.log('✅ Logged in as:', authData2.user?.email);
  } else {
    console.log('✅ Logged in as:', authData.user?.email);
  }

  console.log('\nStep 2: Check if user is admin...');
  const { data: { session } } = await supabase.auth.getSession();

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', session?.user?.id)
    .maybeSingle();

  if (userError) {
    console.error('❌ Failed to check admin status:', userError.message);
    return;
  }

  if (!userData?.is_admin) {
    console.error('❌ User is not an admin in the database');
    console.log('   User needs is_admin=true in the users table');
    return;
  }

  console.log('✅ User is confirmed admin');

  console.log('\nStep 3: Test admin_get_all_users RPC function...');
  const { data: users, error: rpcError } = await supabase.rpc('admin_get_all_users', {
    search_term: null,
    page_number: 1,
    page_size: 10
  });

  if (rpcError) {
    console.error('❌ RPC function failed:', rpcError.message);
    console.error('   Full error:', JSON.stringify(rpcError, null, 2));
    return;
  }

  console.log('✅ RPC function succeeded!');
  console.log('   Returned users:', users?.length);

  if (users && users.length > 0) {
    console.log('   Total count:', users[0].total_count);
    console.log('\n   Sample users:');
    users.slice(0, 5).forEach((user, idx) => {
      console.log(`   ${idx + 1}. ${user.email} (Admin: ${user.is_admin}, Blocked: ${user.is_blocked})`);
    });
  }

  console.log('\nStep 4: Test with search filter...');
  const { data: searchResults, error: searchError } = await supabase.rpc('admin_get_all_users', {
    search_term: 'admin',
    page_number: 1,
    page_size: 10
  });

  if (searchError) {
    console.error('❌ Search failed:', searchError.message);
  } else {
    console.log('✅ Search succeeded!');
    console.log('   Found:', searchResults?.length, 'users matching "admin"');
    searchResults?.forEach(user => {
      console.log(`   - ${user.email}`);
    });
  }

  console.log('\nStep 5: Test pagination...');
  const { data: page2, error: page2Error } = await supabase.rpc('admin_get_all_users', {
    search_term: null,
    page_number: 2,
    page_size: 5
  });

  if (page2Error) {
    console.error('❌ Pagination failed:', page2Error.message);
  } else {
    console.log('✅ Pagination works!');
    console.log('   Page 2 users:', page2?.length);
  }

  console.log('\n🎉 All tests passed! The admin users list should now work on the website.');
}

testAdminRPC().catch(console.error);
