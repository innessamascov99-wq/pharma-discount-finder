import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5MzkyNDQsImV4cCI6MjA0NDUxNTI0NH0.P1SedpzJimnVCxzlsm3_B_KFRfwcx4-VhOp7vS6f86Q';

console.log('Testing connection to:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('\n=== Testing Database Connection ===\n');

  // Test 1: Count drugs
  console.log('Test 1: Counting drugs...');
  const { count: drugCount, error: drugCountError } = await supabase
    .from('drugs')
    .select('count', { count: 'exact', head: true })
    .eq('active', true);

  if (drugCountError) {
    console.error('❌ Error counting drugs:', drugCountError.message);
  } else {
    console.log('✅ Active drugs:', drugCount);
  }

  // Test 2: Get sample drugs
  console.log('\nTest 2: Getting sample drugs...');
  const { data: drugs, error: drugsError } = await supabase
    .from('drugs')
    .select('medication_name, generic_name, manufacturer')
    .eq('active', true)
    .limit(3);

  if (drugsError) {
    console.error('❌ Error fetching drugs:', drugsError.message);
  } else {
    console.log('✅ Sample drugs:', drugs);
  }

  // Test 3: Search function for "ozempic"
  console.log('\nTest 3: Searching for "ozempic"...');
  const { data: ozempicResults, error: ozempicError } = await supabase
    .rpc('search_drugs', { search_query: 'ozempic' });

  if (ozempicError) {
    console.error('❌ Error searching for ozempic:', ozempicError.message);
    console.error('Full error:', JSON.stringify(ozempicError, null, 2));
  } else {
    console.log('✅ Found', ozempicResults?.length || 0, 'results for "ozempic"');
    if (ozempicResults && ozempicResults.length > 0) {
      console.log('First result:', {
        name: ozempicResults[0].medication_name,
        generic: ozempicResults[0].generic_name,
        manufacturer: ozempicResults[0].manufacturer
      });
    }
  }

  // Test 4: Search function for "diabetes"
  console.log('\nTest 4: Searching for "diabetes"...');
  const { data: diabetesResults, error: diabetesError } = await supabase
    .rpc('search_drugs', { search_query: 'diabetes' });

  if (diabetesError) {
    console.error('❌ Error searching for diabetes:', diabetesError.message);
    console.error('Full error:', JSON.stringify(diabetesError, null, 2));
  } else {
    console.log('✅ Found', diabetesResults?.length || 0, 'results for "diabetes"');
  }

  // Test 5: Count programs
  console.log('\nTest 5: Counting programs...');
  const { count: programCount, error: programCountError } = await supabase
    .from('programs')
    .select('count', { count: 'exact', head: true })
    .eq('active', true);

  if (programCountError) {
    console.error('❌ Error counting programs:', programCountError.message);
  } else {
    console.log('✅ Active programs:', programCount);
  }

  console.log('\n=== Test Complete ===\n');
}

testConnection().catch(console.error);
