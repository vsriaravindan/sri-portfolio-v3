import ProjectLayout from '@/components/ProjectLayout';
import Link from 'next/link';
import type { Project } from '@/lib/projects';

const project: Project = {
  slug: 'sri-portfolio',
  name: 'sriaravindan.com — This Portfolio Site',
  role: 'Full-Stack Developer (self)',
  description:
    'The portfolio site you’re reading — Next.js 16 + Supabase with a live /devops CI/CD dashboard, OTP auth, dashboard CMS, and blog with Reddit-style threaded comments that update live over Realtime.',
  details: '',
  techStack: [
    'Next.js 16',
    'React 19',
    'TypeScript',
    'Tailwind v4',
    'Supabase',
    'Postgres',
    'RLS',
    'Supabase Realtime',
    'framer-motion',
    'Tiptap',
    'lucide-react',
    'Docker',
    'Nginx',
    "Let's Encrypt",
  ],
  repo: 'https://github.com/vsriaravindan/sri-portfolio-v3',
  liveUrl: 'https://sriaravindan.com/',
  featured: false,
  standout:
    'Self-documenting — /devops shows the live CI/CD pipeline, /blog has Reddit-style threaded comments over Supabase Realtime, and /projects lists itself as one of the projects.',
  category: 'Web',
  highlights: [
    'Live /devops dashboard: GitHub Actions + deployments + container health',
    'Reddit-style threaded comments (parent_id + likes + Realtime)',
    'OTP auth (send-otp + verify-otp) — no passwords, no magic links',
    'Custom CMS at /dashboard: blog editor + content + profile',
    'Custom design system: tokens, neon-glow card-line, mono-label, display-head',
    '21 pages, 3 API routes, 9 DB tables',
    'framer-motion animations + Cmd+K command palette',
    'Self-hosted Docker + Nginx + Let’s Encrypt on Oracle Cloud VPS',
  ],
};

export default function SriPortfolioPage() {
  return (
    <ProjectLayout project={project}>
      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Live CI/CD Dashboard — /devops
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Visit{' '}
          <Link href="/devops" className="text-[var(--accent)] hover:underline">
            /devops
          </Link>{' '}
          to see this site&rsquo;s own GitHub Actions runs, deployment
          history, and container health — pulled in real time. A portfolio
          that shows its own build pipeline is the best proof of
          competence.
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
          <strong>Supabase Realtime (Phoenix Channels)</strong> — no
          polling. Replies nest like Reddit / Hacker News.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          OTP Auth — no passwords, no magic links
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Sign-in and sign-up at{' '}
          <code className="font-mono text-xs">/auth/verify</code> use a
          pure OTP flow via{' '}
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
          is a content admin that lives inside the app. Blog posts use
          the Tiptap rich-text editor. Site content is stored in a
          Supabase JSON column (
          <code className="font-mono text-xs">site_content</code>) and
          RLS-gated per user.
        </p>
      </section>
    </ProjectLayout>
  );
}
