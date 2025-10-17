import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('=== Testing New Pharma Programs Schema ===\n');

  // Test 1: Direct table access
  console.log('Test 1: Direct table access');
  console.log('─'.repeat(50));
  try {
    const { data, error } = await supabase
      .from('pharma_programs')
      .select('medication_name, manufacturer, program_name')
      .limit(3);

    if (error) {
      console.log('✗ Error:', error.message);
    } else {
      console.log('✓ Success! Found', data?.length || 0, 'programs');
      data?.forEach((prog, i) => {
        console.log(`  ${i + 1}. ${prog.medication_name} - ${prog.manufacturer}`);
      });
    }
  } catch (err) {
    console.log('✗ Exception:', err.message);
  }

  // Test 2: RPC search function
  console.log('\n\nTest 2: Search Function - "mounjaro"');
  console.log('─'.repeat(50));
  try {
    const { data, error } = await supabase.rpc('search_pharma_programs', {
      search_query: 'mounjaro',
      result_limit: 5
    });

    if (error) {
      console.log('✗ Error:', error.message);
    } else {
      console.log('✓ Success! Found', data?.length || 0, 'results');
      data?.forEach((prog, i) => {
        console.log(`  ${i + 1}. ${prog.medication_name} (${prog.generic_name})`);
        console.log(`     Similarity: ${(prog.similarity * 100).toFixed(0)}%`);
      });
    }
  } catch (err) {
    console.log('✗ Exception:', err.message);
  }

  // Test 3: Search for "ozempic"
  console.log('\n\nTest 3: Search Function - "ozempic"');
  console.log('─'.repeat(50));
  try {
    const { data, error } = await supabase.rpc('search_pharma_programs', {
      search_query: 'ozempic',
      result_limit: 5
    });

    if (error) {
      console.log('✗ Error:', error.message);
    } else {
      console.log('✓ Success! Found', data?.length || 0, 'results');
      data?.forEach((prog, i) => {
        console.log(`  ${i + 1}. ${prog.medication_name} - ${prog.manufacturer}`);
      });
    }
  } catch (err) {
    console.log('✗ Exception:', err.message);
  }

  // Test 4: Search for "insulin"
  console.log('\n\nTest 4: Search Function - "insulin"');
  console.log('─'.repeat(50));
  try {
    const { data, error } = await supabase.rpc('search_pharma_programs', {
      search_query: 'insulin',
      result_limit: 5
    });

    if (error) {
      console.log('✗ Error:', error.message);
    } else {
      console.log('✓ Success! Found', data?.length || 0, 'results');
      data?.forEach((prog, i) => {
        console.log(`  ${i + 1}. ${prog.medication_name} (${prog.generic_name})`);
      });
    }
  } catch (err) {
    console.log('✗ Exception:', err.message);
  }

  console.log('\n=== Tests Complete ===\n');
}

// Wait a few seconds for schema cache to refresh
console.log('Waiting 5 seconds for Supabase schema cache to refresh...\n');
setTimeout(runTests, 5000);
