# Google OAuth Redirect Issue - Setup Required

## Problem
Google OAuth is not redirecting properly because:

1. **Missing Anon Key**: The `.env` file contains `YOUR_ANON_KEY_HERE` instead of the actual anon key
2. **Google OAuth Provider Not Configured**: Google OAuth needs to be enabled in Supabase

## Solution Steps

### 1. Get Your Anon Key

Visit your Supabase project settings:
https://supabase.com/dashboard/project/nuhfqkhplldontxtoxkg/settings/api

Copy the **anon/public** key and update your `.env` file:

```env
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

### 2. Configure Google OAuth Provider

1. Go to: https://supabase.com/dashboard/project/nuhfqkhplldontxtoxkg/auth/providers
2. Click on **Google** provider
3. Enable the provider
4. Add your Google OAuth credentials:
   - **Client ID** from Google Cloud Console
   - **Client Secret** from Google Cloud Console

### 3. Add Redirect URLs

In Supabase Auth settings:
https://supabase.com/dashboard/project/nuhfqkhplldontxtoxkg/auth/url-configuration

Add these redirect URLs:
- `http://localhost:5173/auth/callback` (for local development)
- `https://your-production-domain.com/auth/callback` (for production)

### 4. Google Cloud Console Setup

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID (if you don't have one)
3. Add Authorized JavaScript origins:
   - `http://localhost:5173`
   - `https://your-production-domain.com`
4. Add Authorized redirect URIs:
   - `https://nuhfqkhplldontxtoxkg.supabase.co/auth/v1/callback`

### 5. Test the Setup

After completing the above steps:
1. Restart your dev server
2. Try signing in with Google
3. You should be redirected to Google OAuth consent screen
4. After consent, you'll be redirected back to `/auth/callback`
5. The app will then redirect you to `/dashboard` or `/admin`

## Current Code Flow

The Google OAuth flow is:
1. User clicks "Continue with Google" → `AuthContext.signInWithGoogle()`
2. Redirects to Google → User approves
3. Google redirects to → `${window.location.origin}/auth/callback`
4. `AuthCallback` component → Creates user record if needed
5. Final redirect → `/admin` or `/dashboard` based on admin status

## Note

Without the proper anon key and Google OAuth configuration, the authentication will fail at step 1.
