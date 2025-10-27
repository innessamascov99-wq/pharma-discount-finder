# Why Database Mapping Is Challenging - Root Cause Analysis

## The Core Problem

You have **TWO separate Supabase projects** that were created at different times, and they're not easily interchangeable. Here's why mapping between them is difficult:

---

## 1. Different Database Schemas

### Project 1: `asqsltuwmqdvayjmwsjs` (Old/Bolt Database)
```sql
-- Users table structure
users (
  id uuid,
  email text,
  -- MISSING: first_name, last_name
  created_at timestamp
)
```

### Project 2: `nuhfqkhplldontxtoxkg` (Current/Frontend Database)
```sql
-- Users table structure
users (
  id uuid,
  email text,
  first_name text,        -- ✅ Has this
  last_name text,         -- ✅ Has this
  phone text,
  date_of_birth date,
  is_admin boolean,
  is_blocked boolean,
  created_at timestamp,
  updated_at timestamp,
  last_login timestamp
)
```

**Issue**: The frontend expects columns that don't exist in the old database.

---

## 2. Separate Authentication Systems

Each Supabase project has its own **independent auth system**:

### Database 1 (asqsltuwmqdvayjmwsjs)
```
auth.users table (managed by Supabase)
├── user: admin@pharma.com
│   └── ID: 72b94537-d5ad-4275-8338-47424f2067ad
├── user: john.smith@email.com
│   └── ID: abc-123-...
```

### Database 2 (nuhfqkhplldontxtoxkg)
```
auth.users table (managed by Supabase)
├── user: admin@pharma.com
│   └── ID: 13a6a599-2cda-441b-9d39-54eabb8c08ad  (DIFFERENT ID!)
├── user: john.smith@email.com
│   └── ID: xyz-789-...  (DIFFERENT ID!)
```

**Critical Issue**: Even though the email is the same (`admin@pharma.com`), the **user IDs are completely different** because they're separate auth systems.

---

## 3. Why User IDs Matter

User IDs are used everywhere as foreign keys:

```sql
-- User activity references user ID
user_activity (
  user_id uuid REFERENCES users(id)
)

-- User programs references user ID
user_programs (
  user_id uuid REFERENCES users(id)
)

-- All data is tied to the user ID
```

**Problem**: If you move a user from Database 1 to Database 2, their ID changes, breaking all relationships.

---

## 4. The Authentication Token Problem

When you login, Supabase generates a JWT token:

```json
{
  "sub": "72b94537-d5ad-4275-8338-47424f2067ad",  // User ID
  "email": "admin@pharma.com",
  "aud": "authenticated",
  "iss": "https://asqsltuwmqdvayjmwsjs.supabase.co/auth/v1"
}
```

**Issue**: The token is **project-specific**. A token from Database 1 won't work with Database 2.

This is why we see:
- Login with `admin@pharma.com` → Returns ID from Database 1
- But frontend expects → ID from Database 2
- Result: **User not found** or **wrong data returned**

---

## 5. PostgREST Schema Cache Issues

PostgREST (Supabase's REST API layer) caches the database schema:

```
┌─────────────────────┐
│   PostgREST Cache   │
├─────────────────────┤
│ Tables:             │
│ - users ✓           │
│ - drugs ✓           │
│ Functions:          │
│ - search_drugs ✓    │
│ - log_activity ❌   │  ← Not in cache yet!
└─────────────────────┘
```

**Problem**:
- Create a new function → PostgREST doesn't know about it immediately
- Can take **minutes to hours** for cache to update
- Frontend gets 404 errors even though function exists
- No manual way to force immediate cache reload on hosted Supabase

---

## 6. Row Level Security Complexity

RLS policies must reference the correct user ID from the current database:

```sql
-- This policy works for Database 2
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- But if auth.uid() returns ID from Database 1,
-- and 'id' is from Database 2 → No match!
```

**Issue**: If authentication happens in one database but queries go to another, RLS policies fail.

---

## 7. Why Simply "Mapping" Doesn't Work

### What You'd Think Would Work:
```typescript
// "Just point to the other database!"
const supabaseUrl = 'https://asqsltuwmqdvayjmwsjs.supabase.co';
```

### Why It Fails:
1. **Schema Mismatch**: Frontend queries for `first_name` → Column doesn't exist
2. **Missing Functions**: Frontend calls `log_user_activity()` → Function doesn't exist
3. **Different User IDs**: Frontend expects user `13a6a599...` → Database has `72b94537...`
4. **Missing RLS Policies**: Old database might not have the same security policies
5. **Missing Data**: Old database doesn't have drugs, programs, or new features

---

## 8. The Real Solution (What We Did)

Instead of "mapping", we **consolidated everything into ONE database**:

### Approach:
```
1. Choose ONE database as the source of truth
   → We chose: nuhfqkhplldontxtoxkg

2. Migrate ALL data to that database
   ✓ Users table with full schema
   ✓ Drugs table
   ✓ Programs table
   ✓ All RLS policies
   ✓ All RPC functions

3. Update ALL environment variables to point there
   ✓ Frontend .env files
   ✓ Hardcoded fallbacks
   ✓ Auth configuration

4. Create new user accounts in the new database
   (Users must re-register or be manually migrated)
```

---

## 9. Why Migration Is Difficult

### User Account Migration Challenges:

**Problem**: You can't easily copy users between Supabase projects because:

1. **Passwords are hashed** - You can't extract them
2. **Auth system is managed** - No direct access to auth.users
3. **User IDs will change** - Breaking all relationships
4. **OAuth connections lost** - Google sign-ins need to be re-authorized

**Options**:
- **Option A**: Users re-register (simplest but loses history)
- **Option B**: Manually recreate accounts with temporary passwords
- **Option C**: Export data, transform IDs, re-import (complex and error-prone)

---

## 10. The Caching Confusion

This is what makes debugging confusing:

```javascript
// In your code:
const url = 'https://nuhfqkhplldontxtoxkg.supabase.co';

// But somehow...
console.log(user.id); // 72b94537... (from WRONG database!)
```

**Why This Happens**:
- Browser cached auth sessions
- Node.js test scripts with old sessions
- Environment variables not updated in all places
- Bolt's hosting environment has different env vars than local

---

## 11. The Bolt Hosting Complication

Your local development vs hosted environment:

### Local Development (.env file)
```bash
VITE_SUPABASE_URL=https://nuhfqkhplldontxtoxkg.supabase.co
```

### Bolt Hosted (bolt.new dashboard)
```bash
# These might be set to different values!
VITE_SUPABASE_URL=https://asqsltuwmqdvayjmwsjs.supabase.co  # ← Old database!
```

**Issue**: Your local app works fine, but hosted app connects to old database.

---

## 12. Summary: Why It's Hard

| Challenge | Why It's Hard | Impact |
|-----------|--------------|---------|
| **Different Schemas** | Tables have different columns | Queries fail with "column not found" |
| **Separate Auth Systems** | Same email, different user IDs | Wrong user data returned |
| **User ID Changes** | Foreign keys break when migrating | All relationships lost |
| **Password Migration** | Hashed passwords can't be copied | Users must re-register |
| **PostgREST Cache** | New functions not visible immediately | 404 errors for hours |
| **RLS Policies** | Must match exact schema | Security blocks legitimate access |
| **Multiple Env Vars** | .env vs hosting environment | Works locally, fails in prod |
| **OAuth Connections** | Tied to specific project | Google sign-in breaks after migration |

---

## The Real Answer

It's not "mapping" that's hard - it's that **you can't truly map between two separate database instances**.

You must choose ONE database and commit to it fully:
1. Migrate all schema (tables, columns, functions)
2. Migrate all data (with ID transformations)
3. Recreate user accounts (users re-register)
4. Update every configuration reference
5. Clear all caches and sessions

**We've successfully configured the app to use ONE database** (`nuhfqkhplldontxtoxkg`), but:
- Old cached sessions might still point to old database
- Hosted environment variables might not be updated
- Users from old database need to re-register

---

## Recommendation

**Stop trying to map between databases**. Instead:

1. **Use ONLY** `nuhfqkhplldontxtoxkg` going forward
2. **Decommission** the old database (`asqsltuwmqdvayjmwsjs`)
3. **Clear all browser cache** to remove old sessions
4. **Update Bolt hosting env vars** to match .env file
5. **Have users re-register** - their old accounts are in the old database

This is cleaner than trying to maintain two databases or migrate between them.
