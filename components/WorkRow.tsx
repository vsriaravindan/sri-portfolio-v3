import type { WorkExperience } from '@/lib/work';
import { ArrowUpRight } from 'lucide-react';

export default function WorkRow({ work, index }: { work: WorkExperience; index: number }) {
  return (
    <div className="work-row border-b border-[var(--border-subtle)] py-6 sm:py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
        <span className="mono-meta w-[8.5rem] shrink-0 text-[0.7rem] sm:text-right">
          {work.period}
        </span>
        <div className="flex-1">
          <h3 className="work-row-title text-lg font-medium">
            {work.role}
            <span className="mx-2 text-[var(--text-muted)]">&middot;</span>
            <span className="text-[var(--text-secondary)]">{work.organization}</span>
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
            {work.description}
          </p>
        </div>
        <ArrowUpRight size={16} className="arrow-nudge mt-1 shrink-0 text-[var(--text-muted)]" />
      </div>
    </div>
  );
}
