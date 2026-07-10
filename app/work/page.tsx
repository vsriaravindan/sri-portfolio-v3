import WorkRow from '@/components/WorkRow';
import { supabase } from '@/lib/supabase';
import type { WorkExperience } from '@/lib/work';

const fallbackWork: WorkExperience[] = [
  {
    period: "2023 — Present",
    role: "DevOps Engineer",
    organization: "Current Role",
    description:
      "Designing scalable, highly available systems on AWS. Automating infrastructure provisioning with Terraform and CloudFormation. Building CI/CD pipelines with Jenkins and GitHub Actions. Managing containerized workloads on Docker and Kubernetes (EKS).",
  },
];

const fallbackExploring = [
  { title: "Kubernetes (EKS)", desc: "Deep-diving into production-grade Kubernetes on AWS EKS — cluster autoscaling, IRSA, and GitOps workflows." },
  { title: "Advanced Terraform", desc: "Building reusable module registries, managing state at scale with remote backends, and policy-as-code with Sentinel." },
  { title: "Web3 Infrastructure", desc: "Exploring decentralized infrastructure, blockchain node operations, and applying DevOps principles to Web3." },
];

export default async function WorkPage() {
  const { data: workData } = await supabase
    .from('site_content')
    .select('content')
    .eq('section', 'work')
    .maybeSingle();

  const entries: WorkExperience[] = workData?.content?.entries ?? fallbackWork;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
      <p className="mono-label">Experience</p>
      <h1 className="display-head mt-4 text-[length:var(--type-display-lg)] leading-[var(--leading-display-lg)]">
        Work <em>History</em>
      </h1>

      <div className="mt-12 sm:mt-16">
        {entries.map((work, i) => (
          <WorkRow key={i} work={work} index={i} />
        ))}
      </div>

      {/* Education */}
      <div className="mt-20">
        <p className="mono-label">Education</p>
        <div className="work-row border-b border-[var(--border-subtle)] py-6 sm:py-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
            <span className="mono-meta w-[8.5rem] shrink-0 text-[0.7rem] sm:text-right">
              2020 — 2024
            </span>
            <div className="flex-1">
              <h3 className="work-row-title text-lg font-medium">
                B.E in Computer Science and Engineering
                <span className="mx-2 text-[var(--text-muted)]">&middot;</span>
                <span className="text-[var(--text-secondary)]">University</span>
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                Focused on cloud computing, distributed systems, and software
                engineering principles. Foundation for a career in DevOps and
                cloud infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Continuous Learning */}
      <div className="mt-16">
        <p className="mono-label">Currently Exploring</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {fallbackExploring.map((item) => (
            <div key={item.title} className="card-line p-5">
              <h3 className="font-mono text-sm font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
