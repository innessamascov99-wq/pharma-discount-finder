import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verifyAdminLogin() {
  const email = 'admin@pharma.com';
  const password = 'Admin123!';

  console.log('🔐 Testing Admin Login...');
  console.log('Email:', email);
  console.log('');

  try {
    // Step 1: Login
    console.log('Step 1: Attempting login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (loginError) {
      console.error('❌ Login failed:', loginError.message);
      return;
    }

    console.log('✅ Login successful!');
    console.log('User ID:', loginData.user.id);
    console.log('Email:', loginData.user.email);
    console.log('');

    // Step 2: Check admin status
    console.log('Step 2: Checking admin status...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, is_admin, first_name, last_name')
      .eq('id', loginData.user.id)
      .maybeSingle();

    if (userError) {
      console.error('❌ Error checking admin status:', userError.message);
      return;
    }

    console.log('✅ User data retrieved!');
    console.log('');
    console.log('User Info:');
    console.log(JSON.stringify(userData, null, 2));
    console.log('');

    // Step 3: Determine redirect
    console.log('Step 3: Determining redirect path...');
    const adminEmails = ['pharma.admin@gmail.com', 'pharmadiscountfinder@gmail.com'];
    const isAdminEmail = adminEmails.some(e => loginData.user.email?.toLowerCase() === e.toLowerCase());
    const isAdmin = userData?.is_admin || isAdminEmail;

    console.log('Email check (isAdminEmail):', isAdminEmail);
    console.log('Database check (is_admin):', userData?.is_admin);
    console.log('Final admin status:', isAdmin);
    console.log('');

    const redirectPath = isAdmin ? '/admin' : '/dashboard';

    console.log('═══════════════════════════════════════');
    console.log('🎯 REDIRECT PATH:', redirectPath);
    console.log('═══════════════════════════════════════');
    console.log('');

    if (redirectPath === '/admin') {
      console.log('✅ SUCCESS! User will be redirected to /admin');
    } else {
      console.log('❌ FAILED! User will be redirected to /dashboard instead');
    }

    // Clean up
    await supabase.auth.signOut();

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyAdminLogin();
