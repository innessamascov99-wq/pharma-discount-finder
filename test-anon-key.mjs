import { createClient } from '@supabase/supabase-js';

const url = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5MzkyNDQsImV4cCI6MjA0NDUxNTI0NH0.P1SedpzJimnVCxzlsm3_B_KFRfwcx4-VhOp7vS6f86Q';

console.log('🔍 Testing Supabase Connection\n');
console.log('URL:', url);
console.log('Key (first 30 chars):', key.substring(0, 30) + '...\n');

const supabase = createClient(url, key);

console.log('Test 1: Basic table query...');
const { data, error } = await supabase
  .from('drugs')
  .select('medication_name')
  .limit(1);

if (error) {
  console.error('❌ FAILED');
  console.error('Error:', error.message);
  console.error('Code:', error.code);
  console.error('Details:', error.details);
  console.error('Hint:', error.hint);
  console.error('\nFull error object:', JSON.stringify(error, null, 2));
} else {
  console.log('✅ SUCCESS');
  console.log('Data:', data);
}

console.log('\n\nTest 2: RPC function call...');
const { data: rpcData, error: rpcError } = await supabase
  .rpc('search_drugs', { search_query: 'ozempic' });

if (rpcError) {
  console.error('❌ FAILED');
  console.error('Error:', rpcError.message);
  console.error('Code:', rpcError.code);
  console.error('Details:', rpcError.details);
  console.error('Hint:', rpcError.hint);
  console.error('\nFull error object:', JSON.stringify(rpcError, null, 2));
} else {
  console.log('✅ SUCCESS');
  console.log('Results found:', rpcData?.length);
  if (rpcData && rpcData.length > 0) {
    console.log('First result:', rpcData[0].medication_name);
  }
}
