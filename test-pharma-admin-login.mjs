import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Testing different login credentials...\n');

// Try different password combinations
const credentials = [
  { email: 'pharma.admin@gmail.com', password: 'admin123' },
  { email: 'pharma.admin@gmail.com', password: 'Admin123!' },
  { email: 'admin@pharma.com', password: 'Admin123!' },
  { email: 'admin@pharma.com', password: 'password123' },
];

for (const cred of credentials) {
  console.log(`Trying ${cred.email} with password ${cred.password}...`);
  const { data, error } = await supabase.auth.signInWithPassword(cred);

  if (error) {
    console.log(`  ❌ Failed: ${error.message}`);
  } else {
    console.log(`  ✅ SUCCESS! Logged in as ${data.user.email}`);

    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', data.user.id)
      .single();

    console.log(`  Admin status: ${userData?.is_admin}`);
    process.exit(0);
  }
}

console.log('\n❌ None of the credentials worked. Creating a new admin user...');

// Create a new admin user
const newEmail = `testadmin${Date.now()}@pharma.com`;
const newPassword = 'TestAdmin123!';

console.log(`\nCreating new user: ${newEmail}`);
const { data: signupData, error: signupError } = await supabase.auth.signUp({
  email: newEmail,
  password: newPassword,
});

if (signupError) {
  console.error('❌ Signup failed:', signupError);
  process.exit(1);
}

console.log('✅ User created successfully!');
console.log('User ID:', signupData.user.id);
console.log('\nNow we need to set this user as admin in the database via SQL...');
console.log(`\nRun this SQL in Supabase:\nUPDATE users SET is_admin = true WHERE id = '${signupData.user.id}';`);

process.exit(0);
