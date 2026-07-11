'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/supabase-browser';
import { Save, Check, Loader2 } from 'lucide-react';

type SectionStatus = { saving: boolean; saved: boolean; error: string };

const sections = [
  { key: 'site_config', label: 'Site Config', desc: 'Name, tagline, social links, CTAs' },
  { key: 'about', label: 'About', desc: 'Bio paragraphs and quote' },
  { key: 'skills', label: 'Skills', desc: 'Skill categories and technologies' },
  { key: 'projects', label: 'Projects', desc: 'Featured projects and details' },
  { key: 'work', label: 'Work', desc: 'Work experience entries' },
  { key: 'articles', label: 'Articles', desc: 'External articles and links' },
  { key: 'contact', label: 'Contact', desc: 'Email, location, response time' },
  { key: 'footer', label: 'Footer', desc: 'Footer text and availability' },
];

export default function ContentPage() {
  const [activeSection, setActiveSection] = useState('site_config');
  const [data, setData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Record<string, SectionStatus>>({});
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const isAdmin = userEmail === 'vsriaravindan@gmail.com';

  useEffect(() => {
    api.getUser().then((user: any) => {
      setUserEmail(user?.email ?? null);
    });
    api.from('site_content').then((tb: any) => tb.select('section,content')).then(({ data }: any) => {
      const rows = data ?? [];
      const map: Record<string, unknown> = {};
      rows.forEach((r: any) => {
        map[r.section] = r.content;
      });
      setData(map);
      setLoading(false);
    });
  }, []);

  const update = (section: string, value: unknown) => {
    setData((prev) => ({ ...prev, [section]: value }));
  };

  const save = async (section: string) => {
    setStatus((prev) => ({ ...prev, [section]: { saving: true, saved: false, error: '' } }));
    const tb = await api.from('site_content');
    const { error } = await tb.upsert({ section, content: data[section], updated_at: new Date().toISOString() });
    if (error) {
      setStatus((prev) => ({ ...prev, [section]: { saving: false, saved: false, error: error.message } }));
    } else {
      setStatus((prev) => ({ ...prev, [section]: { saving: false, saved: true, error: '' } }));
      setTimeout(() => setStatus((prev) => ({ ...prev, [section]: { saving: false, saved: false, error: '' } })), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  const s = status[activeSection] ?? { saving: false, saved: false, error: '' };

  return (
    <div>
      <h1 className="display-head text-[length:var(--type-display-md)] leading-[var(--leading-display-md)]">
        Content
      </h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Edit every piece of text on your portfolio. Changes appear live after saving.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[14rem_1fr]">
        {/* Sidebar nav */}
        <nav className="flex flex-col gap-1">
          {sections.map((sec) => (
            <button
              key={sec.key}
              onClick={() => setActiveSection(sec.key)}
              className="flex flex-col items-start gap-0.5 rounded-sm px-3 py-2 text-left text-sm transition-colors"
              style={{
                background: activeSection === sec.key ? 'var(--accent-soft)' : 'transparent',
                color: activeSection === sec.key ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              <span className="font-medium">{sec.label}</span>
              <span className="text-[0.65rem] opacity-70">{sec.desc}</span>
            </button>
          ))}
        </nav>

        {/* Editor panel */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="mono-label text-[0.65rem]">
              {sections.find((s) => s.key === activeSection)?.label}
            </h2>
            {isAdmin ? (
              <button
                onClick={() => save(activeSection)}
                disabled={s.saving}
                className="btn btn-solid text-[0.65rem]"
              >
                {s.saving ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : s.saved ? (
                  <Check size={12} />
                ) : (
                  <Save size={12} />
                )}
                {s.saving ? 'Saving...' : s.saved ? 'Saved!' : 'Save'}
              </button>
            ) : (
              <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
                Read-only view
              </span>
            )}
          </div>
          {s.error && (
            <p className="mb-4 text-sm text-[var(--signal-error)]">{s.error}</p>
          )}

          {activeSection === 'site_config' && (
            <SiteConfigForm value={data.site_config as any} onChange={(v) => update('site_config', v)} />
          )}
          {activeSection === 'about' && (
            <AboutForm value={data.about as any} onChange={(v) => update('about', v)} />
          )}
          {activeSection === 'skills' && (
            <SkillsForm value={data.skills as any} onChange={(v) => update('skills', v)} />
          )}
          {activeSection === 'projects' && (
            <ProjectsForm value={data.projects as any} onChange={(v) => update('projects', v)} />
          )}
          {activeSection === 'work' && (
            <WorkForm value={data.work as any} onChange={(v) => update('work', v)} />
          )}
          {activeSection === 'articles' && (
            <ArticlesForm value={data.articles as any} onChange={(v) => update('articles', v)} />
          )}
          {activeSection === 'contact' && (
            <ContactForm value={data.contact as any} onChange={(v) => update('contact', v)} />
          )}
          {activeSection === 'footer' && (
            <FooterForm value={data.footer as any} onChange={(v) => update('footer', v)} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Form Components ─────────────────────────────────────────────────────────
// Each form receives `value` (the JSONB content) and `onChange`

function Field({ label, value, onChange, multiline, type }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; type?: string;
}) {
  const inputClass =
    'mt-1 w-full rounded-sm border bg-transparent px-3 py-2 text-sm transition-colors focus:outline-none';
  const style = { borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' } as const;
  const focusStyle = { borderColor: 'var(--accent)' };

  return (
    <div className="mb-4">
      <label className="mono-label text-[0.55rem]">{label}</label>
      {multiline ? (
        <textarea
          className={inputClass + ' min-h-[80px] resize-y'}
          style={style}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) => Object.assign(e.target.style, style)}
        />
      ) : (
        <input
          type={type ?? 'text'}
          className={inputClass}
          style={style}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) => Object.assign(e.target.style, style)}
        />
      )}
    </div>
  );
}

function SiteConfigForm({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const v = value ?? {};
  const set = (key: string, val: any) => onChange({ ...v, [key]: val });
  const setSocial = (key: string, val: string) =>
    onChange({ ...v, social: { ...v.social, [key]: val } });
  const setCTA = (key: string, field: string, val: string) =>
    onChange({
      ...v,
      cta: { ...v.cta, [key]: { ...(v.cta?.[key] ?? {}), [field]: val } },
    });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" value={v.name ?? ''} onChange={(x) => set('name', x)} />
        <Field label="Author" value={v.author ?? ''} onChange={(x) => set('author', x)} />
        <Field label="URL" value={v.url ?? ''} onChange={(x) => set('url', x)} />
        <Field label="Twitter Handle" value={v.twitterHandle ?? ''} onChange={(x) => set('twitterHandle', x)} />
      </div>
      <Field label="Title / Headline" value={v.title ?? ''} onChange={(x) => set('title', x)} />
      <Field label="Tagline" value={v.tagline ?? ''} onChange={(x) => set('tagline', x)} multiline />
      <Field label="Description (SEO)" value={v.description ?? ''} onChange={(x) => set('description', x)} multiline />
      <p className="mono-label text-[0.55rem]">Social Links</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="GitHub" value={v.social?.github ?? ''} onChange={(x) => setSocial('github', x)} />
        <Field label="Email" value={v.social?.email ?? ''} onChange={(x) => setSocial('email', x)} />
        <Field label="LinkedIn" value={v.social?.linkedin ?? ''} onChange={(x) => setSocial('linkedin', x)} />
      </div>
      <p className="mono-label text-[0.55rem]">CTA Buttons</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Primary Label" value={v.cta?.primary?.label ?? ''} onChange={(x) => setCTA('primary', 'label', x)} />
        <Field label="Primary Link" value={v.cta?.primary?.href ?? ''} onChange={(x) => setCTA('primary', 'href', x)} />
      </div>
    </div>
  );
}

function AboutForm({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const v = value ?? { paragraphs: [''], quote: '', heading: { line1: 'Cloud Automation', line2: 'AI-Augmented' } };
  const set = (key: string, val: any) => onChange({ ...v, [key]: val });

  return (
    <div className="space-y-4">
      <p className="mono-label text-[0.55rem]">Heading</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Line 1" value={v.heading?.line1 ?? ''} onChange={(x) => set('heading', { ...v.heading, line1: x })} />
        <Field label="Line 2" value={v.heading?.line2 ?? ''} onChange={(x) => set('heading', { ...v.heading, line2: x })} />
      </div>
      <p className="mono-label text-[0.55rem]">Paragraphs</p>
      {(v.paragraphs as string[] ?? ['']).map((p: string, i: number) => (
        <Field
          key={i}
          label={`Paragraph ${i + 1}`}
          value={p}
          onChange={(x) => {
            const updated = [...(v.paragraphs ?? [])];
            updated[i] = x;
            set('paragraphs', updated);
          }}
          multiline
        />
      ))}
      <button
        onClick={() => set('paragraphs', [...(v.paragraphs ?? []), ''])}
        className="mono-label text-[0.55rem] text-[var(--accent)] hover:underline"
      >
        + Add paragraph
      </button>
      <Field label="Quote" value={v.quote ?? ''} onChange={(x) => set('quote', x)} multiline />
    </div>
  );
}

function SkillsForm({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const v = value ?? { categories: [] };
  const cats = v.categories ?? [];
  const set = (cats: any[]) => onChange({ ...v, categories: cats });

  const updateCat = (i: number, field: string, val: any) => {
    const updated = [...cats];
    updated[i] = { ...updated[i], [field]: val };
    set(updated);
  };

  const updateSkill = (ci: number, si: number, val: string) => {
    const updated = [...cats];
    const skills = [...(updated[ci].skills ?? [])];
    skills[si] = val;
    updated[ci] = { ...updated[ci], skills };
    set(updated);
  };

  const addSkill = (ci: number) => {
    const updated = [...cats];
    updated[ci] = { ...updated[ci], skills: [...(updated[ci].skills ?? []), ''] };
    set(updated);
  };

  const removeSkill = (ci: number, si: number) => {
    const updated = [...cats];
    updated[ci] = { ...updated[ci], skills: updated[ci].skills.filter((_: any, i: number) => i !== si) };
    set(updated);
  };

  return (
    <div className="space-y-6">
      {cats.map((cat: any, ci: number) => (
        <div key={ci} className="rounded-sm border p-4" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between gap-2">
            <Field label="Category" value={cat.category ?? ''} onChange={(x) => updateCat(ci, 'category', x)} />
            <button
              onClick={() => set(cats.filter((_: any, i: number) => i !== ci))}
              className="mono-label shrink-0 text-[0.55rem] text-[var(--signal-error)] hover:underline"
            >
              Remove
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(cat.skills ?? []).map((skill: string, si: number) => (
              <div key={si} className="flex items-center gap-1">
                <input
                  value={skill}
                  onChange={(e) => updateSkill(ci, si, e.target.value)}
                  className="w-28 rounded-sm border bg-transparent px-2 py-1 text-[0.7rem]"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                />
                <button
                  onClick={() => removeSkill(ci, si)}
                  className="text-[0.55rem] text-[var(--signal-error)]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => addSkill(ci)} className="mono-label mt-2 text-[0.5rem] text-[var(--accent)] hover:underline">
            + Add skill
          </button>
        </div>
      ))}
      <button
        onClick={() => set([...cats, { category: '', skills: [''] }])}
        className="mono-label text-[0.55rem] text-[var(--accent)] hover:underline"
      >
        + Add category
      </button>
    </div>
  );
}

function ProjectsForm({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const v = value ?? { projects: [] };
  const projects = v.projects ?? [];
  const set = (p: any[]) => onChange({ ...v, projects: p });

  const update = (i: number, key: string, val: any) => {
    const updated = [...projects];
    updated[i] = { ...updated[i], [key]: val };
    set(updated);
  };

  const updateArr = (i: number, key: string, arr: string[]) => {
    const updated = [...projects];
    updated[i] = { ...updated[i], [key]: arr };
    set(updated);
  };

  return (
    <div className="space-y-8">
      {projects.map((p: any, i: number) => (
        <div key={i} className="rounded-sm border p-4" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between">
            <Field label="Project Name" value={p.name ?? ''} onChange={(x) => update(i, 'name', x)} />
            <label className="flex items-center gap-2 mono-label text-[0.55rem]">
              <input
                type="checkbox"
                checked={p.featured ?? false}
                onChange={(e) => update(i, 'featured', e.target.checked)}
              />
              Featured
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug" value={p.slug ?? ''} onChange={(x) => update(i, 'slug', x)} />
            <Field label="Role" value={p.role ?? ''} onChange={(x) => update(i, 'role', x)} />
          </div>
          <Field label="Description" value={p.description ?? ''} onChange={(x) => update(i, 'description', x)} multiline />
          <Field label="Details" value={p.details ?? ''} onChange={(x) => update(i, 'details', x)} multiline />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Repo URL" value={p.repo ?? ''} onChange={(x) => update(i, 'repo', x)} />
            <Field label="Live URL" value={p.liveUrl ?? ''} onChange={(x) => update(i, 'liveUrl', x)} />
          </div>
          <p className="mono-label mt-4 text-[0.55rem]">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {(p.techStack ?? []).map((t: string, ti: number) => (
              <div key={ti} className="flex items-center gap-1">
                <input
                  value={t}
                  onChange={(e) => {
                    const updated = [...(p.techStack ?? [])];
                    updated[ti] = e.target.value;
                    updateArr(i, 'techStack', updated);
                  }}
                  className="w-28 rounded-sm border bg-transparent px-2 py-1 text-[0.7rem]"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                />
                <button onClick={() => updateArr(i, 'techStack', (p.techStack ?? []).filter((_: any, j: number) => j !== ti))}
                  className="text-[0.55rem] text-[var(--signal-error)]">×</button>
              </div>
            ))}
            <button onClick={() => updateArr(i, 'techStack', [...(p.techStack ?? []), ''])}
              className="mono-label text-[0.5rem] text-[var(--accent)]">+ Add</button>
          </div>
          <p className="mono-label mt-4 text-[0.55rem]">Highlights</p>
          <div className="space-y-2">
            {(p.highlights ?? []).map((h: string, hi: number) => (
              <div key={hi} className="flex items-center gap-2">
                <input
                  value={h}
                  onChange={(e) => {
                    const updated = [...(p.highlights ?? [])];
                    updated[hi] = e.target.value;
                    updateArr(i, 'highlights', updated);
                  }}
                  className="flex-1 rounded-sm border bg-transparent px-2 py-1 text-[0.7rem]"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                />
                <button onClick={() => updateArr(i, 'highlights', (p.highlights ?? []).filter((_: any, j: number) => j !== hi))}
                  className="text-[0.55rem] text-[var(--signal-error)]">×</button>
              </div>
            ))}
            <button onClick={() => updateArr(i, 'highlights', [...(p.highlights ?? []), ''])}
              className="mono-label text-[0.5rem] text-[var(--accent)]">+ Add highlight</button>
          </div>
          <button onClick={() => set(projects.filter((_: any, j: number) => j !== i))}
            className="mono-label mt-4 text-[0.55rem] text-[var(--signal-error)] hover:underline">
            Delete project
          </button>
        </div>
      ))}
      <button onClick={() => set([...projects, { slug: '', name: '', role: '', description: '', details: '', techStack: [], repo: '', highlights: [], featured: false }])}
        className="mono-label text-[0.55rem] text-[var(--accent)] hover:underline">
        + Add project
      </button>
    </div>
  );
}

function WorkForm({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const v = value ?? { entries: [] };
  const entries = v.entries ?? [];
  const set = (e: any[]) => onChange({ ...v, entries: e });

  return (
    <div className="space-y-6">
      {entries.map((entry: any, i: number) => (
        <div key={i} className="rounded-sm border p-4" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between">
            <Field label="Organization" value={entry.organization ?? ''} onChange={(x) => {
              const updated = [...entries]; updated[i] = { ...updated[i], organization: x }; set(updated);
            }} />
            <button onClick={() => set(entries.filter((_: any, j: number) => j !== i))}
              className="mono-label text-[0.55rem] text-[var(--signal-error)]">Remove</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Role" value={entry.role ?? ''} onChange={(x) => {
              const updated = [...entries]; updated[i] = { ...updated[i], role: x }; set(updated);
            }} />
            <Field label="Period" value={entry.period ?? ''} onChange={(x) => {
              const updated = [...entries]; updated[i] = { ...updated[i], period: x }; set(updated);
            }} />
          </div>
          <Field label="Description" value={entry.description ?? ''} onChange={(x) => {
            const updated = [...entries]; updated[i] = { ...updated[i], description: x }; set(updated);
          }} multiline />
        </div>
      ))}
      <button onClick={() => set([...entries, { period: '', role: '', organization: '', description: '' }])}
        className="mono-label text-[0.55rem] text-[var(--accent)] hover:underline">
        + Add entry
      </button>
    </div>
  );
}

function ArticlesForm({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const v = value ?? { articles: [] };
  const articles = v.articles ?? [];
  const set = (a: any[]) => onChange({ ...v, articles: a });

  return (
    <div className="space-y-6">
      {articles.map((article: any, i: number) => (
        <div key={i} className="rounded-sm border p-4" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between">
            <Field label="Title" value={article.title ?? ''} onChange={(x) => {
              const updated = [...articles]; updated[i] = { ...updated[i], title: x }; set(updated);
            }} />
            <button onClick={() => set(articles.filter((_: any, j: number) => j !== i))}
              className="mono-label text-[0.55rem] text-[var(--signal-error)]">Remove</button>
          </div>
          <Field label="Description" value={article.description ?? ''} onChange={(x) => {
            const updated = [...articles]; updated[i] = { ...updated[i], description: x }; set(updated);
          }} multiline />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="URL" value={article.url ?? ''} onChange={(x) => {
              const updated = [...articles]; updated[i] = { ...updated[i], url: x }; set(updated);
            }} />
            <Field label="Date" value={article.date ?? ''} onChange={(x) => {
              const updated = [...articles]; updated[i] = { ...updated[i], date: x }; set(updated);
            }} />
          </div>
        </div>
      ))}
      <button onClick={() => set([...articles, { title: '', description: '', url: '', date: '' }])}
        className="mono-label text-[0.55rem] text-[var(--accent)] hover:underline">
        + Add article
      </button>
    </div>
  );
}

function ContactForm({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const v = value ?? { email: '', location: '', responseTime: '', intro: '' };
  const set = (key: string, val: any) => onChange({ ...v, [key]: val });

  return (
    <div className="space-y-4">
      <Field label="Intro Text" value={v.intro ?? ''} onChange={(x) => set('intro', x)} multiline />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Email" value={v.email ?? ''} onChange={(x) => set('email', x)} />
        <Field label="Location" value={v.location ?? ''} onChange={(x) => set('location', x)} />
        <Field label="Response Time" value={v.responseTime ?? ''} onChange={(x) => set('responseTime', x)} />
      </div>
    </div>
  );
}

function FooterForm({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const v = value ?? { available: true, subtitle: '', responseText: '' };
  const set = (key: string, val: any) => onChange({ ...v, [key]: val });

  return (
    <div className="space-y-4">
      <Field label="Subtitle" value={v.subtitle ?? ''} onChange={(x) => set('subtitle', x)} />
      <Field label="Response Text" value={v.responseText ?? ''} onChange={(x) => set('responseText', x)} multiline />
      <label className="flex items-center gap-2 mono-label text-[0.55rem]">
        <input type="checkbox" checked={v.available ?? false} onChange={(e) => set('available', e.target.checked)} />
        Available for opportunities
      </label>
    </div>
  );
}
