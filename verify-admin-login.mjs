import { createClient } from '@supabase/supabase-js';

// The correct database
const SUPABASE_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verifyAdmin() {
  const email = 'admin@pharma.com';
  const password = 'Admin123!';

  console.log('Database:', SUPABASE_URL);
  console.log('Testing credentials:', email);
  console.log('');

  // Try login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('❌ Login failed:', error.message);
    console.log('');
    
    // Check if user exists
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (userData) {
      console.log('User exists in database:');
      console.log('  ID:', userData.id);
      console.log('  is_admin:', userData.is_admin);
      console.log('');
      console.log('Password is incorrect or user needs to be recreated.');
    } else {
      console.log('User does not exist in this database.');
      console.log('Creating admin account...');
      
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: 'Admin',
            last_name: 'User'
          }
        }
      });
      
      if (signupError) {
        console.error('Failed to create:', signupError.message);
        return;
      }
      
      console.log('✅ User created! ID:', signupData.user.id);
      
      // Wait and set admin
      await new Promise(r => setTimeout(r, 2000));
      
      await supabase
        .from('users')
        .update({ is_admin: true })
        .eq('id', signupData.user.id);
      
      console.log('✅ Admin flag set!');
    }
    return;
  }

  console.log('✅ Login successful!');
  console.log('User ID:', data.user.id);
  
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', data.user.id)
    .maybeSingle();

  console.log('is_admin:', userData?.is_admin);
  
  if (!userData?.is_admin) {
    console.log('Setting admin flag...');
    await supabase.from('users').update({ is_admin: true }).eq('id', data.user.id);
    console.log('✅ Admin flag set!');
  }

  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('READY:');
  console.log('Email: admin@pharma.com');
  console.log('Password: Admin123!');
  console.log('═══════════════════════════════════════');

  await supabase.auth.signOut();
}

verifyAdmin();
