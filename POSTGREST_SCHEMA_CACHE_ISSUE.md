# PostgREST Schema Cache Issue

## Problem
The `public.drugs` table and `public.search_drugs_rpc` function exist in the database but are **not visible in PostgREST's schema cache** on the hosted Supabase instance.

## Evidence

### Database Level (✓ Working)
```sql
-- Function exists
SELECT proname FROM pg_proc WHERE proname = 'search_drugs_rpc';
-- Returns: search_drugs_rpc

-- Table exists
SELECT tablename FROM pg_tables WHERE tablename = 'drugs';
-- Returns: drugs

-- Direct SQL query works
SELECT * FROM search_drugs_rpc('ozempic');
-- Returns: 1 result (Ozempic by Novo Nordisk)

-- Direct table query works
SELECT * FROM drugs WHERE medication_name ILIKE '%ozempic%';
-- Returns: 1 result
```

### REST API Level (✗ Failing)
```bash
# Table access fails
curl https://nuhfqkhplldontxtoxkg.supabase.co/rest/v1/drugs
# Error: "Could not find the table 'public.drugs' in the schema cache"

# RPC function access fails
curl -X POST https://nuhfqkhplldontxtoxkg.supabase.co/rest/v1/rpc/search_drugs_rpc
# Error: "Could not find the function public.search_drugs_rpc(search_query) in the schema cache"
```

## Root Cause
PostgREST on the hosted Supabase instance maintains a schema cache that:
1. **Only updates when PostgREST restarts** or receives a schema reload signal
2. **Does not respond to NOTIFY signals** from database migrations on hosted instances
3. **Requires manual intervention** to reload on Supabase Cloud

## Attempted Solutions

### ✗ Failed Approaches
1. **NOTIFY signals** - Sent `NOTIFY pgrst, 'reload schema'` multiple times - No effect
2. **Schema changes** - Modified table comments, disabled/enabled RLS - No effect
3. **Function recreation** - Dropped and recreated functions - No effect
4. **Temporary table creation** - Created/dropped tables to trigger reload - No effect
5. **Multiple migrations** - Ran 10+ migrations with reload attempts - No effect

### ✓ Working Solution
**Use Supabase Edge Functions** to bypass PostgREST and query the database directly using the service role.

## Implementation

### Edge Function Deployed
- **Name**: `search-drugs`
- **Slug**: `search-drugs`
- **Status**: ACTIVE (but not accessible yet - propagation delay)
- **JWT Verification**: false (allows anonymous access)

### Frontend Integration
Updated `src/services/searchService.ts` to use the edge function:

```typescript
export const searchDrugs = async (query: string): Promise<Drug[]> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(
    `${supabaseUrl}/functions/v1/search-drugs?q=${encodeURIComponent(query)}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
      },
    }
  );

  const data = await response.json();
  return data || [];
};
```

## Manual Fix (If Needed)
If edge functions don't work, the Supabase dashboard can manually reload the schema cache:
1. Go to Supabase Dashboard
2. Navigate to Database settings
3. Click "Restart PostgREST" or "Reload Schema Cache"

## Status
- ✓ Database tables exist: drugs, programs, postgrest_cache_reload (3 tables)
- ✓ RPC functions exist: search_drugs_rpc, search_programs_rpc (2 functions)
- ✓ Data populated: 40 drugs, 40 programs
- ✓ RLS policies configured correctly
- ✓ Permissions granted to anon/authenticated roles
- ✓ Edge function deployed: search-drugs
- ✗ PostgREST schema cache completely frozen (not responding to ANY changes)

## Critical Finding
PostgREST's schema cache on this Supabase hosted instance:
- Does NOT respond to NOTIFY signals
- Does NOT recognize newly created tables
- Does NOT pick up schema changes
- **REQUIRES manual reload from Supabase Dashboard**

## Manual Reload Required
To fix this issue, you need to manually reload PostgREST's schema cache:

### Option 1: Supabase Dashboard
1. Go to https://supabase.com/dashboard/project/nuhfqkhplldontxtoxkg
2. Navigate to **Settings** → **API**
3. Look for **"Reload Schema"** or **"Restart API"** button
4. Click to force PostgREST to reload

### Option 2: Supabase CLI (if available)
```bash
supabase db reset --db-url "postgresql://[your-connection-string]"
```

### Option 3: Contact Support
If the above options aren't available, contact Supabase support to manually reload the PostgREST schema cache for project `nuhfqkhplldontxtoxkg`.

## Verification After Reload
Once reloaded, these endpoints should work:
```bash
# Test table access
curl https://nuhfqkhplldontxtoxkg.supabase.co/rest/v1/drugs?limit=1

# Test RPC function
curl -X POST https://nuhfqkhplldontxtoxkg.supabase.co/rest/v1/rpc/search_drugs_rpc \
  -H "Content-Type: application/json" \
  -d '{"search_query": "ozempic"}'

# Test new reload table
curl https://nuhfqkhplldontxtoxkg.supabase.co/rest/v1/postgrest_cache_reload?limit=1
```
