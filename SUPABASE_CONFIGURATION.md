# Supabase Configuration - LOCKED

## ⚠️ IMPORTANT: DO NOT CHANGE DATABASE URL

This project is **permanently locked** to the following Supabase project:

```
Project URL: https://nuhfqkhplldontxtoxkg.supabase.co
Project Ref: nuhfqkhplldontxtoxkg
```

**All database migrations, tables, and pharmaceutical program data (39 programs) are stored in this project.**

---

## 🔒 Configuration Lock Mechanisms

### 1. Hardcoded in `src/lib/supabase.ts`
The Supabase client is **hardcoded** to always use the correct project URL, regardless of environment variables. This prevents accidental configuration changes.

```typescript
const CORRECT_SUPABASE_URL = 'https://nuhfqkhplldontxtoxkg.supabase.co';
const CORRECT_ANON_KEY = 'eyJhbGciOiJ...'; // Full key in file
```

### 2. `.env` and `.env.local` Files
Both files contain the correct configuration:

```env
VITE_SUPABASE_URL=https://nuhfqkhplldontxtoxkg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Note:** `.env.local` takes priority over `.env` in Vite projects.

### 3. Automatic Verification Script
The `scripts/verify-db-config.ts` script runs before every build (`prebuild` hook) and:
- Checks if `.env` and `.env.local` have correct URLs
- Automatically fixes incorrect URLs
- Creates `.env.local` if it doesn't exist
- Verifies `src/lib/supabase.ts` configuration

---

## 🧹 Automatic Cache Cleanup

The Supabase client automatically clears cached credentials from old/incorrect projects:

**Old project cleared:** `asqsltuwmqdvayjmwsjs`

When the app loads, it:
1. Removes old auth tokens from localStorage
2. Clears any cached data from incorrect projects
3. Ensures fresh authentication with the correct project

You'll see console messages like:
```
🔒 Supabase client locked to: https://nuhfqkhplldontxtoxkg.supabase.co
🧹 Clearing old cached credentials for: asqsltuwmqdvayjmwsjs
✅ Cleared X old cached items
```

---

## 📊 Database Contents

The correct Supabase project contains:

### Tables
- `pharma_programs` - 39 active pharmaceutical discount programs
- `user_profiles` - User profile data
- `user_activity` - User interaction tracking
- `saved_programs` - User saved programs
- `contact_submissions` - Contact form submissions

### Search Function
- `search_pharma_programs(query, limit)` - Optimized RPC function with relevance scoring

### Programs Include
- **Diabetes:** Mounjaro, Ozempic, Trulicity, Jardiance, Januvia, Victoza, Farxiga, Rybelsus
- **Cardiovascular:** Eliquis, Xarelto, Entresto, Repatha, Praluent
- **Respiratory:** Symbicort, Trelegy Ellipta, Spiriva, Advair Diskus
- **Immunology:** Humira, Enbrel, Stelara, Cosentyx, Otezla, Rinvoq
- **Oncology:** Ibrance, Keytruda, Imbruvica
- **Neurology:** Gilenya, Tecfidera, Ocrevus
- **Dermatology:** Dupixent, Taltz, Tremfya, Skyrizi
- **Insulin:** Humalog, Lantus, Novolog, Levemir, Tresiba, Basaglar

---

## 🚫 What NOT To Do

**NEVER:**
1. Change the Supabase URL in `.env`, `.env.local`, or `src/lib/supabase.ts`
2. Create migrations in a different Supabase project
3. Point the app to any project other than `nuhfqkhplldontxtoxkg`
4. Delete the `.env.local` file (it will be auto-created with correct values)

**IF** you accidentally change the configuration:
- Run `npm run build` - the prebuild script will auto-fix it
- Or manually restore the correct URL shown at the top of this document

---

## ✅ Verification

To verify everything is configured correctly:

1. **Check Console Logs** (when app loads in browser):
   ```
   🔒 Supabase client locked to: https://nuhfqkhplldontxtoxkg.supabase.co
   ✅ Supabase connected successfully. Active programs: 39
   ```

2. **Run Build**:
   ```bash
   npm run build
   ```
   Should show:
   ```
   ✓ .env: Configuration is correct
   ✓ .env.local: Override file exists with correct configuration
   ✓ src/lib/supabase.ts: Using environment variables correctly
   ```

3. **Test Search**:
   - Open `test-fixed-connection.html` in browser
   - Click "Test Connection" - should succeed
   - Click "Count Programs" - should show 39
   - Search for medications - should return results

---

## 🔧 Troubleshooting

### Search Returns No Results
**Cause:** App connecting to wrong Supabase project
**Fix:**
1. Check browser console for the URL being used
2. Clear browser localStorage: `localStorage.clear()` in console
3. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. Rebuild: `npm run build`

### "Table not found" Error
**Cause:** Connecting to project without migrations
**Fix:** Verify you're using `nuhfqkhplldontxtoxkg` - see Verification section above

### Environment Variable Changes Not Taking Effect
**Cause:** `.env.local` overrides `.env`, or hardcoded values take precedence
**Solution:** This is **intentional** to prevent accidental changes. The hardcoded values ensure stability.

---

## 📝 Summary

This configuration is **locked and self-healing**:
- ✅ Hardcoded correct URL in source code
- ✅ Auto-fixes environment files before build
- ✅ Auto-clears old cached credentials
- ✅ Verifies connection on app load
- ✅ Protected by .gitignore (won't commit credentials)

**Bottom line:** The app will always connect to the correct database, no matter what.
