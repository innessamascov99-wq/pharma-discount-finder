import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdmin() {
  const email = 'admin@pharma.com';
  const password = 'Admin123!';

  console.log('🔐 Creating admin account...');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('');

  try {
    // Create user
    console.log('Creating user...');
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: 'Admin',
          last_name: 'User'
        }
      }
    });

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    console.log('✅ User created!');
    console.log('User ID:', data.user.id);
    console.log('');

    // Wait for user record
    console.log('Waiting for user profile...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Set admin
    console.log('Setting admin flag...');
    const { error: updateError } = await supabase
      .from('users')
      .update({ is_admin: true })
      .eq('id', data.user.id);

    if (updateError) {
      console.error('❌ Update error:', updateError.message);
      return;
    }

    console.log('✅ Admin flag set!');
    console.log('');

    // Test login immediately
    console.log('Testing login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (loginError) {
      console.error('❌ Login test failed:', loginError.message);
      return;
    }

    console.log('✅ Login test successful!');
    console.log('');

    console.log('═══════════════════════════════════════');
    console.log('🎉 ADMIN ACCOUNT READY!');
    console.log('═══════════════════════════════════════');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('═══════════════════════════════════════');

    // Sign out
    await supabase.auth.signOut();

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdmin();
