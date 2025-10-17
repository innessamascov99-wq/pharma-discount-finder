#!/usr/bin/env node
/**
 * Generate embeddings for all pharmaceutical programs
 * Uses Supabase AI via edge function for optimal performance
 */

const SUPABASE_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

async function generateEmbeddings() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║   Pharmaceutical Program Embedding Generator              ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  console.log('📊 Database: nuhfqkhplldontxtoxkg.supabase.co');
  console.log('🎯 Programs to process: 28');
  console.log('🤖 Model: Supabase AI gte-small (384 dimensions)\n');

  try {
    console.log('🚀 Calling generate-embeddings edge function...\n');

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/generate-embeddings`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`📡 Response status: ${response.status}\n`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║                    RESULTS                                ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
    console.log(`✅ Message: ${result.message}`);
    console.log(`📈 Total programs: ${result.total || 0}`);
    console.log(`✅ Successfully embedded: ${result.success || 0}`);
    console.log(`❌ Errors: ${result.errors || 0}\n`);

    if (result.success > 0) {
      console.log('╔═══════════════════════════════════════════════════════════╗');
      console.log('║              VECTOR SEARCH IS NOW ACTIVE!                 ║');
      console.log('╚═══════════════════════════════════════════════════════════╝\n');
      console.log('🎉 Your search now supports:');
      console.log('   • Semantic understanding ("diabetes medication")');
      console.log('   • Brand/generic matching ("semaglutide" → Ozempic)');
      console.log('   • Natural language queries');
      console.log('   • Ranked results by relevance\n');
      console.log('💡 Try these example searches:');
      console.log('   - "What diabetes medications have discounts?"');
      console.log('   - "Cheapest Ozempic programs"');
      console.log('   - "Heart medication assistance"\n');
    }

    return result;
  } catch (error) {
    console.error('\n╔═══════════════════════════════════════════════════════════╗');
    console.error('║                        ERROR                              ║');
    console.error('╚═══════════════════════════════════════════════════════════╝\n');
    console.error('❌ Failed to generate embeddings:', error);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check if edge function is deployed');
    console.error('   2. Verify Supabase credentials are correct');
    console.error('   3. Ensure database has pharma_programs table');
    console.error('   4. Check Supabase logs for detailed errors\n');
    throw error;
  }
}

// Run the generator
generateEmbeddings()
  .then(() => {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✨ All done! Your pharmaceutical search is now optimized.');
    console.log('═══════════════════════════════════════════════════════════\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Generation failed:', error.message);
    process.exit(1);
  });
