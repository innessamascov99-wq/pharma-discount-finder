# Quick Search Test Guide

## 🚀 5-Minute Test Plan

Follow these steps to verify search is working:

---

## Step 1: Run Automated Tests (2 minutes)

1. Open `test-search-comprehensive.html` in your browser
2. Click the **"▶️ Run All Tests"** button
3. Wait for tests to complete

**Expected Result**:
```
✅ All 15 tests PASSED
- 5 Database tests
- 10 Search tests
```

If any tests fail, note which ones and check the error messages.

---

## Step 2: Test React App (3 minutes)

1. Open your React app in browser (http://localhost:5173)
2. Open Browser DevTools (F12)
3. Go to **Console** tab

### Check Connection
Look for these logs:
```
🔒 Supabase client locked to: https://nuhfqkhplldontxtoxkg.supabase.co
✅ Supabase connected successfully. Active programs: 39
```

### Test Search #1: Mounjaro
1. Type "Mounjaro" in search box
2. Wait 1 second

**Expected**:
- Shows "1 Program Found"
- Card displays:
  - Medication: Mounjaro
  - Generic: tirzepatide
  - Manufacturer: Eli Lilly
  - Savings: As low as $25 per month

### Test Search #2: Insulin
1. Clear search
2. Type "insulin"
3. Wait 1 second

**Expected**:
- Shows "6 Programs Found"
- Lists: Humalog, Lantus, Novolog, Levemir, Tresiba, Basaglar

### Test Search #3: Humira
1. Clear search
2. Type "Humira"
3. Wait 1 second

**Expected**:
- Shows "1 Program Found"
- Card displays Humira program details

---

## Step 3: Check Network (1 minute)

1. Open Browser DevTools (F12)
2. Go to **Network** tab
3. Type "Mounjaro" in search box
4. Look for request to `search_pharma_programs`

**Expected**:
- Status: `200 OK` (green)
- Response contains result array
- Request completes in < 200ms

---

## ✅ Success Indicators

If you see ALL of these, search is working perfectly:

- ✅ Console shows "Connected - 39 programs"
- ✅ Mounjaro search returns 1 result
- ✅ Insulin search returns 6 results
- ✅ Network tab shows 200 OK
- ✅ No red errors in console
- ✅ Results display in < 1 second

---

## ❌ Failure Indicators

If you see ANY of these, there's an issue:

- ❌ Console error in red text
- ❌ Network request status 400, 401, 403, or 500
- ❌ Search returns 0 results for Mounjaro
- ❌ "Connection failed" message
- ❌ CORS error in console

---

## 🔧 Quick Fixes

### If tests fail:

**Fix 1: Clear Cache**
```javascript
// Paste in browser console and press Enter
localStorage.clear();
location.reload(true);
```

**Fix 2: Check URL**
```javascript
// Paste in browser console and press Enter
console.log(window.location.origin);
// Should show your app URL
```

**Fix 3: Hard Refresh**
- Windows/Linux: Ctrl + Shift + R
- Mac: Cmd + Shift + R

### If still broken:

1. Open `test-fixed-connection.html`
2. Click "1. Test Connection"
3. Click "2. Count Programs" → Should show 39
4. Click "3. Search Mounjaro" → Should show 1 result

If these work but React app doesn't:
- Problem is in React app, not database
- Check browser console for errors

If these don't work:
- Problem is database connection
- Verify Supabase URL in `.env` file

---

## 📊 Test Results Checklist

```
Test Suite:
[ ] Automated tests: 15/15 passed
[ ] Connection logs appear in console
[ ] Mounjaro search works
[ ] Insulin search works
[ ] Humira search works
[ ] Network requests return 200 OK
[ ] No console errors
[ ] Search completes in < 1 second

If all checked: ✅ Search is working perfectly!
If any unchecked: ⚠️ Review failure indicators above
```

---

## 🆘 Still Not Working?

1. **Read detailed analysis**:
   - Open `SEARCH_ANALYSIS_AND_ISSUES.md`

2. **Check configuration**:
   - Open `SUPABASE_CONFIGURATION.md`

3. **Review fixes applied**:
   - Open `SEARCH_FIX_SUMMARY.md`

4. **Test with simulation**:
   - Open `test-react-search-simulation.html`
   - Check detailed console logs

---

**Time Required**: 5 minutes
**Difficulty**: Easy
**Tools Needed**: Web browser, DevTools (F12)
