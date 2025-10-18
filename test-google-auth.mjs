import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Testing Google OAuth Configuration\n');

try {
  console.log('Attempting to initiate Google OAuth...');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:5173/auth/callback',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('\n❌ Google OAuth Error:');
    console.error('   Message:', error.message);
    console.error('   Status:', error.status);
    console.error('   Name:', error.name);

    if (error.message?.includes('provider is not enabled') || error.message?.includes('not configured')) {
      console.error('\n🔧 Google OAuth is NOT enabled in Supabase.');
      console.error('\nTo enable Google OAuth:');
      console.error('1. Go to: https://supabase.com/dashboard/project/nuhfqkhplldontxtoxkg/auth/providers');
      console.error('2. Find "Google" in the providers list');
      console.error('3. Enable it and configure with your Google OAuth credentials');
      console.error('4. Add authorized redirect URLs in Google Cloud Console');
    }
  } else {
    console.log('\n✅ Google OAuth appears to be configured!');
    console.log('   Provider:', data.provider);
    console.log('   URL generated:', data.url ? 'Yes' : 'No');

    if (data.url) {
      console.log('\n   OAuth URL would redirect to Google for authentication');
    }
  }
} catch (err) {
  console.error('\n❌ Unexpected error:', err.message);
}
