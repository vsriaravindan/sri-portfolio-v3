# Sri Portfolio v3 — CMS + Blog Build Plan

## Goal
Make portfolio content fully editable from a dashboard + add a Novel-powered blog.
You edit everything yourself — no need to ask me for text changes.

---

## Phases

### Phase 1 — YOUR PART: Supabase Setup (5 min)
1. Go to https://supabase.com → create account (if not done)
2. Create a new project (free tier, choose a region close to India)
3. In SQL Editor, run the schema SQL below
4. Go to Project Settings → API → copy `Project URL` + `anon public key`
5. Give me those two values — I wire them in

### Phase 2 — MY PART: Install deps
- novel, @supabase/supabase-js, @supabase/ssr
- lucide-react (already installed)

### Phase 3 — MY PART: lib files
- `lib/supabase.ts` — server + browser Supabase clients
- `lib/cms.ts` — fetch/update site_content table
- `lib/posts.ts` — CRUD for blog posts

### Phase 4 — MY PART: Seed data
- Insert your current portfolio content (about, skills, projects, work, articles, contact) into site_content table

### Phase 5 — MY PART: Convert portfolio pages
- home page → fetch about, skills, projects from Supabase
- work page → fetch work data from Supabase
- writing page → fetch articles from Supabase
- contact page → fetch contact info from Supabase
- Fallback: keep hardcoded defaults in case Supabase isn't connected yet

### Phase 6 — MY PART: Dashboard CMS
- `/dashboard/content` page with form sections for every portfolio section
- Site Config, About, Skills, Projects, Work, Articles, Contact

### Phase 7 — MY PART: Blog with Novel
- `/blog` — post list
- `/blog/[slug]` — reader view
- `/blog/new` — Novel editor
- `/blog/edit/[id]` — edit existing post

### Phase 8 — MY PART: Auth + Nav
- Login gate for dashboard
- Header nav links updated

---

## Supabase Schema SQL (Run this in Supabase SQL Editor)

```sql
-- PORTFOLIO CMS: one row per editable section
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "content_select_all" ON site_content
  FOR SELECT USING (true);

-- Only authenticated users can update
CREATE POLICY "content_update_auth" ON site_content
  FOR UPDATE USING (auth.role() = 'authenticated');

-- BLOG POSTS
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  excerpt TEXT,
  cover_url TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  read_time INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts
CREATE POLICY "posts_select_published" ON posts
  FOR SELECT USING (published = true OR auth.uid() = author_id);

-- Authenticated users can create posts
CREATE POLICY "posts_insert_auth" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Authors can update/delete own posts
CREATE POLICY "posts_update_own" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "posts_delete_own" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- STORAGE: covers bucket
-- Create bucket 'covers' in Supabase Storage dashboard (public)
-- Bucket policy: INSERT for authenticated only
```

---

## site_content Seed Data

Each row in site_content stores one section as JSONB.
I'll generate this seed SQL after you give me the Supabase project — it'll insert all your current data so the site works immediately.
