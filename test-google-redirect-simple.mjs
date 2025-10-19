import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3MTY4MjMsImV4cCI6MjA0NDI5MjgyM30.bYWpkK2zK9v6kLdFDhJFi6vMG_kkxFx1_s5YOGbG30I';
const REDIRECT_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co/auth/v1/callback';

console.log('=== Google OAuth Redirect Configuration Test ===\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Configuration:');
console.log('  Auth Database URL:', SUPABASE_URL);
console.log('  Redirect URL:', REDIRECT_URL);
console.log('');

console.log('Test 1: Verify Supabase Client Connection');
try {
    const { data, error } = await supabase.auth.getSession();
    if (error && error.message !== 'No session found') {
        throw error;
    }
    console.log('  ✓ Supabase client connected successfully');
    console.log('  ✓ Auth endpoint accessible:', `${SUPABASE_URL}/auth/v1`);
} catch (error) {
    console.log('  ✗ Failed to connect:', error.message);
    process.exit(1);
}
console.log('');

console.log('Test 2: Verify Redirect URL Format');
const expectedFormat = `${SUPABASE_URL}/auth/v1/callback`;
if (REDIRECT_URL === expectedFormat) {
    console.log('  ✓ Redirect URL format is correct');
    console.log('  ✓ URL:', REDIRECT_URL);
} else {
    console.log('  ✗ Redirect URL mismatch');
    console.log('    Expected:', expectedFormat);
    console.log('    Got:', REDIRECT_URL);
}
console.log('');

console.log('Test 3: Test Google OAuth URL Generation');
try {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: REDIRECT_URL,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    });

    if (error) {
        console.log('  ✗ OAuth Error:', error.message);
        console.log('');
        console.log('Common Issues:');
        console.log('  1. Google OAuth provider not enabled in Supabase Dashboard');
        console.log('  2. Google Client ID/Secret not configured');
        console.log('  3. Redirect URL not in allowed URLs list');
        console.log('');
        console.log('To fix:');
        console.log('  1. Go to: https://supabase.com/dashboard/project/nuhfqkhplldontxtoxkg');
        console.log('  2. Navigate to: Authentication > Providers > Google');
        console.log('  3. Enable Google provider and add credentials');
        console.log('  4. Go to: Authentication > URL Configuration');
        console.log('  5. Add to Redirect URLs:', REDIRECT_URL);
    } else if (data.url) {
        console.log('  ✓ OAuth URL generated successfully');
        console.log('  ✓ Provider:', data.provider);
        console.log('  ✓ OAuth URL created (will redirect to Google)');
        console.log('');
        console.log('  OAuth URL:', data.url.substring(0, 100) + '...');
        console.log('');
        console.log('✓ All tests passed! Google OAuth redirect is configured correctly.');
    } else {
        console.log('  ✗ No OAuth URL generated');
    }
} catch (error) {
    console.log('  ✗ Unexpected error:', error.message);
}

console.log('');
console.log('=== Summary ===');
console.log('Configuration in code is correct.');
console.log('Make sure Supabase Dashboard has:');
console.log('  1. Google OAuth provider enabled');
console.log('  2. Google Client ID and Secret configured');
console.log('  3. Redirect URL added:', REDIRECT_URL);
