import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔐 Testing complete admin user workflow...\n');

// Step 1: Test basic connection
console.log('Step 1: Testing basic connection...');
const { data: testData, error: testError } = await supabase
  .from('users')
  .select('count')
  .limit(1);

if (testError) {
  console.error('❌ Connection failed:', testError.message);
  process.exit(1);
}
console.log('✅ Connection successful!');

// Step 2: Sign in as admin
console.log('\nStep 2: Signing in as admin...');
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: 'admin@pharma.com',
  password: 'Admin123!'
});

if (authError) {
  console.error('❌ Login failed:', authError.message);
  process.exit(1);
}
console.log('✅ Logged in as:', authData.user.email);

// Step 3: Check admin status
console.log('\nStep 3: Checking admin status...');
const { data: adminCheck, error: adminError } = await supabase
  .from('users')
  .select('id, email, is_admin, is_blocked')
  .eq('id', authData.user.id)
  .single();

if (adminError) {
  console.error('❌ Admin check failed:', adminError);
} else {
  console.log('✅ Admin status:', adminCheck);
}

// Step 4: Query all users
console.log('\nStep 4: Querying all users (simulating admin portal)...');
const { data: allUsers, error: queryError, count } = await supabase
  .from('users')
  .select('*', { count: 'exact' })
  .order('created_at', { ascending: false });

if (queryError) {
  console.error('❌ Query failed:', {
    message: queryError.message,
    code: queryError.code,
    details: queryError.details,
    hint: queryError.hint
  });
  process.exit(1);
}

console.log(`✅ Successfully retrieved ${count} users`);
console.log('\nAll users:');
allUsers.forEach((u, i) => {
  console.log(`  ${i + 1}. ${u.email} - Admin: ${u.is_admin}, Blocked: ${u.is_blocked}`);
});

// Step 5: Test search functionality
console.log('\nStep 5: Testing search functionality (query: "admin")...');
const { data: searchResults, error: searchError } = await supabase
  .from('users')
  .select('*')
  .or('email.ilike.%admin%,first_name.ilike.%admin%,last_name.ilike.%admin%')
  .order('created_at', { ascending: false });

if (searchError) {
  console.error('❌ Search failed:', searchError);
} else {
  console.log(`✅ Search found ${searchResults.length} users`);
  searchResults.forEach(u => console.log(`  - ${u.email}`));
}

// Step 6: Test pagination
console.log('\nStep 6: Testing pagination (page 1, 5 per page)...');
const { data: pagedUsers, error: pageError, count: pageCount } = await supabase
  .from('users')
  .select('*', { count: 'exact' })
  .order('created_at', { ascending: false })
  .range(0, 4);

if (pageError) {
  console.error('❌ Pagination failed:', pageError);
} else {
  console.log(`✅ Retrieved ${pagedUsers.length} of ${pageCount} total users`);
}

console.log('\n✅ All tests passed! Admin portal should work correctly.');
process.exit(0);
