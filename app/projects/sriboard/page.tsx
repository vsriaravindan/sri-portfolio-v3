import Link from 'next/link';
import { ArrowLeft, CodeXml, Check, Download } from 'lucide-react';

// Inline Android app metadata — only fields the subpage uses.
const project = {
  name: 'SriBoard — Privacy-First AI Keyboard',
  role: 'Android Developer (Fork Maintainer)',
  repo: 'https://github.com/vsriaravindan/SriBoard',
  apkUrl: 'https://github.com/vsriaravindan/SriBoard/releases/download/v2.3/Sriboard-v2.3-release.apk',
  apkVersion: 'v2.3',
};

export default function SriboardPage() {
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
          Sideload only — not on Play Store. Enable "Install unknown apps" for your browser first.
        </p>
      )}

      <section className="mt-12">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Overview
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Built on top of the HeliBoard / OpenBoard AOSP lineage, SriBoard adds
          an AI toolbar (Fix, Translate to Tamil, 5 user-defined custom presets)
          that integrates as a first-class keyboard action — not an Accessibility
          Service, which means it works inside any input field in any app.
          Supports 5 AI providers (Google Gemini, xAI Grok, DeepSeek Flash,
          DeepSeek Pro, any OpenAI-compatible endpoint) with user-owned API keys.
          The app's AndroidManifest declares NO INTERNET permission by default;
          AI features only enable it when the user opts in.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          What Stands Out
        </h2>
        <ul className="mt-4 space-y-3">
          {[
            '5 AI providers: Gemini 2.0 Flash, Grok-2, DeepSeek Chat/Reasoner, OpenAI-compat',
            'Inline AI in any input field — no Accessibility Service required',
            'No INTERNET permission declared by default (opt-in only for AI)',
            'v2.3 iterative shipping: bulk dictionary import, Gboard mode, model quick-pick',
            'Custom AI toolbar with 7 presets (Fix, Translate, 5 user-defined)',
            'Privacy-first: user owns API keys, data never persists on a server',
            'Glide typing, split keyboard, multilingual, clipboard history',
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
          {['Kotlin', 'Android Views', 'KeyboardView', 'OkHttp', 'Gemini API', 'Grok API', 'DeepSeek API', 'Gradle'].map((tech) => (
            <span key={tech} className="pill text-[0.6rem]">{tech}</span>
          ))}
        </div>
      </section>

      <div className="relative mt-16 overflow-hidden rounded-sm border border-[var(--border-subtle)]">
        <div className="project-cover__dots absolute inset-0" />
        <div className="project-cover__glow absolute inset-0" />
        <div className="relative flex min-h-[200px] items-center justify-center p-10 sm:min-h-[280px]">
          <div className="text-center">
            <h3 className="display-head text-[length:var(--type-display-sm)]">SriBoard</h3>
            <span className="project-cover__cursor" />
          </div>
        </div>
      </div>
    </div>
  );
}