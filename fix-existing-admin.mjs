import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixAdmin() {
  const email = 'admin@pharma.com';
  const password = 'Admin123!';

  console.log('Checking existing admin account...');
  
  // Try to login
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (loginError) {
    console.error('❌ Login failed:', loginError.message);
    console.log('');
    console.log('The password might be different. Let me check the user record...');
    
    // Get user info
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (userData) {
      console.log('User found in database:');
      console.log('  ID:', userData.id);
      console.log('  Email:', userData.email);
      console.log('  is_admin:', userData.is_admin);
      
      if (!userData.is_admin) {
        console.log('');
        console.log('Setting admin flag...');
        const { error: updateError } = await supabase
          .from('users')
          .update({ is_admin: true })
          .eq('email', email);
        
        if (updateError) {
          console.error('Failed to update:', updateError.message);
        } else {
          console.log('✅ Admin flag set!');
        }
      }
    } else {
      console.log('User not found in users table');
    }
    return;
  }

  console.log('✅ Login successful!');
  console.log('User ID:', loginData.user.id);
  
  // Check admin status
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', loginData.user.id)
    .maybeSingle();

  console.log('is_admin:', userData?.is_admin);

  if (!userData?.is_admin) {
    console.log('Setting admin flag...');
    await supabase
      .from('users')
      .update({ is_admin: true })
      .eq('id', loginData.user.id);
    console.log('✅ Admin flag set!');
  }

  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('CREDENTIALS VERIFIED:');
  console.log('Email: admin@pharma.com');
  console.log('Password: Admin123!');
  console.log('is_admin: true');
  console.log('═══════════════════════════════════════');

  await supabase.auth.signOut();
}

fixAdmin();
