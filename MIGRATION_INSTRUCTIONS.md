# Database Migration Instructions

## Migration from Old to New Supabase Project

**Old Database:** https://asqsltuwmqdvayjmwsjs.supabase.co
**New Database:** https://nuhfqkhplldontxtoxkg.supabase.co

---

## ✅ Completed Steps

1. ✓ Exported 10 drugs from old database
2. ✓ Exported 40 programs from old database
3. ✓ Exported 13 drug-program relationships from old database
4. ✓ Updated .env file with new Supabase URL

**Exported Files:**
- `exported-drugs.json`
- `exported-programs.json`
- `exported-drugs-programs.json`

---

## 📋 Next Steps Required

### Step 1: Get Your New Supabase Project API Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `nuhfqkhplldontxtoxkg`
3. Navigate to: **Settings** → **API**
4. Copy the following keys:
   - **Project URL:** `https://nuhfqkhplldontxtoxkg.supabase.co`
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 2: Update Environment File

Edit the `.env` file and replace `YOUR_NEW_ANON_KEY_HERE` with your actual anon key:

```bash
# Database for drugs info
VITE_DRUGS_SUPABASE_URL=https://nuhfqkhplldontxtoxkg.supabase.co
VITE_DRUGS_SUPABASE_ANON_KEY=<your-anon-key-here>

# Database for user authentication
VITE_SUPABASE_URL=https://nuhfqkhplldontxtoxkg.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key-here>
```

### Step 3: Run the Migration Script

Once you've updated the .env file with your new API keys, run:

```bash
node migrate-to-new-db.mjs
```

This will:
- Create the database schema (tables, indexes, RLS policies)
- Import all 10 drugs
- Import all 40 programs
- Import all 13 drug-program relationships
- Set up authentication properly
- Verify the migration

---

## 🔍 What Gets Migrated

### Tables to be Created:
1. **users** - User profiles with authentication
2. **drugs** - 10 pharmaceutical drugs with full details
3. **programs** - 40 discount programs
4. **drugs_programs** - 13 drug-to-program relationships
5. **admin_actions** - Admin audit log

### Data to be Migrated:
- All drug information (medication names, manufacturers, pricing, etc.)
- All program information (eligibility, enrollment, contact details)
- All drug-program relationships
- RLS (Row Level Security) policies
- Search functions and indexes

---

## ⚠️ Important Notes

- Your authentication will be mapped to the new database
- All RLS policies will be recreated for security
- Search functionality will be set up and tested
- The old database will remain unchanged (this is a copy, not a move)

---

## Need Help?

If you encounter any issues, please provide:
1. Your new Supabase anon key
2. Any error messages from the migration script
