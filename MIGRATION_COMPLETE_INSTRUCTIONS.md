# Database Migration Instructions - FINAL STEPS

## ✅ What's Been Completed

1. **Data Export** ✓
   - Exported 10 drugs from old database
   - Exported 40 programs from old database
   - Exported 13 drug-program relationships
   - Files saved: `exported-drugs.json`, `exported-programs.json`, `exported-drugs-programs.json`

2. **Configuration Updates** ✓
   - Updated `.env` file with new Supabase URL: `https://nuhfqkhplldontxtoxkg.supabase.co`
   - Updated `src/lib/supabase.ts` with new credentials
   - Both authentication and drugs databases now point to the same project

3. **Migration Scripts Created** ✓
   - SQL schema script ready: `RUN_THIS_IN_SUPABASE_SQL_EDITOR.sql`
   - Data import script ready: `import-data-simple.mjs`

---

## 🚀 Next Steps (IMPORTANT - DO THESE IN ORDER!)

### Step 1: Run the SQL Script in Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **nuhfqkhplldontxtoxkg**
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Open the file: `RUN_THIS_IN_SUPABASE_SQL_EDITOR.sql`
6. Copy ALL the contents (it's a complete schema + policies + functions)
7. Paste into the SQL Editor
8. Click **Run** button (bottom right)
9. Wait for success message (should take 5-10 seconds)

**This script creates:**
- All 5 tables (users, drugs, programs, drugs_programs, admin_actions)
- All RLS policies for security
- All indexes for performance
- Search functions
- Triggers for automatic user profile creation
- Forces PostgREST to reload its schema cache

### Step 2: Import the Data

After the SQL script completes successfully, run this command in your terminal:

```bash
node import-data-simple.mjs
```

This will:
- Import all 40 programs
- Import all 10 drugs
- Import all 13 drug-program relationships
- Verify the import
- Show you the final counts

**Expected output:**
```
✅ Import completed successfully!

📊 Final counts:
   - Drugs: 10
   - Programs: 40
   - Relationships: 13

🎉 Your database is ready at: https://nuhfqkhplldontxtoxkg.supabase.co
```

### Step 3: Test Your Application

```bash
npm run dev
```

Your application should now:
- Use the new Supabase database for everything
- Have all drugs and programs available
- Support authentication (email/password and Google OAuth)
- Have search functionality working

---

## 📊 What Was Migrated

### From Old Database (asqsltuwmqdvayjmwsjs)
- ✓ 10 drugs with full details
- ✓ 40 discount programs
- ✓ 13 drug-program relationships

### To New Database (nuhfqkhplldontxtoxkg)
- ✓ Complete schema with RLS security
- ✓ All data (pending Step 2 above)
- ✓ Search functions
- ✓ Authentication triggers
- ✓ Admin management system

---

## 🔐 Security Features

All tables have Row Level Security (RLS) enabled:

- **Users**: Can only view/edit their own profile (admins can see all)
- **Drugs**: Public read access, admin-only write
- **Programs**: Public read access, admin-only write
- **Drug-Program relationships**: Public read access, admin-only write
- **Admin Actions**: Admin-only access for audit logging

---

## 🔍 Verification Commands

After completing Steps 1 and 2, you can verify:

```bash
# Check database connection
node check-new-db.mjs

# Expected output:
# ✓ users: 0 rows
# ✓ drugs: 10 rows
# ✓ programs: 40 rows
# ✓ drugs_programs: 13 rows
# ✓ admin_actions: 0 rows
```

---

## ⚠️ Important Notes

1. **Old Database**: The old database at `asqsltuwmqdvayjmwsjs` is unchanged. This is a copy migration, not a move.

2. **Authentication**: You'll need to:
   - Set up Google OAuth in the new Supabase project if you want that feature
   - Users will need to re-register (the old auth database is not migrated)

3. **Environment Variables**: Make sure your `.env` file is correct:
   ```
   VITE_SUPABASE_URL=https://nuhfqkhplldontxtoxkg.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Build Before Deploy**: Always run `npm run build` before deploying to production.

---

## 🆘 Troubleshooting

### If Step 2 fails with "table not found in schema cache":
- Wait 30 seconds and try again (PostgREST needs time to reload)
- Or go back to Step 1 and re-run the SQL script

### If search doesn't work:
- The `search_drugs` function should be created by the SQL script
- Check it exists in: Dashboard → Database → Functions

### If authentication doesn't work:
- Configure Google OAuth in: Dashboard → Authentication → Providers
- Add your site URL in: Dashboard → Authentication → URL Configuration

---

## 📁 Files Reference

- `RUN_THIS_IN_SUPABASE_SQL_EDITOR.sql` - Complete schema setup
- `import-data-simple.mjs` - Data import script
- `check-new-db.mjs` - Verification script
- `exported-drugs.json` - Drug data backup
- `exported-programs.json` - Program data backup
- `exported-drugs-programs.json` - Relationship data backup

---

## ✅ Success Checklist

- [ ] Step 1: SQL script run successfully in Supabase Dashboard
- [ ] Step 2: Data imported successfully (40 programs, 10 drugs, 13 relationships)
- [ ] Step 3: Application runs and shows data
- [ ] Search functionality works
- [ ] Can create new user accounts
- [ ] Build completes: `npm run build`

---

Once you complete Steps 1 and 2 above, your migration will be complete and your application will be fully functional on the new database! 🎉
