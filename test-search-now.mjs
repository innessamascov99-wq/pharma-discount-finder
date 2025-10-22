import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nuhfqkhplldontxtoxkg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE'
);

console.log('Testing drug search...\n');

// Test 1: Count all drugs
const { count, error: countError } = await supabase
  .from('drugs')
  .select('*', { count: 'exact', head: true });

console.log(`Total drugs in database: ${count}`);
if (countError) console.error('Count error:', countError);

// Test 2: Search for "Ozempic"
console.log('\nSearching for "Ozempic"...');
const searchTerm = 'Ozempic';
const { data, error } = await supabase
  .from('drugs')
  .select('*')
  .eq('active', true)
  .or(`medication_name.ilike.%${searchTerm}%,generic_name.ilike.%${searchTerm}%`)
  .limit(5);

if (error) {
  console.error('Search error:', error);
} else {
  console.log(`Found ${data.length} results:`);
  data.forEach(drug => {
    console.log(`- ${drug.medication_name} (${drug.generic_name})`);
  });
}

// Test 3: Get all drugs (no search)
console.log('\nGetting all drugs...');
const { data: allDrugs, error: allError } = await supabase
  .from('drugs')
  .select('medication_name, generic_name, manufacturer')
  .eq('active', true)
  .limit(10);

if (allError) {
  console.error('Get all error:', allError);
} else {
  console.log(`Total retrieved: ${allDrugs.length}`);
  allDrugs.forEach(drug => {
    console.log(`- ${drug.medication_name} by ${drug.manufacturer}`);
  });
}
