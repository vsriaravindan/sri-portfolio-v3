import Link from 'next/link';
import type { Project } from '@/lib/projects';
import { ArrowUpRight, Sparkles } from 'lucide-react';

// Featured/lead card used at the top of the homepage and /projects listing.
// Visually larger than a standard ProjectCard, with a "Flagship" or role badge
// and the full project description visible.
export default function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card-line card-line-interactive group relative block overflow-hidden p-6 sm:p-10"
    >
      <div className="lead-card__glow pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles size={12} className="text-[var(--accent)]" />
          <p className="mono-label text-[0.65rem]">Flagship</p>
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

        {project.standout && (
          <p className="mt-6 text-sm italic leading-relaxed text-[var(--text-muted)]">
            <span className="font-mono not-italic text-[0.65rem] uppercase tracking-[0.12em] text-[var(--accent)]">
              Standout —
            </span>{' '}
            {project.standout}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-2">
          {project.techStack.slice(0, 8).map((tech) => (
            <span key={tech} className="pill text-[0.6rem]">
              {tech}
            </span>
          ))}
          {project.techStack.length > 8 && (
            <span className="pill text-[0.6rem]">
              +{project.techStack.length - 8}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
