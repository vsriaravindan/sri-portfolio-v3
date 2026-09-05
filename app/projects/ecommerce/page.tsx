import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProjectLayout from '@/components/ProjectLayout';
import type { Project } from '@/lib/projects';

export const revalidate = 60;

export default async function EcommercePage() {
  const { data } = await supabase
    .from('site_content')
    .select('content')
    .eq('section', 'projects')
    .maybeSingle();

  const project: Project | undefined = (data?.content?.projects ?? []).find(
    (p: Project) => p.slug === 'ecommerce'
  );

  if (!project) notFound();

  return (
    <ProjectLayout project={project}>
      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          DevOps Notes
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Provisioned and secured the production Oracle Cloud VPS
          environment from scratch. Configured Nginx reverse proxy
          with static asset caching headers, Let&rsquo;s Encrypt SSL/TLS
          with auto-renewal, PM2 process management, and Docker for
          the application. Hardened the PostgreSQL database with
          automated daily backup cron jobs. Implemented strict UFW
          firewall rules (SSH + HTTP + HTTPS only) and isolated
          environment secrets (.env chmod 600).
        </p>
      </section>
    </ProjectLayout>
  );
}
