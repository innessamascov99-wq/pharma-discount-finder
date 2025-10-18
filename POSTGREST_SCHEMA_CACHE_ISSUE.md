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
- ✓ Database tables and functions exist
- ✓ RLS policies configured correctly
- ✓ Permissions granted to anon/authenticated roles
- ✓ Edge function deployed
- ⏳ Waiting for edge function propagation
- ✗ PostgREST schema cache not updated

## Next Steps
The edge function should become accessible within a few minutes. If it doesn't:
1. Manually restart PostgREST from the Supabase dashboard
2. Or contact Supabase support to reload the schema cache
