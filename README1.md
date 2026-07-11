# Sri Portfolio v3 — Full Documentation

## Overview
Personal portfolio for **Sri Aravindan** — AWS DevOps Engineer | AI-Augmented Developer.
Built with Next.js 16 (App Router) + Tailwind CSS v4 + Framer Motion + Novel Editor.
CMS + Blog backend powered by Supabase.

## Live URL
https://sri-portfolio-v3.vercel.app

## Project Structure
```
sri-portfolio/
├── app/
│   ├── page.tsx                    # Home (hero, about, skills, projects — all from Supabase)
│   ├── layout.tsx                  # Root layout (ThemeProvider, Header, Footer, CommandPalette, IntroOverlay)
│   ├── globals.css                 # Design tokens, cyberpunk hover effects, editor styles
│   ├── not-found.tsx               # 404 page
│   ├── work/page.tsx               # Work experience + education (from Supabase)
│   ├── writing/page.tsx            # Articles/external links (from Supabase)
│   ├── contact/page.tsx            # Contact info (from Supabase)
│   ├── projects/[slug]/page.tsx    # Project detail pages (from Supabase)
│   ├── blog/
│   │   ├── page.tsx                # Blog post list (server component, reads published posts)
│   │   ├── [slug]/page.tsx         # Blog reader (server component, renders Novel JSON + author profile)
│   │   ├── [slug]/BlogPostReader.tsx # Client wrapper for Novel EditorContent (read-only)
│   │   ├── [slug]/edit/page.tsx    # Edit post page — loads existing Novel content + cover image
│   │   └── new/page.tsx            # Novel editor for writing posts (with cover image upload)
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard auth guard (email + GitHub OAuth), sign-in/signup form
│   │   ├── page.tsx                # Dashboard landing (post list, edit/delete, quick links, change password)
│   │   ├── content/page.tsx        # Site config editor (admin only: vsriaravindan@gmail.com)
│   │   └── profile/page.tsx        # Profile management — avatar upload, display name, GitHub, bio, handle
│   └── auth/callback/page.tsx      # Email confirmation success/failure page
├── components/
│   ├── Header.tsx                  # Sticky nav with auth-aware links (Dashboard/SignIn), theme toggle, search (⌘K), Blog tab
│   ├── Footer.tsx                  # Footer with social links + CTA
│   ├── HeroSection.tsx             # Mouse parallax hero
│   ├── CommandPalette.tsx          # CMD+K search overlay
│   ├── IntroOverlay.tsx            # 15s first-load splash animation
│   ├── PageTransition.tsx          # Page-to-page veil effects
│   └── ... (ProjectCard, WorkRow, Band, ScrollReveal, etc.)
├── lib/
│   ├── supabase.ts                 # Server-side Supabase client (public reads, persistSession: false)
│   ├── supabase-browser.ts         # Browser REST API wrapper (pure fetch, no GoTrueClient)
│   ├── cms.ts                      # CMS data types + fetch/update helpers
│   ├── posts.ts                    # Blog post CRUD + types
│   ├── constants.ts                # Site config, NAV (has Blog), social links
│   ├── projects.ts                 # Project type + data (now overridden by Supabase)
│   └── work.ts                     # Work experience type + data (now overridden by Supabase)
├── .env.local                      # (gitignored) Supabase URL + anon key
├── seed.sql                        # Initial data SQL for site_content table
├── seed-v2.sql                     # v3.1 migration: profiles table, storage buckets, indexes, triggers
└── .hermes/sri-v3-cms-plan.md      # Original build plan
```

## Supabase

### Project
- URL: https://iuhbtmfdvfuurtkszvar.supabase.co
- Anon Key: (in .env.local and Vercel env vars)

### Tables
1. **site_content** — One row per editable section (site_config, about, skills, projects, work, articles, contact, footer). Content stored as JSONB.
2. **posts** — Blog posts with Novel JSON content, cover image, author_id FK.
3. **profiles** — User profiles linked to auth.users. Avatar, display name, GitHub, bio, blog handle.

### RLS Policies
- `site_content`: Anyone can SELECT. Only `vsriaravindan@gmail.com` can UPDATE/INSERT.
- `posts`: Anyone can read published. Authenticated users can CRUD their own.
- `profiles`: Anyone can SELECT. Users can UPDATE/INSERT their own row.

### Auth
- Email/password authentication with email confirmation
- **GitHub OAuth** — Sign in with GitHub button on dashboard, auto-populates profile
- Custom SMTP: elalastair@gmail.com (Gmail app password)
- Redirect URLs pointing to Vercel

### Storage Buckets
- `avatars` (public) — Profile pictures uploaded from `/dashboard/profile`
- `covers` (public) — Blog post cover images uploaded from `/blog/new` and `/blog/[slug]/edit`

### SMTP Setup
- Host: smtp.gmail.com, Port: 465
- Username: elalastair@gmail.com
- Password: Gmail app password (generated from Google Account → App Passwords)
- Sender name: "Sri Aravindan"

## Key Architecture Decisions

### 1. Pure REST API (No Supabase JS Client for Auth)
The `@supabase/supabase-js` library's GoTrueClient has a bug where `this.storage` is undefined in production builds. `lib/supabase-browser.ts` uses raw `fetch()` calls to Supabase's REST API for all auth and database operations. Token stored in localStorage manually.

### 2. Server vs Browser Client
- `lib/supabase.ts` — Uses `createClient()` for server-side public reads (portfolio pages). `persistSession: false`.
- `lib/supabase-browser.ts` — Exports `api` object with raw fetch methods for all browser-side operations.

### 3. Admin Lock
Only `vsriaravindan@gmail.com` can see the "Site Settings" link and access `/dashboard/content`. Non-admin users see a clean dashboard with blog management only.

### 4. Novel Editor
Blog posts use the Novel rich text editor (TipTap-based). Content stored as JSON. Reader renders via Novel's EditorContent with `editable={false}`.

## Dashboard Features
| Route | Access | Description |
|---|---|---|
| `/dashboard` | All logged-in users | Post list, edit/delete, quick links (New Post, View Blog, Profile, Change Password) |
| `/dashboard/content` | Admin only (`vsriaravindan@gmail.com`) | Edit site config, about, skills, projects, work, articles, contact, footer |
| `/dashboard/profile` | All logged-in users | Avatar upload, display name, GitHub URL, bio, blog handle |
| `/blog/new` | All logged-in users | Novel editor to write and publish posts (with cover image upload) |
| `/blog/[slug]` | All visitors | Blog reader view with author profile card |
| `/blog/[slug]/edit` | Post author only | Edit existing post content, cover image, title, tags |
| `/auth/callback` | All visitors | Email confirmation / GitHub OAuth callback handler |

## Known Issues (Resolved)
- ~~No edit post page yet (only new posts). Users must delete and recreate.~~ ✅ Added at `/blog/[slug]/edit`
- ~~No blog management links inside `/dashboard/posts`~~ ✅ Edit button in dashboard post list
- Novel editor missing some slash command items (blockquote, image upload).
- ~~`lib/cms.ts` is unused (dashboard content page has inline forms).~~

## New Features (v3.1)
### GitHub OAuth Sign-In
- "Sign in with GitHub" button on the sign-in/signup form
- Auto-fetches display name and avatar from GitHub profile
- Profile created automatically via DB trigger on signup

### Profile Management
- `/dashboard/profile` — Edit display name, avatar (upload), GitHub URL, bio, blog handle
- Avatar stored in Supabase Storage (`avatars` bucket)
- Author profile card shown on blog reader page

### Blog Enhancements
- **Edit posts** — `/blog/[slug]/edit` — loads existing Novel content, saves via PATCH
- **Cover images** — Upload/remove cover images on new and edit post pages
- **Author profiles** — Avatar + name + bio displayed on blog reader
- **Home page** — Latest 3 published posts section after Featured Projects

### Bug Fixes
- **Post creation** — Fixed `author_id` missing from insert (RLS was silently blocking)
- **Blog reader** — Converted to server component with anon-key query (was using auth-bound REST API)
- **Input visibility** — Added `site-input` CSS class with visible background + border in dark mode
- **Broken env var** — Fixed truncated `NEXT_PUBLIC_SUPABASE_ANON_KEY` in dashboard delete handler
- **Dashboard posts** — Now scoped to current user's posts only

### Header
- Auth-aware nav — shows "Dashboard" when signed in, "Sign In" when not
- Dashboard button with icon in both desktop and mobile nav

## Setup for GitHub OAuth
1. Run `seed-v2.sql` in Supabase Dashboard → SQL Editor
2. Go to GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
   - Homepage URL: `https://sri-portfolio-v3.vercel.app`
   - Callback URL: `https://iuhbtmfdvfuurtkszvar.supabase.co/auth/v1/callback`
3. Copy Client ID and generate a Client Secret
4. In Supabase Dashboard → Authentication → Providers → GitHub → Enable and paste credentials

## Environment Variables (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://iuhbtmfdvfuurtkszvar.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1aGJ0bWZkdmZ1dXJ0a3N6dmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NzgwNTEsImV4cCI6MjA5OTI1NDA1MX0.anHXCRBktYo4tWRCRAkkE0yQwG_GSujfo8UWvdLedeU
```
