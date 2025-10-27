# Admin Login Setup

## Current Status

✅ **Database is configured correctly**
✅ **Admin users exist in the database**
✅ **RPC function `admin_get_all_users` is working**
✅ **Frontend is updated to use the RPC function**

## Admin Accounts

The following admin accounts exist in the database:

1. **pharma.admin@gmail.com** (ID: 7be70211-c025-426a-9a43-6e592caa9e62)
2. **admin@pharma.com** (ID: 13a6a599-2cda-441b-9d39-54eabb8c08ad)

## Setting Up Admin Login

Since you need to access the admin portal, you have two options:

### Option 1: Reset Password via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/nuhfqkhplldontxtoxkg
2. Navigate to **Authentication** → **Users**
3. Find the user `pharma.admin@gmail.com`
4. Click the three dots menu (⋮) → **Reset Password**
5. Use the temporary password to login
6. You'll be prompted to set a new password

### Option 2: Create New Admin Account

1. Go to the website and sign up with a new email
2. After signing up, use the Supabase SQL Editor to make the user an admin:

```sql
-- Replace 'your-email@example.com' with the email you used
UPDATE users
SET is_admin = true
WHERE email = 'your-email@example.com';
```

3. Log out and log back in to activate admin privileges

### Option 3: Use Supabase CLI (If installed)

If you have Supabase CLI installed locally:

```bash
# Link to your project
supabase link --project-ref nuhfqkhplldontxtoxkg

# Reset admin password
supabase auth users reset-password pharma.admin@gmail.com --new-password "YourNewPassword123!"
```

## Testing Admin Access

Once you can login, verify the admin portal works:

1. **Login**: Use admin credentials at `/login`
2. **Navigate to Admin**: You should be redirected to `/admin` automatically
3. **Check Users Tab**: Click "All Users" - you should see all 10 users
4. **Test Search**: Search for "admin" - should find admin users
5. **Test Pagination**: If there are more than 10 users, pagination should work

## How It Works

The frontend now uses the `admin_get_all_users()` RPC function instead of direct table queries:

```typescript
// Old approach (had RLS issues)
const { data } = await supabase.from('users').select('*');

// New approach (uses SECURITY DEFINER RPC)
const { data } = await supabase.rpc('admin_get_all_users', {
  search_term: searchQuery,
  page_number: page,
  page_size: 20
});
```

The RPC function:
- Checks if the caller is an admin
- Bypasses RLS complexity using SECURITY DEFINER
- Handles pagination and search
- Returns all user data with total count

## Verification

To verify everything is working, check the browser console when viewing the admin users page. You should see:

```
✅ Current session: { email: 'pharma.admin@gmail.com', authenticated: true }
✅ RPC successful. Users: 10, Total: 10
```

## Troubleshooting

### "Invalid login credentials"
- The admin account exists but needs a password reset
- Use Supabase Dashboard to reset the password

### "Access denied. Admin privileges required"
- User is not marked as admin in the users table
- Run: `UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';`

### "Function admin_get_all_users does not exist"
- PostgREST cache hasn't updated yet (can take minutes)
- The migration was successful, just wait a few minutes

### Users list shows only one user (your own)
- RLS is working correctly for non-admin users
- Verify `is_admin = true` in the database for your account

## Summary

The technical issue has been resolved. The users list now uses a dedicated RPC function that properly handles admin access. You just need to set a password for one of the admin accounts to login.
