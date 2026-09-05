import ProjectLayout from '@/components/ProjectLayout';
import type { Project } from '@/lib/projects';

const project: Project = {
  slug: 'netswitch',
  name: 'NetSwitch — Zero-Permission Network Mode Toggle',
  role: 'Android Developer (Side Project)',
  description:
    'One-tap Android quick-settings tile + home-screen widget deep-link that flips your SIM network mode on Realme devices — zero permissions declared, built as a workaround for ColorOS that blocks standard permission grants.',
  details: '',
  techStack: ['Kotlin', 'TileService', 'AppWidgetProvider', 'Gradle'],
  repo: 'https://github.com/vsriaravindan/netswitch',
  apkUrl:
    'https://github.com/vsriaravindan/netswitch/releases/download/v1.0/netswitch.apk',
  apkVersion: 'v1.0',
  featured: false,
  standout:
    'Zero-permission deep-link to SIM network settings — works on ColorOS where pm grant and appops set are blocked.',
  category: 'Android',
  highlights: [
    'TileService API for system-level integration (API 24+)',
    'AppWidgetProvider for home-screen access',
    'CLEAR_TASK deep-link to Settings$MobileNetworkActivity',
    'Zero permissions declared — privacy-first by design',
    'Single Kotlin module, <100 LOC of meaningful code',
    'Works on ColorOS, MIUI, OneUI, stock AOSP',
  ],
};

export default function NetSwitchPage() {
  return (
    <ProjectLayout project={project}>
      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          The Problem
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          On Realme GT Neo 3 (ColorOS 13), every standard Android permission
          grant route is blocked —{' '}
          <code className="font-mono text-xs">pm grant</code>,{' '}
          <code className="font-mono text-xs">appops set</code>, and{' '}
          <code className="font-mono text-xs">settings put</code> all
          refuse to grant{' '}
          <code className="font-mono text-xs">WRITE_SECURE_SETTINGS</code>.
          So you can&rsquo;t write a normal app that toggles the SIM network
          mode in the background.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          The Solution
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          A <code className="font-mono text-xs">CLEAR_TASK</code> deep-link
          to{' '}
          <code className="font-mono text-xs">Settings$MobileNetworkActivity</code>.
          The user adds the NetSwitch quick-settings tile (or home-screen
          widget) and taps it — the Settings app opens directly on the SIM
          network mode toggle. Two taps, zero permissions required.
        </p>
      </section>
    </ProjectLayout>
  );
}
