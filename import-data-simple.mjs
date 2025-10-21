import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const newSupabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const newSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const newClient = createClient(newSupabaseUrl, newSupabaseKey);

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function importData() {
  console.log('🚀 Starting data import...\n');

  try {
    // Load exported data
    console.log('📦 Loading exported data...');
    const drugs = JSON.parse(readFileSync('exported-drugs.json', 'utf8'));
    const programs = JSON.parse(readFileSync('exported-programs.json', 'utf8'));
    const drugsPrograms = JSON.parse(readFileSync('exported-drugs-programs.json', 'utf8'));

    console.log(`   - ${drugs.length} drugs`);
    console.log(`   - ${programs.length} programs`);
    console.log(`   - ${drugsPrograms.length} drug-program relationships\n`);

    // Import in batches to avoid rate limits
    console.log('📥 Importing programs (in batches)...');
    const programBatchSize = 10;
    let importedProgramsCount = 0;

    for (let i = 0; i < programs.length; i += programBatchSize) {
      const batch = programs.slice(i, i + programBatchSize);
      const { data, error } = await newClient
        .from('programs')
        .upsert(batch, { onConflict: 'id' })
        .select();

      if (error) {
        console.error(`❌ Error importing program batch ${i / programBatchSize + 1}:`, error);
        throw error;
      }

      importedProgramsCount += data.length;
      process.stdout.write(`\r   Imported ${importedProgramsCount}/${programs.length} programs...`);
      await delay(500); // Wait between batches
    }
    console.log(' ✓\n');

    // Import drugs
    console.log('📥 Importing drugs (in batches)...');
    const drugBatchSize = 5;
    let importedDrugsCount = 0;

    for (let i = 0; i < drugs.length; i += drugBatchSize) {
      const batch = drugs.slice(i, i + drugBatchSize);
      const { data, error } = await newClient
        .from('drugs')
        .upsert(batch, { onConflict: 'id' })
        .select();

      if (error) {
        console.error(`❌ Error importing drug batch ${i / drugBatchSize + 1}:`, error);
        throw error;
      }

      importedDrugsCount += data.length;
      process.stdout.write(`\r   Imported ${importedDrugsCount}/${drugs.length} drugs...`);
      await delay(500); // Wait between batches
    }
    console.log(' ✓\n');

    // Import drugs_programs relationships
    console.log('📥 Importing drug-program relationships...');
    const { data: importedJunction, error: junctionError } = await newClient
      .from('drugs_programs')
      .upsert(drugsPrograms, { onConflict: 'id' })
      .select();

    if (junctionError) {
      console.error('❌ Error importing relationships:', junctionError);
      throw junctionError;
    }
    console.log(`✓ Imported ${importedJunction.length} relationships\n`);

    // Verify
    console.log('🔍 Verifying import...');
    const { count: drugCount } = await newClient
      .from('drugs')
      .select('*', { count: 'exact', head: true });

    const { count: programCount } = await newClient
      .from('programs')
      .select('*', { count: 'exact', head: true });

    const { count: junctionCount } = await newClient
      .from('drugs_programs')
      .select('*', { count: 'exact', head: true });

    console.log(`\n✅ Import completed successfully!\n`);
    console.log(`📊 Final counts:`);
    console.log(`   - Drugs: ${drugCount}`);
    console.log(`   - Programs: ${programCount}`);
    console.log(`   - Relationships: ${junctionCount}\n`);

    console.log(`🎉 Your database is ready at: ${newSupabaseUrl}\n`);

  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  }
}

importData();
