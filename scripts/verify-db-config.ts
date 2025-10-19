#!/usr/bin/env node
/**
 * Database Configuration Verification Tool
 *
 * This script ensures all database connections point to the correct Supabase instances:
 * - Auth Database: https://nuhfqkhplldontxtoxkg.supabase.co (Login and Google Auth)
 * - Drugs Database: https://asqsltuwmqdvayjmwsjs.supabase.co (Drug search)
 *
 * CRITICAL: These URLs must NEVER change
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const AUTH_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const AUTH_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const DRUGS_URL = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const DRUGS_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

interface CheckResult {
  file: string;
  status: 'ok' | 'fixed' | 'error';
  message: string;
}

const results: CheckResult[] = [];

function checkAndFixEnvFile(): void {
  const envPath = join(process.cwd(), '.env');
  const correctContent = `# Database for user authentication (Login and Google Auth)
VITE_SUPABASE_URL=${AUTH_URL}
VITE_SUPABASE_ANON_KEY=${AUTH_ANON_KEY}

# Database for drugs info (Drug search)
VITE_DRUGS_SUPABASE_URL=${DRUGS_URL}
VITE_DRUGS_SUPABASE_ANON_KEY=${DRUGS_ANON_KEY}
`;

  if (!existsSync(envPath)) {
    writeFileSync(envPath, correctContent);
    results.push({
      file: '.env',
      status: 'fixed',
      message: 'Created .env file with correct two-database configuration'
    });
    return;
  }

  let content = readFileSync(envPath, 'utf-8');
  let modified = false;

  // Check auth database URL
  const authUrlRegex = /VITE_SUPABASE_URL=.*/;
  if (!content.match(authUrlRegex)) {
    content += `\nVITE_SUPABASE_URL=${AUTH_URL}\n`;
    modified = true;
  } else if (!content.includes(`VITE_SUPABASE_URL=${AUTH_URL}`)) {
    content = content.replace(authUrlRegex, `VITE_SUPABASE_URL=${AUTH_URL}`);
    modified = true;
  }

  // Check auth database key
  const authKeyRegex = /VITE_SUPABASE_ANON_KEY=.*/;
  if (!content.match(authKeyRegex)) {
    content += `VITE_SUPABASE_ANON_KEY=${AUTH_ANON_KEY}\n`;
    modified = true;
  } else if (!content.includes(`VITE_SUPABASE_ANON_KEY=${AUTH_ANON_KEY}`)) {
    content = content.replace(authKeyRegex, `VITE_SUPABASE_ANON_KEY=${AUTH_ANON_KEY}`);
    modified = true;
  }

  // Check drugs database URL
  const drugsUrlRegex = /VITE_DRUGS_SUPABASE_URL=.*/;
  if (!content.match(drugsUrlRegex)) {
    content += `\nVITE_DRUGS_SUPABASE_URL=${DRUGS_URL}\n`;
    modified = true;
  } else if (!content.includes(`VITE_DRUGS_SUPABASE_URL=${DRUGS_URL}`)) {
    content = content.replace(drugsUrlRegex, `VITE_DRUGS_SUPABASE_URL=${DRUGS_URL}`);
    modified = true;
  }

  // Check drugs database key
  const drugsKeyRegex = /VITE_DRUGS_SUPABASE_ANON_KEY=.*/;
  if (!content.match(drugsKeyRegex)) {
    content += `VITE_DRUGS_SUPABASE_ANON_KEY=${DRUGS_ANON_KEY}\n`;
    modified = true;
  } else if (!content.includes(`VITE_DRUGS_SUPABASE_ANON_KEY=${DRUGS_ANON_KEY}`)) {
    content = content.replace(drugsKeyRegex, `VITE_DRUGS_SUPABASE_ANON_KEY=${DRUGS_ANON_KEY}`);
    modified = true;
  }

  if (modified) {
    writeFileSync(envPath, content);
    results.push({
      file: '.env',
      status: 'fixed',
      message: 'Fixed database URLs and/or API keys'
    });
  } else {
    results.push({
      file: '.env',
      status: 'ok',
      message: 'Configuration is correct'
    });
  }
}

function checkSupabaseClient(): void {
  const supabasePath = join(process.cwd(), 'src/lib/supabase.ts');

  if (!existsSync(supabasePath)) {
    results.push({
      file: 'src/lib/supabase.ts',
      status: 'error',
      message: 'File not found'
    });
    return;
  }

  const content = readFileSync(supabasePath, 'utf-8');

  // Check if it uses environment variables (preferred approach)
  if (content.includes('import.meta.env.VITE_SUPABASE_URL') &&
      content.includes('import.meta.env.VITE_DRUGS_SUPABASE_URL')) {

    // Verify no hardcoded fallbacks exist
    if (content.includes('|| \'https://')) {
      results.push({
        file: 'src/lib/supabase.ts',
        status: 'error',
        message: 'Found hardcoded fallback URLs - remove them to ensure .env is always used'
      });
    } else {
      results.push({
        file: 'src/lib/supabase.ts',
        status: 'ok',
        message: 'Using environment variables (.env file controls configuration)'
      });
    }
  } else {
    results.push({
      file: 'src/lib/supabase.ts',
      status: 'error',
      message: 'Not using environment variables correctly - please review manually'
    });
  }
}

function printResults(): void {
  console.log('\n=== Database Configuration Verification ===\n');
  console.log(`Auth Database URL: ${AUTH_URL}`);
  console.log(`Drugs Database URL: ${DRUGS_URL}\n`);

  let hasErrors = false;
  let hasChanges = false;

  for (const result of results) {
    const icon = result.status === 'ok' ? '✓' : result.status === 'fixed' ? '🔧' : '✗';
    const color = result.status === 'ok' ? '\x1b[32m' : result.status === 'fixed' ? '\x1b[33m' : '\x1b[31m';
    const reset = '\x1b[0m';

    console.log(`${color}${icon}${reset} ${result.file}: ${result.message}`);

    if (result.status === 'error') hasErrors = true;
    if (result.status === 'fixed') hasChanges = true;
  }

  console.log('\n');

  if (hasChanges) {
    console.log('⚠️  Configuration has been updated. Please restart your dev server.');
  }

  if (hasErrors) {
    console.log('❌ Some errors were found. Please review and fix manually.');
    process.exit(1);
  } else {
    console.log('✅ All database configurations are correct!');
    console.log('\nDatabase Assignment:');
    console.log('  • Login & Google Auth → nuhfqkhplldontxtoxkg.supabase.co');
    console.log('  • Drug Search → asqsltuwmqdvayjmwsjs.supabase.co');
  }
}

// Run checks
checkAndFixEnvFile();
checkSupabaseClient();
printResults();
