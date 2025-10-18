// Direct test of the db-query edge function
const SUPABASE_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

async function testSearch(query) {
    console.log(`\n🔍 Testing search for: "${query}"`);

    try {
        const url = `${SUPABASE_URL}/functions/v1/db-query`;
        console.log(`📡 URL: ${url}`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'apikey': SUPABASE_ANON_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: 'search_drugs', query }),
        });

        console.log(`📊 Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Error: ${errorText}`);
            return;
        }

        const result = await response.json();
        console.log(`✅ Success! Found ${result.data?.length || 0} results`);

        if (result.data && result.data.length > 0) {
            console.log('\n📋 Results:');
            result.data.forEach((drug, idx) => {
                console.log(`  ${idx + 1}. ${drug.medication_name} (${drug.generic_name}) - ${drug.manufacturer}`);
            });
        }

        return result;
    } catch (error) {
        console.error(`❌ Exception: ${error.message}`);
    }
}

async function runTests() {
    console.log('🚀 Starting search tests...\n');

    await testSearch('ozempic');
    await testSearch('insulin');
    await testSearch('advair');

    console.log('\n✨ All tests completed!');
}

runTests();
