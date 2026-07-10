import { SOCIAL } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { ArrowUpRight, BookOpen } from 'lucide-react';

const fallbackArticles = [
  {
    title: "Automating AWS Infrastructure with Terraform",
    description: "A step-by-step guide on provisioning VPCs, EC2 instances, and RDS databases using Terraform modules and remote state management.",
    url: "https://dev.to/vsriaravindan",
    date: "2025",
  },
  {
    title: "CI/CD Pipeline Setup with GitHub Actions",
    description: "Building a complete CI/CD pipeline for a Node.js application using GitHub Actions, Docker, and AWS ECR/ECS deployment.",
    url: "https://dev.to/vsriaravindan",
    date: "2025",
  },
  {
    title: "Monitoring Cloud Infrastructure with Prometheus & Grafana",
    description: "Setting up comprehensive monitoring for AWS workloads using Prometheus for metrics collection and Grafana for visualization.",
    url: "https://dev.to/vsriaravindan",
    date: "2024",
  },
];

export default async function WritingPage() {
  const { data: articlesData } = await supabase
    .from('site_content')
    .select('content')
    .eq('section', 'articles')
    .maybeSingle();

  const articles = articlesData?.content?.articles ?? fallbackArticles;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
      <p className="mono-label">Writing</p>
      <h1 className="display-head mt-4 text-[length:var(--type-display-lg)] leading-[var(--leading-display-lg)]">
        Notes &amp; <em>Articles</em>
      </h1>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
        I regularly document my cloud engineering learnings and troubleshooting
        experiences. Here are some of my recent write-ups.
      </p>

      <div className="mt-12 space-y-1">
        {articles.map((article: typeof fallbackArticles[0], i: number) => (
          <a
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-line card-line-interactive flex items-start gap-4 p-5 no-underline sm:p-6"
          >
            <BookOpen size={18} className="mt-0.5 shrink-0 text-[var(--text-muted)]" />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-medium">{article.title}</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {article.description}
              </p>
              <p className="mono-meta mt-2 text-[0.65rem]">{article.date}</p>
            </div>
            <ArrowUpRight size={16} className="arrow-nudge mt-1 shrink-0 text-[var(--text-muted)]" />
          </a>
        ))}
      </div>

      <div className="mt-12">
        <p className="mono-label">Community</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <a
            href={SOCIAL.github}
            target="_blank"
            rel="noopener noreferrer"
            className="card-line card-line-interactive flex items-center justify-between p-5"
          >
            <span className="font-mono text-sm">GitHub</span>
            <ArrowUpRight size={16} className="text-[var(--text-muted)]" />
          </a>
          <a
            href="https://dev.to/vsriaravindan"
            target="_blank"
            rel="noopener noreferrer"
            className="card-line card-line-interactive flex items-center justify-between p-5"
          >
            <span className="font-mono text-sm">dev.to</span>
            <ArrowUpRight size={16} className="text-[var(--text-muted)]" />
          </a>
        </div>
      </div>
    </div>
  );
}
