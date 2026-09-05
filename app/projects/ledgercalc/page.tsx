import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProjectLayout from '@/components/ProjectLayout';
import type { Project } from '@/lib/projects';

export const revalidate = 60;

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
    <ProjectLayout project={project}>
      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Architecture
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Built natively in Kotlin + Jetpack Compose with a
          glass-morphism Material3 design language. Local persistence
          is Room v3 with three migrations; remote sync uses Supabase
          Postgres + Phoenix Channels WebSockets (not polling) for
          instant INSERT/UPDATE/DELETE propagation to all members.
          Includes a full audit trail (📝 edited / 🗑️ deleted actor chips),
          auto-reconnect with exponential backoff, and offline guards
          for shared folders. CalcHub delivers 33 financial calculators
          in the same APK (SIP, EMI, FD, PPF, EPF, RD, NPS, SWP, GST,
          HRA, XIRR, …).
        </p>
      </section>
    </ProjectLayout>
  );
}
