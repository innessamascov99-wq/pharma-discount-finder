#!/usr/bin/env node

const SUPABASE_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

async function testDbQuery() {
  console.log('Testing Edge Function db-query...\n');

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/db-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        type: 'search_drugs',
        query: 'jardiance'
      })
    });

    console.log('Status:', response.status);

    const text = await response.text();

    if (response.ok) {
      const result = JSON.parse(text);
      console.log('✓ SUCCESS! Found', result.data?.length || 0, 'drugs');
      if (result.data && result.data.length > 0) {
        console.log('\nFirst result:');
        console.log('  Medication:', result.data[0].medication_name);
        console.log('  Generic:', result.data[0].generic_name);
        console.log('  Manufacturer:', result.data[0].manufacturer);
      }
    } else {
      console.log('✗ FAILED');
      console.log('Response:', text);
    }
  } catch (error) {
    console.error('✗ ERROR:', error.message);
  }
}

testDbQuery();
