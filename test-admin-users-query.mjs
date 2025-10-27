import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔐 Testing admin user login and query...');

// Sign in as admin
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: 'admin@pharma.com',
  password: 'admin123'
});

if (authError) {
  console.error('❌ Login error:', authError);
  process.exit(1);
}

console.log('✅ Logged in as:', authData.user.email);
console.log('User ID:', authData.user.id);

// Check if user is admin in the database
const { data: userCheck, error: userError } = await supabase
  .from('users')
  .select('id, email, is_admin')
  .eq('id', authData.user.id)
  .single();

if (userError) {
  console.error('❌ Error checking user:', userError);
} else {
  console.log('✅ User record:', userCheck);
}

// Try to query all users
console.log('\n🔍 Attempting to query all users...');
const { data: users, error: queryError, count } = await supabase
  .from('users')
  .select('*', { count: 'exact' })
  .order('created_at', { ascending: false });

if (queryError) {
  console.error('❌ Query error:', queryError);
  console.error('Error details:', {
    message: queryError.message,
    code: queryError.code,
    details: queryError.details,
    hint: queryError.hint
  });
} else {
  console.log('✅ Query successful!');
  console.log('Total users:', count);
  console.log('Returned users:', users.length);
  console.log('\nUsers:');
  users.forEach(u => {
    console.log(`  - ${u.email} (admin: ${u.is_admin}, blocked: ${u.is_blocked})`);
  });
}

process.exit(0);
