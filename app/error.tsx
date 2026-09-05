'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

// Per-route error boundary. Catches anything thrown by the page or its
// descendants and shows a friendly recovery UI instead of the global
// "Application error" overlay.
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console so you can see it in DevTools. Sentry/PostHog hook would go here.
    console.error('[route error]', error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
      <AlertTriangle size={32} style={{ color: 'var(--signal-warn)' }} />
      <p className="mono-label mt-6 text-[0.65rem]">Something went wrong</p>
      <h1 className="display-head mt-3 text-[length:var(--type-display-md)] leading-[var(--leading-display-md)]">
        This <em>page</em> couldn’t load
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
        We hit an unexpected error rendering this page. The rest of the site
        is unaffected — try again, or head back home.
      </p>
      {error.digest && (
        <p className="mt-3 font-mono text-[0.65rem] text-[var(--text-muted)]">
          digest: {error.digest}
        </p>
      )}
      <div className="mt-8 flex gap-3">
        <button onClick={reset} className="btn btn-solid text-[0.7rem]">
          <RefreshCw size={13} /> Try again
        </button>
        <Link href="/" className="btn btn-ghost text-[0.7rem]">
          <ArrowLeft size={13} /> Go home
        </Link>
      </div>
    </div>
  );
}
