-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA for sri-portfolio
-- Run this in Supabase SQL Editor AFTER creating the tables
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Add INSERT policy for admin (so you can seed from the app later too)
CREATE POLICY "content_insert_admin" ON site_content
  FOR INSERT WITH CHECK (auth.email() = 'vsriaravindan@gmail.com');

-- 2. Site Config
INSERT INTO site_content (section, content) VALUES ('site_config', '{
  "name": "Sri Aravindan",
  "title": "AWS DevOps Engineer | AI-Augmented Developer | Cloud Automation Specialist",
  "tagline": "I build resilient cloud infrastructures, automate complex workflows, and deploy production-grade applications. I bridge the gap between development and operations using code.",
  "description": "DevOps engineer specializing in AWS cloud infrastructure, CI/CD automation, and AI-augmented development. B.E in Computer Science.",
  "author": "Sri Aravindan V",
  "url": "https://vsriaravindan.github.io",
  "locale": "en_US",
  "twitterHandle": "@vsriaravindan",
  "social": {
    "github": "https://github.com/vsriaravindan",
    "email": "vsriaravindan@gmail.com",
    "linkedin": "https://linkedin.com/in/vsriaravindan"
  },
  "cta": {
    "primary": { "label": "View My Work", "href": "/work" },
    "secondary": { "label": "Visit Live Demo", "href": "http://140.245.203.57/", "external": true }
  }
}') ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content, updated_at = now();

-- 3. About
INSERT INTO site_content (section, content) VALUES ('about', '{
  "heading": { "line1": "Cloud Automation", "line2": "AI-Augmented" },
  "paragraphs": [
    "I am a passionate DevOps Engineer with a B.E in Computer Science and a deep focus on Cloud Automation and Infrastructure as Code. Over the last two years, I have specialized in designing scalable, highly available systems on AWS while integrating AI capabilities into practical applications.",
    "I actively explore the intersection of AI and DevOps. By leveraging Large Language Models (LLMs) and AI tools, I enhance traditional CI/CD pipelines and infrastructure monitoring."
  ],
  "quote": "Automate everything, monitor everything, and never stop learning."
}') ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content, updated_at = now();

-- 4. Skills
INSERT INTO site_content (section, content) VALUES ('skills', '{
  "categories": [
    { "category": "Cloud", "skills": ["AWS", "GCP", "Azure"] },
    { "category": "IaC", "skills": ["Terraform", "CloudFormation", "Pulumi"] },
    { "category": "Containers", "skills": ["Docker", "Kubernetes", "ECS", "Fargate"] },
    { "category": "CI/CD", "skills": ["Jenkins", "GitHub Actions", "CodePipeline", "ArgoCD"] },
    { "category": "Scripting", "skills": ["Python", "Bash", "YAML", "Go"] },
    { "category": "Monitoring", "skills": ["CloudWatch", "Prometheus", "Grafana", "Datadog"] },
    { "category": "Databases", "skills": ["RDS", "DynamoDB", "ElastiCache", "Aurora"] },
    { "category": "Networking", "skills": ["VPC", "Route 53", "Nginx", "ALB/NLB"] },
    { "category": "Security", "skills": ["IAM", "KMS", "WAF", "Shield"] }
  ]
}') ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content, updated_at = now();

-- 5. Projects
INSERT INTO site_content (section, content) VALUES ('projects', '{
  "projects": [
    {
      "slug": "ecommerce",
      "name": "Sri-Ecommerce — Live Production Platform",
      "role": "Lead Developer & Cloud Infrastructure Architect",
      "description": "A fully functional, production-grade e-commerce web application featuring secure user authentication, dynamic product catalogs, real-time shopping cart, order processing, and an admin dashboard for inventory management.",
      "details": "Provisioned and secured the production VPS environment from scratch. Configured Nginx reverse proxy for concurrent traffic with static asset caching. Deployed and hardened the production database with automated daily backup cron jobs. Implemented strict UFW firewall rules, SSL/TLS certificates via Let''s Encrypt, and securely isolated environment secrets.",
      "techStack": ["Express.js", "React", "PostgreSQL", "Nginx", "Docker", "PM2", "Let''s Encrypt"],
      "repo": "https://github.com/vsriaravindan/sri-ecommerce",
      "liveUrl": "http://140.245.203.57/",
      "featured": true,
      "highlights": [
        "Provisioned and hardened production VPS from bare metal",
        "Configured Nginx reverse proxy with caching headers",
        "Automated daily database backups with cron",
        "SSL/TLS via Let''s Encrypt with auto-renewal",
        "Strict firewall rules and secret isolation"
      ]
    },
    {
      "slug": "ledgercalc",
      "name": "LedgerCalc — AI-Powered Finance Calculator",
      "role": "Developer & DevOps Engineer",
      "description": "An Android finance calculator that utilizes Google''s Gemini AI for intelligent ledger accounting and smart financial insights. Demonstrates integration of cutting-edge AI APIs into real-world mobile applications.",
      "details": "Built natively for Android using Kotlin and Android Studio. Integrated Google Gemini AI API for intelligent financial analysis. Implemented secure environment variable management for API keys and version-controlled CI configurations for the Android build process.",
      "techStack": ["Kotlin", "Android Studio", "Gemini API", "Git", "GitHub Actions"],
      "repo": "https://github.com/vsriaravindan/ledgercalc",
      "featured": true,
      "highlights": [
        "Integrated Google Gemini AI for intelligent accounting",
        "Secure API key management in Android builds",
        "Version-controlled CI pipeline configuration",
        "Clean architecture with MVVM pattern"
      ]
    }
  ]
}') ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content, updated_at = now();

-- 6. Work Experience
INSERT INTO site_content (section, content) VALUES ('work', '{
  "entries": [
    {
      "period": "2023 — Present",
      "role": "DevOps Engineer",
      "organization": "Current Role",
      "description": "Designing scalable, highly available systems on AWS. Automating infrastructure provisioning with Terraform and CloudFormation. Building CI/CD pipelines with Jenkins and GitHub Actions. Managing containerized workloads on Docker and Kubernetes (EKS)."
    }
  ]
}') ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content, updated_at = now();

-- 7. Articles
INSERT INTO site_content (section, content) VALUES ('articles', '{
  "articles": [
    {
      "title": "Automating AWS Infrastructure with Terraform",
      "description": "A step-by-step guide on provisioning VPCs, EC2 instances, and RDS databases using Terraform modules and remote state management.",
      "url": "https://dev.to/vsriaravindan",
      "date": "2025"
    },
    {
      "title": "CI/CD Pipeline Setup with GitHub Actions",
      "description": "Building a complete CI/CD pipeline for a Node.js application using GitHub Actions, Docker, and AWS ECR/ECS deployment.",
      "url": "https://dev.to/vsriaravindan",
      "date": "2025"
    },
    {
      "title": "Monitoring Cloud Infrastructure with Prometheus & Grafana",
      "description": "Setting up comprehensive monitoring for AWS workloads using Prometheus for metrics collection and Grafana for visualization.",
      "url": "https://dev.to/vsriaravindan",
      "date": "2024"
    }
  ]
}') ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content, updated_at = now();

-- 8. Contact
INSERT INTO site_content (section, content) VALUES ('contact', '{
  "email": "vsriaravindan@gmail.com",
  "location": "Chennai, India",
  "responseTime": "Within 24 hours",
  "intro": "Looking for a DevOps engineer to automate your infrastructure, set up CI/CD pipelines, or deploy your next application? Let''s talk."
}') ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content, updated_at = now();

-- 9. Footer
INSERT INTO site_content (section, content) VALUES ('footer', '{
  "available": true,
  "subtitle": "Have infrastructure to automate?",
  "responseText": "Looking for a DevOps engineer to automate your infrastructure or deploy your next application? Let''s talk."
}') ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content, updated_at = now();
