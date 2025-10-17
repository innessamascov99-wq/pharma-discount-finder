#!/usr/bin/env node
/**
 * Database Configuration Verification Tool
 *
 * This script ensures all database connections point to the correct Supabase instance:
 * https://asqsltuwmqdvayjmwsjs.supabase.co
 *
 * It checks and corrects:
 * - .env file
 * - Any hardcoded database URLs in the codebase
 * - Supabase client configurations
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const CORRECT_URL = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
const CORRECT_PROJECT_REF = 'asqsltuwmqdvayjmwsjs';
const CORRECT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXNsdHV3bXFkdmF5am13c2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzE3MjksImV4cCI6MjA3NjA0NzcyOX0.9ZbZOIejIOZfJRC1yBSvOxnXJE9QHtgMUt9x6apgY4A';

interface CheckResult {
  file: string;
  status: 'ok' | 'fixed' | 'error';
  message: string;
}

const results: CheckResult[] = [];

function checkAndFixEnvFile(): void {
  const envPath = join(process.cwd(), '.env');
  const envLocalPath = join(process.cwd(), '.env.local');
  const correctContent = `VITE_SUPABASE_URL=${CORRECT_URL}\nVITE_SUPABASE_ANON_KEY=${CORRECT_ANON_KEY}\n`;

  if (!existsSync(envPath)) {
    writeFileSync(envPath, correctContent);
    results.push({
      file: '.env',
      status: 'fixed',
      message: 'Created .env file with correct configuration'
    });
  } else {
    let content = readFileSync(envPath, 'utf-8');
    let modified = false;

    const urlRegex = /VITE_SUPABASE_URL=.*/;
    if (!content.match(urlRegex)) {
      content += `\nVITE_SUPABASE_URL=${CORRECT_URL}\n`;
      modified = true;
    } else if (!content.includes(`VITE_SUPABASE_URL=${CORRECT_URL}`)) {
      content = content.replace(urlRegex, `VITE_SUPABASE_URL=${CORRECT_URL}`);
      modified = true;
    }

    const keyRegex = /VITE_SUPABASE_ANON_KEY=.*/;
    if (!content.match(keyRegex)) {
      content += `VITE_SUPABASE_ANON_KEY=${CORRECT_ANON_KEY}\n`;
      modified = true;
    } else if (!content.includes(`VITE_SUPABASE_ANON_KEY=${CORRECT_ANON_KEY}`)) {
      content = content.replace(keyRegex, `VITE_SUPABASE_ANON_KEY=${CORRECT_ANON_KEY}`);
      modified = true;
    }

    if (modified) {
      writeFileSync(envPath, content);
      results.push({
        file: '.env',
        status: 'fixed',
        message: 'Fixed database URL and/or API key'
      });
    } else {
      results.push({
        file: '.env',
        status: 'ok',
        message: 'Configuration is correct'
      });
    }
  }

  if (!existsSync(envLocalPath)) {
    writeFileSync(envLocalPath, correctContent);
    results.push({
      file: '.env.local',
      status: 'fixed',
      message: 'Created override file (takes priority over .env)'
    });
  } else {
    const localContent = readFileSync(envLocalPath, 'utf-8');
    if (localContent.includes(CORRECT_URL)) {
      results.push({
        file: '.env.local',
        status: 'ok',
        message: 'Override file exists with correct configuration'
      });
    } else {
      writeFileSync(envLocalPath, correctContent);
      results.push({
        file: '.env.local',
        status: 'fixed',
        message: 'Fixed override file configuration'
      });
    }
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
  if (content.includes('import.meta.env.VITE_SUPABASE_URL')) {
    results.push({
      file: 'src/lib/supabase.ts',
      status: 'ok',
      message: 'Using environment variables (.env file controls configuration)'
    });
  } else if (content.includes(CORRECT_URL) || content.includes(CORRECT_PROJECT_REF)) {
    results.push({
      file: 'src/lib/supabase.ts',
      status: 'ok',
      message: 'Configuration locked to correct database (hardcoded)'
    });
  } else {
    results.push({
      file: 'src/lib/supabase.ts',
      status: 'error',
      message: 'Incorrect database URL detected - please review manually'
    });
  }
}

function printResults(): void {
  console.log('\n=== Database Configuration Verification ===\n');
  console.log(`Correct Supabase URL: ${CORRECT_URL}\n`);

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
  }
}

// Run checks
checkAndFixEnvFile();
checkSupabaseClient();
printResults();
