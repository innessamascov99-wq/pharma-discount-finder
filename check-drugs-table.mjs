import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nuhfqkhplldontxtoxkg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE'
);

console.log('Checking drugs table...\n');

const { data: drugs, error, count } = await supabase
  .from('drugs')
  .select('*', { count: 'exact' })
  .limit(5);

if (error) {
  console.error('Error querying drugs:', error);
} else {
  console.log(`Total drugs in table: ${count}`);
  console.log('\nFirst 5 drugs:');
  console.log(JSON.stringify(drugs, null, 2));
}

const { data: programs, error: progError, count: progCount } = await supabase
  .from('programs')
  .select('*', { count: 'exact' })
  .limit(3);

if (progError) {
  console.error('\nError querying programs:', progError);
} else {
  console.log(`\n\nTotal programs in table: ${progCount}`);
  console.log('\nFirst 3 programs:');
  console.log(JSON.stringify(programs, null, 2));
}

const { data: junction, error: juncError, count: juncCount } = await supabase
  .from('drugs_programs')
  .select('*', { count: 'exact' })
  .limit(5);

if (juncError) {
  console.error('\nError querying drugs_programs:', juncError);
} else {
  console.log(`\n\nTotal drug-program mappings: ${juncCount}`);
  console.log('\nFirst 5 mappings:');
  console.log(JSON.stringify(junction, null, 2));
}
