import Link from 'next/link';
import { ArrowLeft, CodeXml, Globe, Check } from 'lucide-react';

export default function DevOpsAcademyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
      <Link
        href="/projects"
        className="mono-label inline-flex items-center gap-2 hover:text-[var(--accent)]"
      >
        <ArrowLeft size={14} /> Back to projects
      </Link>

      <div className="mt-8">
        <p className="mono-label">Full-Stack Developer &amp; Product Engineer</p>
        <h1 className="display-head mt-3 text-[length:var(--type-display-md)] leading-[var(--leading-display-md)]">
          DevOps Academy — Interactive DevOps SaaS
        </h1>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href="https://devops-academy-nu.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-solid"
        >
          <Globe size={16} /> Visit Live
        </a>
        <a
          href="#"
          className="btn btn-ghost opacity-60"
          aria-disabled
        >
          <CodeXml size={16} /> Repository (private)
        </a>
      </div>

      <section className="mt-12">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          The Moat — Continuity Engine
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Every chat turn builds a{' '}
          <strong>context bundle</strong> — teacher rules + progress snapshot +
          current lesson content + last 20 messages — injected as system prompt.
          Progress persists in Postgres per user, so{' '}
          <strong>"Continue" always resumes exactly where they left off</strong>.
          No other competitor in this space has this — they all start from
          scratch every chat.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Overview
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Built on Next.js 16 + Supabase + Vercel AI SDK with DeepSeek V4 Flash
          as the AI teacher. 14 modules and 95 lessons are seeded into the
          curriculum. Terminal labs use a companion{' '}
          <code className="font-mono text-xs">devops-lab</code> CLI that runs
          real Linux commands locally and the server re-verifies command +
          output evidence before awarding XP. Notes are markdown per user with
          Obsidian sync (Pro-only export). Monetized via Razorpay with a
          Stripe-ready provider abstraction: Free ₹0, Starter ₹199/mo /
          ₹1,999/yr, Pro ₹499/mo / ₹4,999/yr.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          What Stands Out
        </h2>
        <ul className="mt-4 space-y-3">
          {[
            'Continuity engine: AI teacher resumes exactly where the user left off',
            '14 modules / 95 lessons, full curriculum seeded',
            'Terminal labs with real command grading via devops-lab CLI',
            'Notes notebook + Obsidian sync (Pro feature)',
            'Monetized from day one (Razorpay, 3 tiers, Stripe-ready)',
            'Per-user chat sessions with RLS, auto-titled',
            'DeepSeek V4 Flash AI teacher, platform key only',
            'Admin panel: edit pricing/model/teacher-rules live',
          ].map((h, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <Check size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
              <span className="text-[var(--text-secondary)]">{h}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Tech Stack
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            'Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4',
            'Supabase', 'Postgres', 'RLS', 'pgsodium Vault',
            'Vercel AI SDK', 'DeepSeek V4 Flash', 'Razorpay',
            'Node.js CLI', 'Vitest',
          ].map((tech) => (
            <span key={tech} className="pill text-[0.6rem]">{tech}</span>
          ))}
        </div>
      </section>

      <div className="relative mt-16 overflow-hidden rounded-sm border border-[var(--border-subtle)]">
        <div className="project-cover__dots absolute inset-0" />
        <div className="project-cover__glow absolute inset-0" />
        <div className="relative flex min-h-[200px] items-center justify-center p-10 sm:min-h-[280px]">
          <div className="text-center">
            <h3 className="display-head text-[length:var(--type-display-sm)]">DevOps Academy</h3>
            <span className="project-cover__cursor" />
          </div>
        </div>
      </div>
    </div>
  );
}