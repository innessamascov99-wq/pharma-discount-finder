import https from 'https';

const testSearch = (query) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, limit: 5 });

    const options = {
      hostname: 'nuhfqkhplldontxtoxkg.supabase.co',
      port: 443,
      path: '/functions/v1/pharma-search',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE',
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(data);
    req.end();
  });
};

const runTests = async () => {
  console.log('=== Testing Pharma Search Functionality ===\n');

  const testCases = [
    'mounjaro',
    'ozempic',
    'januvia',
    'diabetes'
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 Test: Searching for "${testCase}"`);
    console.log('─'.repeat(50));

    try {
      const result = await testSearch(testCase);

      if (result.status === 200 && result.data.results) {
        console.log(`✓ Status: ${result.status}`);
        console.log(`✓ Found: ${result.data.results.length} results`);
        console.log(`✓ Method: ${result.data.method}`);

        if (result.data.results.length > 0) {
          console.log('\nTop Results:');
          result.data.results.slice(0, 3).forEach((prog, idx) => {
            console.log(`  ${idx + 1}. ${prog.medication_name} (${prog.generic_name})`);
            console.log(`     Manufacturer: ${prog.manufacturer}`);
            console.log(`     Program: ${prog.program_name}`);
            console.log(`     Savings: ${prog.discount_amount || 'Contact program'}`);
          });
        }
      } else {
        console.log(`✗ Status: ${result.status}`);
        console.log(`✗ Response:`, result.data);
      }
    } catch (error) {
      console.log(`✗ Error: ${error.message}`);
    }
  }

  console.log('\n=== Test Complete ===\n');
};

runTests();
