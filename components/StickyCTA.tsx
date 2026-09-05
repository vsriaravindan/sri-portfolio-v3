'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

// Floating CTA bar — appears once user scrolls past 60vh, hides when near
// top or bottom of page. Slim, accent-coloured, single-line.
//
// Used as a secondary affordance to the in-page "Get in touch" footer CTA;
// captures visitors who landed deep on a page and never scroll back to top.
export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const passed = window.scrollY > window.innerHeight * 0.6;
      const nearBottom = window.scrollY > total - window.innerHeight * 0.5;
      setVisible(passed && !nearBottom);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translate(-50%, ${visible ? '0' : '12px'})`,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <Link
        href="/contact"
        className="btn btn-solid flex items-center gap-2 text-[0.7rem] shadow-[0_0_24px_rgba(0,255,65,0.35)]"
      >
        Get in touch
        <ArrowUpRight size={13} className="arrow-nudge" />
      </Link>
    </div>
  );
}
