# Database Setup Instructions

Your database tables haven't been created yet. Follow these simple steps:

---

## Step 1: Create the Tables

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/nuhfqkhplldontxtoxkg/sql/new

2. **Copy the SQL file:**
   - Open the file: `RUN_THIS_IN_SUPABASE_SQL_EDITOR.sql`
   - Select ALL text (Ctrl+A or Cmd+A)
   - Copy it (Ctrl+C or Cmd+C)

3. **Run the SQL:**
   - Paste into the SQL Editor
   - Click the "RUN" button (or press Ctrl+Enter)
   - Wait for "Success" message

4. **Verify tables were created:**
   - Click "Table Editor" in left sidebar
   - Make sure schema is set to "public"
   - You should now see these tables:
     - drugs
     - programs
     - drugs_programs
     - users
     - admin_actions

---

## Step 2: Import the Data

1. **Open the import tool:**
   - Open file: `import-all-data-now.html` in your browser
   - (Just double-click the file)

2. **Click the button:**
   - Click "Check Tables & Import Data"
   - Wait for completion message

3. **Verify data was imported:**
   - Go back to Supabase Table Editor
   - Click on "drugs" table
   - You should see 50 drugs
   - Click on "programs" table
   - You should see 50 programs

---

## Done!

After completing these steps:
- Your database will have all tables
- All drug and program data will be imported
- Your app will work correctly

---

## Troubleshooting

**If you see errors in Step 1:**
- Make sure you copied the ENTIRE SQL file
- Make sure you're in the correct project: nuhfqkhplldontxtoxkg

**If Step 2 shows table errors:**
- Go back to Step 1 and run the SQL again
- Make sure the SQL completed successfully

**If you need help:**
- Take a screenshot of any error messages
- Share them with me
