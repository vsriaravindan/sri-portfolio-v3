import { SOCIAL } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { Mail, CodeXml, MapPin, Clock } from 'lucide-react';

const fallbackContact = {
  email: "vsriaravindan@gmail.com",
  location: "Chennai, India",
  responseTime: "Within 24 hours",
  intro: "Looking for a DevOps engineer to automate your infrastructure, set up CI/CD pipelines, or deploy your next application? Let's talk.",
};

export default async function ContactPage() {
  const { data: contactData } = await supabase
    .from('site_content')
    .select('content')
    .eq('section', 'contact')
    .maybeSingle();

  const contact = contactData?.content ?? fallbackContact;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
      <p className="mono-label">Contact</p>
      <h1 className="display-head mt-4 text-[length:var(--type-display-lg)] leading-[var(--leading-display-lg)]">
        Get in <em>Touch</em>
      </h1>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
        {contact.intro}
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <a
          href={`mailto:${contact.email}`}
          className="card-line card-line-interactive flex items-center gap-4 p-6"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-[var(--border-subtle)]">
            <Mail size={18} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-muted)]">
              Email
            </p>
            <p className="mt-0.5 text-sm font-medium">{contact.email}</p>
          </div>
        </a>

        <a
          href={SOCIAL.github}
          target="_blank"
          rel="noopener noreferrer"
          className="card-line card-line-interactive flex items-center gap-4 p-6"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-[var(--border-subtle)]">
            <CodeXml size={18} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-muted)]">
              GitHub
            </p>
            <p className="mt-0.5 text-sm font-medium">vsriaravindan</p>
          </div>
        </a>

        <div className="card-line flex items-center gap-4 p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-[var(--border-subtle)]">
            <MapPin size={18} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-muted)]">
              Location
            </p>
            <p className="mt-0.5 text-sm font-medium">{contact.location}</p>
          </div>
        </div>

        <div className="card-line flex items-center gap-4 p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-[var(--border-subtle)]">
            <Clock size={18} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-muted)]">
              Response Time
            </p>
            <p className="mt-0.5 text-sm font-medium">{contact.responseTime}</p>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-[var(--border-subtle)] pt-8">
        <p className="mono-label">Send a message</p>
        <a href={`mailto:${contact.email}`} className="btn btn-solid mt-6">
          Email me directly
        </a>
      </div>
    </div>
  );
}
