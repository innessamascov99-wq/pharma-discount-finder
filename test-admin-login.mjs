import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAdminLogin() {
  console.log('🧪 Testing Admin Login Flow\n');
  console.log('='.repeat(60));

  const email = 'pharma.admin@gmail.com';
  const password = 'Test123!';

  // Step 1: Check if user exists
  console.log('\n📋 Step 1: Checking if user exists...');
  const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers();

  if (checkError) {
    console.log('⚠️  Cannot check users with anon key (this is normal)');
  }

  // Check in public.users table
  const { data: publicUser, error: publicError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (publicError) {
    console.log('❌ Error checking public.users:', publicError.message);
  } else if (publicUser) {
    console.log('✅ User exists in public.users');
    console.log('   Email:', publicUser.email);
    console.log('   is_admin:', publicUser.is_admin);
    console.log('   User ID:', publicUser.id);
  } else {
    console.log('❌ User does NOT exist in public.users');
    console.log('\n📝 Creating account...');

    // Create the account
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: 'Pharma',
          last_name: 'Admin'
        }
      }
    });

    if (signUpError) {
      console.log('❌ Sign up error:', signUpError.message);
      return;
    }

    console.log('✅ Account created!');
    console.log('   User ID:', signUpData.user?.id);
    console.log('   Email:', signUpData.user?.email);

    // Wait for trigger to create user record
    console.log('\n⏳ Waiting for database trigger to create user record...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if user record was created
    const { data: newUser, error: newUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', signUpData.user.id)
      .maybeSingle();

    if (newUserError) {
      console.log('❌ Error fetching new user:', newUserError.message);
    } else if (newUser) {
      console.log('✅ User record created by trigger');
      console.log('   is_admin:', newUser.is_admin);
    } else {
      console.log('❌ User record not found after creation!');
    }

    // Sign out before testing login
    await supabase.auth.signOut();
  }

  // Step 2: Test login
  console.log('\n📋 Step 2: Testing login...');
  console.log('   Email:', email);
  console.log('   Password: Test123!');

  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (loginError) {
    console.log('❌ Login failed:', loginError.message);
    return;
  }

  console.log('✅ Login successful!');
  console.log('   User ID:', loginData.user?.id);
  console.log('   Email:', loginData.user?.email);

  // Step 3: Check admin status
  console.log('\n📋 Step 3: Checking admin status from database...');

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, is_admin, first_name, last_name')
    .eq('id', loginData.user.id)
    .maybeSingle();

  if (userError) {
    console.log('❌ Error fetching user data:', userError.message);
  } else if (userData) {
    console.log('✅ User data retrieved:');
    console.log('   Email:', userData.email);
    console.log('   is_admin:', userData.is_admin);
    console.log('   Name:', userData.first_name, userData.last_name);
  } else {
    console.log('❌ User record not found in database!');
  }

  // Step 4: Determine redirect
  console.log('\n📋 Step 4: Determining redirect...');

  const adminEmails = ['pharma.admin@gmail.com', 'pharmadiscountfinder@gmail.com'];
  const isAdminEmail = adminEmails.some(e => loginData.user.email?.toLowerCase() === e.toLowerCase());
  const isAdmin = userData?.is_admin || isAdminEmail;

  console.log('   Email check (isAdminEmail):', isAdminEmail);
  console.log('   Database check (userData.is_admin):', userData?.is_admin);
  console.log('   Final admin status:', isAdmin);
  console.log('\n🎯 Should redirect to:', isAdmin ? '/admin' : '/dashboard');

  if (isAdmin) {
    console.log('✅ Admin redirect logic is CORRECT');
  } else {
    console.log('❌ Admin redirect logic is WRONG - should redirect to /admin');
  }

  console.log('\n' + '='.repeat(60));
  console.log('🏁 Test Complete');

  // Clean up
  await supabase.auth.signOut();
}

testAdminLogin().catch(console.error);
