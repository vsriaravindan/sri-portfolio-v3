# Sri Portfolio v3

Personal portfolio website for **Sri Aravindan** — AWS DevOps Engineer | AI-Augmented Developer | Cloud Automation Specialist.

Built with Next.js 15 (App Router) + Tailwind CSS v4 + Framer Motion. Full cyberpunk neon aesthetic with pure black dark mode and clean white light mode.

---

## Architecture Overview

```
sri-portfolio-v3/
├── app/                          # Next.js 15 App Router pages
│   ├── globals.css               # Design tokens, component classes, animations
│   ├── layout.tsx                # Root layout — fonts, ThemeProvider, Header/Footer, overlays
│   ├── page.tsx                  # Home page — hero, about, projects, skills
│   ├── not-found.tsx             # 404 page
│   ├── work/page.tsx             # Work experience & education timeline
│   ├── writing/page.tsx          # Articles & community links
│   ├── contact/page.tsx          # Contact info cards + email CTA
│   └── projects/
│       ├── ledgercalc/page.tsx   # Project detail — LedgerCalc
│       └── ecommerce/page.tsx    # Project detail — Sri-Ecommerce
├── components/
│   ├── Header.tsx                # Sticky nav with scroll blur, nav-links with cyberpunk hover
│   ├── Footer.tsx                # Dark ink-panel footer with social links + CTA
│   ├── HeroSection.tsx           # Hero: glow, split name, mouse parallax on letters
│   ├── ProjectCard.tsx           # Project card with hover lift + tech stack tags
│   ├── WorkRow.tsx               # Timeline row with hover accent bar animation
│   ├── Band.tsx                  # Auto-scrolling marquee band with outline/fill rows
│   ├── Pill.tsx                  # Tag/chip component
│   ├── ScrollReveal.tsx          # IntersectionObserver — fade + slide up on scroll
│   ├── CommandPalette.tsx        # CMD+K search overlay — pages + external links
│   ├── IntroOverlay.tsx          # First-load splash: glyph rise animation (4s, once/session)
│   ├── PageTransition.tsx        # Page-to-page veil effect (stagger-wipe / blinds / pixels)
│   └── providers/
│       └── ThemeProvider.tsx     # Dark/light theme context + localStorage
├── lib/
│   ├── constants.ts              # Site config, nav, social links, skills, CTAs
│   ├── projects.ts               # Featured project data
│   └── work.ts                   # Work experience data
└── public/                       # Static assets
```

---

## Key Features

### 1. Intro Splash (First Load)
- **File**: `components/IntroOverlay.tsx`
- Fullscreen overlay on first visit each session
- Letter-by-letter glyph rise animation for "Sri Aravindan"
- Stored in `sessionStorage` key `"kc:intro"` — plays once per session
- Skips if `prefers-reduced-motion` or `navigator.webdriver`
- Duration: 4 seconds
- CSS classes: `.intro-glyph-clip`, `.intro-glyph`, `@keyframes intro-glyph-rise`

### 2. Page Transition Veil (Navigation)
- **File**: `components/PageTransition.tsx`
- Plays between page navigations (not on first load)
- Random effect per session, stored in `sessionStorage("cmd:veil-effect")`:
  - **stagger-wipe** (950ms): 8 vertical accent-colored columns slide up
  - **blinds** (850ms): 12 horizontal strips scale to zero from top
  - **pixels** (750ms): 96 squares fade out with random delays
- After veil: content fades in with `opacity: 0.55 → 1`, `y: 12 → 0` over 450ms

### 3. Mouse Parallax (Hero)
- **File**: `components/HeroSection.tsx`
- `mousemove` listener on the hero section
- Each letter in "Sri Aravindan" shifts independently based on cursor position
- Uses `requestAnimationFrame` for smooth 60fps
- Letters reset on `mouseleave`
- CSS class: `.hero-char`

### 4. Navigation Cyberpunk Hover
- **File**: `components/Header.tsx` + `app/globals.css` (`.nav-link`)
- Glowing underline sweeps from center on hover
- `::before` element for background tint
- `::after` element with `box-shadow` glow
- Active page gets persistent accent color + underline

### 5. Theme Toggle (Dark/Light)
- **File**: `components/providers/ThemeProvider.tsx`
- `data-theme` attribute on `<html>`
- Persisted in `localStorage("theme")`
- Dark: pure black `#000000` + neon green `#00ff41`
- Light: pure white `#ffffff` + green `#00cc33`

### 6. Scroll-Reveal Animations
- **File**: `components/ScrollReveal.tsx`
- Uses `IntersectionObserver` — triggers when 10% of element is visible
- Fades from `opacity: 0` + `translateY(48px)` to visible
- Configurable `delay` per element for staggered reveals

### 7. CMD+K Command Palette
- **File**: `components/CommandPalette.tsx`
- Trigger: `Cmd+K` / `Ctrl+K`
- Search overlay with sections (Pages, Links)
- Keyboard navigation with arrow keys + Enter
- External links open in new tab

### 8. Marquee Band
- **File**: `components/Band.tsx`
- Two rows of auto-scrolling text (fill + outline)
- Words: "automate deploy scale monitor secure build"
- Pauses on hover (`prefers-reduced-motion` respected)

---

## Design System

### CSS Custom Properties (`app/globals.css`)

| Token | Dark Value | Light Value | Usage |
|---|---|---|---|
| `--bg-base` | `#000000` | `#ffffff` | Page background |
| `--bg-surface` | `#0a0a0a` | `#f5f5f5` | Card/surface background |
| `--bg-elevated` | `#111111` | `#ffffff` | Elevated elements (modals) |
| `--border-subtle` | `#1a1a1a` | `#e5e5e5` | Subtle borders |
| `--border-strong` | `#2a2a2a` | `#d4d4d4` | Strong borders |
| `--text-primary` | `#ffffff` | `#0a0a0a` | Main text |
| `--text-secondary` | `#a0a0a0` | `#525252` | Secondary text |
| `--text-muted` | `#666666` | `#a3a3a3` | Muted labels |
| `--accent` | `#00ff41` | `#00cc33` | Primary accent (green) |
| `--accent-hover` | `#00cc33` | `#009926` | Accent hover state |
| `--ink` | `#000000` | `#0a0a0a` | Footer dark panel bg |
| `--paper` | `#ffffff` | `#ffffff` | Footer text |

### Typography
- **Body**: Inter (via `next/font/google`)
- **Mono**: JetBrains Mono (via `next/font/google`)
- Scale: `--type-display-xl` through `--type-body-sm`

### Transitions
- `--dur-fast: 0.14s`
- `--dur-base: 0.26s`
- `--ease-standard: cubic-bezier(0.22, 1, 0.36, 1)`
- `--ease-out-expo: cubic-bezier(0.2, 0.74, 0.2, 1)`

---

## Component Interactions Summary

| Component | Hover Effect | Click Effect | Scroll Effect |
|---|---|---|---|
| Header nav links | Glowing underline sweep + accent color | Navigate to page | Sticky + backdrop blur |
| Hero name letters | Mouse parallax shift (per letter) | — | — |
| Project cards | Lift 3px + border highlight + arrow nudge | Navigate to detail | Reveal on scroll |
| Work rows | Left accent bar scaleY + arrow nudge | — | — |
| Marquee band | Pause animation | — | — |
| Skill tags | Slight scale-up (105%) | — | Reveal staggered |
| Footer links | Accent color + glow shadow + arrow nudge | Open external | — |
| CMD+K palette | Highlight row | Navigate/search | — |
| Theme toggle | Border glow | Switch dark/light | — |

---

## Setup & Running

```bash
# Install dependencies
npm install

# Development
npm run dev        # http://localhost:3000

# Production build
npm run build
npm start
```

---

## Data Files (Edit These to Update Content)

| File | What to Edit |
|---|---|
| `lib/constants.ts` | Site name, tagline, nav items, social links, skills, CTAs |
| `lib/projects.ts` | Featured projects — name, role, description, tech stack, highlights |
| `lib/work.ts` | Work experience entries |
| `app/writing/page.tsx` | Blog/articles listing |
| `app/contact/page.tsx` | Contact information |
| `app/globals.css` | Colors, fonts, animation timings, component styles |

---

## Tech Stack

- **Framework**: Next.js 16.2.10 (App Router)
- **Language**: TypeScript
- **CSS**: Tailwind CSS v4 + Custom Properties
- **Animation**: Framer Motion 11 + CSS @keyframes
- **Icons**: lucide-react
- **Fonts**: Inter, JetBrains Mono (via next/font)
- **Deploy**: Vercel-ready (static export compatible)
