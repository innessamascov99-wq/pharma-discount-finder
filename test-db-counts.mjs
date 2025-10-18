import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Database Inventory:\n');

// Count drugs
const { count: drugCount, error: drugError } = await supabase
  .from('drugs')
  .select('*', { count: 'exact', head: true });

console.log(`Drugs: ${drugCount || 0}`);

// Count programs
const { count: programCount, error: programError } = await supabase
  .from('programs')
  .select('*', { count: 'exact', head: true });

console.log(`Programs: ${programCount || 0}`);

// Count junction table
const { count: junctionCount, error: junctionError } = await supabase
  .from('drugs_programs')
  .select('*', { count: 'exact', head: true });

console.log(`Drug-Program Relationships: ${junctionCount || 0}`);

// Sample drugs
const { data: sampleDrugs } = await supabase
  .from('drugs')
  .select('medication_name')
  .limit(10);

console.log('\nSample Medications:');
sampleDrugs?.forEach((d, i) => console.log(`${i + 1}. ${d.medication_name}`));
