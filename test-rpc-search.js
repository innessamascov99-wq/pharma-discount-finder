import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function searchUsingRPC(query, limit = 15) {
  const { data, error } = await supabase.rpc('search_pharma_programs', {
    search_query: query,
    result_limit: limit
  });

  if (error) {
    throw error;
  }

  return data || [];
}

async function runTests() {
  console.log('=== Testing RPC Function Search ===\n');

  const testQueries = [
    'mounjaro',
    'ozempic',
    'januvia',
    'diabetes',
    'insulin'
  ];

  for (const query of testQueries) {
    console.log(`\n📋 Searching for: "${query}"`);
    console.log('─'.repeat(50));

    try {
      const results = await searchUsingRPC(query);

      if (results.length === 0) {
        console.log('✗ No results found');
      } else {
        console.log(`✓ Found ${results.length} result(s)`);
        results.slice(0, 3).forEach((result, index) => {
          console.log(`\n  ${index + 1}. ${result.medication_name} (${result.generic_name})`);
          console.log(`     Manufacturer: ${result.manufacturer}`);
          console.log(`     Program: ${result.program_name}`);
          console.log(`     Relevance: ${(result.similarity * 100).toFixed(0)}%`);
        });
      }
    } catch (error) {
      console.log('✗ Error:', error.message);
    }
  }

  console.log('\n=== Test Complete ===\n');
}

runTests();
