# Frontend Database Access Flow - Complete Documentation

## Overview
The frontend accesses the Supabase database through a well-defined architecture that handles authentication, authorization, and data access through Row Level Security (RLS) policies.

---

## 1. Database Connection Setup

### File: `src/lib/supabase.ts`

This is the **single source of truth** for database connections. It creates two Supabase clients:

```typescript
// Primary client for user authentication and user data
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Secondary client for drugs/programs search (same database)
export const searchSupabase = createClient(drugsSupabaseUrl, drugsSupabaseAnonKey)
```

**Configuration:**
- **URL**: `https://nuhfqkhplldontxtoxkg.supabase.co`
- **Anon Key**: JWT token with role `anon`
- **Schema**: `public`

**Why Two Clients?**
- `supabase`: Manages authentication sessions, handles user profile data
- `searchSupabase`: Optimized for search operations, doesn't persist sessions

---

## 2. Authentication Flow

### File: `src/contexts/AuthContext.tsx`

The `AuthProvider` wraps the entire application and manages authentication state.

### Login Process:
```
1. User enters credentials in Login form
   ↓
2. AuthContext.signIn() called
   ↓
3. supabase.auth.signInWithPassword()
   → Sends credentials to: https://nuhfqkhplldontxtoxkg.supabase.co/auth/v1/token
   ↓
4. Supabase Auth validates credentials against auth.users table
   ↓
5. Returns JWT token + user session
   ↓
6. Token stored in browser localStorage
   ↓
7. Check admin status from public.users table
   ↓
8. User redirected to /dashboard or /admin
```

### What Happens Behind the Scenes:

1. **Supabase Auth Service** validates email/password
2. **JWT Token Generated** containing:
   - `sub`: User ID (UUID)
   - `role`: "authenticated"
   - `email`: User's email
   - `exp`: Token expiration

3. **Token Included in ALL Requests**:
   ```
   Authorization: Bearer <JWT_TOKEN>
   ```

---

## 3. Accessing User Data

### File: `src/services/adminService.ts`

This service handles all user data operations.

### Example: Getting All Users (Admin Portal)

```typescript
export const getAllUsers = async (searchQuery, page, pageSize) => {
  // Step 1: Use the supabase client (has auth token)
  let query = supabase
    .from('users')  // Query public.users table
    .select('*', { count: 'exact' });

  // Step 2: Add search filter
  if (searchQuery) {
    query = query.or(`email.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%`);
  }

  // Step 3: Add pagination
  query = query.range(from, to);

  // Step 4: Execute query
  const { data, error, count } = await query;

  return { users: data, total: count };
}
```

### What Happens When This Runs:

```
1. Frontend calls getAllUsers()
   ↓
2. Supabase client builds HTTP request:
   GET https://nuhfqkhplldontxtoxkg.supabase.co/rest/v1/users?select=*
   Headers:
     - Authorization: Bearer <JWT_TOKEN>
     - apikey: <ANON_KEY>
   ↓
3. Request hits PostgREST API (Supabase's REST layer)
   ↓
4. PostgREST extracts auth.uid() from JWT token
   ↓
5. RLS Policies evaluated (see next section)
   ↓
6. Query executed if allowed
   ↓
7. Results returned to frontend
```

---

## 4. Row Level Security (RLS) Policies

RLS policies determine WHO can see WHAT data. They run **on the database server**, not in the frontend.

### Users Table RLS Policies:

#### Policy 1: SELECT - "Users can view own profile or admins view all"
```sql
-- Regular users can only see their own profile
(auth.uid() = users.id)

OR

-- Admins can see all users
(EXISTS (
  SELECT 1 FROM users admin_check
  WHERE admin_check.id = auth.uid()
  AND admin_check.is_admin = true
))
```

**How it works:**
1. User makes request: `SELECT * FROM users`
2. PostgreSQL automatically adds WHERE clause based on policy
3. For regular user: `WHERE id = auth.uid()`
4. For admin: No filter (sees all users)

#### Policy 2: INSERT - "Users can create own profile"
```sql
-- User can only create their own profile
auth.uid() = users.id
```

#### Policy 3: UPDATE - "Users can update own profile"
```sql
-- User can only update their own record
auth.uid() = users.id
```

#### Policy 4: UPDATE - "Admins can update user admin status"
```sql
-- Only admins can change admin flags
is_admin() = true
```

### How Frontend Leverages RLS:

The frontend **doesn't need to check permissions** - the database does it automatically!

**Example:**
```typescript
// Regular user tries to query all users
const { data } = await supabase.from('users').select('*');
// Result: Only returns their own user record (RLS filters it)

// Admin tries to query all users
const { data } = await supabase.from('users').select('*');
// Result: Returns ALL user records (RLS allows it)
```

---

## 5. Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. User Component (e.g., AdminAllUsers.tsx)                │
│     ↓                                                         │
│  2. Calls adminService.getAllUsers()                         │
│     ↓                                                         │
│  3. Service uses supabase client from lib/supabase.ts       │
│     ↓                                                         │
│  4. Builds query: supabase.from('users').select('*')        │
│                                                               │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP Request
                            │ Authorization: Bearer JWT_TOKEN
                            │ apikey: ANON_KEY
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE (https://nuhfqkhplldontxtoxkg...)     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  5. PostgREST receives request                               │
│     ↓                                                         │
│  6. Validates JWT token                                      │
│     ↓                                                         │
│  7. Extracts auth.uid() from token                          │
│     ↓                                                         │
│  8. Forwards query to PostgreSQL                             │
│                                                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  9. PostgreSQL receives: SELECT * FROM public.users          │
│     ↓                                                         │
│  10. Checks RLS policies for 'users' table                  │
│     ↓                                                         │
│  11. Evaluates policy conditions:                            │
│      - Is auth.uid() = users.id? (regular user)             │
│      - OR is user an admin? (admin access)                  │
│     ↓                                                         │
│  12. Applies automatic WHERE filter based on policy         │
│     ↓                                                         │
│  13. Executes filtered query                                 │
│     ↓                                                         │
│  14. Returns results                                         │
│                                                               │
└───────────────────────────┬─────────────────────────────────┘
                            │ JSON Response
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  15. Receives data array                                     │
│     ↓                                                         │
│  16. Updates React state                                     │
│     ↓                                                         │
│  17. Re-renders UI with user data                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Key Security Features

### JWT Token Authentication
- Every request includes the user's JWT token
- Token contains user ID and role
- Token is validated on every request
- Expired tokens are automatically refreshed

### Row Level Security (RLS)
- **Database-enforced** - cannot be bypassed by frontend
- Policies run before any query executes
- Uses `auth.uid()` to identify current user
- Admins identified via `is_admin` flag in database

### Anonymous Key (Anon Key)
- Public key that allows unauthenticated access
- Used for public data (drugs, programs search)
- Cannot be used to escalate privileges
- RLS still applies even with anon key

---

## 7. Data Access Patterns

### Pattern 1: Public Data (No Auth Required)
```typescript
// Anyone can search drugs
const { data } = await searchSupabase
  .from('drugs')
  .select('*')
  .eq('active', true);

// RLS Policy: Allow anonymous SELECT on active drugs
```

### Pattern 2: User's Own Data (Auth Required)
```typescript
// User viewing their own profile
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', user.id)
  .single();

// RLS Policy: auth.uid() = users.id ✅
```

### Pattern 3: Admin Data (Auth + Admin Required)
```typescript
// Admin viewing all users
const { data } = await supabase
  .from('users')
  .select('*');

// RLS Policy: User is_admin = true ✅
// Regular user gets filtered to only their record
// Admin gets all records
```

### Pattern 4: RPC Functions (Server-side Logic)
```typescript
// Call database function to update user status
await supabase.rpc('toggle_user_blocked', {
  target_user_id: userId,
  block_status: true
});

// RPC function checks if caller is admin before executing
```

---

## 8. Common Tables and Their Access

| Table | Who Can Read | Who Can Write | Use Case |
|-------|-------------|---------------|----------|
| `auth.users` | Supabase Auth only | Supabase Auth only | Authentication credentials |
| `public.users` | Own record or admin | Own record or admin | User profiles |
| `public.drugs` | Everyone (anon) | Admin only | Drug database |
| `public.programs` | Everyone (anon) | Admin only | Assistance programs |
| `public.user_activity` | Own records or admin | Own records | Activity tracking |
| `public.user_programs` | Own records or admin | Own records | User enrollments |

---

## 9. Why This Architecture is Secure

1. **Server-side Validation**: RLS policies run on the database server, not the client
2. **Cannot Be Bypassed**: Frontend code cannot manipulate RLS policies
3. **Token-based**: Every request requires valid JWT token
4. **Automatic Filtering**: Database automatically filters results based on user
5. **Principle of Least Privilege**: Users only see what they need to see
6. **Admin Verification**: Admin status stored in database, not in frontend state

---

## 10. Troubleshooting Guide

### Issue: "Column does not exist"
**Cause**: Connected to wrong database or schema cache not updated
**Fix**: Verify VITE_SUPABASE_URL in .env matches correct database

### Issue: "JWT expired"
**Cause**: Token expired after 1 hour
**Fix**: Supabase client automatically refreshes tokens

### Issue: "Row level security policy violation"
**Cause**: User trying to access data they don't have permission for
**Fix**: Check RLS policies and user's is_admin status

### Issue: "Function not found"
**Cause**: PostgREST schema cache not updated
**Fix**: Wait for cache to update (can take minutes to hours)

---

## Summary

The frontend accesses user data through:
1. **Supabase Client** - Handles HTTP requests with authentication
2. **JWT Tokens** - Proves user identity on every request
3. **PostgREST API** - Converts HTTP to SQL queries
4. **RLS Policies** - Enforces permissions at database level
5. **PostgreSQL** - Stores and filters data based on policies

This architecture ensures that **security is enforced by the database**, not the frontend, making it impossible for users to bypass access controls.
