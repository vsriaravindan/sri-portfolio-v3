'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/supabase-browser';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    // Handle both email confirmation (#access_token) and OAuth (#access_token=...)
    const result = api.handleAuthCallback();
    if (result.error) {
      setStatus('error');
    } else if (result.access_token) {
      setStatus('success');
      // Redirect to dashboard after brief delay
      const t = setTimeout(() => router.push('/dashboard'), 1500);
      return () => clearTimeout(t);
    } else {
      // Check if there's an error in the URL query params
      const searchParams = new URLSearchParams(window.location.search);
      const err = searchParams.get('error') || searchParams.get('error_description');
      if (err) {
        setStatus('error');
      } else {
        // No token found — user probably landed here directly
        setStatus('error');
      }
    }
  }, [router]);

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28 text-center sm:px-10 sm:pt-36">
      {status === 'verifying' && (
        <div>
          <Loader2 size={32} className="mx-auto animate-spin" style={{ color: 'var(--accent)' }} />
          <h1 className="display-head mt-8 text-[length:var(--type-display-md)]">
            Verifying...
          </h1>
        </div>
      )}

      {status === 'success' && (
        <div>
          <CheckCircle size={48} className="mx-auto" style={{ color: 'var(--accent)' }} />
          <h1 className="display-head mt-6 text-[length:var(--type-display-md)]">
            <em>Authenticated</em>
          </h1>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            Redirecting to dashboard...
          </p>
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
