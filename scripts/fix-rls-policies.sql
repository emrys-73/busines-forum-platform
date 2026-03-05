-- ============================================
-- 1. DROP ALL existing RLS policies on all app tables
-- ============================================

-- Members
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'members'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.members', pol.policyname);
  END LOOP;
END $$;

-- Companies
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'companies'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.companies', pol.policyname);
  END LOOP;
END $$;

-- Company Members
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'company_members'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.company_members', pol.policyname);
  END LOOP;
END $$;

-- Events
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'events'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.events', pol.policyname);
  END LOOP;
END $$;

-- Forum Posts
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'forum_posts'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.forum_posts', pol.policyname);
  END LOOP;
END $$;

-- Forum Replies
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'forum_replies'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.forum_replies', pol.policyname);
  END LOOP;
END $$;

-- ============================================
-- 2. CREATE clean, simple RLS policies
-- ============================================

-- MEMBERS
-- Anyone authenticated can read members
CREATE POLICY "members_select" ON public.members
  FOR SELECT USING (true);

-- Users can update their own record
CREATE POLICY "members_update_own" ON public.members
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own record (signup)
CREATE POLICY "members_insert_own" ON public.members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- COMPANIES
-- Anyone can read companies
CREATE POLICY "companies_select" ON public.companies
  FOR SELECT USING (true);

-- COMPANY_MEMBERS
-- Anyone can read company memberships
CREATE POLICY "company_members_select" ON public.company_members
  FOR SELECT USING (true);

-- EVENTS
-- Anyone can read events
CREATE POLICY "events_select" ON public.events
  FOR SELECT USING (true);

-- FORUM_POSTS
-- Anyone can read posts
CREATE POLICY "forum_posts_select" ON public.forum_posts
  FOR SELECT USING (true);

-- Authenticated users can create posts
CREATE POLICY "forum_posts_insert" ON public.forum_posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Authors can update their own posts
CREATE POLICY "forum_posts_update_own" ON public.forum_posts
  FOR UPDATE USING (auth.uid() = author_id);

-- FORUM_REPLIES
-- Anyone can read replies
CREATE POLICY "forum_replies_select" ON public.forum_replies
  FOR SELECT USING (true);

-- Authenticated users can create replies
CREATE POLICY "forum_replies_insert" ON public.forum_replies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Authors can update their own replies
CREATE POLICY "forum_replies_update_own" ON public.forum_replies
  FOR UPDATE USING (auth.uid() = author_id);

-- ============================================
-- 3. Make sure RLS is enabled on all tables
-- ============================================
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- Done! Verify:
SELECT schemaname, tablename, policyname, cmd, qual FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;
