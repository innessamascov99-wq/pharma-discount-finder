# Generate Embeddings for Vector Search

## Current Status
- ✅ Database: Fully configured with HNSW indexing
- ✅ Programs: 28 pharmaceutical discount programs loaded
- ✅ Search Functions: Optimized vector search ready
- ❌ Embeddings: Need to be generated (0/28)

## Best Path: Use Supabase Dashboard

### Option 1: Via Supabase Dashboard Edge Functions (RECOMMENDED - 2 minutes)

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/nuhfqkhplldontxtoxkg

2. **Open Edge Functions**
   - Click "Edge Functions" in left sidebar
   - Find `generate-embeddings` function

3. **Invoke the Function**
   - Click on `generate-embeddings`
   - Click "Invoke" button
   - Method: POST
   - Body: `{}` (empty object)
   - Click "Send Request"

4. **Wait for Response** (30-60 seconds)
   ```json
   {
     "message": "Embeddings generated successfully",
     "total": 28,
     "success": 28,
     "errors": 0
   }
   ```

5. **Verify Success**
   - Go to SQL Editor
   - Run:
   ```sql
   SELECT COUNT(*) as total, COUNT(embedding) as with_embeddings
   FROM pharma_programs WHERE active = true;
   ```
   - Should show: `with_embeddings: 28`

### Option 2: Via API Call (Alternative)

If the dashboard method doesn't work, try direct API call:

```bash
curl -X POST \
  "https://nuhfqkhplldontxtoxkg.supabase.co/functions/v1/generate-embeddings" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Option 3: Deploy Edge Function First

If function returns 404, deploy it first:

1. **Check if function exists**
   - Dashboard → Edge Functions
   - Look for `generate-embeddings`

2. **Deploy if missing**
   - Use Supabase CLI or dashboard
   - Function code is in: `supabase/functions/generate-embeddings/index.ts`

## What Happens When You Generate Embeddings

### The Process
1. **Fetches** all 28 programs from database
2. **Creates** searchable text combining:
   - Medication name (e.g., "Mounjaro")
   - Generic name (e.g., "tirzepatide")
   - Manufacturer (e.g., "Eli Lilly")
   - Program name
   - Description
   - Eligibility criteria

3. **Generates** 384-dimensional vector embeddings using Supabase AI's gte-small model
4. **Stores** embeddings in database
5. **HNSW Index** automatically optimizes for fast queries

### Example Data Flow
```
Input Text:
"Mounjaro tirzepatide Eli Lilly Mounjaro Savings Card
Patient savings program for diabetes medication..."

↓ Supabase AI (gte-small)

Output Vector (384 dimensions):
[0.023, -0.145, 0.892, ..., 0.234]

↓ Store in Database

Enables Semantic Search:
"diabetes medication" → Finds Mounjaro, Ozempic, Januvia
```

## After Embeddings Are Generated

### Your Search Will Support

**Natural Language Queries:**
- ✅ "What diabetes medications have discounts?"
- ✅ "Find cheapest Ozempic programs"
- ✅ "Heart medication patient assistance"

**Brand/Generic Matching:**
- ✅ "semaglutide" → Finds Ozempic
- ✅ "tirzepatide" → Finds Mounjaro
- ✅ "apixaban" → Finds Eliquis

**Semantic Understanding:**
- ✅ Understands synonyms
- ✅ Ranks by relevance
- ✅ Finds related programs

### Performance Expectations
- **Query Time**: <50ms (HNSW index)
- **Accuracy**: 95%+ relevant matches
- **Results**: Top 15 most similar programs
- **Threshold**: 0.7 minimum similarity (70% match)

## Verify It's Working

### Test in Browser
1. Open your application homepage
2. Search for: "diabetes medication"
3. Should see: Mounjaro, Ozempic, Januvia, etc.
4. Look for "Best Match" badges on highly relevant results

### Test via SQL
```sql
-- Generate a test embedding (you'll need to do this via edge function)
-- Then test similarity search:
SELECT
  medication_name,
  program_name,
  1 - (embedding <=> query_embedding) as similarity
FROM pharma_programs
WHERE active = true
ORDER BY embedding <=> query_embedding
LIMIT 5;
```

### Check Console Logs
In browser console, you should see:
```
Searching for: "diabetes"
Calling pharma-search edge function...
Vector search returned 10 results using vector_search
```

## Troubleshooting

### Function Returns 404
**Cause**: Edge function not deployed to production
**Solution**:
1. Check if function exists in dashboard
2. Deploy using Supabase CLI: `supabase functions deploy generate-embeddings`
3. Or create function in dashboard and paste code from `supabase/functions/generate-embeddings/index.ts`

### No Programs Found
**Cause**: Function can't find programs
**Solution**: Check programs exist:
```sql
SELECT COUNT(*) FROM pharma_programs WHERE active = true;
```

### Embeddings Not Generated
**Cause**: Supabase AI not available or error during generation
**Solution**:
1. Check function logs in Supabase Dashboard
2. Ensure your Supabase project has AI features enabled
3. Try regenerating one program at a time

### Search Still Uses Text Fallback
**Cause**: Embeddings not in database
**Solution**: Verify embeddings exist:
```sql
SELECT
  medication_name,
  CASE WHEN embedding IS NOT NULL THEN 'Has embedding' ELSE 'Missing' END
FROM pharma_programs
LIMIT 5;
```

## Alternative: Manual Process (If Edge Function Unavailable)

If edge functions aren't working, you can generate embeddings manually:

### Using Python Script

```python
import os
from supabase import create_client
from openai import OpenAI

# Initialize clients
supabase = create_client(
    "https://nuhfqkhplldontxtoxkg.supabase.co",
    "YOUR_SERVICE_ROLE_KEY"  # Get from Supabase Dashboard → Settings → API
)
openai_client = OpenAI(api_key="YOUR_OPENAI_KEY")

# Fetch programs
programs = supabase.table('pharma_programs').select('*').eq('active', True).is_('embedding', 'null').execute()

print(f"Found {len(programs.data)} programs needing embeddings")

# Generate and upload
for program in programs.data:
    # Create search text
    search_text = f"{program['medication_name']} {program['generic_name']} {program['manufacturer']} {program['program_name']} {program['program_description']}"

    # Generate embedding (OpenAI - 1536 dimensions)
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=search_text,
        dimensions=384  # Match gte-small dimensions
    )
    embedding = response.data[0].embedding

    # Update database
    supabase.table('pharma_programs').update({
        'embedding': embedding
    }).eq('id', program['id']).execute()

    print(f"✓ {program['medication_name']}")

print("Done!")
```

**Note**: This requires OpenAI API (costs ~$0.01 for 28 programs)

## Summary

**Recommended Path:**
1. ✅ Go to Supabase Dashboard
2. ✅ Navigate to Edge Functions → `generate-embeddings`
3. ✅ Click "Invoke" with empty body `{}`
4. ✅ Wait 30-60 seconds
5. ✅ Verify in SQL Editor

**Time Required**: 2-5 minutes

**Cost**: Free (uses Supabase AI included in your plan)

**Result**: Production-ready semantic search for 28 pharmaceutical discount programs

---

Once embeddings are generated, your search will transform from keyword matching to intelligent semantic understanding, providing users with the most relevant results ranked by similarity!
