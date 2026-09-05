import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProjectLayout from '@/components/ProjectLayout';
import type { Project } from '@/lib/projects';

export const revalidate = 60;

export default async function DevOpsAcademyPage() {
  const { data } = await supabase
    .from('site_content')
    .select('content')
    .eq('section', 'projects')
    .maybeSingle();

  const project: Project | undefined = (data?.content?.projects ?? []).find(
    (p: Project) => p.slug === 'devops-academy'
  );

  if (!project) notFound();

  return (
    <ProjectLayout project={project}>
      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          The Moat — Continuity Engine
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Every chat turn builds a{' '}
          <strong>context bundle</strong> — teacher rules + progress snapshot +
          current lesson content + last 20 messages — injected as system prompt.
          Progress persists in Postgres per user, so{' '}
          <strong>&ldquo;Continue&rdquo; always resumes exactly where they left off</strong>.
          No other competitor in this space has this — they all start from
          scratch every chat.
        </p>
      </section>
    </ProjectLayout>
  );
}
