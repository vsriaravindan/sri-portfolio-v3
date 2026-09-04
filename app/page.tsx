import HeroSection from '@/components/HeroSection';
import ProjectCard from '@/components/ProjectCard';
import Band from '@/components/Band';
import ScrollReveal from '@/components/ScrollReveal';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/projects';

// ── Fallback data ──────────────────────────────────────────────────────────
const fallbackSkills = [
  { category: "Cloud", skills: ["AWS", "GCP", "Azure"] },
  { category: "IaC", skills: ["Terraform", "CloudFormation", "Pulumi"] },
  { category: "Containers", skills: ["Docker", "Kubernetes", "ECS", "Fargate"] },
  { category: "CI/CD", skills: ["Jenkins", "GitHub Actions", "CodePipeline", "ArgoCD"] },
  { category: "Scripting", skills: ["Python", "Bash", "YAML", "Go"] },
  { category: "Monitoring", skills: ["CloudWatch", "Prometheus", "Grafana", "Datadog"] },
  { category: "Databases", skills: ["RDS", "DynamoDB", "ElastiCache", "Aurora"] },
  { category: "Networking", skills: ["VPC", "Route 53", "Nginx", "ALB/NLB"] },
  { category: "Security", skills: ["IAM", "KMS", "WAF", "Shield"] },
];

const fallbackAbout = {
  paragraphs: [
    "I am a passionate DevOps Engineer with a B.E in Computer Science and a deep focus on Cloud Automation and Infrastructure as Code. Over the last two years, I have specialized in designing scalable, highly available systems on AWS while integrating AI capabilities into practical applications.",
    "I actively explore the intersection of AI and DevOps. By leveraging Large Language Models (LLMs) and AI tools, I enhance traditional CI/CD pipelines and infrastructure monitoring.",
  ],
  quote: "Automate everything, monitor everything, and never stop learning.",
  heading: { line1: "Cloud Automation", line2: "AI-Augmented" },
};

// ── 7-project fallback (covers all projects shown across home + /projects) ──
const fallbackProjects: Project[] = [
  {
    slug: "devops-academy",
    name: "DevOps Academy — Interactive DevOps SaaS",
    role: "Full-Stack Developer & Product Engineer",
    description:
      "A monetized SaaS that teaches DevOps interactively — 14 modules / 95 lessons, a terminal-lab CLI that grades real commands, notes with Obsidian sync, and an AI teacher that remembers each user's progress.",
    details:
      "Built on Next.js 16 + Supabase + Vercel AI SDK with DeepSeek V4 Flash. Every chat turn builds a context bundle (teacher rules + progress + current lesson + last 20 messages) injected as system prompt — so 'Continue' always resumes where the user left off. Terminal labs use devops-lab CLI companion with real command grading. Monetized via Razorpay (3 tiers, Stripe-ready).",
    techStack: ["Next.js 16", "React 19", "Supabase", "Vercel AI SDK", "DeepSeek V4 Flash", "Razorpay", "Node.js CLI", "Tailwind v4"],
    repo: "https://github.com/vsriaravindan/devops-academy",
    liveUrl: "https://devops-academy-nu.vercel.app/",
    featured: true,
    standout:
      "Continuity engine — AI teacher resumes exactly where the user left off. Plus real terminal-lab grading, Obsidian notes sync, and 3-tier Razorpay monetization from day one.",
    category: "Web",
    highlights: [
      "Continuity engine: AI teacher resumes exactly where the user left off",
      "14 modules / 95 lessons, full curriculum",
      "Terminal labs via devops-lab CLI with real command grading",
      "Notes + Obsidian sync (Pro feature)",
      "Razorpay 3-tier pricing, monetized from day one",
      "Admin panel: live pricing/model/teacher-rules edits",
    ],
  },
  {
    slug: "ledgercalc",
    name: "LedgerCalc — Dual App, Real-Time Sync",
    role: "Android Developer & Backend Integrator",
    description:
      "Dual-mode Android finance app: Ledger + CalcHub (33 calculators). Share a ledger via 6-digit secret code, watch entries sync live over Supabase WebSockets.",
    details:
      "Built natively in Kotlin + Jetpack Compose with a glass-morphism Material3 design language. Local persistence is Room v3 with three migrations; remote sync uses Supabase Postgres + Phoenix Channels WebSockets for instant propagation.",
    techStack: ["Kotlin 2.2", "Jetpack Compose", "Material3", "Room v3", "Supabase", "Phoenix Channels", "WebSocket", "OkHttp", "AGP 9.2"],
    repo: "https://github.com/vsriaravindan/ledgercalc",
    featured: true,
    standout:
      "Real-time WebSocket sync + 6-digit secret-code sharing + history auto-save without pressing = + 33 financial calculators.",
    category: "Android",
    highlights: [
      "Real-time WebSocket sync via Supabase Phoenix Channels",
      "6-digit secret-code folder sharing",
      "Calculator history auto-saves without pressing =",
      "Audit trail with actor badges",
      "33 financial calculators",
      "Room v3 with three migrations",
    ],
  },
  {
    slug: "ecommerce",
    name: "Sri-Kart — Live E-Commerce on Oracle Cloud",
    role: "Lead Developer & Cloud Infrastructure Architect",
    description:
      "Production-grade e-commerce platform running live on Oracle Cloud VPS — Express + React + PostgreSQL behind Nginx + PM2 + Docker, with a custom premium design system.",
    details:
      "Provisioned and secured the production Oracle Cloud VPS environment from scratch. Configured Nginx reverse proxy, Let's Encrypt SSL/TLS, PM2, and Docker.",
    techStack: ["React", "Vite", "Express.js", "PostgreSQL", "Prisma", "Nginx", "Docker", "PM2", "Let's Encrypt"],
    repo: "https://github.com/vsriaravindan/sri-ecommerce",
    liveUrl: "http://140.245.203.57/",
    featured: true,
    standout:
      "DevOps from bare metal + custom design system + full-stack app shipping real traffic.",
    category: "Web",
    highlights: [
      "Provisioned Oracle Cloud VPS from bare metal",
      "Nginx reverse proxy with static asset caching",
      "Daily database backups via cron",
      "Let's Encrypt SSL/TLS with auto-renewal",
      "UFW firewall + secret isolation",
      "Custom design system (DESIGN.md)",
    ],
  },
  {
    slug: "sriboard",
    name: "SriBoard — Privacy-First AI Keyboard",
    role: "Android Developer (Fork Maintainer)",
    description:
      "Privacy-first Android keyboard forked from HeliBoard, with inline AI text correction and translation via 5 AI providers — works inside any app without Accessibility Service.",
    details:
      "Built on HeliBoard lineage. AI toolbar as a first-class keyboard action. Supports 5 AI providers with user-owned API keys. No INTERNET permission by default.",
    techStack: ["Kotlin", "Android Views", "KeyboardView", "OkHttp", "Gemini API", "Grok API", "DeepSeek API", "Gradle"],
    repo: "https://github.com/vsriaravindan/SriBoard",
    featured: false,
    standout:
      "Inline AI inside the keyboard (no Accessibility Service), BYOK for 5 providers, no INTERNET permission by default.",
    category: "Android",
    highlights: [
      "5 AI providers: Gemini, Grok, DeepSeek, OpenAI-compat",
      "Inline AI in any input field — no Accessibility Service",
      "No INTERNET permission by default",
      "v2.3 iterative shipping",
      "Custom AI toolbar with 7 presets",
    ],
  },
  {
    slug: "netswitch",
    name: "NetSwitch — Zero-Permission Network Mode Toggle",
    role: "Android Developer (Side Project)",
    description:
      "One-tap Android QS tile + widget deep-link that flips SIM network mode on Realme devices — zero permissions declared.",
    details:
      "On Realme GT Neo 3 (ColorOS 13), every standard permission grant route is blocked. Solved with CLEAR_TASK deep-link. Zero permissions declared.",
    techStack: ["Kotlin", "TileService", "AppWidgetProvider", "Gradle"],
    repo: "https://github.com/vsriaravindan/netswitch",
    featured: false,
    standout:
      "Zero-permission deep-link to SIM network settings — works on ColorOS where pm grant is blocked.",
    category: "Android",
    highlights: [
      "TileService API",
      "AppWidgetProvider",
      "CLEAR_TASK deep-link to Settings$MobileNetworkActivity",
      "Zero permissions declared",
    ],
  },
  {
    slug: "bankchain",
    name: "BankChain — Modular DeFi Suite on Polygon",
    role: "Blockchain Developer",
    description:
      "Modular DeFi banking suite on Polygon — Lending, Token, Treasury, Vault contracts backed by an autonomous AI agent.",
    details:
      "Four Solidity contracts + AI-agent module. Express + Prisma backend indexes events. Hardhat 9.x, Polygon Amoy.",
    techStack: ["Solidity 0.8.20", "Hardhat", "OpenZeppelin", "TypeScript", "Express", "Prisma", "Polygon", "Ethers v6"],
    repo: "https://github.com/vsriaravindan/bankchain",
    featured: false,
    standout:
      "Four production-grade Solidity contracts + AI-agent layer for on-chain monitoring.",
    category: "Blockchain",
    highlights: [
      "4 contracts: Lending, Token, Treasury, Vault",
      "Hardhat + Solidity 0.8.20 + OpenZeppelin",
      "Autonomous AI agent",
      "Express + Prisma backend",
      "Polygon Amoy deployment",
    ],
  },
  {
    slug: "sri-portfolio",
    name: "sriaravindan.com — This Portfolio Site",
    role: "Full-Stack Developer (self)",
    description:
      "Self-documenting portfolio — Next.js 16 + Supabase with /devops CI/CD dashboard, OTP auth, /dashboard CMS, and Reddit-style threaded comments over Realtime.",
    details:
      "Built as a self-documenting showcase. Live /devops, OTP-only auth (no passwords), custom CMS, Reddit-style threaded comments via Supabase Realtime.",
    techStack: ["Next.js 16", "React 19", "Supabase", "Supabase Realtime", "framer-motion", "Tiptap", "Tailwind v4", "Docker"],
    repo: "https://github.com/vsriaravindan/sri-portfolio-v3",
    liveUrl: "https://sriaravindan.com/",
    featured: false,
    standout:
      "Self-documenting — /devops shows live CI/CD, /blog has Reddit-style threaded comments, and /projects lists itself.",
    category: "Web",
    highlights: [
      "Live /devops CI/CD dashboard",
      "Reddit-style threaded comments (Realtime)",
      "OTP auth (no passwords)",
      "Custom CMS at /dashboard",
      "Custom design system, framer-motion animations",
    ],
  },
];

export default async function Home() {
  const [aboutRes, skillsRes, projectsRes, latestPostsRes] = await Promise.all([
    supabase.from('site_content').select('content').eq('section', 'about').maybeSingle(),
    supabase.from('site_content').select('content').eq('section', 'skills').maybeSingle(),
    supabase.from('site_content').select('content').eq('section', 'projects').maybeSingle(),
    supabase.from('posts').select('id, title, slug, excerpt, tags, read_time, created_at, cover_url')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  const about = aboutRes?.data?.content ?? fallbackAbout;
  const skills = skillsRes?.data?.content ?? { categories: fallbackSkills };
  const projects = projectsRes?.data?.content ?? { projects: fallbackProjects };
  console.log('[DEBUG] projects.length =', projects?.projects?.length, 'slugs =', projects?.projects?.map((p: any) => p.slug).join(','));
  // Show ALL projects on home (was previously featured-only = 2)
  const allProjects = projects.projects as Project[];
  const skillCategories = skills.categories ?? fallbackSkills;
  const latestPosts = latestPostsRes?.data ?? [];

  return (
    <>
      <ScrollProgressBar />
      <HeroSection />

      <ScrollReveal>
        <Band />
      </ScrollReveal>

      {/* About Section */}
      <ScrollReveal delay={100}>
        <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
            <div>
              <p className="mono-label" style={{ color: 'var(--accent)' }}>About Me</p>
              <h2 className="display-head mt-4 text-[length:var(--type-display-lg)] leading-[var(--leading-display-lg)]">
                {about.heading.line1.split(' ').map((w: string, i: number) => (
                  <span key={i}>
                    {i > 0 && ' '}
                    {/Automation|Augmented|AI/i.test(w) ? <em>{w}</em> : w}
                  </span>
                ))}
                <br />
                {about.heading.line2.split(' ').map((w: string, i: number) => (
                  <span key={i}>
                    {i > 0 && ' '}
                    {/Automation|Augmented|AI/i.test(w) ? <em>{w}</em> : w}
                  </span>
                ))}
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              {(about.paragraphs as string[]).map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
              <p className="font-medium text-[var(--text-primary)]">
                &ldquo;{about.quote}&rdquo;
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Projects — all of them, in a compact rail */}
      <ScrollReveal delay={200}>
        <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 sm:pb-28">
          <div className="flex items-baseline justify-between">
            <p className="mono-label" style={{ color: 'var(--accent)' }}>
              {allProjects.length} Projects Shipped
            </p>
            <Link
              href="/projects"
              className="font-mono text-xs hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              View all &rarr;
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {allProjects.map((project: Project, idx: number) => (
              <ScrollReveal key={project.slug} delay={idx * 60}>
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Latest Blog Posts */}
      <ScrollReveal delay={250}>
        <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 sm:pb-28">
          <p className="mono-label" style={{ color: 'var(--accent)' }}>Latest from the Blog</p>

          <div className="mt-8 space-y-1">
            {latestPosts.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--text-muted)]">No posts yet. Stay tuned.</p>
            ) : (
              latestPosts.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="card-line card-line-interactive flex items-start gap-4 p-5 no-underline sm:p-6"
                >
                  {post.cover_url && (
                    <div className="mt-0.5 h-14 w-14 shrink-0 overflow-hidden rounded-sm sm:h-16 sm:w-16">
                      <img src={post.cover_url} alt="" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-medium">{post.title}</h3>
                    {post.excerpt && (
                      <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[0.65rem] text-[var(--text-muted)]">
                      <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {post.read_time && <span>{post.read_time} min read</span>}
                      <div className="flex flex-wrap gap-1.5">
                        {(post.tags ?? []).map((tag: string) => (
                          <span key={tag} className="mono-label text-[0.5rem]" style={{ color: 'var(--accent)' }}>#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              href="/blog"
              className="font-mono text-xs hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              View all posts &rarr;
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* Skills Grid */}
      <ScrollReveal delay={300}>
        <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 sm:pb-28">
          <p className="mono-label" style={{ color: 'var(--accent)' }}>Skills &amp; Technologies</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {skillCategories.map((cat: { category: string; skills: string[] }, idx: number) => (
              <ScrollReveal key={cat.category} delay={idx * 80}>
                <div
                  className="card-line p-5 transition-all duration-300"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <p
                    className="mono-label text-[0.6rem]"
                    style={{ color: 'var(--accent)' }}
                  >
                    {cat.category}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {cat.skills.map((skill: string, si: number) => (
                      <span
                        key={skill}
                        className="rounded-sm px-2 py-1 font-mono text-[0.7rem] transition-all duration-200 hover:scale-105"
                        style={{
                          background: 'var(--bg-surface)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                          transitionDelay: `${si * 30}ms`,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}