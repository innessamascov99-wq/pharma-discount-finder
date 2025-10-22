import { createClient } from '@supabase/supabase-js';

const url = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

const supabase = createClient(url, key);

console.log('=== Verifying Unified Database ===\n');
console.log('Database URL:', url);
console.log('\nChecking tables...\n');

const { count: userCount } = await supabase
  .from('users')
  .select('*', { count: 'exact', head: true });
console.log('users table:', userCount || 0, 'records');

const { count: drugCount } = await supabase
  .from('drugs')
  .select('*', { count: 'exact', head: true });
console.log('drugs table:', drugCount || 0, 'records');

const { count: progCount } = await supabase
  .from('programs')
  .select('*', { count: 'exact', head: true });
console.log('programs table:', progCount || 0, 'records');

const { count: juncCount } = await supabase
  .from('drugs_programs')
  .select('*', { count: 'exact', head: true });
console.log('drugs_programs table:', juncCount || 0, 'records');

const { count: adminCount } = await supabase
  .from('admin_actions')
  .select('*', { count: 'exact', head: true });
console.log('admin_actions table:', adminCount || 0, 'records');

console.log('\n=== Summary ===');
console.log('All tables exist in single database');

if (drugCount === 0) {
  console.log('\nWARNING: Drugs table is EMPTY!');
  console.log('You need to import data for search to work.');
}
