# Admin Account Access

## Current Admin Accounts

The following accounts have admin privileges:

### 1. admin@diabetic.com
- **Email:** `admin@diabetic.com`
- **Status:** Active Admin
- **Created:** October 26, 2025

### 2. diabetic.admin@gmail.com
- **Email:** `diabetic.admin@gmail.com`
- **Status:** Active Admin
- **Created:** October 26, 2025

## Creating a New Admin Account

To create `pharmadiscountfinder@gmail.com` as an admin:

### Option 1: Sign up and promote to admin
1. Go to the signup page
2. Create account with email: `pharmadiscountfinder@gmail.com`
3. After signup, run this SQL in Supabase SQL Editor:

```sql
UPDATE public.users
SET is_admin = true
WHERE email = 'pharmadiscountfinder@gmail.com';
```

### Option 2: Use existing admin account
1. Log in with one of the existing admin accounts above
2. Go to Admin Dashboard → All Users tab
3. Find the user you want to promote
4. Click "Grant Admin" button

## Accessing Admin Dashboard

1. Log in with an admin account
2. You'll be automatically redirected to `/admin`
3. Access "All Users" tab to manage users

## Troubleshooting

### "Unable to verify admin status" error
This means you're logged in with a non-admin account. Solutions:
- Log out and log in with an admin account
- Or have another admin promote your account

### Can't see users list
Make sure you're logged in with one of the admin accounts listed above.
