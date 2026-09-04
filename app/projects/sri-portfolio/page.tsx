import Link from 'next/link';
import { ArrowLeft, CodeXml, Globe, Check } from 'lucide-react';

export default function SriPortfolioPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
      <Link
        href="/projects"
        className="mono-label inline-flex items-center gap-2 hover:text-[var(--accent)]"
      >
        <ArrowLeft size={14} /> Back to projects
      </Link>

      <div className="mt-8">
        <p className="mono-label">Full-Stack Developer (self)</p>
        <h1 className="display-head mt-3 text-[length:var(--type-display-md)] leading-[var(--leading-display-md)]">
          sriaravindan.com — This Portfolio Site
        </h1>
        <p className="mt-4 max-italic text-sm leading-relaxed text-[var(--text-muted)]">
          Yes — the page you're reading is itself one of the projects. A
          self-documenting showcase that demonstrates its own CI/CD, auth,
          CMS, and commenting system.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href="https://sriaravindan.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-solid"
        >
          <Globe size={16} /> Visit Live
        </a>
        <a
          href="https://github.com/vsriaravindan/sri-portfolio-v3"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
        >
          <CodeXml size={16} /> View Repository
        </a>
      </div>

      <section className="mt-12">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Live CI/CD Dashboard — /devops
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Visit{' '}
          <Link href="/devops" className="text-[var(--accent)] hover:underline">
            /devops
          </Link>{' '}
          to see this site's own GitHub Actions runs, deployment history, and
          container health — pulled in real time. A portfolio that shows its
          own build pipeline is the best proof of competence.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Reddit-Style Threaded Comments — /blog
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Every blog post has nested replies with{' '}
          <code className="font-mono text-xs">parent_id</code> (FK to{' '}
          <code className="font-mono text-xs">comments.id</code>, ON DELETE
          CASCADE), per-comment likes via{' '}
          <code className="font-mono text-xs">comment_likes</code> with{' '}
          <code className="font-mono text-xs">UNIQUE(comment_id, user_id)</code>,
          and live updates over{' '}
          <strong>Supabase Realtime (Phoenix Channels)</strong> — no polling.
          Replies nest like Reddit / Hacker News. Try it on any blog post.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          OTP Auth — no passwords, no magic links
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Sign-in and sign-up at{' '}
          <code className="font-mono text-xs">/auth/verify</code> use a pure
          OTP flow via{' '}
          <code className="font-mono text-xs">/api/auth/send-otp</code> +{' '}
          <code className="font-mono text-xs">/api/auth/verify-otp</code>.
          Supabase Auth + custom session cookies. 6-digit codes via SMTP.
          Magic-link click-through not required.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Custom CMS — /dashboard
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          The dashboard at{' '}
          <Link href="/dashboard" className="text-[var(--accent)] hover:underline">
            /dashboard
          </Link>{' '}
          is a content admin that lives inside the app. Blog posts use the
          Tiptap rich-text editor. Site content is stored in a Supabase JSON
          column (<code className="font-mono text-xs">site_content</code>) and
          RLS-gated per user.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          What Stands Out
        </h2>
        <ul className="mt-4 space-y-3">
          {[
            'Live /devops dashboard: GitHub Actions + deployments + container health',
            'Reddit-style threaded comments (parent_id + likes + Realtime)',
            'OTP auth (send-otp + verify-otp) — no passwords, no magic links',
            'Custom CMS at /dashboard: blog editor + content + profile',
            'Custom design system: tokens, neon-glow card-line, mono-label, display-head',
            '21 pages, 3 API routes, 9 DB tables',
            'framer-motion animations + Cmd+K command palette',
            'Self-hosted Docker + Nginx + Let\'s Encrypt on Oracle Cloud VPS',
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
            'Supabase', 'Postgres', 'RLS', 'Supabase Realtime',
            'framer-motion', 'Tiptap', 'lucide-react',
            'Docker', 'Nginx', "Let's Encrypt",
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
            <h3 className="display-head text-[length:var(--type-display-sm)]">sriaravindan.com</h3>
            <span className="project-cover__cursor" />
          </div>
        </div>
      </div>
    </div>
  );
}