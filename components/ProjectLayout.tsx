import Link from 'next/link';
import { ArrowLeft, CodeXml, Globe, Download, Check } from 'lucide-react';
import type { Project } from '@/lib/projects';

// Unified project subpage layout. Replaces 7 hand-rolled layouts with a
// single component that pulls from the Project data model.
//
// Subpages can wrap this with extra custom sections (e.g. "Architecture
// diagram", "The Problem/Solution") via the `children` prop.

export default function ProjectLayout({
  project,
  children,
}: {
  project: Project;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
      {/* Back link */}
      <Link
        href="/projects"
        className="mono-label inline-flex items-center gap-2 hover:text-[var(--accent)]"
      >
        <ArrowLeft size={14} /> Back to projects
      </Link>

      {/* Hero */}
      <header className="mt-8">
        <p className="mono-label">{project.role}</p>
        <h1 className="display-head mt-3 text-[length:var(--type-display-md)] leading-[var(--leading-display-md)]">
          {project.name}
        </h1>
        {project.standout && (
          <p className="mt-4 max-w-italic text-sm leading-relaxed text-[var(--text-muted)]">
            {project.standout}
          </p>
        )}
      </header>

      {/* CTA buttons */}
      <div className="mt-10 flex flex-wrap gap-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-solid"
          >
            <Globe size={16} /> Visit Live
          </a>
        )}
        {project.apkUrl && (
          <a
            href={project.apkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-solid"
          >
            <Download size={16} /> Download APK {project.apkVersion ?? ''}
          </a>
        )}
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            <CodeXml size={16} /> View Repository
          </a>
        )}
      </div>

      {/* Overview */}
      <section className="mt-12">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Overview
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          {project.description}
        </p>
      </section>

      {/* Highlights */}
      {project.highlights && project.highlights.length > 0 && (
        <section className="mt-10">
          <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Key Highlights
          </h2>
          <ul className="mt-4 space-y-3">
            {project.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <Check
                  size={16}
                  className="mt-0.5 shrink-0 text-[var(--accent)]"
                />
                <span className="text-[var(--text-secondary)]">{h}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tech stack */}
      {project.techStack && project.techStack.length > 0 && (
        <section className="mt-10">
          <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Tech Stack
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span key={tech} className="pill text-[0.6rem]">
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Optional custom content per project */}
      {children}

      {/* Cover artwork (signature visual at end of every project) */}
      <div className="relative mt-16 overflow-hidden rounded-sm border border-[var(--border-subtle)]">
        <div className="project-cover__dots absolute inset-0" />
        <div className="project-cover__glow absolute inset-0" />
        <div className="relative flex min-h-[200px] items-center justify-center p-10 sm:min-h-[280px]">
          <div className="text-center">
            <h3 className="display-head text-[length:var(--type-display-sm)]">
              {project.name.split('—')[0].trim()}
            </h3>
            <span className="project-cover__cursor" />
          </div>
        </div>
      </div>
    </div>
  );
}
