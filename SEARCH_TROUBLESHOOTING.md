# Search Troubleshooting Guide

## ✅ What Was Fixed

### Issue: Search wasn't working
**Root Cause**: .env file had incorrect Supabase credentials

**Fixed**:
- ✅ Updated `.env` to use correct database: `nuhfqkhplldontxtoxkg.supabase.co`
- ✅ Updated anon key to match your production database
- ✅ Modified search service to prioritize direct database queries
- ✅ Added detailed console logging for debugging

## 🔍 How Search Now Works

### Priority 1: Direct Text Search (Always Works)
```typescript
// Queries pharma_programs table directly
// Uses ILIKE pattern matching on:
// - medication_name
// - generic_name
// - manufacturer
// - program_name
// - program_description
```

### Priority 2: Vector Search (If text search finds nothing)
```typescript
// Attempts edge function call
// Falls back gracefully if unavailable
```

## 🧪 Testing Your Search

### Test 1: Open Browser Console
1. Open your app in browser
2. Press F12 to open DevTools
3. Go to Console tab
4. Type a medication in search bar

**Expected Output:**
```
🔍 Searching for: Mounjaro
📊 Database URL: https://nuhfqkhplldontxtoxkg.supabase.co
Using fallback text search...
Fallback search returned 1 results
✅ Found 1 results via text search
```

### Test 2: Direct Database Query
Open the test file in your browser:
```
file:///tmp/cc-agent/58636903/project/test-search.html
```

**Expected Result:**
- ✅ Database connected! Found 5 programs
- Shows medication data from your database

### Test 3: Sample Searches
Try these in your app:

**Should Find Results:**
- "Mounjaro" → Mounjaro Savings Card
- "Ozempic" → Ozempic Savings Card
- "diabetes" → Multiple diabetes medications
- "heart" → Cardiovascular medications

**If NO Results:**
- Database may not have programs loaded
- See "Fix: No Data in Database" below

## 🔧 Common Issues & Fixes

### Issue 1: "No programs found"

**Possible Causes:**
1. Database doesn't have data in pharma_programs table
2. All programs marked as inactive (active = false)
3. Wrong database being queried

**Check:**
```sql
-- Run in Supabase SQL Editor
SELECT COUNT(*) FROM pharma_programs WHERE active = true;
```

**Should Return:** 28 programs

**If Returns 0:**
- Programs not loaded yet
- See migration: `supabase/migrations/20251015185904_create_pharma_discount_programs_table.sql`
- Run migrations to populate data

### Issue 2: Console shows different database URL

**Symptom:**
```
📊 Database URL: https://some-other-url.supabase.co
```

**Fix:**
1. Check `.env` file has correct URL
2. Restart dev server after changing .env
3. Clear browser cache

**Correct .env:**
```
VITE_SUPABASE_URL=https://nuhfqkhplldontxtoxkg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Issue 3: "Network error" or "Connection refused"

**Possible Causes:**
1. Supabase project is paused
2. Invalid API key
3. Network connectivity issues

**Check:**
1. Visit: https://supabase.com/dashboard/project/nuhfqkhplldontxtoxkg
2. Verify project is active (green status)
3. Check API keys in Settings → API

### Issue 4: Edge function returns 404

**Symptom:**
```
Edge function error: 404 NOT_FOUND
```

**Expected Behavior:**
- Search automatically falls back to text search
- Still returns results

**To Deploy Edge Function:**
```bash
# If you have Supabase CLI
supabase functions deploy pharma-search
```

**Current State:**
- Text search works without edge function
- Edge function is optional enhancement
- 28 programs searchable without it

## 📊 Verify Database Setup

### Check Table Exists
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'pharma_programs';
```

**Should Return:** pharma_programs

### Check Column Structure
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'pharma_programs'
ORDER BY ordinal_position;
```

**Should Include:**
- id (uuid)
- medication_name (text)
- generic_name (text)
- manufacturer (text)
- program_name (text)
- active (boolean)
- embedding (vector)

### Check Sample Data
```sql
SELECT
  medication_name,
  generic_name,
  program_name,
  active
FROM pharma_programs
LIMIT 5;
```

**Should Show:** Mounjaro, Ozempic, Januvia, Humira, Eliquis, etc.

### Check Indexes
```sql
SELECT indexname
FROM pg_indexes
WHERE tablename = 'pharma_programs';
```

**Should Include:**
- pharma_programs_pkey
- idx_pharma_medication_lower_gin
- idx_pharma_generic_lower_gin
- pharma_programs_embedding_hnsw_idx

## 🚀 Next Steps After Verifying Search Works

### 1. Generate Embeddings (Optional - Enhances Search)
Once basic search works, generate embeddings for semantic search:

```bash
# Via Supabase Dashboard
Go to Edge Functions → generate-embeddings → Invoke
```

**Benefits:**
- Understand "diabetes medication" → finds Mounjaro, Ozempic
- Match generic to brand names
- Rank results by relevance

### 2. Deploy Edge Functions (Optional)
Deploy pharma-search for optimized performance:

```bash
supabase functions deploy pharma-search
```

### 3. Test Advanced Queries
Once embeddings are generated, test semantic search:

- "What's the cheapest diabetes medication?"
- "Heart medication assistance programs"
- "Arthritis drug discounts"

## 📝 Debug Checklist

Use this to diagnose search issues:

- [ ] .env file has correct VITE_SUPABASE_URL
- [ ] .env file has correct VITE_SUPABASE_ANON_KEY
- [ ] Dev server restarted after .env changes
- [ ] Browser console shows correct database URL
- [ ] Supabase project is active (not paused)
- [ ] pharma_programs table exists
- [ ] Table has data (28 programs)
- [ ] Programs are marked active = true
- [ ] Test search in browser console logs results
- [ ] No CORS errors in network tab
- [ ] No 401 Unauthorized errors

## 💡 Quick Test Commands

### Test via Browser Console
```javascript
// Paste in browser console while on your app
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
console.log('URL:', url);
console.log('Key:', key ? 'Present' : 'Missing');
```

### Test Database Connection
```javascript
// Test if table is accessible
fetch('https://nuhfqkhplldontxtoxkg.supabase.co/rest/v1/pharma_programs?limit=1', {
  headers: {
    'apikey': 'YOUR_ANON_KEY',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
.then(r => r.json())
.then(d => console.log('Data:', d));
```

## 🎯 Success Indicators

Your search is working when you see:

✅ **In Console:**
```
🔍 Searching for: Mounjaro
📊 Database URL: https://nuhfqkhplldontxtoxkg.supabase.co
Using fallback text search...
Fallback search returned 1 results
✅ Found 1 results via text search
```

✅ **In UI:**
- Search bar responds to typing
- Results appear within 1 second
- Shows medication name, program name, savings
- "Best Match" badges on relevant results
- No error messages

✅ **In Network Tab:**
- Requests to `/rest/v1/pharma_programs` return 200
- No CORS errors
- Response includes program data

## 📞 Still Not Working?

If search still doesn't work after following this guide:

1. **Check Console for Errors**
   - Look for red error messages
   - Note exact error text

2. **Verify Database**
   - Log into Supabase Dashboard
   - Check Table Editor for pharma_programs
   - Verify data exists

3. **Test Direct Query**
   - Open test-search.html in browser
   - Check what errors appear

4. **Check Network Tab**
   - Look for failed requests
   - Note status codes (401, 403, 404, 500)

5. **Share Debug Info**
   - Console log output
   - Network tab screenshots
   - Exact error messages

---

**Current Status**: Search configured to work with direct database queries. Embeddings and edge functions are optional enhancements that can be added after basic search is verified working.
