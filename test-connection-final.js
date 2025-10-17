import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Testing connection to:', supabaseUrl);
console.log('');

async function testConnection() {
  console.log('TEST 1: Direct Table Access');
  console.log('─'.repeat(60));

  try {
    const { data, error } = await supabase
      .from('pharma_programs')
      .select('medication_name, manufacturer')
      .limit(5);

    if (error) {
      console.log('❌ FAILED:', error.message);
      console.log('   Code:', error.code);
      console.log('   Details:', error.details);
    } else {
      console.log('✅ SUCCESS! Found', data?.length, 'programs:');
      data?.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.medication_name} - ${p.manufacturer}`);
      });
    }
  } catch (err) {
    console.log('❌ EXCEPTION:', err.message);
  }

  console.log('');
  console.log('TEST 2: Fallback Search Method');
  console.log('─'.repeat(60));

  try {
    const query = 'mounjaro';
    const searchWords = query.toLowerCase().split(/\s+/);

    const orConditions = searchWords.flatMap(word => [
      `medication_name.ilike.%${word}%`,
      `generic_name.ilike.%${word}%`,
      `manufacturer.ilike.%${word}%`,
      `program_name.ilike.%${word}%`
    ]).join(',');

    const { data, error } = await supabase
      .from('pharma_programs')
      .select('*')
      .eq('active', true)
      .or(orConditions)
      .limit(10);

    if (error) {
      console.log('❌ FAILED:', error.message);
    } else {
      console.log('✅ SUCCESS! Search for "mounjaro" found', data?.length, 'results:');
      data?.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.medication_name} (${p.generic_name})`);
        console.log(`      ${p.program_name}`);
        console.log(`      ${p.discount_amount}`);
      });
    }
  } catch (err) {
    console.log('❌ EXCEPTION:', err.message);
  }

  console.log('');
  console.log('TEST 3: RPC Function (if cache refreshed)');
  console.log('─'.repeat(60));

  try {
    const { data, error } = await supabase.rpc('search_pharma_programs', {
      search_query: 'insulin',
      result_limit: 5
    });

    if (error) {
      console.log('⚠️  RPC not available yet:', error.message);
      console.log('   This is normal - schema cache needs refresh');
      console.log('   Fallback search will be used instead');
    } else {
      console.log('✅ SUCCESS! RPC function is working');
      console.log('   Found', data?.length, 'results for "insulin"');
      data?.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.medication_name} - ${(p.similarity * 100).toFixed(0)}%`);
      });
    }
  } catch (err) {
    console.log('⚠️  RPC exception:', err.message);
  }

  console.log('');
  console.log('═'.repeat(60));
  console.log('SUMMARY');
  console.log('═'.repeat(60));
  console.log('Database URL:', supabaseUrl);
  console.log('Table Access: Run test to see status');
  console.log('Fallback Search: Will work if table access works');
  console.log('RPC Search: May need schema cache refresh');
  console.log('');
}

testConnection();
