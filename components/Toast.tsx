'use client';

import { useEffect, useState } from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';

type Toast = {
  id: number;
  kind: 'success' | 'error' | 'info';
  message: string;
};

let pushToast: ((t: Omit<Toast, 'id'>) => void) | null = null;

export function toast(message: string, kind: Toast['kind'] = 'info') {
  pushToast?.({ kind, message });
}

export default function ToastHost() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    pushToast = ({ kind, message }) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, kind, message }]);
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    return () => {
      pushToast = null;
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 sm:bottom-6"
    >
      {items.map((t) => {
        const Icon =
          t.kind === 'success' ? Check : t.kind === 'error' ? AlertCircle : Info;
        const color =
          t.kind === 'success'
            ? 'var(--accent)'
            : t.kind === 'error'
            ? 'var(--signal-error)'
            : 'var(--text-secondary)';
        return (
          <div
            key={t.id}
            className="card-line flex max-w-sm items-start gap-3 p-3 shadow-[0_0_24px_rgba(0,0,0,0.4)]"
            role="status"
          >
            <Icon size={14} style={{ color, marginTop: 2, flexShrink: 0 }} />
            <p className="flex-1 text-xs leading-relaxed text-[var(--text-secondary)]">
              {t.message}
            </p>
            <button
              onClick={() =>
                setItems((prev) => prev.filter((x) => x.id !== t.id))
              }
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              aria-label="Dismiss"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
