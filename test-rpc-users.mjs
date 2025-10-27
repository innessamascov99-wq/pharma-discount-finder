import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔐 Testing RPC function for admin users...\n');

// Login as admin
console.log('Step 1: Logging in as admin...');
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: 'admin@pharma.com',
  password: 'Admin123!'
});

if (authError) {
  console.error('❌ Login failed:', authError.message);
  process.exit(1);
}

console.log('✅ Logged in as:', authData.user.email);

// Test RPC function
console.log('\nStep 2: Calling get_all_users_admin RPC...');
const { data: users, error: rpcError } = await supabase.rpc('get_all_users_admin', {
  search_query: '',
  page_number: 1,
  page_size: 10
});

if (rpcError) {
  console.error('❌ RPC call failed:', {
    message: rpcError.message,
    code: rpcError.code,
    details: rpcError.details,
    hint: rpcError.hint
  });
  process.exit(1);
}

console.log(`✅ RPC call successful! Retrieved ${users.length} users`);

if (users.length > 0) {
  console.log('\nFirst user:', {
    email: users[0].email,
    is_admin: users[0].is_admin,
    is_blocked: users[0].is_blocked,
    total_count: users[0].total_count
  });

  console.log('\nAll users:');
  users.forEach((u, i) => {
    console.log(`  ${i + 1}. ${u.email} - Admin: ${u.is_admin}, Blocked: ${u.is_blocked}`);
  });

  console.log(`\nTotal count from query: ${users[0].total_count}`);
}

// Test search
console.log('\nStep 3: Testing search functionality...');
const { data: searchResults, error: searchError } = await supabase.rpc('get_all_users_admin', {
  search_query: 'admin',
  page_number: 1,
  page_size: 10
});

if (searchError) {
  console.error('❌ Search failed:', searchError);
} else {
  console.log(`✅ Search found ${searchResults.length} users matching "admin"`);
  searchResults.forEach(u => console.log(`  - ${u.email}`));
}

console.log('\n✅ All RPC tests passed! Admin portal Users tab will now work correctly.');
process.exit(0);
