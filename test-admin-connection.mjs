import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3NDk4NzIsImV4cCI6MjA0NDMyNTg3Mn0.b-h8bVQdlZxafqxmBJdTB9FN_H_XPQ4VcLgQ6uHR2eM';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔐 Testing admin authentication and user query...\n');

// Sign in as admin
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: 'admin@pharma.com',
  password: 'admin123'
});

if (authError) {
  console.error('❌ Login failed:', authError.message);
  process.exit(1);
}

console.log('✅ Logged in as:', authData.user.email);

// Test 1: Check if user exists in users table
console.log('\n📋 Test 1: Checking admin user in database...');
const { data: adminUser, error: adminError } = await supabase
  .from('users')
  .select('id, email, is_admin, is_blocked')
  .eq('id', authData.user.id)
  .single();

if (adminError) {
  console.error('❌ Failed to get admin user:', adminError);
} else {
  console.log('✅ Admin user found:', adminUser);
}

// Test 2: Query all users (what the admin portal does)
console.log('\n📋 Test 2: Querying all users...');
const { data: allUsers, error: queryError, count } = await supabase
  .from('users')
  .select('*', { count: 'exact' })
  .order('created_at', { ascending: false });

if (queryError) {
  console.error('❌ Failed to query users:', {
    message: queryError.message,
    code: queryError.code,
    details: queryError.details,
    hint: queryError.hint
  });
} else {
  console.log(`✅ Successfully retrieved ${count} users`);
  console.log('\nUsers:');
  allUsers.forEach((u, i) => {
    console.log(`  ${i + 1}. ${u.email} - Admin: ${u.is_admin}, Blocked: ${u.is_blocked}`);
  });
}

// Test 3: Search users (pagination test)
console.log('\n📋 Test 3: Testing pagination (page 1, 5 per page)...');
const { data: pagedUsers, error: pageError, count: pageCount } = await supabase
  .from('users')
  .select('*', { count: 'exact' })
  .order('created_at', { ascending: false })
  .range(0, 4);

if (pageError) {
  console.error('❌ Pagination failed:', pageError);
} else {
  console.log(`✅ Page 1: Retrieved ${pagedUsers.length} of ${pageCount} total users`);
}

// Test 4: Search by email
console.log('\n📋 Test 4: Testing search by email (query: "admin")...');
const { data: searchResults, error: searchError } = await supabase
  .from('users')
  .select('*')
  .or('email.ilike.%admin%,first_name.ilike.%admin%,last_name.ilike.%admin%')
  .order('created_at', { ascending: false });

if (searchError) {
  console.error('❌ Search failed:', searchError);
} else {
  console.log(`✅ Found ${searchResults.length} users matching "admin"`);
  searchResults.forEach(u => console.log(`  - ${u.email}`));
}

console.log('\n✅ All tests completed!');
process.exit(0);
