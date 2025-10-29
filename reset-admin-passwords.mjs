import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseServiceKey = envVars.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('ERROR: VITE_SUPABASE_SERVICE_ROLE_KEY not found in .env file');
  console.error('Service role key is required to update user passwords');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('\n=== Resetting Admin Passwords ===\n');
console.log('Database:', supabaseUrl);
console.log('New Password: Admin123!\n');

const adminAccounts = [
  {
    id: '13a6a599-2cda-441b-9d39-54eabb8c08ad',
    email: 'admin@diabetic.com'
  },
  {
    id: '7be70211-c025-426a-9a43-6e592caa9e62',
    email: 'diabetic.admin@gmail.com'
  }
];

for (const admin of adminAccounts) {
  console.log(`Updating password for ${admin.email}...`);

  const { data, error } = await supabase.auth.admin.updateUserById(
    admin.id,
    { password: 'Admin123!' }
  );

  if (error) {
    console.error(`❌ Error updating ${admin.email}:`, error.message);
  } else {
    console.log(`✅ Password updated successfully for ${admin.email}`);
  }
}

console.log('\n=== Password Reset Complete ===');
console.log('\nYou can now login with:');
console.log('  Email: admin@diabetic.com');
console.log('  Password: Admin123!');
console.log('\nOR');
console.log('  Email: diabetic.admin@gmail.com');
console.log('  Password: Admin123!');
console.log('\nThen navigate to /admin to access the Admin Portal');
