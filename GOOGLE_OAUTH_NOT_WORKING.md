# Why Google OAuth is Not Working

## Current Status
Google OAuth is **NOT configured** in your Supabase project. The code is ready, but the provider needs to be set up in Supabase.

## What's Missing

### 1. Google OAuth Provider Not Enabled in Supabase
You must enable and configure the Google provider in Supabase:

**Steps:**
1. Go to: https://supabase.com/dashboard/project/nuhfqkhplldontxtoxkg/auth/providers
2. Find **Google** in the list of providers
3. Click to expand Google settings
4. Toggle **Enable Sign in with Google**

### 2. Google Cloud Console Credentials Required
Before enabling in Supabase, you need Google OAuth credentials:

**Steps:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Create a new OAuth 2.0 Client ID (or use existing)
3. Set **Application type** to "Web application"
4. Add **Authorized JavaScript origins:**
   - `http://localhost:5173` (for local dev)
   - `https://your-production-domain.com` (for production)
5. Add **Authorized redirect URIs:**
   - `https://nuhfqkhplldontxtoxkg.supabase.co/auth/v1/callback`
6. Copy the **Client ID** and **Client Secret**

### 3. Configure in Supabase
After getting Google credentials:

1. Go back to: https://supabase.com/dashboard/project/nuhfqkhplldontxtoxkg/auth/providers
2. Click on Google provider
3. Enter your **Client ID**
4. Enter your **Client Secret**
5. Click **Save**

### 4. Add Redirect URLs in Supabase
Configure allowed redirect URLs:

1. Go to: https://supabase.com/dashboard/project/nuhfqkhplldontxtoxkg/auth/url-configuration
2. Add these Site URLs:
   - `http://localhost:5173` (for local dev)
   - `https://your-production-domain.com` (for production)
3. Add these Redirect URLs:
   - `http://localhost:5173/auth/callback`
   - `https://your-production-domain.com/auth/callback`

## Current Code Status

The frontend code is **already implemented** and ready:
- `AuthContext.tsx` has `signInWithGoogle()` function
- Redirects to `/auth/callback` after OAuth
- `AuthCallback.tsx` handles the OAuth callback
- Creates user records automatically

## Error You're Seeing

Without Google OAuth configured, you'll see errors like:
- "Provider is not enabled"
- "Not configured"
- "Authentication error: Unable to sign in with Google"

## After Setup

Once Google OAuth is configured:
1. Restart your dev server (if running)
2. Click "Continue with Google" on login page
3. You'll be redirected to Google's consent screen
4. After approval, redirected back to your app
5. User record created automatically in `public.users` table
6. Logged in and redirected to dashboard or admin panel

## Quick Test

To test if Google OAuth is working:
1. Complete all setup steps above
2. Go to login page
3. Click "Continue with Google"
4. Should redirect to Google (not show an error)
