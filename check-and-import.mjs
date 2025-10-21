import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const newSupabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const newSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const client = createClient(newSupabaseUrl, newSupabaseKey);

console.log('🔍 Checking new database status...\n');

// Check if tables exist and have data
const tables = ['drugs', 'programs', 'drugs_programs'];
const tableCounts = {};

for (const table of tables) {
  try {
    const { count, error } = await client
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`❌ Table '${table}': ${error.message}`);
      tableCounts[table] = { exists: false, count: 0, error: error.message };
    } else {
      console.log(`✓ Table '${table}': ${count} rows`);
      tableCounts[table] = { exists: true, count: count || 0 };
    }
  } catch (err) {
    console.log(`❌ Table '${table}': ${err.message}`);
    tableCounts[table] = { exists: false, count: 0, error: err.message };
  }
}

console.log();

// Check if we need to import
const needsImport =
  (tableCounts.drugs?.count === 0 || tableCounts.drugs?.count === null) &&
  (tableCounts.programs?.count === 0 || tableCounts.programs?.count === null);

if (!needsImport) {
  console.log('📊 Database already has data:');
  console.log(`   - Drugs: ${tableCounts.drugs?.count || 0}`);
  console.log(`   - Programs: ${tableCounts.programs?.count || 0}`);
  console.log(`   - Relationships: ${tableCounts.drugs_programs?.count || 0}`);
  console.log('\n✅ Data migration already complete!\n');
  process.exit(0);
}

// Import data
console.log('📦 Loading exported data...');
const drugs = JSON.parse(readFileSync('exported-drugs.json', 'utf8'));
const programs = JSON.parse(readFileSync('exported-programs.json', 'utf8'));
const drugsPrograms = JSON.parse(readFileSync('exported-drugs-programs.json', 'utf8'));

console.log(`   - ${drugs.length} drugs`);
console.log(`   - ${programs.length} programs`);
console.log(`   - ${drugsPrograms.length} relationships\n`);

try {
  // Import programs first
  console.log('📥 Importing programs...');
  const { data: importedPrograms, error: programsError } = await client
    .from('programs')
    .upsert(programs, { onConflict: 'id' })
    .select();

  if (programsError) {
    console.error('❌ Error importing programs:', programsError);
    throw programsError;
  }
  console.log(`✓ Imported ${importedPrograms.length} programs\n`);

  // Import drugs
  console.log('📥 Importing drugs...');
  const { data: importedDrugs, error: drugsError } = await client
    .from('drugs')
    .upsert(drugs, { onConflict: 'id' })
    .select();

  if (drugsError) {
    console.error('❌ Error importing drugs:', drugsError);
    throw drugsError;
  }
  console.log(`✓ Imported ${importedDrugs.length} drugs\n`);

  // Import relationships
  console.log('📥 Importing drug-program relationships...');
  const { data: importedRelations, error: relationsError } = await client
    .from('drugs_programs')
    .upsert(drugsPrograms, { onConflict: 'id' })
    .select();

  if (relationsError) {
    console.error('❌ Error importing relationships:', relationsError);
    throw relationsError;
  }
  console.log(`✓ Imported ${importedRelations.length} relationships\n`);

  // Verify
  console.log('🔍 Verifying import...');
  const { count: finalDrugs } = await client
    .from('drugs')
    .select('*', { count: 'exact', head: true });

  const { count: finalPrograms } = await client
    .from('programs')
    .select('*', { count: 'exact', head: true });

  const { count: finalRelations } = await client
    .from('drugs_programs')
    .select('*', { count: 'exact', head: true });

  console.log('\n✅ Import completed successfully!\n');
  console.log('📊 Final counts in database:');
  console.log(`   - Drugs: ${finalDrugs}`);
  console.log(`   - Programs: ${finalPrograms}`);
  console.log(`   - Relationships: ${finalRelations}\n`);

  console.log('🎉 Data migration complete!\n');

} catch (error) {
  console.error('\n❌ Import failed:', error.message);
  if (error.code) {
    console.error('Error code:', error.code);
  }
  if (error.details) {
    console.error('Details:', error.details);
  }
  if (error.hint) {
    console.error('Hint:', error.hint);
  }
  process.exit(1);
}
