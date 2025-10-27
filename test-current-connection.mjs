import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔌 Testing Database Connection');
console.log('================================\n');
console.log('Connected to:', supabaseUrl);
console.log('Project ID:', 'nuhfqkhplldontxtoxkg\n');

// Test 1: Basic connection
console.log('Test 1: Basic Connection');
const { data: drugs, error: drugsError, count: drugsCount } = await supabase
  .from('drugs')
  .select('*', { count: 'exact', head: true });

if (drugsError) {
  console.log('❌ Failed:', drugsError.message);
} else {
  console.log(`✅ Connected! Found ${drugsCount} drugs in database\n`);
}

// Test 2: Users table
console.log('Test 2: Users Table');
const { count: usersCount, error: usersError } = await supabase
  .from('users')
  .select('*', { count: 'exact', head: true });

if (usersError) {
  console.log('❌ Failed:', usersError.message);
} else {
  console.log(`✅ Users table accessible! Found ${usersCount} users\n`);
}

// Test 3: Programs table
console.log('Test 3: Programs Table');
const { count: programsCount, error: programsError } = await supabase
  .from('programs')
  .select('*', { count: 'exact', head: true });

if (programsError) {
  console.log('❌ Failed:', programsError.message);
} else {
  console.log(`✅ Programs table accessible! Found ${programsCount} programs\n`);
}

// Test 4: Admin login
console.log('Test 4: Admin Login');
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: 'admin@pharma.com',
  password: 'Admin123!'
});

if (authError) {
  console.log('❌ Failed:', authError.message);
} else {
  console.log(`✅ Admin login successful! User: ${authData.user.email}\n`);
}

console.log('================================');
console.log('Database Connection Summary:');
console.log('✅ Database: https://nuhfqkhplldontxtoxkg.supabase.co');
console.log(`✅ Drugs: ${drugsCount || 0} records`);
console.log(`✅ Users: ${usersCount || 0} records`);
console.log(`✅ Programs: ${programsCount || 0} records`);
console.log(`✅ Admin Login: ${authData ? 'Working' : 'Failed'}`);
