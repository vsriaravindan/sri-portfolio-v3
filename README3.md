# Sri Portfolio v3 — Session 3 Changes (v3.2)

## Overview
Features and fixes implemented in the July 11 session. Builds on v3.1 (GitHub OAuth, profile management, edit posts, cover images).

## Live URL
https://sri-portfolio-v3.vercel.app

## New Features

### 1. Blog Posts — Likes + Comments
- **Likes** — Any visitor (no login needed) can heart/like a post. Tracked per browser via localStorage + server-side visitor UUID.
- **Comments** — Only logged-in users can comment. Shows author avatar + name + delete button for own comments.
- **SQL required:** `add-comments-likes.sql` — creates `comments` table, `likes` table, `likes_count` column on posts, and RPC functions `like_post` / `unlike_post` (SECURITY DEFINER, bypass RLS).

### 2. Universal Search (⌘K / Ctrl+K)
Command palette now fetches all published blog posts from Supabase when opened. Search any post title from anywhere on the site.
- **File:** `components/CommandPalette.tsx`

### 3. Author Profile on Blog Posts
- Blog list page (`/blog`) shows author avatar + display name next to each post.
- Blog reader page (`/blog/[slug]`) shows author profile card with avatar, name, and bio.
- GitHub avatar auto-populates on login via dashboard layout.

### 4. Admin Dashboard — All Posts Visible
- Admin (`vsriaravindan@gmail.com`) sees ALL posts from every user in the dashboard.
- Admin can delete any user's post (requires RLS update — `admin-delete-policy.sql`).
- Non-admin users see only their own posts.

### 5. Scroll-to-Top
- Every navigation scrolls to top of page automatically.
- Floating back-to-top button (green neon, bottom-right) appears after scrolling 400px.
- **File:** `components/ScrollToTop.tsx`

### 6. 15 Blog Posts Written
Batch-inserted via Supabase REST API. All on AWS/DevOps topics, 600-900 words each, proper TipTap JSON formatting, published immediately.

## Fixes

### Auth Callback
- `/auth/callback` no longer shows false "Verification Failed" on GitHub OAuth. Checks localStorage for existing token as fallback.

### Nav Bar
- All nav links (Home, Work, Writing, Blog, Contact, Sign In) are now **bold** (font-weight: 600) with `cursor: pointer`.
- Hamburger menu hidden on desktop ≥1024px via dedicated CSS class.

### Sign-In Page Text
- "Or continue with" and "Don't have an account? Sign up" changed from grey (`--text-muted`) to **white** (`--text-primary`).
- Sign-up toggle has `cursor: pointer`.

### Dark Mode Text Colors
- `--text-secondary`: `#c8c8c8` → `#f0f0f0`
- `--text-muted`: `#666666` → `#d0d0d0`
Everything is brighter against the black background.

### Hero Section
- Removed mouse parallax (lag on mobile).
- One-shot staggered letter reveal (slide up + fade, runs once on load).
- Static subtle glow after reveal (no continuous animation).
- Desktop hover glow preserved.

### Profile Save (RLS Fix)
- Created `upsert_my_profile` RPC function (SECURITY DEFINER, bypasses RLS) for profile inserts/updates.
- Profiles table needs `GRANT SELECT ON profiles TO anon, authenticated` for public reads.

### Blog Page Caching
- `/blog` now uses `force-dynamic` so newly published posts appear immediately on page load.

## SQL Files Created

| File | Purpose | Status |
|---|---|---|
| `admin-delete-policy.sql` | Allow admin to delete any post | Needs user to run |
| `add-comments-likes.sql` | Comments + likes tables + RPC functions | ✅ Run by user |
| `fix-profiles-rls.sql` | Profiles RLS policies (DROP/CREATE) | ❌ Syntax failed |
| `fix-profiles-rpc.sql` | `upsert_my_profile` SECURITY DEFINER function | ✅ Run by user |
| `fix-profiles-final.sql` | Profiles RLS + GRANT SELECT to anon | Needs user to run |

## Project Structure (Updated)
```
sri-portfolio/
├── app/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   ├── page.tsx              # Blog reader (server) — author card, likes, comments
│   │   │   ├── BlogPostReader.tsx    # Novel reader
│   │   │   └── BlogActions.tsx       # Like button + comment form (client)
│   ├── dashboard/
│   │   ├── layout.tsx                # Auth guard + GitHub auto-profile populate
│   │   └── profile/page.tsx          # Profile save via RPC function
├── components/
│   ├── CommandPalette.tsx            # Universal search (incl. blog posts)
│   ├── ScrollToTop.tsx               # Auto scroll + floating top button
│   └── HeroSection.tsx               # Staggered reveal (no parallax)
├── add-comments-likes.sql            # Comments + likes schema
├── admin-delete-policy.sql           # Admin delete RLS update
├── fix-profiles-rls.sql              # Profiles RLS policies
├── fix-profiles-rpc.sql              # upsert_my_profile function
└── fix-profiles-final.sql            # Profiles RLS + GRANT SELECT
```

## Environment Variables (Unchanged)
```
NEXT_PUBLIC_SUPABASE_URL=https://iuhbtmfdvfuurtkszvar.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...edeU
```
