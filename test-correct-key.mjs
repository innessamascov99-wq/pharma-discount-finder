import { createClient } from '@supabase/supabase-js';

const url = 'https://nuhfqkhplldontxtoxkg.supabase.co';

// Test both keys
const key1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5MzkyNDQsImV4cCI6MjA0NDUxNTI0NH0.P1SedpzJimnVCxzlsm3_B_KFRfwcx4-VhOp7vS6f86Q';
const key2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

console.log('Testing Key 1 (from .env)...');
const supabase1 = createClient(url, key1);
const { data: data1, error: error1 } = await supabase1
  .from('drugs')
  .select('medication_name')
  .limit(1);

if (error1) {
  console.log('❌ Key 1 FAILED:', error1.message);
} else {
  console.log('✅ Key 1 SUCCESS:', data1);
}

console.log('\nTesting Key 2 (from test files)...');
const supabase2 = createClient(url, key2);
const { data: data2, error: error2 } = await supabase2
  .from('drugs')
  .select('medication_name')
  .limit(1);

if (error2) {
  console.log('❌ Key 2 FAILED:', error2.message);
} else {
  console.log('✅ Key 2 SUCCESS:', data2);
}

// Test search with working key
if (!error2) {
  console.log('\nTesting search with Key 2...');
  const { data: searchData, error: searchError } = await supabase2
    .rpc('search_drugs', { search_query: 'ozempic' });

  if (searchError) {
    console.log('❌ Search FAILED:', searchError.message);
  } else {
    console.log('✅ Search SUCCESS:', searchData?.length, 'results');
    if (searchData && searchData.length > 0) {
      console.log('   First result:', searchData[0].medication_name);
    }
  }
}
