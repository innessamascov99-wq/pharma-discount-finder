#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testSupabaseJSClient() {
  console.log('Testing Supabase JS Client for direct table query...\n');

  const searchTerm = 'jardiance';

  try {
    // Test direct table query
    const { data, error } = await supabase
      .from('drugs')
      .select('*')
      .eq('active', true)
      .or(`medication_name.ilike.%${searchTerm}%,generic_name.ilike.%${searchTerm}%,drug_class.ilike.%${searchTerm}%,indication.ilike.%${searchTerm}%`)
      .order('medication_name')
      .limit(20);

    if (error) {
      console.log('✗ ERROR:', error.message);
      console.log('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('✓ SUCCESS! Found', data.length, 'drugs');
      if (data.length > 0) {
        console.log('\nFirst result:');
        console.log('  Medication:', data[0].medication_name);
        console.log('  Generic:', data[0].generic_name);
        console.log('  Manufacturer:', data[0].manufacturer);
        console.log('  Class:', data[0].drug_class);
      }
    }
  } catch (err) {
    console.error('✗ EXCEPTION:', err.message);
  }
}

testSupabaseJSClient();
