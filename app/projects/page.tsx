import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import type { Project } from '@/lib/projects';
import { projects } from '@/lib/projects';
import ProjectCard from '@/components/ProjectCard';

// ── Server-side read from Supabase, fall back to lib/projects.ts ──────────
async function getProjects() {
  try {
    const { supabase } = await import('@/lib/supabase');
    const { data } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', 'projects')
      .maybeSingle();
    const remote = (data?.content?.projects ?? []) as Project[];
    if (remote.length > 0) return remote;
  } catch {
    /* fall through */
  }
  return projects;
}

// ── Lead card (LedgerCalc — the standout) ─────────────────────────────────
function LeadCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card-line card-line-interactive group relative block overflow-hidden p-6 sm:p-10"
    >
      {/* gradient wash */}
      <div className="lead-card__glow pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles size={12} className="text-[var(--accent)]" />
          <p className="mono-label text-[0.65rem]">Featured — Deep Dive</p>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mono-label text-[0.65rem]">{project.role}</p>
            <h2 className="display-head mt-3 text-[length:var(--type-display-lg)] leading-[var(--leading-display-lg)]">
              {project.name}
            </h2>
          </div>
          <ArrowUpRight
            size={20}
            className="arrow-nudge mt-1 shrink-0 text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)]"
          />
        </div>

        <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)]">
          {project.description}
        </p>

        <p className="mt-6 text-sm italic leading-relaxed text-[var(--text-muted)]">
          <span className="font-mono not-italic text-[0.65rem] uppercase tracking-[0.12em] text-[var(--accent)]">
            Standout —
          </span>{' '}
          {project.standout}
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {project.techStack.slice(0, 8).map((tech) => (
            <span key={tech} className="pill text-[0.6rem]">
              {tech}
            </span>
          ))}
          {project.techStack.length > 8 && (
            <span className="pill text-[0.6rem]">+{project.techStack.length - 8}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Standard card moved to components/ProjectCard.tsx (single source of truth) ──

export default async function ProjectsPage() {
  const allProjects = await getProjects();
  const lead = allProjects.find((p) => p.featured) || allProjects[0];
  const rest = allProjects.filter((p) => p.slug !== lead.slug);

  // Group by category for the rest
  const groups: Record<string, Project[]> = {};
  for (const p of rest) {
    if (!groups[p.category]) groups[p.category] = [];
    groups[p.category].push(p);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
      <header className="mb-12">
        <p className="mono-label">Selected Work</p>
        <h1 className="display-head mt-3 text-[length:var(--type-display-md)] leading-[var(--leading-display-md)] sm:text-[length:var(--type-display-lg)]">
          Projects
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
          {allProjects.length} production-grade projects across Android, Web, and
          Blockchain. Each one shipped with a real user, a real problem, and a
          reason it had to exist.
        </p>
      </header>

      {/* Lead */}
      {lead && (
        <section className="mb-16">
          <LeadCard project={lead} />
        </section>
      )}

      {/* Grouped */}
      <div className="space-y-16">
        {Object.entries(groups).map(([category, items]) => (
          <section key={category}>
            <div className="mb-6 flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-3">
              <h2 className="display-head text-[length:var(--type-display-sm)] leading-[var(--leading-display-sm)]">
                {category}
              </h2>
              <span className="mono-label text-[0.6rem]">
                {items.length} {items.length === 1 ? 'project' : 'projects'}
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {items.map((p) => (
                <ProjectCard key={p.slug} project={p} showStandout />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}