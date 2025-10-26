import { createClient } from '@supabase/supabase-js';

// This is the database your FRONTEND uses for auth
const SUPABASE_URL = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdmin() {
  const email = 'admin@pharma.com';
  const password = 'Admin123!';

  console.log('Creating admin in FRONTEND database...');
  console.log('Database:', SUPABASE_URL);
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('');

  try {
    // Delete existing user first
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      console.log('Deleting existing user...');
      await supabase.auth.admin.deleteUser(existing.id);
    }

    // Create new user
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
      console.error('❌ Error creating user:', error.message);
      return;
    }

    console.log('✅ User created!');
    console.log('User ID:', data.user.id);

    // Wait for profile creation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Set admin flag
    const { error: updateError } = await supabase
      .from('users')
      .update({ is_admin: true })
      .eq('id', data.user.id);

    if (updateError) {
      console.error('❌ Failed to set admin flag:', updateError.message);
      return;
    }

    console.log('✅ Admin flag set!');
    console.log('');

    // Test login
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (loginError) {
      console.error('❌ Login test failed:', loginError.message);
      return;
    }

    console.log('✅ Login test successful!');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('READY TO USE:');
    console.log('Email: admin@pharma.com');
    console.log('Password: Admin123!');
    console.log('═══════════════════════════════════════');

    await supabase.auth.signOut();

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdmin();
