export type WorkExperience = {
  period: string;
  role: string;
  organization: string;
  description: string;
};

export const workExperience: WorkExperience[] = [
  {
    period: "2023 — Present",
    role: "DevOps Engineer",
    organization: "Current Role",
    description:
      "Designing scalable, highly available systems on AWS. Automating infrastructure provisioning with Terraform and CloudFormation. Building CI/CD pipelines with Jenkins and GitHub Actions. Managing containerized workloads on Docker and Kubernetes (EKS).",
  },
];
