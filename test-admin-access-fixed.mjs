import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔐 Testing Admin Access After RLS Fix');
console.log('==========================================\n');

// Step 1: Login as admin
console.log('Step 1: Logging in as admin@pharma.com...');
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: 'admin@pharma.com',
  password: 'Admin123!'
});

if (authError) {
  console.log('❌ Login failed:', authError.message);
  process.exit(1);
}

console.log('✅ Logged in as:', authData.user.email);
console.log('   User ID:', authData.user.id);

// Step 2: Query all users
console.log('\nStep 2: Querying all users...');
const { data: users, error: usersError, count } = await supabase
  .from('users')
  .select('*', { count: 'exact' })
  .order('created_at', { ascending: false });

if (usersError) {
  console.log('❌ Query failed:', usersError.message);
  console.log('   Code:', usersError.code);
  console.log('   Details:', usersError.details);
  process.exit(1);
}

console.log('✅ Query successful!');
console.log('   Total count:', count);
console.log('   Returned users:', users.length);

// Step 3: Display users
if (users && users.length > 0) {
  console.log('\n📋 Users Found:');
  console.log('==========================================');
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.email}`);
    console.log(`   Name: ${user.first_name || 'N/A'} ${user.last_name || 'N/A'}`);
    console.log(`   Admin: ${user.is_admin ? 'Yes' : 'No'}`);
    console.log(`   Blocked: ${user.is_blocked ? 'Yes' : 'No'}`);
    console.log('');
  });
} else {
  console.log('\n⚠️  No users returned!');
  console.log('This means RLS is still blocking access.');
}

// Step 4: Test search
console.log('Step 3: Testing search for "john"...');
const { data: searchResults, error: searchError } = await supabase
  .from('users')
  .select('*')
  .or('email.ilike.%john%,first_name.ilike.%john%,last_name.ilike.%john%');

if (searchError) {
  console.log('❌ Search failed:', searchError.message);
} else {
  console.log('✅ Search successful!');
  console.log('   Found:', searchResults.length, 'users');
  if (searchResults.length > 0) {
    searchResults.forEach(user => {
      console.log(`   - ${user.email} (${user.first_name} ${user.last_name})`);
    });
  }
}

console.log('\n==========================================');
if (users && users.length > 0) {
  console.log('✅ SUCCESS: Admin can now access all users!');
  console.log('✅ The RLS fix worked!');
} else {
  console.log('❌ FAILED: RLS is still blocking access');
  console.log('Need to investigate further...');
}
