import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminAccess() {
  console.log('\n=== Testing Admin User Management ===\n');

  // Test 1: Sign in as admin
  console.log('1. Signing in as admin@pharma.com...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@pharma.com',
    password: 'admin123'
  });

  if (authError) {
    console.error('❌ Auth error:', authError.message);
    return;
  }

  console.log('✅ Signed in successfully as:', authData.user.email);
  console.log('   User ID:', authData.user.id);

  // Test 2: Fetch all users
  console.log('\n2. Fetching all users...');
  const { data: users, error: usersError, count } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (usersError) {
    console.error('❌ Error fetching users:', usersError.message);
    console.error('   Code:', usersError.code);
    console.error('   Details:', usersError.details);
    console.error('   Hint:', usersError.hint);
  } else {
    console.log('✅ Successfully fetched users');
    console.log('   Total count:', count);
    console.log('   Users returned:', users.length);
    console.log('\n   Users:');
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.first_name} ${user.last_name})`);
      console.log(`     Admin: ${user.is_admin}, Blocked: ${user.is_blocked}`);
    });
  }

  // Test 3: Check if is_admin function works
  console.log('\n3. Testing is_admin() function...');
  const { data: adminCheck, error: adminError } = await supabase
    .rpc('is_admin');

  if (adminError) {
    console.error('❌ Error checking admin status:', adminError.message);
  } else {
    console.log('✅ is_admin() returned:', adminCheck);
  }

  // Sign out
  await supabase.auth.signOut();
  console.log('\n✅ Test complete!\n');
}

testAdminAccess().catch(console.error);
