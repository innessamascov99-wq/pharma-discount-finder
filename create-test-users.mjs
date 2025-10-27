import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ3MTcyOSwiZXhwIjoyMDc2MDQ3NzI5fQ.aZIZhcqQFCxYWv_N78ezmb2PmZkdP8y5VKLvD_pLHSg';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testUsers = [
  {
    email: 'john.smith@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Smith',
    phone: '555-0101',
    dateOfBirth: '1985-05-15',
    addressLine1: '123 Main Street',
    addressLine2: 'Apt 4B',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    insuranceType: 'Private Insurance',
    insuranceProvider: 'Blue Cross Blue Shield'
  },
  {
    email: 'sarah.johnson@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '555-0102',
    dateOfBirth: '1990-08-22',
    addressLine1: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    insuranceType: 'Private Insurance',
    insuranceProvider: 'Aetna'
  },
  {
    email: 'michael.brown@example.com',
    password: 'password123',
    firstName: 'Michael',
    lastName: 'Brown',
    phone: '555-0103',
    dateOfBirth: '1978-03-10',
    addressLine1: '789 Pine Road',
    city: 'Houston',
    state: 'TX',
    zipCode: '77001',
    insuranceType: 'Medicare',
    insuranceProvider: 'Medicare Part D'
  },
  {
    email: 'emily.davis@example.com',
    password: 'password123',
    firstName: 'Emily',
    lastName: 'Davis',
    phone: '555-0104',
    dateOfBirth: '1995-11-30',
    addressLine1: '321 Elm Street',
    addressLine2: 'Unit 12',
    city: 'Phoenix',
    state: 'AZ',
    zipCode: '85001',
    insuranceType: 'Private Insurance',
    insuranceProvider: 'Cigna'
  },
  {
    email: 'robert.wilson@example.com',
    password: 'password123',
    firstName: 'Robert',
    lastName: 'Wilson',
    phone: '555-0105',
    dateOfBirth: '1982-07-18',
    addressLine1: '654 Maple Drive',
    city: 'Philadelphia',
    state: 'PA',
    zipCode: '19019',
    insuranceType: 'Private Insurance',
    insuranceProvider: 'Humana'
  },
  {
    email: 'maria.garcia@example.com',
    password: 'password123',
    firstName: 'Maria',
    lastName: 'Garcia',
    phone: '555-0106',
    dateOfBirth: '1992-12-05',
    addressLine1: '987 Cedar Lane',
    city: 'Miami',
    state: 'FL',
    zipCode: '33101',
    insuranceType: 'Medicaid',
    insuranceProvider: 'Medicaid'
  },
  {
    email: 'james.taylor@example.com',
    password: 'password123',
    firstName: 'James',
    lastName: 'Taylor',
    phone: '555-0107',
    dateOfBirth: '1988-04-25',
    addressLine1: '111 Birch Street',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    insuranceType: 'Private Insurance',
    insuranceProvider: 'Kaiser Permanente'
  },
  {
    email: 'blocked.user@example.com',
    password: 'password123',
    firstName: 'Blocked',
    lastName: 'User',
    phone: '555-0108',
    dateOfBirth: '1988-12-05',
    addressLine1: '999 Block Street',
    city: 'San Antonio',
    state: 'TX',
    zipCode: '78201',
    insuranceType: 'Uninsured',
    insuranceProvider: null,
    isBlocked: true
  }
];

async function createTestUsers() {
  console.log('Creating test users...\n');

  for (const user of testUsers) {
    try {
      const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          first_name: user.firstName,
          last_name: user.lastName
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          console.log(`⚠️  User ${user.email} already exists, skipping...`);
          continue;
        }
        throw signUpError;
      }

      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          date_of_birth: user.dateOfBirth,
          address_line1: user.addressLine1,
          address_line2: user.addressLine2 || null,
          city: user.city,
          state: user.state,
          zip_code: user.zipCode,
          country: 'USA',
          insurance_type: user.insuranceType,
          insurance_provider: user.insuranceProvider,
          is_admin: false,
          is_blocked: user.isBlocked || false,
          created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          last_login: user.isBlocked ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() : new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        });

      if (profileError) {
        if (profileError.code === '23505') {
          console.log(`⚠️  Profile for ${user.email} already exists, skipping...`);
          continue;
        }
        throw profileError;
      }

      console.log(`✅ Created user: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error creating ${user.email}:`, error.message);
    }
  }

  console.log('\n✅ Test users creation complete!');

  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  console.log(`\nTotal users in database: ${count}`);
}

createTestUsers();
