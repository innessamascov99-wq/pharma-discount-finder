import { createClient } from '@supabase/supabase-js';

const CORRECT_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabaseAdmin = createClient(CORRECT_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const CORRECT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(CORRECT_URL, CORRECT_ANON_KEY);

async function resetAdminAndTest() {
  console.log('🔧 Resetting admin password and testing access...\n');

  const adminEmail = 'pharma.admin@gmail.com';
  const newPassword = 'Admin@123456';

  // Step 1: Get admin user ID
  console.log('Step 1: Finding admin user...');
  const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();

  if (authError) {
    console.error('❌ Failed to list users:', authError.message);
    return;
  }

  const adminUser = authUsers.users.find(u => u.email === adminEmail);
  if (!adminUser) {
    console.error('❌ Admin user not found in auth.users');
    return;
  }

  console.log('✅ Admin user found:', adminUser.email, '(ID:', adminUser.id + ')');

  // Step 2: Reset password
  console.log('\nStep 2: Resetting password...');
  const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    adminUser.id,
    { password: newPassword }
  );

  if (updateError) {
    console.error('❌ Failed to reset password:', updateError.message);
    return;
  }

  console.log('✅ Password reset successful');

  // Step 3: Test login
  console.log('\nStep 3: Testing login with new password...');
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: newPassword
  });

  if (signInError) {
    console.error('❌ Login failed:', signInError.message);
    return;
  }

  console.log('✅ Login successful!');
  console.log('   Email:', signInData.user?.email);
  console.log('   ID:', signInData.user?.id);

  // Step 4: Check admin status in users table
  console.log('\nStep 4: Verifying admin status in users table...');
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, is_admin, is_blocked')
    .eq('id', signInData.user?.id)
    .maybeSingle();

  if (userError) {
    console.error('❌ Failed to query users table:', userError.message);
  } else if (!userData) {
    console.error('❌ User not found in public.users table');
  } else {
    console.log('✅ User record found:');
    console.log('   Email:', userData.email);
    console.log('   Is Admin:', userData.is_admin);
    console.log('   Is Blocked:', userData.is_blocked);
  }

  // Step 5: Try to fetch all users (admin query)
  console.log('\nStep 5: Testing admin query to fetch all users...');
  const { data: allUsers, error: allUsersError, count } = await supabase
    .from('users')
    .select('id, email, is_admin, is_blocked, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(5);

  if (allUsersError) {
    console.error('❌ Failed to fetch users:', allUsersError.message);
    console.error('   Full error:', JSON.stringify(allUsersError, null, 2));
  } else {
    console.log('✅ Successfully fetched users!');
    console.log('   Returned:', allUsers?.length, 'users');
    console.log('   Total count:', count);
    console.log('\n   Users:');
    allUsers?.forEach((user, idx) => {
      console.log(`   ${idx + 1}. ${user.email} (Admin: ${user.is_admin}, Blocked: ${user.is_blocked})`);
    });
  }

  // Step 6: Test pagination
  console.log('\nStep 6: Testing pagination (page 2)...');
  const { data: page2Users, error: page2Error } = await supabase
    .from('users')
    .select('id, email')
    .order('created_at', { ascending: false })
    .range(5, 9);

  if (page2Error) {
    console.error('❌ Pagination failed:', page2Error.message);
  } else {
    console.log('✅ Pagination works!');
    console.log('   Page 2 users:', page2Users?.length);
  }

  console.log('\n🎉 All tests completed!');
  console.log('\n📝 Admin Credentials:');
  console.log('   Email:', adminEmail);
  console.log('   Password:', newPassword);
}

resetAdminAndTest().catch(console.error);
