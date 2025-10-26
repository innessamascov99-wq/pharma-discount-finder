import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdminAccount() {
  const email = 'admin@pharma.com';
  const password = 'Admin123!';

  console.log('🔐 Creating admin account...');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('');

  try {
    // Step 1: Create auth user
    console.log('Step 1: Creating auth user...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: 'Admin',
          last_name: 'User'
        }
      }
    });

    if (signUpError) {
      console.error('❌ Sign up failed:', signUpError.message);
      return;
    }

    console.log('✅ Auth user created!');
    console.log('User ID:', signUpData.user.id);
    console.log('Email:', signUpData.user.email);
    console.log('');

    // Step 2: Wait for trigger to create user record
    console.log('Step 2: Waiting for user profile creation...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 3: Update to admin
    console.log('Step 3: Setting admin flag...');
    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({ is_admin: true })
      .eq('id', signUpData.user.id)
      .select();

    if (updateError) {
      console.error('❌ Failed to set admin flag:', updateError.message);
      return;
    }

    console.log('✅ Admin flag set!');
    console.log('');

    // Step 4: Verify
    console.log('Step 4: Verifying admin status...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('id', signUpData.user.id)
      .maybeSingle();

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError.message);
      return;
    }

    console.log('✅ Verification complete!');
    console.log('');
    console.log('User Data:');
    console.log(JSON.stringify(verifyData, null, 2));
    console.log('');

    // Success summary
    console.log('🎉 Admin Account Created Successfully!');
    console.log('═══════════════════════════════════════');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('is_admin:', verifyData.is_admin);
    console.log('═══════════════════════════════════════');
    console.log('✅ You can now login with these credentials');
    console.log('✅ You will be redirected to /admin page');

    // Sign out
    await supabase.auth.signOut();

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminAccount();
