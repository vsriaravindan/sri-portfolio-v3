export type Project = {
  slug: string;
  name: string;
  role: string;
  description: string;
  details: string;
  techStack: string[];
  repo: string;
  liveUrl?: string;
  featured: boolean;
  highlights: string[];
  standout: string;
  category: "Web" | "Android" | "Blockchain" | "DevOps";
};

// ── Source of truth: each repo's SHOWCASE.md ──────────────────────────────
// (LedgerCalc, SriBoard, NetSwitch, Sri-Kart, BankChain, DevOps Academy)
export const projects: Project[] = [
  // ── Flagship Lead ─────────────────────────────────────────────────────
  {
    slug: "devops-academy",
    name: "DevOps Academy — Interactive DevOps SaaS",
    role: "Full-Stack Developer & Product Engineer",
    description:
      "A monetized SaaS that teaches DevOps interactively — 14 modules / 95 lessons, a terminal-lab CLI companion that grades real commands, notes with Obsidian sync, and an AI teacher that remembers each user's progress.",
    details:
      "Built on Next.js 16 + Supabase + Vercel AI SDK with DeepSeek V4 Flash as the AI teacher. Every chat turn builds a context bundle (teacher rules + progress snapshot + current lesson + last 20 messages) injected as system prompt — so 'Continue' always resumes exactly where the user left off. Terminal labs use a companion devops-lab CLI that runs real Linux commands locally and the server re-verifies command + output evidence before awarding XP. Notes are markdown per user with Obsidian sync (Pro-only export). Monetized via Razorpay with a Stripe-ready provider abstraction: Free ₹0, Starter ₹199/mo / ₹1,999/yr, Pro ₹499/mo / ₹4,999/yr.",
    techStack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Supabase",
      "Postgres",
      "RLS",
      "pgsodium Vault",
      "Vercel AI SDK",
      "DeepSeek V4 Flash",
      "Razorpay",
      "Node.js CLI",
      "Vitest",
    ],
    repo: "https://github.com/vsriaravindan/devops-academy",
    liveUrl: "https://devops-academy-nu.vercel.app/",
    featured: true,
    standout:
      "Continuity engine — AI teacher resumes exactly where the user left off. Plus real terminal-lab grading via devops-lab CLI, Obsidian notes sync, and 3-tier Razorpay monetization from day one.",
    category: "Web",
    highlights: [
      "Continuity engine: AI teacher resumes exactly where the user left off",
      "14 modules / 95 lessons, full curriculum seeded",
      "Terminal labs with real command grading via devops-lab CLI",
      "Notes notebook + Obsidian sync (Pro feature)",
      "Monetized from day one (Razorpay, 3 tiers, Stripe-ready)",
      "Per-user chat sessions with RLS, auto-titled",
      "DeepSeek V4 Flash AI teacher, platform key only",
      "Admin panel: edit pricing/model/teacher-rules live",
    ],
  },

  // ── Featured Deep Dives ───────────────────────────────────────────────
  {
    slug: "ledgercalc",
    name: "LedgerCalc — Dual App, Real-Time Sync",
    role: "Android Developer & Backend Integrator",
    description:
      "Dual-mode Android finance app: Ledger (groups, transactions, PDF export) + CalcHub (33 financial calculators). Share a ledger with anyone via a 6-digit secret code and watch their entries sync live over Supabase WebSockets.",
    details:
      "Built natively in Kotlin + Jetpack Compose with a glass-morphism Material3 design language (violet/teal). Local persistence is Room v3 with three migrations; remote sync uses Supabase Postgres + Phoenix Channels WebSockets (not polling) for instant INSERT/UPDATE/DELETE propagation to all members. Includes a full audit trail (📝 edited / 🗑️ deleted actor chips), auto-reconnect with exponential backoff, and offline guards for shared folders. CalcHub delivers 33 financial calculators in the same APK (SIP, EMI, FD, PPF, EPF, RD, NPS, SWP, GST, HRA, XIRR, ...).",
    techStack: [
      "Kotlin 2.2",
      "Jetpack Compose",
      "Material3",
      "Room v3",
      "Supabase",
      "Phoenix Channels",
      "WebSocket",
      "OkHttp",
      "AGP 9.2",
    ],
    repo: "https://github.com/vsriaravindan/ledgercalc",
    featured: true,
    standout:
      "Real-time WebSocket sync + 6-digit secret-code sharing + history auto-save without pressing = + 33 financial calculators in one APK.",
    category: "Android",
    highlights: [
      "Real-time WebSocket sync via Supabase Phoenix Channels (no polling)",
      "6-digit secret-code folder sharing — read-only or full-access",
      "Calculator history auto-saves without pressing = (2s debounce)",
      "Audit trail with 📝 edited / 🗑️ deleted actor badges inline",
      "33 financial calculators: SIP, EMI, FD, PPF, EPF, GST, HRA, XIRR, ...",
      "Room v3 with three migrations, offline guard, auto-reconnect",
      "Glass-morphism UI, 7 fonts, 10 currencies",
    ],
  },

  // ── Web ────────────────────────────────────────────────────────────────
  {
    slug: "ecommerce",
    name: "Sri-Kart — Live E-Commerce on Oracle Cloud",
    role: "Lead Developer & Cloud Infrastructure Architect",
    description:
      "Production-grade e-commerce platform running live on Oracle Cloud VPS — Express + React + PostgreSQL + Prisma behind Nginx + PM2 + Docker, with a custom premium design system.",
    details:
      "Provisioned and secured the production Oracle Cloud VPS environment from scratch. Configured Nginx reverse proxy with static asset caching headers, Let's Encrypt SSL/TLS with auto-renewal, PM2 process management, and Docker for the application. Hardened the PostgreSQL database with automated daily backup cron jobs. Implemented strict UFW firewall rules (SSH + HTTP + HTTPS only) and isolated environment secrets (.env chmod 600). Built a custom design system (DESIGN.md) synthesizing four premium brands: Nike's bold product photography grid, Shopify's dark campaign chrome, Airbnb's warm rounded UX, and Stripe's trustworthy form patterns.",
    techStack: [
      "React",
      "Vite",
      "Express.js",
      "PostgreSQL",
      "Prisma",
      "Nginx",
      "Docker",
      "PM2",
      "Let's Encrypt",
      "UFW",
    ],
    repo: "https://github.com/vsriaravindan/sri-ecommerce",
    liveUrl: "http://140.245.203.57/",
    featured: true,
    standout:
      "DevOps from bare metal (firewall, Nginx, Let's Encrypt, PM2, Docker, daily backups) + custom design system + full-stack app shipping real traffic.",
    category: "Web",
    highlights: [
      "Provisioned Oracle Cloud VPS from bare metal",
      "Configured Nginx reverse proxy with static asset caching",
      "Automated daily database backups via cron",
      "SSL/TLS via Let's Encrypt with auto-renewal",
      "Strict UFW firewall rules + secret isolation (.env chmod 600)",
      "Custom design system (DESIGN.md) — 4-brand synthesis",
      "PM2 + Docker process orchestration",
    ],
  },

  // ── Android ────────────────────────────────────────────────────────────
  {
    slug: "sriboard",
    name: "SriBoard — Privacy-First AI Keyboard",
    role: "Android Developer (Fork Maintainer)",
    description:
      "Privacy-first Android keyboard forked from HeliBoard, with inline AI text correction and translation via 5 AI providers (Gemini, Grok, DeepSeek, OpenAI-compat) — works inside any app without Accessibility Service.",
    details:
      "Built on top of the HeliBoard / OpenBoard AOSP lineage, SriBoard adds an AI toolbar (Fix, Translate to Tamil, 5 user-defined custom presets) that integrates as a first-class keyboard action — not an Accessibility Service, which means it works inside any input field in any app. Supports 5 AI providers (Google Gemini, xAI Grok, DeepSeek Flash, DeepSeek Pro, any OpenAI-compatible endpoint) with user-owned API keys. The app's AndroidManifest declares NO INTERNET permission by default; AI features only enable it when the user opts in. Iterative v2.x shipping added bulk dictionary import, Gboard layout mode, model quick-pick dropdown, and markdown-to-plain-text pre-commit.",
    techStack: [
      "Kotlin",
      "Android Views",
      "KeyboardView",
      "OkHttp",
      "Gemini API",
      "Grok API",
      "DeepSeek API",
      "Gradle",
    ],
    repo: "https://github.com/vsriaravindan/SriBoard",
    featured: false,
    standout:
      "Inline AI inside the keyboard (no Accessibility Service), BYOK for 5 providers, manifest declares no INTERNET permission by default.",
    category: "Android",
    highlights: [
      "5 AI providers: Gemini 2.0 Flash, Grok-2, DeepSeek Chat/Reasoner, OpenAI-compat",
      "Inline AI in any input field — no Accessibility Service required",
      "No INTERNET permission declared by default (opt-in only for AI)",
      "v2.3 iterative shipping: bulk dictionary import, Gboard mode, model quick-pick",
      "Custom AI toolbar with 7 presets (Fix, Translate, 5 user-defined)",
      "Privacy-first: user owns API keys, data never persists on a server",
      "Glide typing, split keyboard, multilingual, clipboard history",
    ],
  },

  {
    slug: "netswitch",
    name: "NetSwitch — Zero-Permission Network Mode Toggle",
    role: "Android Developer (Side Project)",
    description:
      "One-tap Android quick-settings tile + home-screen widget deep-link that flips your SIM's network mode on Realme devices — zero permissions declared, built as a workaround for ColorOS that blocks standard permission grant routes.",
    details:
      "On Realme GT Neo 3 (ColorOS 13), every standard Android permission grant route is blocked — `pm grant`, `appops set`, and `settings put` all refuse to grant `WRITE_SECURE_SETTINGS`. Solved with a `CLEAR_TASK` deep-link to `Settings$MobileNetworkActivity` — the user toggles network mode in 2 taps without the app needing any permission. Both the QS tile (`TileService`, API 24+) and the home-screen widget (`AppWidgetProvider`) trigger the same intent. Manifest declares zero permissions.",
    techStack: ["Kotlin", "TileService", "AppWidgetProvider", "Gradle"],
    repo: "https://github.com/vsriaravindan/netswitch",
    featured: false,
    standout:
      "Zero-permission deep-link to SIM network settings — works on ColorOS where pm grant and appops set are blocked.",
    category: "Android",
    highlights: [
      "TileService API for system-level integration (API 24+)",
      "AppWidgetProvider for home-screen access",
      "CLEAR_TASK deep-link to Settings$MobileNetworkActivity",
      "Zero permissions declared — privacy-first by design",
      "Single Kotlin module, <100 LOC of meaningful code",
      "Works on ColorOS, MIUI, OneUI, stock AOSP",
    ],
  },

  // ── Blockchain ─────────────────────────────────────────────────────────
  {
    slug: "bankchain",
    name: "BankChain — Modular DeFi Suite on Polygon",
    role: "Blockchain Developer",
    description:
      "Modular DeFi banking suite on Polygon — Lending, Token, Treasury, and Vault smart contracts (Hardhat, Solidity 0.8.20) backed by an autonomous AI agent that monitors on-chain health and proposes rebalancing actions.",
    details:
      "Four production-grade Solidity contracts form the protocol: Lending (over-collateralized lending pool with interest accrual), Token (ERC20 base), Treasury (protocol-owned liquidity + fee routing), and Vault (yield aggregator strategy wrapper). An AI-agent module wraps the contracts with an autonomous monitor that observes on-chain events and proposes rebalancing. Express + Prisma backend indexes contract events. Hardhat 9.x with optimizer enabled, Polygon Amoy testnet deployment config, Polygonscan verification.",
    techStack: [
      "Solidity 0.8.20",
      "Hardhat",
      "OpenZeppelin",
      "TypeScript",
      "Express",
      "Prisma",
      "Polygon",
      "Ethers v6",
    ],
    repo: "https://github.com/vsriaravindan/bankchain",
    featured: false,
    standout:
      "Four production-grade Solidity contracts + an AI-agent layer that observes on-chain state and proposes rebalancing.",
    category: "Blockchain",
    highlights: [
      "4 contracts: Lending (over-collateralized), Token (ERC20), Treasury (POLL), Vault (yield aggregator)",
      "Hardhat + Solidity 0.8.20 + OpenZeppelin",
      "Autonomous AI agent for on-chain monitoring",
      "Express + Prisma backend for event indexing",
      "Polygon Amoy testnet deployment + Polygonscan verification",
      "Modular architecture — each contract independently upgradeable",
    ],
  },
];