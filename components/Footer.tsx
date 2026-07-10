import Link from 'next/link';
import { SOCIAL, NAV } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="ink-panel mt-24 overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-6 pb-8 pt-20 sm:px-10 sm:pt-28">
        <p className="mono-label" style={{ color: 'var(--accent)' }}>( Have infrastructure to automate? )</p>

        <h2 className="display-head mt-6 text-[length:var(--type-display-xl)] leading-[var(--leading-display-xl)]">
          Let&apos;s <em>build</em>
        </h2>

        <div className="mt-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-12 sm:mt-16">
          <div className="flex flex-col gap-5">
            <a
              href={SOCIAL.github}
              target="_blank"
              rel="noreferrer"
              className="ink-link text-[clamp(1.3rem,3vw,2.1rem)]"
            >
              GitHub
              <span className="arrow-nudge" aria-hidden="true">
                ↗
              </span>
            </a>
            <a
              href={SOCIAL.linkedin}
              target="_blank"
              rel="noreferrer"
              className="ink-link text-[clamp(1.3rem,3vw,2.1rem)]"
            >
              LinkedIn
              <span className="arrow-nudge" aria-hidden="true">
                ↗
              </span>
            </a>
            <a
              href={`mailto:${SOCIAL.email}`}
              className="ink-link text-[clamp(1.3rem,3vw,2.1rem)]"
            >
              Email
              <span className="arrow-nudge" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>

          <div className="space-y-4 sm:text-right">
            <p className="flex items-center gap-2.5 font-mono text-[0.72rem] uppercase tracking-[0.13em] text-[color-mix(in_srgb,var(--paper)_72%,transparent)] sm:justify-end">
              <span className="inline-block h-[7px] w-[7px] rounded-full bg-[var(--accent)]" />
              Available for opportunities &middot; Replies &lt; 24h
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-[color-mix(in_srgb,var(--paper)_62%,transparent)]">
              Looking for a DevOps engineer to automate your infrastructure or
              deploy your next application? Let&apos;s talk.
            </p>
            <Link href="/contact" className="btn btn-solid">
              Get in touch
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-[color-mix(in_srgb,var(--paper)_16%,transparent)] pt-5 sm:mt-24">
          <span className="flex items-center gap-3">
            <svg
              viewBox="-29.5 -77 485.5 206.5"
              className="h-3.5 w-auto text-[var(--paper)]"
              aria-hidden="true"
            >
              <g fill="none" stroke="currentColor" strokeWidth="22">
                <path d="M80.1 22.9 A40.5 40.5 0 1 0 80.1 77.1" />
                <path d="M135 100 V30.5 A19.5 19.5 0 0 1 174 30.5 V100 M174 30.5 A19.5 19.5 0 0 1 213 30.5 V100" />
                <path d="M256 50 A40.5 40.5 0 1 0 337 50 A40.5 40.5 0 1 0 256 50" />
                <path d="M337 -38 V100" />
              </g>
              <rect
                x="378"
                y="-30"
                width="50"
                height="130"
                fill="var(--accent)"
              />
            </svg>
            <p className="mono-meta">
              &copy; {new Date().getFullYear()} Sri Aravindan
            </p>
          </span>
          <p className="mono-meta">Chennai, India &middot; UTC+5:30</p>
        </div>
      </div>
    </footer>
  );
}
