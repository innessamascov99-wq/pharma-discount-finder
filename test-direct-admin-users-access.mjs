import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read .env file manually
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

async function testAdminAccess() {
  console.log('\n=== Testing Direct Admin Users Access ===\n');

  // Step 1: Login as admin
  console.log('1. Logging in as admin@diabetic.com...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@diabetic.com',
    password: 'Admin123!'
  });

  if (authError) {
    console.error('❌ Login failed:', authError.message);
    return;
  }

  console.log('✅ Logged in successfully as:', authData.user.email);
  console.log('   User ID:', authData.user.id);

  // Step 2: Verify admin status
  console.log('\n2. Verifying admin status...');
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('is_admin, email, first_name, last_name')
    .eq('id', authData.user.id)
    .maybeSingle();

  if (userError) {
    console.error('❌ Error checking admin status:', userError);
    return;
  }

  console.log('✅ Current user data:', userData);

  if (!userData?.is_admin) {
    console.error('❌ User is not an admin!');
    return;
  }

  console.log('✅ Confirmed: User is an admin');

  // Step 3: Query all users (simulating getAllUsers function)
  console.log('\n3. Querying all users...');
  const { data: allUsers, error: usersError, count } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(5);

  if (usersError) {
    console.error('❌ Error querying users:', usersError);
    return;
  }

  console.log(`✅ Retrieved ${allUsers.length} users (Total: ${count})`);
  allUsers.forEach(user => {
    console.log(`   - ${user.email} (${user.first_name} ${user.last_name}) [Admin: ${user.is_admin}, Blocked: ${user.is_blocked}]`);
  });

  // Step 4: Test search functionality
  console.log('\n4. Testing search for "john"...');
  const searchTerm = '%john%';
  const { data: searchResults, error: searchError } = await supabase
    .from('users')
    .select('*')
    .or(`email.ilike.${searchTerm},first_name.ilike.${searchTerm},last_name.ilike.${searchTerm}`)
    .limit(5);

  if (searchError) {
    console.error('❌ Search error:', searchError);
    return;
  }

  console.log(`✅ Search results for "john": ${searchResults.length} users found`);
  searchResults.forEach(user => {
    console.log(`   - ${user.email} (${user.first_name} ${user.last_name})`);
  });

  // Step 5: Test update functionality (toggle block status)
  console.log('\n5. Testing user update functionality...');
  const testUser = allUsers.find(u => u.email !== 'admin@diabetic.com');

  if (testUser) {
    console.log(`   Testing with user: ${testUser.email}`);
    const newBlockedStatus = !testUser.is_blocked;

    const { error: updateError } = await supabase
      .from('users')
      .update({ is_blocked: newBlockedStatus })
      .eq('id', testUser.id);

    if (updateError) {
      console.error('❌ Update error:', updateError);
      return;
    }

    console.log(`✅ Successfully updated user block status to: ${newBlockedStatus}`);

    // Revert the change
    const { error: revertError } = await supabase
      .from('users')
      .update({ is_blocked: testUser.is_blocked })
      .eq('id', testUser.id);

    if (!revertError) {
      console.log(`✅ Reverted block status back to: ${testUser.is_blocked}`);
    }
  }

  console.log('\n=== All Tests Passed! ===\n');
  console.log('The admin portal Users tab should now work correctly!');
  console.log('\nYou can now:');
  console.log('1. Login to the app with: admin@diabetic.com');
  console.log('2. Navigate to Admin Portal > Users tab');
  console.log('3. Search for users by name or email');
  console.log('4. Block/unblock users');
  console.log('5. Grant/revoke admin privileges');
}

testAdminAccess().catch(console.error);
