# Pharmaceutical Programs - Embedding Setup Guide

## Current Status

✅ **Database Structure**: Optimized with HNSW vector indexing
✅ **Data**: 28 pharmaceutical programs loaded
✅ **Edge Functions**: Deployed and ready
❌ **Embeddings**: Not yet generated (0/28)

## Why Embeddings Are Important

Vector embeddings enable semantic search, allowing users to find pharmaceutical programs using natural language queries like:
- "What's the cheapest diabetes medication?"
- "Show me all Ozempic discounts"
- "Find programs for heart medication"

## Architecture Overview

Your setup uses **Supabase AI's built-in 'gte-small' model**:
- **Model**: gte-small (384 dimensions)
- **Index**: HNSW (Hierarchical Navigable Small World)
- **Search Function**: `search_pharma_programs_vector()`
- **Edge Function**: `generate-embeddings`

## Best Approach: Use Edge Functions

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions** → `generate-embeddings`
3. Click **Invoke Function**
4. Use POST method with empty body `{}`
5. Wait 30-60 seconds for all 28 programs to process

### Option 2: Via API Call

```bash
curl -X POST \
  "https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-embeddings" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

Replace:
- `YOUR_PROJECT_REF` with your actual Supabase project reference
- `YOUR_ANON_KEY` with your anon key from the dashboard

### Option 3: Via Frontend Integration

Add a button in your admin dashboard:

```typescript
const generateEmbeddings = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-embeddings`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const result = await response.json();
  console.log(result);
};
```

## How It Works

The `generate-embeddings` edge function:

1. **Fetches** all programs without embeddings
2. **Combines** text fields into searchable content:
   - Medication name
   - Generic name
   - Manufacturer
   - Program name
   - Description
   - Eligibility criteria
3. **Generates** 384-dimensional embeddings using Supabase AI
4. **Updates** each record with its embedding
5. **Returns** success/error counts

## Verify Embeddings

After generation, check in Supabase SQL Editor:

```sql
SELECT
  COUNT(*) as total,
  COUNT(embedding) as with_embeddings,
  COUNT(*) - COUNT(embedding) as missing_embeddings
FROM pharma_programs
WHERE active = true;
```

Expected result: `with_embeddings: 28`

## Test Vector Search

Once embeddings are generated, test the search:

```sql
-- This requires an embedding vector, so use the edge function instead
```

Or use the `pharma-search` edge function:

```bash
curl -X POST \
  "https://YOUR_PROJECT_REF.supabase.co/functions/v1/pharma-search" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "diabetes medication discounts", "limit": 10}'
```

## Performance Expectations

With HNSW indexing and 28 programs:
- **Query time**: <50ms
- **Accuracy**: 95%+ for relevant matches
- **Top K**: 15 results by default (configurable)
- **Threshold**: 0.7 similarity minimum

## Troubleshooting

### Edge Function Not Found
- Ensure the function is deployed in your Supabase project
- Check the function slug matches: `generate-embeddings`
- Verify JWT is disabled for the function

### No Embeddings Generated
- Check edge function logs in Supabase Dashboard
- Verify programs have required text fields populated
- Ensure Supabase AI is enabled for your project

### Slow Performance
- Verify HNSW index exists: `pharma_programs_embedding_hnsw_idx`
- Check index parameters are optimal (m=16, ef_construction=64)
- Run `ANALYZE pharma_programs;` to update statistics

## Next Steps

1. ✅ Generate embeddings (choose option above)
2. ✅ Verify all 28 programs have embeddings
3. ✅ Test vector search with sample queries
4. ✅ Integrate search into your frontend
5. ✅ Monitor performance and adjust thresholds as needed

## Integration with n8n

Your n8n chatbot can use the `pharma-search` edge function:

1. Add HTTP Request node
2. Method: POST
3. URL: `${SUPABASE_URL}/functions/v1/pharma-search`
4. Headers: `Authorization: Bearer ${ANON_KEY}`
5. Body: `{"query": "{{$json.userMessage}}", "limit": 15}`

This provides semantic search results to your AI agent for comprehensive responses.
