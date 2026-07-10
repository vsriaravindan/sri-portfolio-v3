import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ArrowLeft, CodeXml, Check } from 'lucide-react';
import type { Project } from '@/lib/projects';

export default async function LedgerCalcPage() {
  const { data } = await supabase
    .from('site_content')
    .select('content')
    .eq('section', 'projects')
    .maybeSingle();

  const project: Project | undefined = (data?.content?.projects ?? []).find(
    (p: Project) => p.slug === 'ledgercalc'
  );

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
      <Link
        href="/"
        className="mono-label inline-flex items-center gap-2 hover:text-[var(--accent)]"
      >
        <ArrowLeft size={14} />
        Back
      </Link>

      <div className="mt-8">
        <p className="mono-label">{project.role}</p>
        <h1 className="display-head mt-3 text-[length:var(--type-display-md)] leading-[var(--leading-display-md)]">
          {project.name}
        </h1>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            <CodeXml size={16} />
            View Repository
          </a>
        )}
      </div>

      <div className="mt-12">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Overview
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          {project.details}
        </p>
      </div>

      <div className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Key Highlights
        </h2>
        <ul className="mt-4 space-y-3">
          {project.highlights.map((h: string, i: number) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <Check size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
              <span className="text-[var(--text-secondary)]">{h}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Tech Stack
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.techStack.map((tech: string) => (
            <span key={tech} className="pill text-[0.6rem]">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mt-16 overflow-hidden rounded-sm border border-[var(--border-subtle)]">
        <div className="project-cover__dots absolute inset-0" />
        <div className="project-cover__glow absolute inset-0" />
        <div className="relative flex min-h-[200px] items-center justify-center p-10 sm:min-h-[280px]">
          <div className="text-center">
            <h3 className="display-head text-[length:var(--type-display-sm)]">
              {project.name.split("—")[0].trim()}
            </h3>
            <span className="project-cover__cursor" />
          </div>
        </div>
      </div>
    </div>
  );
}
