import Link from 'next/link';
import type { Project } from '@/lib/projects';
import { ArrowUpRight } from 'lucide-react';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card-line card-line-interactive flex flex-col p-6 sm:p-8"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="mono-label text-[0.65rem]">{project.role}</p>
          <h3 className="display-head mt-2 text-[length:var(--type-display-sm)] leading-[var(--leading-display-sm)]">
            {project.name}
          </h3>
        </div>
        <ArrowUpRight
          size={18}
          className="arrow-nudge mt-1 shrink-0 text-[var(--text-muted)]"
        />
      </div>

      <p className="mb-4 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
        {project.description}
      </p>

      {project.liveUrl && (
        <span className="pill mb-3 w-max text-[0.6rem]">
          <span className="avail-dot" />
          Live in production
        </span>
      )}

      <div className="mt-auto flex flex-wrap gap-1.5">
        {project.techStack.slice(0, 5).map((tech) => (
          <span
            key={tech}
            className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-[var(--text-muted)]"
          >
            {tech}
          </span>
        ))}
        {project.techStack.length > 5 && (
          <span className="font-mono text-[0.65rem] text-[var(--text-muted)]">
            +{project.techStack.length - 5}
          </span>
        )}
      </div>
    </Link>
  );
}
