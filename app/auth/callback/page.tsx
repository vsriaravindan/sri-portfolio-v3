'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const params = new URLSearchParams(hash);
    const error = params.get('error') || new URLSearchParams(window.location.search).get('error');

    if (error) {
      setStatus('error');
    } else {
      // Token is in the URL fragment — Supabase handled it
      setStatus('success');
    }
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28 text-center sm:px-10 sm:pt-36">
      {status === 'verifying' && (
        <div>
          <Loader2 size={32} className="mx-auto animate-spin" style={{ color: 'var(--accent)' }} />
          <h1 className="display-head mt-8 text-[length:var(--type-display-md)]">
            Verifying your email...
          </h1>
        </div>
      )}

      {status === 'success' && (
        <div>
          <CheckCircle size={48} className="mx-auto" style={{ color: 'var(--accent)' }} />
          <h1 className="display-head mt-6 text-[length:var(--type-display-md)]">
            Email <em>Verified</em>
          </h1>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            Your email has been confirmed successfully. You can now sign in.
          </p>
          <Link href="/dashboard" className="btn btn-solid mt-8">
            Go to Dashboard
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div>
          <XCircle size={48} className="mx-auto" style={{ color: 'var(--signal-error)' }} />
          <h1 className="display-head mt-6 text-[length:var(--type-display-md)]">
            Verification <em>Failed</em>
          </h1>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            The confirmation link was invalid or expired. Try signing up again.
          </p>
          <Link href="/dashboard" className="btn btn-solid mt-8">
            Back to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
