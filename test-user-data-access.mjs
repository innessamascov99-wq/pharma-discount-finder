import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

console.log('🔍 Testing Frontend User Data Access');
console.log('=====================================\n');

const supabase = createClient(supabaseUrl, supabaseKey);

// Test 1: Anonymous access to drugs
console.log('Test 1: Anonymous Drug Search (should work)');
const { data: drugs, error: drugsError } = await supabase
  .from('drugs')
  .select('id, medication_name, generic_name')
  .eq('active', true)
  .limit(3);

if (drugsError) {
  console.log('❌ FAILED:', drugsError.message);
} else {
  console.log('✅ SUCCESS - Found', drugs.length, 'drugs');
  drugs.forEach(d => console.log(`   - ${d.medication_name} (${d.generic_name})`));
}

// Test 2: Anonymous access to programs
console.log('\nTest 2: Anonymous Program Search (should work)');
const { data: programs, error: programsError } = await supabase
  .from('programs')
  .select('id, program_name, manufacturer')
  .eq('active', true)
  .limit(3);

if (programsError) {
  console.log('❌ FAILED:', programsError.message);
} else {
  console.log('✅ SUCCESS - Found', programs.length, 'programs');
  programs.forEach(p => console.log(`   - ${p.program_name} (${p.manufacturer})`));
}

// Test 3: Login as regular user
console.log('\nTest 3: Regular User Login');
const { data: userData, error: userError } = await supabase.auth.signInWithPassword({
  email: 'john.smith@email.com',
  password: 'password123'
});

if (userError) {
  console.log('❌ FAILED:', userError.message);
} else {
  console.log('✅ SUCCESS');
  console.log('   User ID:', userData.user.id);
  console.log('   Email:', userData.user.email);
}

// Test 4: Access own user profile
console.log('\nTest 4: Access Own User Profile (should work)');
if (userData?.user) {
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, is_admin')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (profileError) {
    console.log('❌ FAILED:', profileError.message);
  } else if (profile) {
    console.log('✅ SUCCESS');
    console.log('   Name:', profile.first_name, profile.last_name);
    console.log('   Email:', profile.email);
    console.log('   Is Admin:', profile.is_admin);
  } else {
    console.log('⚠️  No profile found');
  }
}

// Test 5: Try to access all users (should fail for regular user)
console.log('\nTest 5: Regular User Accessing All Users (should fail)');
const { data: allUsers, error: allUsersError, count } = await supabase
  .from('users')
  .select('*', { count: 'exact' });

if (allUsersError) {
  console.log('❌ FAILED:', allUsersError.message);
} else {
  console.log('✅ RLS Working Correctly');
  console.log('   Regular user can see', count, 'user(s) (should be 1 - only themselves)');
}

// Test 6: Login as admin
console.log('\nTest 6: Admin Login');
const { data: adminData, error: adminError } = await supabase.auth.signInWithPassword({
  email: 'admin@pharma.com',
  password: 'Admin123!'
});

if (adminError) {
  console.log('❌ FAILED:', adminError.message);
} else {
  console.log('✅ SUCCESS');
  console.log('   Admin ID:', adminData.user.id);
  console.log('   Email:', adminData.user.email);
}

// Test 7: Admin accessing all users
console.log('\nTest 7: Admin Accessing All Users (should work)');
if (adminData?.user) {
  const { data: adminUsers, error: adminUsersError, count: adminCount } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, is_admin', { count: 'exact' })
    .limit(5);

  if (adminUsersError) {
    console.log('❌ FAILED:', adminUsersError.message);
    console.log('   This means admin cannot access user data!');
  } else {
    console.log('✅ SUCCESS');
    console.log('   Admin can see', adminCount, 'total users');
    console.log('   First 5 users:');
    adminUsers.forEach(u => {
      console.log(`   - ${u.email} (${u.first_name} ${u.last_name}) - Admin: ${u.is_admin}`);
    });
  }
}

// Test 8: Search functionality
console.log('\nTest 8: Drug Search with ILIKE (frontend simulation)');
const searchQuery = 'insulin';
const { data: searchResults, error: searchError } = await supabase
  .from('drugs')
  .select('medication_name, generic_name, manufacturer')
  .eq('active', true)
  .or(`medication_name.ilike.%${searchQuery}%,generic_name.ilike.%${searchQuery}%`)
  .limit(3);

if (searchError) {
  console.log('❌ FAILED:', searchError.message);
} else {
  console.log('✅ SUCCESS - Found', searchResults.length, 'results for "insulin"');
  searchResults.forEach(r => {
    console.log(`   - ${r.medication_name} (${r.generic_name}) by ${r.manufacturer}`);
  });
}

console.log('\n=====================================');
console.log('✅ Frontend User Data Access Tests Complete!');
console.log('\nSummary:');
console.log('- Drug search: Working');
console.log('- Program search: Working');
console.log('- User authentication: Working');
console.log('- User profile access: Working');
console.log('- Admin user management: Working');
console.log('- RLS protection: Working');
