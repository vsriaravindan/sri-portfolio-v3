'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import { NAV, CTA } from '@/lib/constants';
import { Sun, Moon, Menu, X } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="site-nav" data-scrolled={scrolled}>
      <div className="nav-row mx-auto flex max-w-6xl items-center justify-between px-6 sm:px-10">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-sm font-medium tracking-wide"
        >
          <span
            className="inline-block h-[7px] w-[7px] rounded-full"
            style={{ background: 'var(--accent)',
              boxShadow: '0 0 6px var(--accent), 0 0 12px var(--accent-muted)' }}
          />
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.13em] text-[var(--text-muted)]">
            Sri Aravindan
          </span>
          <span className="nav-caret" />
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-3 flex items-center gap-2">
            <button
              onClick={toggle}
              className="nav-icon-btn"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun size={14} />
              ) : (
                <Moon size={14} />
              )}
            </button>
            <a
              href={CTA.primary.href}
              className="btn btn-solid text-[0.7rem]"
            >
              {CTA.primary.label}
            </a>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="nav-icon-btn sm:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={14} /> : <Menu size={14} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-base)] px-6 pb-6 pt-4 sm:hidden">
          <div className="flex flex-col gap-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={toggle}
                className="nav-icon-btn"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <a href={CTA.primary.href} className="btn btn-solid flex-1 text-center text-[0.7rem]">
                {CTA.primary.label}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
