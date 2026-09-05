import Link from 'next/link';
import { ArrowLeft, CodeXml, Check, Download } from 'lucide-react';

// Inline Android app metadata — only fields the subpage uses.
const project = {
  name: 'NetSwitch — Zero-Permission Network Mode Toggle',
  role: 'Android Developer (Side Project)',
  repo: 'https://github.com/vsriaravindan/netswitch',
  apkUrl: 'https://github.com/vsriaravindan/netswitch/releases/download/v1.0/netswitch.apk',
  apkVersion: 'v1.0',
};

export default function NetSwitchPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
      <Link
        href="/projects"
        className="mono-label inline-flex items-center gap-2 hover:text-[var(--accent)]"
      >
        <ArrowLeft size={14} /> Back to projects
      </Link>

      <div className="mt-8">
        <p className="mono-label">{project.role}</p>
        <h1 className="display-head mt-3 text-[length:var(--type-display-md)] leading-[var(--leading-display-md)]">
          {project.name}
        </h1>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
        >
          <CodeXml size={16} /> View Repository
        </a>
        {project.apkUrl && (
          <a
            href={project.apkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-solid"
          >
            <Download size={16} /> Download APK {project.apkVersion}
          </a>
        )}
      </div>

      {project.apkUrl && (
        <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-[var(--text-muted)]">
          Sideload only — not on Play Store. Requires Shizuku. Enable "Install unknown apps" for your browser first.
        </p>
      )}

      <section className="mt-12">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          The Problem
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          On Realme GT Neo 3 (ColorOS 13), every standard Android permission grant
          route is blocked — <code className="font-mono text-xs">pm grant</code>,{' '}
          <code className="font-mono text-xs">appops set</code>, and{' '}
          <code className="font-mono text-xs">settings put</code> all refuse to grant{' '}
          <code className="font-mono text-xs">WRITE_SECURE_SETTINGS</code>. So you
          can't write a normal app that toggles the SIM network mode in the
          background.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          The Solution
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          A <code className="font-mono text-xs">CLEAR_TASK</code> deep-link to{' '}
          <code className="font-mono text-xs">Settings$MobileNetworkActivity</code>.
          The user adds the NetSwitch quick-settings tile (or home-screen widget)
          and taps it — the Settings app opens directly on the SIM network mode
          page, ready to toggle in 2 taps. The app itself declares{' '}
          <strong>zero permissions</strong> in its manifest.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          What Stands Out
        </h2>
        <ul className="mt-4 space-y-3">
          {[
            'TileService API for system-level integration (API 24+)',
            'AppWidgetProvider for home-screen access',
            'CLEAR_TASK deep-link to Settings$MobileNetworkActivity',
            'Zero permissions declared — privacy-first by design',
            'Single Kotlin module, <100 LOC of meaningful code',
            'Works on ColorOS, MIUI, OneUI, stock AOSP',
          ].map((h, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <Check size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
              <span className="text-[var(--text-secondary)]">{h}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Tech Stack
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Kotlin', 'TileService', 'AppWidgetProvider', 'Gradle'].map((tech) => (
            <span key={tech} className="pill text-[0.6rem]">{tech}</span>
          ))}
        </div>
      </section>

      <div className="relative mt-16 overflow-hidden rounded-sm border border-[var(--border-subtle)]">
        <div className="project-cover__dots absolute inset-0" />
        <div className="project-cover__glow absolute inset-0" />
        <div className="relative flex min-h-[200px] items-center justify-center p-10 sm:min-h-[280px]">
          <div className="text-center">
            <h3 className="display-head text-[length:var(--type-display-sm)]">NetSwitch</h3>
            <span className="project-cover__cursor" />
          </div>
        </div>
      </div>
    </div>
  );
}