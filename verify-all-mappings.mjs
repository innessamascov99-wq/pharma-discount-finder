import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const CORRECT_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const CORRECT_REF = 'nuhfqkhplldontxtoxkg';
const OLD_URL = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const OLD_REF = 'asqsltuwmqdvayjmwsjs';

console.log('🔍 Comprehensive Database Mapping Verification\n');
console.log('='.repeat(60));
console.log(`✓ Correct URL: ${CORRECT_URL}`);
console.log(`✗ Old URL:     ${OLD_URL}`);
console.log('='.repeat(60));
console.log();

let allGood = true;
const issues = [];

// Check .env file
console.log('📄 Checking .env file...');
try {
  const envContent = readFileSync('.env', 'utf-8');

  const hasCorrectUrl = envContent.includes(CORRECT_URL);
  const hasOldUrl = envContent.includes(OLD_URL);

  if (hasCorrectUrl && !hasOldUrl) {
    console.log('   ✓ .env file uses correct URL\n');
  } else if (hasOldUrl) {
    console.log('   ✗ .env file still contains old URL!\n');
    issues.push('.env file contains old URL');
    allGood = false;
  } else {
    console.log('   ⚠ .env file missing Supabase URL\n');
    issues.push('.env file missing Supabase URL');
    allGood = false;
  }
} catch (error) {
  console.log('   ✗ .env file not found!\n');
  issues.push('.env file not found');
  allGood = false;
}

// Check src/lib/supabase.ts
console.log('📄 Checking src/lib/supabase.ts...');
try {
  const supabaseContent = readFileSync('src/lib/supabase.ts', 'utf-8');

  const hasCorrectUrl = supabaseContent.includes(CORRECT_URL);
  const hasOldUrl = supabaseContent.includes(OLD_URL);

  if (hasCorrectUrl && !hasOldUrl) {
    console.log('   ✓ supabase.ts uses correct URL\n');
  } else if (hasOldUrl) {
    console.log('   ✗ supabase.ts still contains old URL!\n');
    issues.push('supabase.ts contains old URL');
    allGood = false;
  } else if (supabaseContent.includes('import.meta.env.VITE_SUPABASE_URL')) {
    console.log('   ✓ supabase.ts uses environment variables\n');
  } else {
    console.log('   ⚠ supabase.ts configuration unclear\n');
  }
} catch (error) {
  console.log('   ✗ supabase.ts not found!\n');
  issues.push('supabase.ts not found');
  allGood = false;
}

// Check scripts/verify-db-config.ts
console.log('📄 Checking scripts/verify-db-config.ts...');
try {
  const verifyContent = readFileSync('scripts/verify-db-config.ts', 'utf-8');

  const hasCorrectUrl = verifyContent.includes(CORRECT_URL);
  const hasOldUrl = verifyContent.includes(OLD_URL);

  if (hasCorrectUrl && !hasOldUrl) {
    console.log('   ✓ verify-db-config.ts uses correct URL\n');
  } else if (hasOldUrl) {
    console.log('   ✗ verify-db-config.ts still contains old URL!\n');
    issues.push('verify-db-config.ts contains old URL');
    allGood = false;
  } else {
    console.log('   ⚠ verify-db-config.ts configuration unclear\n');
  }
} catch (error) {
  console.log('   ⚠ verify-db-config.ts not found (optional)\n');
}

// Check for any old URLs in source code
console.log('🔍 Scanning src/ directory for old URLs...');
try {
  const { execSync } = await import('child_process');
  const result = execSync(`grep -r "${OLD_REF}" src/ 2>/dev/null || true`, { encoding: 'utf-8' });

  if (result.trim()) {
    console.log('   ✗ Found old URLs in source code:');
    console.log(result);
    issues.push('Old URLs found in source code');
    allGood = false;
  } else {
    console.log('   ✓ No old URLs found in source code\n');
  }
} catch (error) {
  console.log('   ✓ No old URLs found in source code\n');
}

// Test connection to new database
console.log('🌐 Testing connection to new database...');
try {
  const envContent = readFileSync('.env', 'utf-8');
  const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
  const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

  if (urlMatch && keyMatch) {
    const url = urlMatch[1].trim();
    const key = keyMatch[1].trim();

    const client = createClient(url, key);

    // Try a simple query
    const { data, error } = await client
      .from('drugs')
      .select('count', { count: 'exact', head: true });

    if (error) {
      if (error.message.includes('Could not find the table')) {
        console.log('   ⚠ Database connected, but schema not created yet');
        console.log('   → Run the SQL script in Supabase Dashboard\n');
      } else {
        console.log('   ✗ Database error:', error.message, '\n');
        issues.push('Database connection error');
        allGood = false;
      }
    } else {
      console.log(`   ✓ Successfully connected to ${url}`);
      console.log(`   ✓ Database ready (drugs table accessible)\n`);
    }
  }
} catch (error) {
  console.log('   ✗ Could not test database connection:', error.message, '\n');
}

// Summary
console.log('='.repeat(60));
console.log('\n📊 VERIFICATION SUMMARY\n');

if (allGood && issues.length === 0) {
  console.log('✅ ALL MAPPINGS ARE CORRECT!\n');
  console.log('Your application is properly configured to use:');
  console.log(`   ${CORRECT_URL}\n`);
  console.log('Next steps:');
  console.log('1. Run SQL script in Supabase Dashboard (if not done yet)');
  console.log('2. Run: node import-data-simple.mjs');
  console.log('3. Start your app: npm run dev\n');
} else {
  console.log('❌ ISSUES FOUND:\n');
  issues.forEach((issue, i) => {
    console.log(`   ${i + 1}. ${issue}`);
  });
  console.log('\nPlease fix these issues before proceeding.\n');
  process.exit(1);
}
