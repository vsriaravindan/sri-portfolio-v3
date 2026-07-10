import HeroSection from '@/components/HeroSection';
import ProjectCard from '@/components/ProjectCard';
import Band from '@/components/Band';
import ScrollReveal from '@/components/ScrollReveal';
import { projects } from '@/lib/projects';
import Link from 'next/link';

export default function Home() {
  const featured = projects.filter((p) => p.featured);

  const skillCategories = [
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
                Cloud <em>Automation</em>
                <br />
                AI-<em>Augmented</em>
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              <p>
                I am a passionate DevOps Engineer with a B.E in Computer Science
                and a deep focus on Cloud Automation and Infrastructure as Code.
                Over the last two years, I have specialized in designing scalable,
                highly available systems on AWS while integrating AI capabilities
                into practical applications.
              </p>
              <p>
                I actively explore the intersection of AI and DevOps. By leveraging
                Large Language Models (LLMs) and AI tools, I enhance traditional
                CI/CD pipelines and infrastructure monitoring.
              </p>
              <p className="font-medium text-[var(--text-primary)]">
                &ldquo;Automate everything, monitor everything, and never stop
                learning.&rdquo;
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
            {featured.map((project) => (
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

      {/* Skills Grid - Animated */}
      <ScrollReveal delay={300}>
        <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 sm:pb-28">
          <p className="mono-label" style={{ color: 'var(--accent)' }}>Skills &amp; Technologies</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {skillCategories.map((cat, idx) => (
              <ScrollReveal key={cat.category} delay={idx * 80}>
                <div
                  className="card-line p-5 transition-all duration-300"
                  style={{
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <p
                    className="mono-label text-[0.6rem]"
                    style={{ color: 'var(--accent)' }}
                  >
                    {cat.category}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {cat.skills.map((skill, si) => (
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
