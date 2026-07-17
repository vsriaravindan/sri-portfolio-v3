'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  head_commit: { message: string };
  status: string;
  conclusion: string | null;
  run_started_at: string;
  updated_at: string;
  html_url: string;
}

interface Deployment {
  ref: string;
  description: string;
  created_at: string;
  state: string;
}

interface HealthData {
  status: string;
  uptime: string;
  memory: string;
  version: string;
  timestamp: string;
}

export default function DevOpsPage() {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const GITHUB_REPO = 'vsriaravindan/sri-portfolio-v3';
  const GHCR_PACKAGE = 'ghcr.io/vsriaravindan/sri-portfolio-v3';

  useEffect(() => {
    async function fetchData() {
      try {
        const [runsRes, healthRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${GITHUB_REPO}/actions/runs?per_page=10&status=completed`),
          fetch('/api/health'),
        ]);
        if (runsRes.ok) {
          const data = await runsRes.json();
          setRuns(data.workflow_runs || []);
        }
        if (healthRes.ok) {
          setHealth(await healthRes.json());
        }
      } catch (e) {
        console.error('Failed to fetch DevOps data', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statusIcon = (conclusion: string | null) => {
    if (!conclusion) return <span className="text-yellow-400">◉</span>;
    if (conclusion === 'success') return <span className="text-green-400">●</span>;
    return <span className="text-red-400">●</span>;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-20 sm:px-10">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          DevOps <span className="text-[var(--accent)]">Dashboard</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
          Live CI/CD pipeline, infrastructure status, and deployment history — all
          powering this site.
        </p>
      </div>

      {/* Architecture Diagram */}
      <section className="mb-12 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Architecture
        </h2>
        <svg viewBox="0 0 800 160" className="w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent-muted)" />
            </linearGradient>
          </defs>
          {/* GitHub */}
          <rect x="10" y="50" width="120" height="50" rx="8" fill="var(--bg-base)" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <text x="70" y="78" textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontFamily="monospace">GitHub</text>
          <text x="70" y="92" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="monospace">Source + Actions</text>
          {/* Arrow */}
          <line x1="130" y1="75" x2="175" y2="75" stroke="url(#arrowGrad)" strokeWidth="2" markerEnd="none" />
          <polygon points="172,70 180,75 172,80" fill="var(--accent)" />
          {/* GHCR */}
          <rect x="185" y="50" width="120" height="50" rx="8" fill="var(--bg-base)" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <text x="245" y="78" textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontFamily="monospace">GHCR</text>
          <text x="245" y="92" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="monospace">Container Registry</text>
          {/* Arrow */}
          <line x1="305" y1="75" x2="350" y2="75" stroke="url(#arrowGrad)" strokeWidth="2" />
          <polygon points="347,70 355,75 347,80" fill="var(--accent)" />
          {/* Oracle VPS */}
          <rect x="360" y="50" width="120" height="50" rx="8" fill="var(--bg-base)" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <text x="420" y="70" textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontFamily="monospace">Oracle VPS</text>
          <text x="420" y="84" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="monospace">Docker + Nginx</text>
          <text x="420" y="96" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="monospace">1GB RAM · 24.04</text>
          {/* Arrow down */}
          <line x1="370" y1="100" x2="370" y2="130" stroke="var(--border-subtle)" strokeWidth="1.5" strokeDasharray="4" />
          <line x1="200" y1="130" x2="420" y2="130" stroke="var(--border-subtle)" strokeWidth="1.5" strokeDasharray="4" />
          {/* Supabase */}
          <rect x="290" y="120" width="140" height="30" rx="8" fill="var(--bg-base)" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <text x="360" y="139" textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontFamily="monospace">Supabase (DB + Auth)</text>
          {/* Arrow right from VPS */}
          <line x1="480" y1="75" x2="525" y2="75" stroke="url(#arrowGrad)" strokeWidth="2" />
          <polygon points="522,70 530,75 522,80" fill="var(--accent)" />
          {/* Cloudflare */}
          <rect x="535" y="50" width="120" height="50" rx="8" fill="var(--bg-base)" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <text x="595" y="78" textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontFamily="monospace">Cloudflare</text>
          <text x="595" y="92" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="monospace">DNS + SSL + Email</text>
          {/* Arrow */}
          <line x1="655" y1="75" x2="700" y2="75" stroke="url(#arrowGrad)" strokeWidth="2" />
          <polygon points="697,70 705,75 697,80" fill="var(--accent)" />
          {/* Browser */}
          <rect x="710" y="50" width="80" height="50" rx="8" fill="var(--bg-base)" stroke="var(--accent)" strokeWidth="1.5" />
          <text x="750" y="78" textAnchor="middle" fill="var(--accent)" fontSize="12" fontFamily="monospace">🌐 User</text>
        </svg>
      </section>

      {/* CI Status Badge */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          CI Pipeline
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <img
            src={`https://img.shields.io/github/actions/workflow/status/${GITHUB_REPO}/ci.yml?logo=githubactions&label=CI&style=for-the-badge`}
            alt="CI Status"
            className="h-7"
          />
          <img
            src={`https://img.shields.io/github/last-commit/${GITHUB_REPO}?logo=git&label=Last%20Deploy&style=for-the-badge`}
            alt="Last Commit"
            className="h-7"
          />
        </div>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Build Timeline */}
        <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Build Timeline
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-[var(--bg-base)]" />
              ))}
            </div>
          ) : runs.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)]">No builds yet. Push to main to trigger CI.</p>
          ) : (
            <div className="space-y-2">
              {runs.slice(0, 8).map((run) => (
                <a
                  key={run.id}
                  href={run.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg bg-[var(--bg-base)] px-3 py-2 text-xs transition-all hover:bg-[var(--bg-elevated)] hover:text-[var(--accent)] group cursor-pointer"
                >
                  {statusIcon(run.conclusion)}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      {run.name || run.head_commit?.message || 'Build'}
                    </p>
                    <p className="text-[var(--text-muted)]">
                      {run.head_branch} · {formatDate(run.run_started_at)}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Deployment History */}
        <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Deployment History
          </h2>
          {deployments.length === 0 ? (
            <div className="space-y-2">
              {runs.slice(0, 5).map((run) => (
                <a
                  key={run.id}
                  href={run.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg bg-[var(--bg-base)] px-3 py-2 text-xs transition-all hover:bg-[var(--bg-elevated)] hover:text-[var(--accent)] group cursor-pointer"
                >
                  {statusIcon(run.conclusion)}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      {run.head_commit?.message || 'Deploy'}
                    </p>
                    <p className="text-[var(--text-muted)]">
                      {formatDate(run.updated_at)}
                    </p>
                  </div>
                  <code className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[0.6rem] text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
                    {run.conclusion || 'running'}
                  </code>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)]">Loading deployments...</p>
          )}
        </section>
      </div>

      {/* Container Info + Live Health */}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Container Registry */}
        <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Container Image
          </h2>
          <div className="rounded-lg bg-[var(--bg-base)] px-4 py-3 text-xs">
            <div className="flex items-center gap-2">
              <code className="font-mono text-[var(--accent)]">{GHCR_PACKAGE}</code>
              <span className="rounded bg-green-900/30 px-1.5 py-0.5 text-[0.6rem] text-green-400">
                latest
              </span>
            </div>
            <p className="mt-2 text-[var(--text-muted)]">
              Built and pushed by GitHub Actions. VPS pulls and restarts automatically.
            </p>
          </div>
        </section>

        {/* Live Health */}
        <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Live Health Check
          </h2>
          {health ? (
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className={`inline-block h-2 w-2 rounded-full ${health.status === 'ok' ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="font-medium text-[var(--text-primary)]">Status: {health.status}</span>
              </div>
              <div className="rounded-lg bg-[var(--bg-base)] px-4 py-3 font-mono text-[0.65rem]">
                <p className="text-[var(--text-muted)]">uptime: {health.uptime}</p>
                <p className="text-[var(--text-muted)]">memory: {health.memory}</p>
                <p className="text-[var(--text-muted)]">version: {health.version}</p>
                <p className="text-[var(--text-muted)]">checked: {health.timestamp}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)]">Waiting for first health check...</p>
          )}
        </section>
      </div>

      {/* Tech Stack Footer */}
      <section className="mt-12 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {['GitHub Actions', 'Docker', 'GHCR', 'Nginx', 'Oracle Cloud', 'Cloudflare', 'Let\'s Encrypt', 'Next.js', 'Supabase', 'Upptime'].map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[var(--border-subtle)] px-3 py-1 text-[0.65rem] font-medium text-[var(--text-muted)]"
            >
              {tech}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs text-[var(--text-muted)]">
          This dashboard updates live from GitHub Actions API and the server's health endpoint.
          Total infrastructure cost: <strong className="text-green-400">$10.14/yr</strong> (domain only).
        </p>
      </section>
    </div>
  );
}
