import https from 'https';

const testFunction = (functionName, body = {}) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);

    const options = {
      hostname: 'nuhfqkhplldontxtoxkg.supabase.co',
      port: 443,
      path: `/functions/v1/${functionName}`,
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
  console.log('=== Testing All Edge Functions ===\n');

  const tests = [
    { name: 'pharma-search', body: { query: 'mounjaro', limit: 3 } },
    { name: 'generate-embeddings', body: { text: 'test' } },
    { name: 'send-contact-email', body: { name: 'Test', email: 'test@test.com', message: 'test' } }
  ];

  for (const test of tests) {
    console.log(`\n📋 Testing: ${test.name}`);
    console.log('─'.repeat(50));

    try {
      const result = await testFunction(test.name, test.body);
      console.log(`Status: ${result.status}`);
      console.log(`Response:`, JSON.stringify(result.data, null, 2));
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  console.log('\n=== Test Complete ===\n');
};

runTests();
