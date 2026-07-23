'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px]">
      <div
        className="h-full transition-[width] duration-100 ease-out"
        style={{
          width: `${progress * 100}%`,
          background: 'var(--accent)',
          boxShadow: '0 0 8px var(--accent), 0 0 16px color-mix(in srgb, var(--accent) 50%, transparent)',
        }}
      />
    </div>
  );
}
