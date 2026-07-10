'use client';

import { useEffect, useState } from 'react';

export default function IntroOverlay() {
  const [play, setPlay] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('intro');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const played = sessionStorage.getItem('kc:intro');

    if (played || reduced || q === '0' || navigator.webdriver) {
      setPlay(false);
      setVisible(false);
      return;
    }

    sessionStorage.setItem('kc:intro', '1');
    document.documentElement.dataset.intro = 'play';
    setPlay(true);

    const timer = setTimeout(() => {
      document.documentElement.dataset.intro = '';
      setVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible && !play) return null;

  return (
    <div
      className="intro-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
      }}
    >
      {play && (
        <h1
          className="display-head"
          style={{
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            textAlign: 'center',
          }}
        >
          {'Sri Aravindan'.split('').map((char, i) => (
            <span key={i} className="intro-glyph-clip">
              <span
                className="intro-glyph"
                style={{ animationDelay: `${i * 0.045}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            </span>
          ))}
        </h1>
      )}
    </div>
  );
}
