import { createClient } from '@supabase/supabase-js';

const url = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

console.log('🔑 Verifying Anon Key...\n');
console.log('URL:', url);
console.log('Key:', anonKey.substring(0, 50) + '...\n');

// Decode the JWT to check the payload
const parts = anonKey.split('.');
const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

console.log('📋 JWT Payload:');
console.log('  - Issuer:', payload.iss);
console.log('  - Reference:', payload.ref);
console.log('  - Role:', payload.role);
console.log('  - Issued At:', new Date(payload.iat * 1000).toISOString());
console.log('  - Expires:', new Date(payload.exp * 1000).toISOString());
console.log();

// Check if the reference matches the URL
const expectedRef = 'nuhfqkhplldontxtoxkg';
if (payload.ref === expectedRef) {
  console.log('✅ JWT reference matches URL!');
} else {
  console.log('❌ JWT reference does NOT match URL!');
  console.log(`   Expected: ${expectedRef}`);
  console.log(`   Got: ${payload.ref}`);
  process.exit(1);
}

// Check role
if (payload.role === 'anon') {
  console.log('✅ Role is "anon" (correct for client-side)');
} else {
  console.log('⚠️  Role is not "anon":', payload.role);
}

// Test connection
console.log('\n🌐 Testing connection...');
const client = createClient(url, anonKey);

try {
  const { count, error } = await client
    .from('drugs')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.log('❌ Connection failed:', error.message);
    process.exit(1);
  }

  console.log('✅ Connection successful!');
  console.log(`✅ Drugs table accessible (${count} rows)\n`);

  // Test auth endpoints
  const { data: { session }, error: authError } = await client.auth.getSession();
  if (authError && !authError.message.includes('session_not_found')) {
    console.log('⚠️  Auth endpoint issue:', authError.message);
  } else {
    console.log('✅ Auth endpoints accessible\n');
  }

  console.log('🎉 All verifications passed!\n');
  console.log('Summary:');
  console.log('  - URL: ✅ Correct');
  console.log('  - Anon Key: ✅ Correct');
  console.log('  - JWT Reference: ✅ Matches');
  console.log('  - Database Access: ✅ Working');
  console.log('  - Auth Endpoints: ✅ Working\n');

} catch (error) {
  console.log('❌ Error:', error.message);
  process.exit(1);
}
