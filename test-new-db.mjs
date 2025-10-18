import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Testing new Supabase database...\n');

// Test 1: Check drugs table
console.log('1. Testing drugs table:');
const { data: drugs, error: drugsError } = await supabase
  .from('drugs')
  .select('medication_name, manufacturer')
  .limit(3);

if (drugsError) {
  console.error('   ❌ Error:', drugsError.message);
} else {
  console.log(`   ✅ Found ${drugs.length} drugs:`);
  drugs.forEach(d => console.log(`      - ${d.medication_name} (${d.manufacturer})`));
}

// Test 2: Check programs table
console.log('\n2. Testing programs table:');
const { data: programs, error: programsError } = await supabase
  .from('programs')
  .select('program_name, manufacturer')
  .limit(3);

if (programsError) {
  console.error('   ❌ Error:', programsError.message);
} else {
  console.log(`   ✅ Found ${programs.length} programs:`);
  programs.forEach(p => console.log(`      - ${p.program_name} (${p.manufacturer})`));
}

// Test 3: Search for a drug
console.log('\n3. Testing search for "Ozempic":');
const { data: searchResults, error: searchError } = await supabase
  .from('drugs')
  .select('*')
  .eq('active', true)
  .or('medication_name.ilike.%Ozempic%,generic_name.ilike.%Ozempic%')
  .limit(5);

if (searchError) {
  console.error('   ❌ Error:', searchError.message);
} else {
  console.log(`   ✅ Found ${searchResults.length} results`);
  searchResults.forEach(r => console.log(`      - ${r.medication_name} (${r.generic_name})`));
}

console.log('\n✅ Database connection test complete!');
