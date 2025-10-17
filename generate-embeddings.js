const SUPABASE_URL = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

console.log('🚀 Generating embeddings for pharmaceutical programs...\n');

fetch(`${SUPABASE_URL}/functions/v1/generate-embeddings`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({})
})
.then(response => {
  console.log('📡 Response status:', response.status, response.statusText);
  return response.json();
})
.then(result => {
  console.log('\n✅ Result:', JSON.stringify(result, null, 2));
  console.log('\n🎉 Embedding generation complete!');
  console.log('   Total programs:', result.total || 0);
  console.log('   Successfully embedded:', result.success || 0);
  console.log('   Errors:', result.errors || 0);
})
.catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
