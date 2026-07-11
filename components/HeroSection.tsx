'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { CTA, SITE } from '@/lib/constants';

export default function HeroSection() {
  const [glowVisible, setGlowVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setGlowVisible(true);
  }, []);

  // ── Mouse parallax (desktop) ──
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!sectionRef.current || !nameRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = sectionRef.current!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;

      const letters = nameRef.current!.querySelectorAll('.hero-char');
      letters.forEach((char, i) => {
        const speed = 8 + (i % 5) * 2;
        const x = dx * speed;
        const y = dy * speed;
        const rotate = (dx * dy) * 3;
        (char as HTMLElement).style.setProperty('transform', `translate(${x}px, ${y}px) rotate(${rotate}deg)`, 'important');
      });
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!nameRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const letters = nameRef.current.querySelectorAll('.hero-char');
    letters.forEach((char) => {
      (char as HTMLElement).style.removeProperty('transform');
    });
  }, []);

  // ── Touch parallax (mobile) ──
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!sectionRef.current || !nameRef.current || !e.touches[0]) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = sectionRef.current!.getBoundingClientRect();
      const touch = e.touches[0];
      const dx = (touch.clientX - rect.left) / rect.width - 0.5;
      const dy = (touch.clientY - rect.top) / rect.height - 0.5;

      const letters = nameRef.current!.querySelectorAll('.hero-char');
      letters.forEach((char, i) => {
        const speed = 6 + (i % 5) * 1.5;
        const x = dx * speed;
        const y = dy * speed;
        (char as HTMLElement).style.setProperty('animation', 'none', 'important');
        (char as HTMLElement).style.setProperty('transform', `translate(${x}px, ${y}px)`, 'important');
      });
    });
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!nameRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const letters = nameRef.current.querySelectorAll('.hero-char');
    letters.forEach((char) => {
      (char as HTMLElement).style.removeProperty('transform');
      (char as HTMLElement).style.removeProperty('animation');
      // Re-trigger wave animation by toggling
      void (char as HTMLElement).offsetWidth;
      (char as HTMLElement).style.animation = '';
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);
    section.addEventListener('touchmove', handleTouchMove, { passive: true });
    section.addEventListener('touchend', handleTouchEnd);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
      section.removeEventListener('touchmove', handleTouchMove);
      section.removeEventListener('touchend', handleTouchEnd);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleMouseLeave, handleTouchMove, handleTouchEnd]);

  // Build wave delays: staggered so letters ripple in sequence
  const name = 'Sri Aravindan';
  const delays = name.split('').map((_, i) => `${(i * 0.08).toFixed(2)}s`);

  return (
    <section ref={sectionRef} className="relative min-h-[80vh] overflow-hidden">
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
