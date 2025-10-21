import { createClient } from '@supabase/supabase-js';

const url = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(url, key);

console.log('🔍 Checking database tables...\n');
console.log('URL:', url);
console.log();

// List all tables in the public schema
try {
  const { data: tables, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .order('table_name');

  if (error) {
    console.log('Note: Cannot query information_schema directly (expected)');
    console.log('Checking tables individually instead...\n');
  }
} catch (err) {
  console.log('Note: information_schema not accessible via client (expected)\n');
}

// Check each table individually
const tablesToCheck = ['drugs', 'programs', 'drugs_programs', 'users', 'admin_actions'];

console.log('📊 Checking tables:\n');

for (const table of tablesToCheck) {
  try {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`❌ Table '${table}': ${error.message}`);
      if (error.code) {
        console.log(`   Error code: ${error.code}`);
      }
    } else {
      console.log(`✅ Table '${table}': EXISTS (${count || 0} rows)`);
    }
  } catch (err) {
    console.log(`❌ Table '${table}': ${err.message}`);
  }
}

console.log('\n🔍 Detailed drugs table check:\n');

// Try to query drugs table specifically
try {
  const { data, error, count } = await supabase
    .from('drugs')
    .select('medication_name, generic_name, manufacturer', { count: 'exact' })
    .limit(5);

  if (error) {
    console.log('❌ Cannot query drugs table:', error.message);
    console.log('Error details:', JSON.stringify(error, null, 2));
  } else {
    console.log(`✅ Drugs table is accessible!`);
    console.log(`   Total rows: ${count}`);
    console.log(`   Sample data:`);
    data.forEach((drug, i) => {
      console.log(`   ${i + 1}. ${drug.medication_name} (${drug.generic_name}) - ${drug.manufacturer}`);
    });
  }
} catch (err) {
  console.log('❌ Error:', err.message);
}

console.log('\n' + '='.repeat(60));
