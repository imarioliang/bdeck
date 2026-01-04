# Supabase Schema Cleanup Steps

This document provides SQL scripts to help clean up and re-apply the schema to your Supabase project, especially useful after encountering errors like "relation does not exist" or schema cache issues.

**Always back up your data before running destructive SQL commands.**

---

### **Step 1: Cleanup Existing Schema (if any conflicts)**

Run this entire block to ensure no old policies or functions interfere.
**Important:** If you have existing data and do not want to lose it, be extremely cautious with `DROP TABLE` commands. For this project, tables like `links`, `todos`, `notes`, `timers` are user-specific and can be cleared if starting fresh.

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can view own links" ON public.links;
DROP POLICY IF EXISTS "Users can insert own links" ON public.links;
DROP POLICY IF EXISTS "Users can update own links" ON public.links;
DROP POLICY IF EXISTS "Users can delete own links" ON public.links;
DROP POLICY IF EXISTS "Users can view own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can insert own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can update own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can delete own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can view own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can insert own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can view own timers" ON public.timers;
DROP POLICY IF EXISTS "Users can insert own timers" ON public.timers;
DROP POLICY IF EXISTS "Users can update own timers" ON public.timers;
DROP POLICY IF EXISTS "Users can delete own timers" ON public.timers;

-- Drop trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop tables (use CASCADE if you are absolutely sure, but be careful with data)
-- For a fresh start, if data is not important:
DROP TABLE IF EXISTS public.links CASCADE;
DROP TABLE IF EXISTS public.todos CASCADE;
DROP TABLE IF EXISTS public.notes CASCADE;
DROP TABLE IF EXISTS public.timers CASCADE;
DROP TABLE IF EXISTS public.user_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- If you have data and only want to update `notes` table (use this if the above DROP TABLEs are too destructive)
-- This assumes the 'notes' table already exists.
-- ALTER TABLE IF EXISTS public.notes DROP CONSTRAINT IF EXISTS notes_pkey;
-- ALTER TABLE IF EXISTS public.notes DROP COLUMN IF EXISTS id;
-- ALTER TABLE IF EXISTS public.notes DROP COLUMN IF EXISTS position;
```

---

### **Step 2: Apply the Complete Schema**

After performing any necessary cleanup, copy the **entire content** of your `supabase/schema.sql` file (the one from your local project) and paste it into the SQL Editor. **Run this entire script as one single execution.**

---

### **Step 3: Verify in Table Editor**

After running the full schema:

1.  Go to the **"Table Editor"** in Supabase.
2.  Check that all tables (`profiles`, `user_settings`, `links`, `todos`, `notes`, `timers`) exist.
3.  For the `notes` table, confirm that `id` (text, not null) and `position` (integer) columns are present.

---

### **Step 4: Redeploy to Netlify**

Once your Supabase schema is verified, trigger another redeploy on Netlify. This will ensure your application code correctly interacts with the updated database structure.
