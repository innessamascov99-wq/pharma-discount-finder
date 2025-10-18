const OLD_DB_URL = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const OLD_DB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

async function compareDatabase() {
  try {
    console.log('\n=== OLD DATABASE ANALYSIS ===\n');

    // Get OpenAPI spec to list all tables
    const response = await fetch(`${OLD_DB_URL}/rest/v1/`, {
      headers: {
        'apikey': OLD_DB_KEY,
        'Accept': 'application/json'
      }
    });

    const spec = await response.json();
    const paths = Object.keys(spec.paths || {});

    // Extract table names (paths that start with / but aren't rpc)
    const tables = paths
      .filter(p => p.startsWith('/') && !p.includes('rpc') && p !== '/')
      .map(p => p.replace('/', ''))
      .sort();

    console.log('Tables found:', tables);
    console.log('\nTable Details:\n');

    // Get count and sample data from each table
    for (const table of tables) {
      try {
        // Get count
        const countRes = await fetch(`${OLD_DB_URL}/rest/v1/${table}?select=count`, {
          headers: {
            'apikey': OLD_DB_KEY,
            'Prefer': 'count=exact'
          }
        });
        const countData = await countRes.json();
        const count = countData[0]?.count || 0;

        console.log(`\n${table.toUpperCase()}: ${count} records`);

        // Get sample data to see structure
        const dataRes = await fetch(`${OLD_DB_URL}/rest/v1/${table}?limit=1`, {
          headers: {
            'apikey': OLD_DB_KEY
          }
        });
        const data = await dataRes.json();

        if (data && data.length > 0) {
          console.log('  Columns:', Object.keys(data[0]).join(', '));
        }
      } catch (err) {
        console.log(`  Error fetching ${table}:`, err.message);
      }
    }

    // Get all data from each table
    console.log('\n\n=== EXPORTING ALL DATA ===\n');
    const allData = {};

    for (const table of tables) {
      try {
        const response = await fetch(`${OLD_DB_URL}/rest/v1/${table}?select=*`, {
          headers: {
            'apikey': OLD_DB_KEY
          }
        });
        const data = await response.json();
        allData[table] = data;
        console.log(`${table}: Exported ${data.length} records`);
      } catch (err) {
        console.log(`${table}: Error - ${err.message}`);
        allData[table] = [];
      }
    }

    // Save to file
    const fs = require('fs');
    fs.writeFileSync(
      '/tmp/cc-agent/58636903/project/old-database-export.json',
      JSON.stringify(allData, null, 2)
    );

    console.log('\n\nData exported to: old-database-export.json');
    console.log('\nSummary:');
    console.log('--------');
    Object.entries(allData).forEach(([table, data]) => {
      console.log(`${table}: ${data.length} records`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

compareDatabase();
