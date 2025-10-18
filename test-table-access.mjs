import { createClient } from '@supabase/supabase-js';

const url = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(url, key);

console.log('Testing different approaches...\n');

// Try raw REST API call
console.log('1. Testing raw REST API call to /rest/v1/drugs...');
try {
  const response = await fetch(`${url}/rest/v1/drugs?limit=1`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`
    }
  });

  if (response.ok) {
    const data = await response.json();
    console.log('✅ REST API SUCCESS:', data);
  } else {
    const error = await response.text();
    console.log('❌ REST API FAILED:', response.status, error);
  }
} catch (e) {
  console.log('❌ REST API ERROR:', e.message);
}

// Try RPC call
console.log('\n2. Testing RPC function search_drugs...');
try {
  const response = await fetch(`${url}/rest/v1/rpc/search_drugs`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ search_query: 'ozempic' })
  });

  if (response.ok) {
    const data = await response.json();
    console.log('✅ RPC SUCCESS:', data.length, 'results');
    if (data.length > 0) {
      console.log('   First:', data[0].medication_name);
    }
  } else {
    const error = await response.text();
    console.log('❌ RPC FAILED:', response.status, error);
  }
} catch (e) {
  console.log('❌ RPC ERROR:', e.message);
}
