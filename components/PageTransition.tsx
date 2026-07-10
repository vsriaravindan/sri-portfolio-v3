'use client';

import { useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const EASE: [number, number, number, number] = [0.2, 0.74, 0.2, 1];
const EFFECTS = ['stagger-wipe', 'pixels', 'blinds'] as const;
const DURATIONS: Record<string, number> = { 'stagger-wipe': 950, pixels: 750, blinds: 850 };

type VeilEffect = (typeof EFFECTS)[number];

let firstLoad = true;

function getEffect(): VeilEffect {
  if (typeof window === 'undefined') return 'stagger-wipe';
  const stored = window.sessionStorage.getItem('cmd:veil-effect');
  if (EFFECTS.includes(stored as VeilEffect)) return stored as VeilEffect;
  const pick = EFFECTS[Math.floor(Math.random() * EFFECTS.length)];
  window.sessionStorage.setItem('cmd:veil-effect', pick);
  return pick;
}

function StaggerWipe() {
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <motion.span
          key={i}
          className="absolute top-0 h-full bg-[var(--accent)]"
          style={{ left: `${(100 * i) / 8}%`, width: '13.1%' }}
          initial={{ y: '0%' }}
          animate={{ y: '-102%' }}
          transition={{ duration: 0.5, delay: 0.05 * i, ease: EASE }}
        />
      ))}
    </>
  );
}

function Blinds() {
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => (
        <motion.span
          key={i}
          className="absolute left-0 w-full origin-top bg-[var(--accent)]"
          style={{ top: `${(100 * i) / 12}%`, height: '8.93333%' }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.45, delay: 0.04 * i, ease: EASE }}
        />
      ))}
    </>
  );
}

function Pixels({ delays }: { delays: number[] }) {
  const cols = 12;
  const rows = 8;
  return (
    <div className="grid h-full w-full grid-cols-12 grid-rows-8">
      {Array.from({ length: cols * rows }, (_, i) => (
        <motion.span
          key={i}
          className="bg-[var(--accent)]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.35, delay: delays[i] ?? 0, ease: EASE }}
        />
      ))}
    </div>
  );
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [veilVisible, setVeilVisible] = useState(false);
  const [effect, setEffect] = useState<VeilEffect>('stagger-wipe');
  const [pixelDelays] = useState(() =>
    Array.from({ length: 96 }, () => 0.5 * Math.random())
  );
  const prevPath = useRef(pathname);

  const navigate = useCallback(() => {
    if (firstLoad) {
      firstLoad = false;
      return;
    }

    const eff = getEffect();
    setEffect(eff);
    setVeilVisible(true);

    const timeout = setTimeout(() => {
      setVeilVisible(false);
    }, DURATIONS[eff]);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      navigate();
    }
  }, [pathname, navigate]);

  return (
    <>
      <AnimatePresence>
        {veilVisible && (
          <motion.div
            key="veil"
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {effect === 'stagger-wipe' && <StaggerWipe />}
            {effect === 'blinds' && <Blinds />}
            {effect === 'pixels' && <Pixels delays={pixelDelays} />}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={pathname}
        data-page-transition
        data-entrance={!firstLoad ? 'animated' : 'static'}
        initial={!firstLoad ? { opacity: 0.55, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        {children}
      </motion.div>
    </>
  );
}
