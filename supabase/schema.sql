DO $$
BEGIN
  -- profiles: select
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((SELECT auth.uid()) = id);$$;
  END IF;

  -- profiles: update
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((SELECT auth.uid()) = id);$$;
  END IF;

  -- profiles: insert
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);$$;
  END IF;

  -- user_settings
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_settings' AND policyname = 'Users can view own settings'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can view own settings" ON public.user_settings FOR SELECT USING ((SELECT auth.uid()) = user_id);$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_settings' AND policyname = 'Users can update own settings'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can update own settings" ON public.user_settings FOR UPDATE USING ((SELECT auth.uid()) = user_id);$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_settings' AND policyname = 'Users can insert own settings'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can insert own settings" ON public.user_settings FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);$$;
  END IF;

  -- links
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'links' AND policyname = 'Users can view own links'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can view own links" ON public.links FOR SELECT USING ((SELECT auth.uid()) = user_id);$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'links' AND policyname = 'Users can insert own links'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can insert own links" ON public.links FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'links' AND policyname = 'Users can update own links'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can update own links" ON public.links FOR UPDATE USING ((SELECT auth.uid()) = user_id);$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'links' AND policyname = 'Users can delete own links'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can delete own links" ON public.links FOR DELETE USING ((SELECT auth.uid()) = user_id);$$;
  END IF;

  -- todos
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'todos' AND policyname = 'Users can view own todos'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can view own todos" ON public.todos FOR SELECT USING ((SELECT auth.uid()) = user_id);$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'todos' AND policyname = 'Users can insert own todos'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can insert own todos" ON public.todos FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'todos' AND policyname = 'Users can update own todos'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can update own todos" ON public.todos FOR UPDATE USING ((SELECT auth.uid()) = user_id);$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'todos' AND policyname = 'Users can delete own todos'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can delete own todos" ON public.todos FOR DELETE USING ((SELECT auth.uid()) = user_id);$$;
  END IF;

  -- notes
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'notes' AND policyname = 'Users can view own notes'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can view own notes" ON public.notes FOR SELECT USING ((SELECT auth.uid()) = user_id);$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'notes' AND policyname = 'Users can insert own notes'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can insert own notes" ON public.notes FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'notes' AND policyname = 'Users can update own notes'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can update own notes" ON public.notes FOR UPDATE USING ((SELECT auth.uid()) = user_id);$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'notes' AND policyname = 'Users can delete own notes'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can delete own notes" ON public.notes FOR DELETE USING ((SELECT auth.uid()) = user_id);$$;
  END IF;

  -- timers
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'timers' AND policyname = 'Users can view own timers'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can view own timers" ON public.timers FOR SELECT USING ((SELECT auth.uid()) = user_id);$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'timers' AND policyname = 'Users can insert own timers'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can insert own timers" ON public.timers FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'timers' AND policyname = 'Users can update own timers'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can update own timers" ON public.timers FOR UPDATE USING ((SELECT auth.uid()) = user_id);$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'timers' AND policyname = 'Users can delete own timers'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can delete own timers" ON public.timers FOR DELETE USING ((SELECT auth.uid()) = user_id);$$;
  END IF;
END
$$;
