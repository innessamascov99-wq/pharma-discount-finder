import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

const supabase = createClient(supabaseUrl, supabaseKey);

// Replicate the searchDrugs function from searchService.ts
const searchDrugs = async (query) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.trim();

  try {
    const { data, error } = await supabase
      .from('drugs')
      .select('*')
      .eq('active', true)
      .or(`medication_name.ilike.%${searchTerm}%,generic_name.ilike.%${searchTerm}%,drug_class.ilike.%${searchTerm}%,indication.ilike.%${searchTerm}%`)
      .order('medication_name')
      .limit(20);

    if (error) throw error;
    return (data || []).map(drug => ({ ...drug, similarity: 0.8 }));
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

console.log('Testing Search Service\n');

// Test various searches
const testQueries = ['Ozempic', 'diabetes', 'Lilly', 'semaglutide', 'JAR'];

for (const query of testQueries) {
  console.log(`\nSearching for "${query}":`);
  try {
    const results = await searchDrugs(query);
    console.log(`  ✅ Found ${results.length} result(s)`);
    results.forEach(r => {
      console.log(`     - ${r.medication_name} (${r.generic_name}) - ${r.manufacturer}`);
    });
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
}

console.log('\n✅ Search service test complete!');
