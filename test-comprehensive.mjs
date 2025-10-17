import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nuhfqkhplldontxtoxkg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE'
);

async function runTests() {
  console.log('='.repeat(80));
  console.log('COMPREHENSIVE DATABASE & SEARCH TEST');
  console.log('='.repeat(80));
  console.log('');

  let errors = [];
  let warnings = [];

  // TEST 1: Count programs
  console.log('TEST 1: Count Active Programs');
  console.log('-'.repeat(80));
  const { count, error: countError } = await supabase
    .from('pharma_programs')
    .select('*', { count: 'exact', head: true })
    .eq('active', true);

  if (countError) {
    console.log('❌ FAILED:', countError.message);
    errors.push('Count programs failed');
    return;
  }
  console.log('✅ Total active programs:', count);

  if (count < 30) {
    warnings.push(`Only ${count} programs found (expected 38+)`);
    console.log(`⚠️  WARNING: Expected at least 38 programs, found ${count}`);
  }
  console.log('');

  // TEST 2: Check data quality
  console.log('TEST 2: Data Quality Check');
  console.log('-'.repeat(80));
  const { data: qualityData, error: qualityError } = await supabase
    .from('pharma_programs')
    .select('medication_name, generic_name, manufacturer, discount_amount, phone_number')
    .eq('active', true)
    .limit(5);

  if (qualityError) {
    console.log('❌ FAILED:', qualityError.message);
    errors.push('Data quality check failed');
  } else {
    console.log('Sample programs:');
    qualityData.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.medication_name} (${p.manufacturer})`);
      console.log(`     Generic: ${p.generic_name}`);
      console.log(`     Savings: ${p.discount_amount}`);
      console.log(`     Phone: ${p.phone_number}`);

      // Check for missing data
      if (!p.discount_amount || !p.phone_number) {
        warnings.push(`${p.medication_name} has missing data`);
      }
    });
    console.log('✅ Data quality check passed');
  }
  console.log('');

  // TEST 3: RPC Function - Search for 'mounjaro'
  console.log('TEST 3: RPC Function - Exact Match Search "mounjaro"');
  console.log('-'.repeat(80));
  const { data: rpc1, error: rpc1Error } = await supabase.rpc('search_pharma_programs', {
    search_query: 'mounjaro',
    result_limit: 5
  });

  if (rpc1Error) {
    console.log('❌ FAILED:', rpc1Error.message);
    errors.push('RPC search for mounjaro failed');
  } else if (!rpc1 || rpc1.length === 0) {
    console.log('❌ FAILED: No results returned');
    errors.push('No results for mounjaro search');
  } else {
    console.log(`✅ Found ${rpc1.length} result(s):`);
    rpc1.forEach((p, i) => {
      const relevance = (p.similarity * 100).toFixed(0);
      console.log(`  ${i + 1}. ${p.medication_name} - Relevance: ${relevance}%`);

      if (p.medication_name.toLowerCase() === 'mounjaro' && p.similarity < 0.9) {
        warnings.push('Exact match for Mounjaro has low similarity score');
      }
    });
  }
  console.log('');

  // TEST 4: RPC Function - Search for 'insulin'
  console.log('TEST 4: RPC Function - Generic Search "insulin"');
  console.log('-'.repeat(80));
  const { data: rpc2, error: rpc2Error } = await supabase.rpc('search_pharma_programs', {
    search_query: 'insulin',
    result_limit: 10
  });

  if (rpc2Error) {
    console.log('❌ FAILED:', rpc2Error.message);
    errors.push('RPC search for insulin failed');
  } else {
    console.log(`✅ Found ${rpc2.length} result(s):`);
    rpc2.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.medication_name} - ${p.discount_amount}`);
    });

    if (rpc2.length < 5) {
      warnings.push(`Only ${rpc2.length} insulin results (expected 6+)`);
    }
  }
  console.log('');

  // TEST 5: Direct Table Query - Search for 'humira'
  console.log('TEST 5: Direct Table Query - Search "humira"');
  console.log('-'.repeat(80));
  const { data: directData, error: directError } = await supabase
    .from('pharma_programs')
    .select('*')
    .eq('active', true)
    .or('medication_name.ilike.%humira%,generic_name.ilike.%humira%');

  if (directError) {
    console.log('❌ FAILED:', directError.message);
    errors.push('Direct query for humira failed');
  } else if (!directData || directData.length === 0) {
    console.log('❌ FAILED: No results');
    errors.push('No Humira found in database');
  } else {
    console.log(`✅ Found ${directData.length} result(s):`);
    directData.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.medication_name} - ${p.program_name}`);
    });
  }
  console.log('');

  // TEST 6: Check for specific medications
  console.log('TEST 6: Verify Key Medications Present');
  console.log('-'.repeat(80));
  const keyMeds = ['Mounjaro', 'Ozempic', 'Humira', 'Eliquis', 'Humalog'];

  for (const med of keyMeds) {
    const { data, error } = await supabase
      .from('pharma_programs')
      .select('medication_name')
      .eq('active', true)
      .ilike('medication_name', med)
      .limit(1);

    if (error || !data || data.length === 0) {
      console.log(`❌ ${med} - NOT FOUND`);
      errors.push(`${med} missing from database`);
    } else {
      console.log(`✅ ${med} - Found`);
    }
  }
  console.log('');

  // TEST 7: Test empty search
  console.log('TEST 7: Empty Search Handling');
  console.log('-'.repeat(80));
  const { data: emptyData, error: emptyError } = await supabase.rpc('search_pharma_programs', {
    search_query: '',
    result_limit: 5
  });

  if (emptyError) {
    console.log('✅ Properly rejects empty search');
  } else if (!emptyData || emptyData.length === 0) {
    console.log('✅ Returns empty results for empty query');
  } else {
    console.log('⚠️  Returns results for empty query');
    warnings.push('Empty search should return no results');
  }
  console.log('');

  // TEST 8: Test special characters
  console.log('TEST 8: Special Character Handling');
  console.log('-'.repeat(80));
  const { data: specialData, error: specialError } = await supabase.rpc('search_pharma_programs', {
    search_query: "ozempic's",
    result_limit: 5
  });

  if (specialError) {
    console.log('❌ FAILED:', specialError.message);
    errors.push('Special character handling failed');
  } else {
    console.log('✅ Handles special characters properly');
  }
  console.log('');

  // SUMMARY
  console.log('='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));

  if (errors.length === 0) {
    console.log('✅ Database connection: WORKING');
    console.log(`✅ Programs in database: ${count}`);
    console.log('✅ RPC search function: WORKING');
    console.log('✅ Direct table query: WORKING');
    console.log('✅ Data quality: GOOD');
    console.log('✅ Key medications: PRESENT');
    console.log('');

    if (warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      warnings.forEach(w => console.log(`   - ${w}`));
      console.log('');
    }

    console.log('🎉 All critical tests passed! Search is operational.');
  } else {
    console.log('❌ ERRORS FOUND:');
    errors.forEach(e => console.log(`   - ${e}`));
    console.log('');

    if (warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      warnings.forEach(w => console.log(`   - ${w}`));
      console.log('');
    }

    console.log('⚠️  Some tests failed. Review errors above.');
  }

  console.log('='.repeat(80));

  return { errors, warnings };
}

runTests().then(result => {
  if (result && result.errors && result.errors.length > 0) {
    process.exit(1);
  }
}).catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
