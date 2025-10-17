import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function searchPharmaPrograms(query, limit = 15) {
  const searchTerm = query.trim().toLowerCase();
  const searchWords = searchTerm.split(/\s+/).filter(w => w.length > 1);

  if (searchWords.length === 0) {
    return [];
  }

  const orConditions = searchWords.flatMap(word => [
    `medication_name.ilike.%${word}%`,
    `generic_name.ilike.%${word}%`,
    `manufacturer.ilike.%${word}%`,
    `program_name.ilike.%${word}%`,
    `program_description.ilike.%${word}%`
  ]).join(',');

  const { data, error } = await supabase
    .from('pharma_programs')
    .select('*')
    .eq('active', true)
    .or(orConditions)
    .limit(50);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  const results = data.map(program => {
    let relevanceScore = 0;
    const medName = program.medication_name?.toLowerCase() || '';
    const genName = program.generic_name?.toLowerCase() || '';
    const mfg = program.manufacturer?.toLowerCase() || '';
    const progName = program.program_name?.toLowerCase() || '';

    searchWords.forEach(word => {
      if (medName === word) relevanceScore += 100;
      else if (medName.startsWith(word)) relevanceScore += 80;
      else if (medName.includes(word)) relevanceScore += 50;

      if (genName === word) relevanceScore += 90;
      else if (genName.startsWith(word)) relevanceScore += 70;
      else if (genName.includes(word)) relevanceScore += 40;

      if (mfg.includes(word)) relevanceScore += 30;
      if (progName.includes(word)) relevanceScore += 20;
    });

    return {
      ...program,
      similarity: relevanceScore / 100
    };
  });

  return results
    .filter(r => r.similarity && r.similarity > 0)
    .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
    .slice(0, limit);
}

async function runTests() {
  console.log('=== Testing Direct Database Search ===\n');

  const testQueries = [
    'mounjaro',
    'ozempic',
    'januvia',
    'diabetes',
    'insulin'
  ];

  for (const query of testQueries) {
    console.log(`\n📋 Searching for: "${query}"`);
    console.log('─'.repeat(50));

    try {
      const results = await searchPharmaPrograms(query);

      if (results.length === 0) {
        console.log('✗ No results found');
      } else {
        console.log(`✓ Found ${results.length} result(s)`);
        results.slice(0, 3).forEach((result, index) => {
          console.log(`\n  ${index + 1}. ${result.medication_name} (${result.generic_name})`);
          console.log(`     Manufacturer: ${result.manufacturer}`);
          console.log(`     Program: ${result.program_name}`);
          console.log(`     Relevance: ${(result.similarity * 100).toFixed(0)}%`);
        });
      }
    } catch (error) {
      console.log('✗ Error:', error.message);
    }
  }

  console.log('\n=== Test Complete ===\n');
}

runTests();
