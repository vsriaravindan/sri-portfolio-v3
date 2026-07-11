'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { CTA, SITE } from '@/lib/constants';

export default function HeroSection() {
  const [glowVisible, setGlowVisible] = useState(false);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setGlowVisible(true);
  }, []);

  // Add subtle static glow after reveal animation finishes
  useEffect(() => {
    const name = nameRef.current;
    if (!name) return;
    const timer = setTimeout(() => {
      const chars = name.querySelectorAll<HTMLSpanElement>('.hero-char');
      chars.forEach((c) => c.classList.add('hero-char-revealed'));
    }, 1200); // after all letters have animated in
    return () => clearTimeout(timer);
  }, []);

  // Staggered delays: letters reveal in sequence
  const delays = 'Sri Aravindan'.split('').map((_, i) => `${(i * 0.04).toFixed(2)}s`);

  return (
    <section className="relative min-h-[80vh] overflow-hidden">
      <div className={`hero-glow ${glowVisible ? 'visible' : ''}`} />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
        <p className="mono-label flex items-center gap-2.5">
          <span
            className="inline-block h-[7px] w-[7px] rounded-full"
            style={{
              background: 'var(--accent)',
              boxShadow: '0 0 6px var(--accent), 0 0 12px var(--accent-muted)',
              animation: 'avail-pulse 2.6s var(--ease-out-expo) infinite',
            }}
          />
          Available for opportunities
        </p>

        <h1
          ref={nameRef}
          className="display-head mt-8 text-[length:min(var(--type-display-xl),11.5vw)] leading-[var(--leading-display-xl)]"
        >
          <span className="block">
            {'Sri'.split('').map((char, i) => (
              <span
                key={i}
                className="hero-char inline-block"
                style={{ animationDelay: delays[i] }}
              >
                {char}
              </span>
            ))}
          </span>
          <span className="block">
            {'Aravindan'.split('').map((char, i) => (
              <span
                key={i + 'Sri'.length}
                className="hero-char inline-block"
                style={{ animationDelay: delays[i + 'Sri'.length] }}
              >
                {char}
              </span>
            ))}
          </span>
        </h1>

        <p className="mt-6 max-w-3xl text-[length:var(--type-body-lg)] leading-[var(--leading-body-lg)] text-[var(--text-secondary)]">
          {SITE.tagline}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href={CTA.primary.href} className="btn btn-solid">
            {CTA.primary.label}
          </Link>
          <a
            href={CTA.secondary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            {CTA.secondary.label}
            <span className="arrow-nudge" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
