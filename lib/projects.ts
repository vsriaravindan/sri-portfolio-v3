export type Project = {
  slug: string;
  name: string;
  role: string;
  description: string;
  details: string;
  techStack: string[];
  repo: string;
  liveUrl?: string;
  featured: boolean;
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: "ecommerce",
    name: "Sri-Ecommerce — Live Production Platform",
    role: "Lead Developer & Cloud Infrastructure Architect",
    description:
      "A fully functional, production-grade e-commerce web application featuring secure user authentication, dynamic product catalogs, real-time shopping cart, order processing, and an admin dashboard for inventory management.",
    details:
      "Provisioned and secured the production VPS environment from scratch. Configured Nginx reverse proxy for concurrent traffic with static asset caching. Deployed and hardened the production database with automated daily backup cron jobs. Implemented strict UFW firewall rules, SSL/TLS certificates via Let's Encrypt, and securely isolated environment secrets.",
    techStack: ["Express.js", "React", "PostgreSQL", "Nginx", "Docker", "PM2", "Let's Encrypt"],
    repo: "https://github.com/vsriaravindan/sri-ecommerce",
    liveUrl: "http://140.245.203.57/",
    featured: true,
    highlights: [
      "Provisioned and hardened production VPS from bare metal",
      "Configured Nginx reverse proxy with caching headers",
      "Automated daily database backups with cron",
      "SSL/TLS via Let's Encrypt with auto-renewal",
      "Strict firewall rules and secret isolation",
    ],
  },
  {
    slug: "ledgercalc",
    name: "LedgerCalc — AI-Powered Finance Calculator",
    role: "Developer & DevOps Engineer",
    description:
      "An Android finance calculator that utilizes Google's Gemini AI for intelligent ledger accounting and smart financial insights. Demonstrates integration of cutting-edge AI APIs into real-world mobile applications.",
    details:
      "Built natively for Android using Kotlin and Android Studio. Integrated Google Gemini AI API for intelligent financial analysis. Implemented secure environment variable management for API keys and version-controlled CI configurations for the Android build process.",
    techStack: ["Kotlin", "Android Studio", "Gemini API", "Git", "GitHub Actions"],
    repo: "https://github.com/vsriaravindan/ledgercalc",
    featured: true,
    highlights: [
      "Integrated Google Gemini AI for intelligent accounting",
      "Secure API key management in Android builds",
      "Version-controlled CI pipeline configuration",
      "Clean architecture with MVVM pattern",
    ],
  },
];
