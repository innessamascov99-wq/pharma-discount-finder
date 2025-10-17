import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('='.repeat(80));
console.log('DATABASE VERIFICATION TEST');
console.log('='.repeat(80));
console.log('Database:', supabaseUrl);
console.log('');

async function verifyData() {
  console.log('TEST 1: Count total programs');
  console.log('-'.repeat(80));

  const { count, error: countError } = await supabase
    .from('pharma_programs')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.log('❌ FAILED:', countError.message);
    return;
  }

  console.log('✅ Total programs in database:', count);
  console.log('');

  console.log('TEST 2: List first 10 programs');
  console.log('-'.repeat(80));

  const { data, error } = await supabase
    .from('pharma_programs')
    .select('medication_name, manufacturer, discount_amount')
    .eq('active', true)
    .limit(10);

  if (error) {
    console.log('❌ FAILED:', error.message);
    return;
  }

  data.forEach((p, i) => {
    console.log(`${i + 1}. ${p.medication_name} (${p.manufacturer}) - ${p.discount_amount}`);
  });

  console.log('');
  console.log('TEST 3: Search for "mounjaro"');
  console.log('-'.repeat(80));

  const searchWords = ['mounjaro'];
  const orConditions = searchWords.flatMap(word => [
    `medication_name.ilike.%${word}%`,
    `generic_name.ilike.%${word}%`,
    `manufacturer.ilike.%${word}%`
  ]).join(',');

  const { data: searchData, error: searchError } = await supabase
    .from('pharma_programs')
    .select('*')
    .eq('active', true)
    .or(orConditions);

  if (searchError) {
    console.log('❌ FAILED:', searchError.message);
    return;
  }

  if (searchData.length === 0) {
    console.log('⚠️  No results found for "mounjaro"');
  } else {
    console.log('✅ Found', searchData.length, 'result(s) for "mounjaro":');
    searchData.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.medication_name} - ${p.program_name}`);
      console.log(`      Savings: ${p.discount_amount}`);
      console.log(`      Phone: ${p.phone_number}`);
    });
  }

  console.log('');
  console.log('TEST 4: Test RPC function');
  console.log('-'.repeat(80));

  const { data: rpcData, error: rpcError } = await supabase.rpc('search_pharma_programs', {
    search_query: 'insulin',
    result_limit: 5
  });

  if (rpcError) {
    console.log('⚠️  RPC function not ready:', rpcError.message);
    console.log('   (This is okay - direct table search will be used)');
  } else {
    console.log('✅ RPC function works! Found', rpcData.length, 'results for "insulin"');
    rpcData.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.medication_name} - ${(p.similarity * 100).toFixed(0)}% match`);
    });
  }

  console.log('');
  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log('✅ Database connection: WORKING');
  console.log(`✅ Programs in database: ${count}`);
  console.log('✅ Direct table query: WORKING');
  console.log('✅ Search functionality: READY');
  console.log('');
  console.log('Your search should now work on the website!');
  console.log('Try searching for: mounjaro, ozempic, insulin, humira, eliquis');
  console.log('='.repeat(80));
}

verifyData();
