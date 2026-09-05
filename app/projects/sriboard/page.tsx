import ProjectLayout from '@/components/ProjectLayout';
import type { Project } from '@/lib/projects';

// Project data — kept inline (not pulled from Supabase) so the subpage
// renders without a network round-trip. Update via the codebase, not CMS.
const project: Project = {
  slug: 'sriboard',
  name: 'SriBoard — Privacy-First AI Keyboard',
  role: 'Android Developer (Fork Maintainer)',
  description:
    'Privacy-first Android keyboard forked from HeliBoard, with inline AI text correction and translation via 5 AI providers (Gemini, Grok, DeepSeek, OpenAI-compat) — works inside any app without Accessibility Service.',
  details: '',
  techStack: [
    'Kotlin',
    'Android Views',
    'KeyboardView',
    'OkHttp',
    'Gemini API',
    'Grok API',
    'DeepSeek API',
    'Gradle',
  ],
  repo: 'https://github.com/vsriaravindan/SriBoard',
  apkUrl:
    'https://github.com/vsriaravindan/SriBoard/releases/download/v2.3/Sriboard-v2.3-release.apk',
  apkVersion: 'v2.3',
  featured: false,
  standout:
    'Inline AI inside the keyboard (no Accessibility Service), BYOK for 5 providers, no INTERNET permission by default.',
  category: 'Android',
  highlights: [
    '5 AI providers: Gemini 2.0 Flash, Grok-2, DeepSeek Chat/Reasoner, OpenAI-compat',
    'Inline AI in any input field — no Accessibility Service required',
    'No INTERNET permission declared by default (opt-in only for AI)',
    'v2.3 iterative shipping: bulk dictionary import, Gboard mode, model quick-pick',
    'Custom AI toolbar with 7 presets (Fix, Translate, 5 user-defined)',
    'Privacy-first: user owns API keys, data never persists on a server',
    'Glide typing, split keyboard, multilingual, clipboard history',
  ],
};

export default function SriboardPage() {
  return (
    <ProjectLayout project={project}>
      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          What stands out
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Built on top of the HeliBoard / OpenBoard AOSP lineage, SriBoard
          adds an AI toolbar (Fix, Translate to Tamil, 5 user-defined custom
          presets) that integrates as a first-class keyboard action — not an
          Accessibility Service, which means it works inside any input
          field in any app. Supports 5 AI providers (Google Gemini, xAI
          Grok, DeepSeek Flash, DeepSeek Pro, any OpenAI-compatible endpoint)
          with user-owned API keys. The app&rsquo;s AndroidManifest declares
          NO INTERNET permission by default; AI features only enable it
          when the user opts in.
        </p>
      </section>
    </ProjectLayout>
  );
}
