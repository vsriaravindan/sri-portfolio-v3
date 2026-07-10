'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { NAV, SOCIAL } from '@/lib/constants';
import { Search, ExternalLink, ArrowUpRight } from 'lucide-react';

type CmdItem = {
  label: string;
  href: string;
  section: string;
  shortcut?: string;
  external?: boolean;
};

const allItems: CmdItem[] = [
  ...NAV.map((n) => ({ ...n, section: 'Pages' })),
  { label: 'GitHub Profile', href: SOCIAL.github, section: 'Links', external: true },
  { label: 'Send Email', href: `mailto:${SOCIAL.email}`, section: 'Links', external: true },
  { label: 'View Live Demo', href: 'http://140.245.203.57/', section: 'Links', external: true },
];

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = query
    ? allItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  const sections = filtered.reduce<{ section: string; items: CmdItem[] }[]>(
    (acc, item) => {
      const last = acc[acc.length - 1];
      if (last && last.section === item.section) {
        last.items.push(item);
      } else {
        acc.push({ section: item.section, items: [item] });
      }
      return acc;
    },
    []
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((p) => !p);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const toggleHandler = () => setOpen((p) => !p);
    document.addEventListener('keydown', handler);
    window.addEventListener('toggle-cmd-palette', toggleHandler);
    return () => {
      document.removeEventListener('keydown', handler);
      window.removeEventListener('toggle-cmd-palette', toggleHandler);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setActiveIdx(0);
    }
  }, [open]);

  const navigate = useCallback(
    (item: CmdItem) => {
      setOpen(false);
      if (item.external) {
        window.open(item.href, '_blank', 'noopener');
      } else {
        router.push(item.href);
      }
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((p) => Math.min(p + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((p) => Math.max(p - 1, 0));
    } else if (e.key === 'Enter' && filtered[activeIdx]) {
      e.preventDefault();
      navigate(filtered[activeIdx]);
    }
  };

  useEffect(() => {
    const el = listRef.current;
    if (el) {
      const active = el.querySelector('.cmd-item--active');
      if (active) {
        active.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIdx]);

  if (!open) return null;

  let globalIdx = 0;

  return (
    <div
      className="cmd-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="cmd-panel">
        <div className="cmd-input-wrap">
          <Search className="cmd-input-icon" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-input"
            placeholder="Search pages, links..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <span className="cmd-kbd">ESC</span>
        </div>

        <div className="cmd-list" ref={listRef}>
          {filtered.length === 0 && (
            <div className="cmd-empty">No results found.</div>
          )}

          {sections.map((sec) => (
            <div key={sec.section} className="cmd-section">
              <div className="cmd-section-label">{sec.section}</div>
              {sec.items.map((item) => {
                const idx = globalIdx++;
                const active = idx === activeIdx;
                return (
                  <button
                    key={item.href}
                    className={`cmd-item ${active ? 'cmd-item--active' : ''}`}
                    onClick={() => navigate(item)}
                    onMouseEnter={() => setActiveIdx(idx)}
                  >
                    <span className="cmd-item-label">{item.label}</span>
                    {item.external && (
                      <ExternalLink className="cmd-item-external" size={14} />
                    )}
                    {item.shortcut && (
                      <span className="cmd-item-shortcut">{item.shortcut}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="cmd-footer">
          <span />
          <span>
            <span className="cmd-kbd" style={{ marginRight: '0.35rem' }}>
              ↑↓
            </span>
            <span className="cmd-kbd" style={{ marginRight: '0.35rem' }}>
              ↵
            </span>
            select
          </span>
        </div>
      </div>
    </div>
  );
}
