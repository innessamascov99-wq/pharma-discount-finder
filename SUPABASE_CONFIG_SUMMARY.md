# Supabase Configuration Summary

## Database Connection

**Project URL:** `https://nuhfqkhplldontxtoxkg.supabase.co`
**Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE`

## Configuration Files

### 1. Environment Variables (`.env`)
The `.env` file contains the correct credentials:
```
VITE_SUPABASE_URL=https://nuhfqkhplldontxtoxkg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE
```

### 2. Main Application Files

All application files correctly use environment variables:

- **`src/lib/supabase.ts`** - Supabase client initialization
  - Uses `import.meta.env.VITE_SUPABASE_URL`
  - Uses `import.meta.env.VITE_SUPABASE_ANON_KEY`

- **`src/services/searchService.ts`** - Search service
  - Uses environment variables for API calls
  - Includes detailed logging for debugging

- **`src/contexts/AuthContext.tsx`** - Authentication
  - Imports client from `lib/supabase.ts`
  - All auth operations use environment variables

### 3. Edge Functions

All 4 edge functions are correctly deployed and use Supabase-provided environment variables:

1. **`chat-kb-query`** - Knowledge base search
2. **`send-contact-email`** - Contact form handler
3. **`pharma-search`** - Pharmaceutical program search with vector/text search
4. **`generate-embeddings`** - AI embedding generation

Edge functions automatically use:
- `Deno.env.get('SUPABASE_URL')` → `https://nuhfqkhplldontxtoxkg.supabase.co`
- `Deno.env.get('SUPABASE_ANON_KEY')` → Auto-provided by Supabase
- `Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')` → Auto-provided by Supabase

## Database Tables

- **`pharma_programs`** - 28 active pharmaceutical discount programs
- **`contact_submissions`** - Contact form submissions
- **`user_profiles`** - User profile data
- **`saved_programs`** - User-saved programs
- **`user_activity`** - User activity tracking
- **`programs`** - Legacy program data
- **`customer`** - Customer information

## Row Level Security (RLS)

RLS is enabled on `pharma_programs` with the policy:
- **"Anyone can view active programs"** - Allows public SELECT access where `active = true`

## Search Functionality

The search system uses a multi-tier approach:

1. **Text Search (Primary)** - Fast ILIKE queries on medication names, generic names, manufacturers
2. **Vector Search (Secondary)** - AI-powered semantic search via `pharma-search` edge function
3. **Fallback** - Returns all programs if both fail

## Test Files

Test files with hardcoded credentials (for testing only):
- `test-connection.html` ✓
- `test-search.html` ✓
- `test-search-complete.html` ✓
- `test-search-direct.html` ✓
- `generate-embeddings.html` ✓
- `generate-embeddings-simple.html` ✓
- `generate-embeddings.js` ✓
- `scripts/generate-embeddings-now.ts` ✓

All test files use the correct anon key.

## Status

✅ All configuration files updated with correct credentials
✅ All application code uses environment variables
✅ All edge functions properly configured
✅ Database connection verified
✅ RLS policies in place
✅ Project builds successfully
✅ No old/incorrect keys remaining in production code

## Next Steps

The search functionality is now properly configured and should work correctly. If you still experience issues:

1. Check browser console for detailed error messages
2. Verify network connectivity to Supabase
3. Open `test-connection.html` in a browser to test direct database access
4. Check Supabase dashboard for function logs if edge functions fail
