import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ3MTcyOSwiZXhwIjoyMDc2MDQ3NzI5fQ.aZIZhcqQFCxYWv_N78ezmb2PmZkdP8y5VKLvD_pLHSg';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function resetAdminPasswords() {
  console.log('Resetting admin passwords...\n');

  const admins = [
    { id: '13a6a599-2cda-441b-9d39-54eabb8c08ad', email: 'admin@pharma.com', password: 'admin123' },
    { id: '7be70211-c025-426a-9a43-6e592caa9e62', email: 'pharma.admin@gmail.com', password: 'admin123' }
  ];

  for (const admin of admins) {
    console.log(`Setting password for ${admin.email}...`);

    const { data, error } = await supabase.auth.admin.updateUserById(
      admin.id,
      { password: admin.password }
    );

    if (error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.log(`✅ Password set successfully`);
    }
  }

  console.log('\n✅ All admin passwords reset to: admin123\n');
}

resetAdminPasswords();
