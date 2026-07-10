import { supabase } from './supabase';
import type { Project } from './projects';
import type { WorkExperience } from './work';

// ── Types ──────────────────────────────────────────────────────────────────

export type SiteConfig = {
  name: string;
  title: string;
  tagline: string;
  description: string;
  author: string;
  url: string;
  locale: string;
  twitterHandle: string;
  social: { github: string; email: string; linkedin: string };
  cta: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string; external: boolean };
  };
};

export type AboutContent = {
  paragraphs: string[];
  quote: string;
  heading: { line1: string; line2: string };
};

export type SkillsContent = {
  categories: { category: string; skills: string[] }[];
};

export type ProjectsContent = {
  projects: Project[];
};

export type WorkContent = {
  entries: WorkExperience[];
};

export type ArticlesContent = {
  articles: { title: string; description: string; url: string; date: string }[];
};

export type ContactContent = {
  email: string;
  location: string;
  responseTime: string;
  intro: string;
};

export type FooterContent = {
  available: boolean;
  subtitle: string;
  responseText: string;
};

export type SiteContent = {
  site_config: SiteConfig;
  about: AboutContent;
  skills: SkillsContent;
  projects: ProjectsContent;
  work: WorkContent;
  articles: ArticlesContent;
  contact: ContactContent;
  footer: FooterContent;
};

// ── Fetch ───────────────────────────────────────────────────────────────────

async function getSection<T>(section: string): Promise<T | null> {
  const { data, error } = await supabase
    .from('site_content')
    .select('content')
    .eq('section', section)
    .single();

  if (error || !data) return null;
  return data.content as T;
}

export async function getSiteConfig(): Promise<SiteConfig | null> {
  return getSection<SiteConfig>('site_config');
}

export async function getAbout(): Promise<AboutContent | null> {
  return getSection<AboutContent>('about');
}

export async function getSkills(): Promise<SkillsContent | null> {
  return getSection<SkillsContent>('skills');
}

export async function getProjects(): Promise<ProjectsContent | null> {
  return getSection<ProjectsContent>('projects');
}

export async function getWork(): Promise<WorkContent | null> {
  return getSection<WorkContent>('work');
}

export async function getArticles(): Promise<ArticlesContent | null> {
  return getSection<ArticlesContent>('articles');
}

export async function getContact(): Promise<ContactContent | null> {
  return getSection<ContactContent>('contact');
}

export async function getFooter(): Promise<FooterContent | null> {
  return getSection<FooterContent>('footer');
}

// ── Update ──────────────────────────────────────────────────────────────────

export async function updateSection(
  section: string,
  content: unknown
): Promise<boolean> {
  const { error } = await supabase
    .from('site_content')
    .upsert({ section, content, updated_at: new Date().toISOString() });

  return !error;
}
