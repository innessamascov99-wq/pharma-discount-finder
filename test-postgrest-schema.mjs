#!/usr/bin/env node

const SUPABASE_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

async function checkPostgRESTSchema() {
  console.log('Checking PostgREST schema discovery...\n');

  try {
    // Get the OpenAPI spec from PostgREST
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Accept': 'application/openapi+json'
      }
    });

    console.log('Status:', response.status);

    if (response.ok) {
      const spec = await response.json();
      console.log('\nAvailable paths (tables/functions):');
      const paths = Object.keys(spec.paths || {});
      paths.forEach(path => console.log('  -', path));

      console.log('\n✓ PostgREST is responding');
      console.log('Total endpoints:', paths.length);
    } else {
      console.log('✗ Failed to get schema');
      const text = await response.text();
      console.log(text);
    }
  } catch (error) {
    console.error('✗ ERROR:', error.message);
  }
}

checkPostgRESTSchema();
