# sri-portfolio (sriaravindan.com) — Portfolio Showcase

> **This file is the source of truth for portfolio descriptions.** When updating
> the portfolio's own self-listing under /projects, copy from here.

## One-liner

The portfolio site you're looking at — **sriaravindan.com** — built as a
self-documenting Next.js 16 + Supabase showcase that *is itself* one of the
projects. Includes a live CI/CD dashboard, custom CMS, OTP auth, dashboard,
and blog with Reddit-style threaded comments that update over Supabase
Realtime — no polling.

**Live at:** https://sriaravindan.com/

## What stands out (interview pitch)

1. **Live CI/CD dashboard at `/devops`** — pulls GitHub Actions workflow runs,
   deployment history, and container health in real time. A portfolio that
   shows its own build pipeline is the best proof of competence.
2. **Reddit-style threaded comments on `/blog`** — every post has nested
   replies (parent_id FK with ON DELETE CASCADE), per-comment likes with
   UNIQUE(comment_id, user_id), and **live updates over Supabase Realtime
   (Phoenix Channels)**. Replies nest like Reddit/HN — no reload.
3. **OTP-based auth (no passwords)** — sign-in / sign-up flow uses
   `/api/auth/send-otp` + `/api/auth/verify-otp`. Supabase Auth with custom
   session cookies. No magic-link click-through needed.
4. **Custom CMS at `/dashboard`** — content admin lives inside the app
   (not in a separate admin tool). Editors can edit blog posts in place
   (Tiptap editor), manage site_content JSON, update their profile. RLS
   gates everything by user.
5. **Custom design system** — Tailwind v4 with CSS custom properties,
   design tokens for type scale (display-xxl → caption), mono-label,
   display-head, card-line (with neon-glow hover + lift), dot-grid +
   radial glow project covers. No shadcn/ui / DaisyUI dependency.
6. **Animation polish** — PageTransition, ScrollReveal, ScrollProgressBar,
   IntroOverlay, custom `arrow-nudge` for buttons, framer-motion powered.
7. **Cmd+K command palette** — keyboard-first navigation across all pages.
8. **Self-documenting** — `/projects` lists itself as a project (this entry).

## Tech

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 + Tailwind v4 + custom CSS variables |
| Animations | framer-motion + bespoke components |
| Database | Supabase Postgres (9 tables incl. comments, comment_likes) |
| Auth | Supabase Auth + custom OTP + httpOnly session cookies |
| Realtime | Supabase Realtime (Phoenix Channels) for live comments |
| Editor | Tiptap (rich-text blog posts) |
| Icons | lucide-react |
| Deploy | Docker on Oracle Cloud VPS, Nginx reverse, Let's Encrypt |
| DNS | Cloudflare (DNS-only, SSL at Nginx) |

## Stats

- **21** pages · **3** API routes · **9** DB tables
- **0** magic-link dependency — pure OTP
- **Reddit-style** threaded comments with live update
- **Self-hosted** Docker + Nginx + Let's Encrypt on Oracle Cloud
- **Cmd+K** command palette
- **100%** of design tokens custom (no component library)

## For the portfolio site

- **Slug:** `sri-portfolio`
- **Role:** Full-Stack Developer (self)
- **Description:** The portfolio site you're reading — Next.js 16 + Supabase
  with a live /devops CI/CD dashboard, OTP auth, dashboard CMS, and blog
  with Reddit-style threaded comments that update live over Realtime.
- **Standout:** A self-documenting portfolio — /devops shows the live CI/CD
  pipeline, /blog has Reddit-style threaded comments over Supabase
  Realtime, and /projects lists itself as one of the projects.
- **Live URL:** https://sriaravindan.com/
- **Category:** Web (Next.js)
- **Highlights:**
  - Live /devops dashboard: GitHub Actions + deployments + container health
  - Reddit-style threaded comments (parent_id + likes + Realtime)
  - OTP auth (send-otp + verify-otp) — no passwords, no magic links
  - Custom CMS at /dashboard: blog editor + content + profile
  - Custom design system: tokens, neon-glow card-line, mono-label, display-head
  - 21 pages, 3 API routes, 9 DB tables
  - framer-motion animations + Cmd+K command palette
  - Self-hosted Docker + Nginx + Let's Encrypt on Oracle Cloud VPS

## Repo

Public — `https://github.com/vsriaravindan/sri-portfolio-v3`