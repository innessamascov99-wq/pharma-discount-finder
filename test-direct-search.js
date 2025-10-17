import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSearch(query) {
  console.log(`\n🔍 Searching for: "${query}"`);
  console.log('─'.repeat(50));

  const lowerSearchTerm = query.toLowerCase().trim();
  const searchWords = lowerSearchTerm.split(/\s+/).filter(w => w.length > 1);

  const orConditions = searchWords.flatMap(word => [
    `medication_name.ilike.%${word}%`,
    `generic_name.ilike.%${word}%`,
    `manufacturer.ilike.%${word}%`,
    `program_name.ilike.%${word}%`,
    `program_description.ilike.%${word}%`
  ]).join(',');

  const { data, error } = await supabase
    .from('pharma_programs')
    .select('*')
    .eq('active', true)
    .or(orConditions)
    .limit(10);

  if (error) {
    console.log('❌ Error:', error.message);
    return;
  }

  console.log(`✅ Found ${data.length} results`);

  if (data.length > 0) {
    console.log('\nTop Results:');
    data.slice(0, 3).forEach((prog, idx) => {
      console.log(`\n  ${idx + 1}. ${prog.medication_name} (${prog.generic_name})`);
      console.log(`     Manufacturer: ${prog.manufacturer}`);
      console.log(`     Program: ${prog.program_name}`);
      console.log(`     Savings: ${prog.discount_amount || 'Contact program'}`);
    });
  }
}

async function runTests() {
  console.log('\n=== Direct Database Search Test ===');

  const testCases = ['mounjaro', 'ozempic', 'januvia', 'humira', 'eliquis'];

  for (const testCase of testCases) {
    await testSearch(testCase);
  }

  console.log('\n\n=== Test Complete ===\n');
}

runTests();
