#!/usr/bin/env node

const SUPABASE_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

async function testTableQuery() {
  console.log('Testing direct table query for drugs...\n');

  const searchTerm = 'jardiance';

  try {
    const url = `${SUPABASE_URL}/rest/v1/drugs?active=eq.true&or=(medication_name.ilike.%25${searchTerm}%25,generic_name.ilike.%25${searchTerm}%25,drug_class.ilike.%25${searchTerm}%25,indication.ilike.%25${searchTerm}%25)&order=medication_name&limit=20`;

    console.log('URL:', url, '\n');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    const text = await response.text();
    console.log('\nRaw Response:\n', text.substring(0, 500));

    if (response.ok) {
      const data = JSON.parse(text);
      console.log('\n✓ SUCCESS! Found', data.length, 'drugs');
      if (data.length > 0) {
        console.log('\nFirst result:');
        console.log('  Medication:', data[0].medication_name);
        console.log('  Generic:', data[0].generic_name);
        console.log('  Manufacturer:', data[0].manufacturer);
      }
    } else {
      console.log('\n✗ FAILED');
    }
  } catch (error) {
    console.error('\n✗ ERROR:', error.message);
  }
}

testTableQuery();
