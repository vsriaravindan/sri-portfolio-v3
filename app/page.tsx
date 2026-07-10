import HeroSection from '@/components/HeroSection';
import ProjectCard from '@/components/ProjectCard';
import Band from '@/components/Band';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/projects';

// ── Fallback data ──────────────────────────────────────────────────────────
const fallbackSkills = [
  { category: "Cloud", skills: ["AWS", "GCP", "Azure"] },
  { category: "IaC", skills: ["Terraform", "CloudFormation", "Pulumi"] },
  { category: "Containers", skills: ["Docker", "Kubernetes", "ECS", "Fargate"] },
  { category: "CI/CD", skills: ["Jenkins", "GitHub Actions", "CodePipeline", "ArgoCD"] },
  { category: "Scripting", skills: ["Python", "Bash", "YAML", "Go"] },
  { category: "Monitoring", skills: ["CloudWatch", "Prometheus", "Grafana", "Datadog"] },
  { category: "Databases", skills: ["RDS", "DynamoDB", "ElastiCache", "Aurora"] },
  { category: "Networking", skills: ["VPC", "Route 53", "Nginx", "ALB/NLB"] },
  { category: "Security", skills: ["IAM", "KMS", "WAF", "Shield"] },
];

const fallbackAbout = {
  paragraphs: [
    "I am a passionate DevOps Engineer with a B.E in Computer Science and a deep focus on Cloud Automation and Infrastructure as Code. Over the last two years, I have specialized in designing scalable, highly available systems on AWS while integrating AI capabilities into practical applications.",
    "I actively explore the intersection of AI and DevOps. By leveraging Large Language Models (LLMs) and AI tools, I enhance traditional CI/CD pipelines and infrastructure monitoring.",
  ],
  quote: "Automate everything, monitor everything, and never stop learning.",
  heading: { line1: "Cloud Automation", line2: "AI-Augmented" },
};

const fallbackProjects: Project[] = [
  {
    slug: "ecommerce",
    name: "Sri-Ecommerce — Live Production Platform",
    role: "Lead Developer & Cloud Infrastructure Architect",
    description: "A fully functional, production-grade e-commerce web application featuring secure user authentication, dynamic product catalogs, real-time shopping cart, order processing, and an admin dashboard for inventory management.",
    details: "Provisioned and secured the production VPS environment from scratch. Configured Nginx reverse proxy for concurrent traffic with static asset caching.",
    techStack: ["Express.js", "React", "PostgreSQL", "Nginx", "Docker", "PM2", "Let's Encrypt"],
    repo: "https://github.com/vsriaravindan/sri-ecommerce",
    liveUrl: "http://140.245.203.57/",
    featured: true,
    highlights: [
      "Provisioned and hardened production VPS from bare metal",
      "Configured Nginx reverse proxy with caching headers",
      "Automated daily database backups with cron",
    ],
  },
  {
    slug: "ledgercalc",
    name: "LedgerCalc — AI-Powered Finance Calculator",
    role: "Developer & DevOps Engineer",
    description: "An Android finance calculator that utilizes Google's Gemini AI for intelligent ledger accounting and smart financial insights.",
    details: "Built natively for Android using Kotlin and Android Studio. Integrated Google Gemini AI API for intelligent financial analysis.",
    techStack: ["Kotlin", "Android Studio", "Gemini API", "Git", "GitHub Actions"],
    repo: "https://github.com/vsriaravindan/ledgercalc",
    featured: true,
    highlights: [
      "Integrated Google Gemini AI for intelligent accounting",
      "Secure API key management in Android builds",
      "Version-controlled CI pipeline configuration",
    ],
  },
];

export default async function Home() {
  // ── Fetch from Supabase ──────────────────────────────────────────────
  const [aboutRes, skillsRes, projectsRes] = await Promise.all([
    supabase.from('site_content').select('content').eq('section', 'about').maybeSingle(),
    supabase.from('site_content').select('content').eq('section', 'skills').maybeSingle(),
    supabase.from('site_content').select('content').eq('section', 'projects').maybeSingle(),
  ]);

  const about = aboutRes?.data?.content ?? fallbackAbout;
  const skills = skillsRes?.data?.content ?? { categories: fallbackSkills };
  const projects = projectsRes?.data?.content ?? { projects: fallbackProjects };
  const featured = projects.projects.filter((p: Project) => p.featured);
  const skillCategories = skills.categories ?? fallbackSkills;

  return (
    <>
      <HeroSection />

      <ScrollReveal>
        <Band />
      </ScrollReveal>

      {/* About Section */}
      <ScrollReveal delay={100}>
        <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
            <div>
              <p className="mono-label" style={{ color: 'var(--accent)' }}>About Me</p>
              <h2 className="display-head mt-4 text-[length:var(--type-display-lg)] leading-[var(--leading-display-lg)]">
                {about.heading.line1.split(' ').map((w: string, i: number) => (
                  <span key={i}>
                    {i > 0 && ' '}
                    {/Automation|Augmented|AI/i.test(w) ? <em>{w}</em> : w}
                  </span>
                ))}
                <br />
                {about.heading.line2.split(' ').map((w: string, i: number) => (
                  <span key={i}>
                    {i > 0 && ' '}
                    {/Automation|Augmented|AI/i.test(w) ? <em>{w}</em> : w}
                  </span>
                ))}
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              {(about.paragraphs as string[]).map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
              <p className="font-medium text-[var(--text-primary)]">
                &ldquo;{about.quote}&rdquo;
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Featured Projects */}
      <ScrollReveal delay={200}>
        <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 sm:pb-28">
          <p className="mono-label" style={{ color: 'var(--accent)' }}>Selected Projects</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {featured.map((project: Project) => (
              <ScrollReveal key={project.slug}>
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Link
              href="/work"
              className="font-mono text-xs hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              View all work &rarr;
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* Skills Grid */}
      <ScrollReveal delay={300}>
        <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 sm:pb-28">
          <p className="mono-label" style={{ color: 'var(--accent)' }}>Skills &amp; Technologies</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {skillCategories.map((cat: { category: string; skills: string[] }, idx: number) => (
              <ScrollReveal key={cat.category} delay={idx * 80}>
                <div
                  className="card-line p-5 transition-all duration-300"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <p
                    className="mono-label text-[0.6rem]"
                    style={{ color: 'var(--accent)' }}
                  >
                    {cat.category}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {cat.skills.map((skill: string, si: number) => (
                      <span
                        key={skill}
                        className="rounded-sm px-2 py-1 font-mono text-[0.7rem] transition-all duration-200 hover:scale-105"
                        style={{
                          background: 'var(--bg-surface)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                          transitionDelay: `${si * 30}ms`,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
