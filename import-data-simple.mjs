import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(
  'https://nuhfqkhplldontxtoxkg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE'
);

console.log('Loading data files...\n');

const drugs = JSON.parse(readFileSync('exported-drugs.json', 'utf8'));
const programs = JSON.parse(readFileSync('exported-programs.json', 'utf8'));
const mappings = JSON.parse(readFileSync('exported-drugs-programs.json', 'utf8'));

console.log(`Drugs: ${drugs.length}`);
console.log(`Programs: ${programs.length}`);
console.log(`Mappings: ${mappings.length}\n`);

// Import drugs
console.log('Importing drugs...');
const { data: drugData, error: drugError } = await supabase
  .from('drugs')
  .upsert(drugs, { onConflict: 'id' });

if (drugError) {
  console.error('Error importing drugs:', drugError);
} else {
  console.log('✓ Drugs imported successfully');
}

// Import programs
console.log('Importing programs...');
const { data: progData, error: progError } = await supabase
  .from('programs')
  .upsert(programs, { onConflict: 'id' });

if (progError) {
  console.error('Error importing programs:', progError);
} else {
  console.log('✓ Programs imported successfully');
}

// Import mappings
console.log('Importing drug-program mappings...');
const { data: mapData, error: mapError } = await supabase
  .from('drugs_programs')
  .upsert(mappings, { onConflict: 'drug_id,program_id' });

if (mapError) {
  console.error('Error importing mappings:', mapError);
} else {
  console.log('✓ Mappings imported successfully');
}

console.log('\nDone!');
