'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/supabase-browser';
import Link from 'next/link';
import { ArrowLeft, LogOut, Loader2 } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    api.getUser().then(async (u: any) => {
      setUser(u as any);
      if (u?.id && u?.user_metadata?.avatar_url) {
        try {
          const p = await api.getProfile(u.id);
          if (!p?.avatar_url) {
            const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
            const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const token = localStorage.getItem('sb-at');
            await fetch(`${URL}/rest/v1/rpc/upsert_my_profile`, {
              method: 'POST',
              headers: { apikey: ANON_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                p_avatar_url: u.user_metadata.avatar_url,
                p_display_name: u.user_metadata.full_name || u.user_metadata.name || null,
                p_github_url: u.user_metadata.user_name ? `https://github.com/${u.user_metadata.user_name}` : null,
                p_github_username: u.user_metadata.user_name || null,
              }),
            });
          }
        } catch {}
      }
      setLoading(false);
    });
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'signup') {
        await api.signUp(email, password);
        // Store email + password in sessionStorage for OTP verify page to auto-login
        sessionStorage.setItem('otp-email', email);
        sessionStorage.setItem('otp-pw', password);
        sessionStorage.setItem('otp-type', 'signup');
        router.push('/auth/verify?email=' + encodeURIComponent(email) + '&type=signup');
        return;
      }
      // Login
      await api.signIn(email, password);
      // Re-fetch user to update UI
      const u = await api.getUser();
      setUser(u as any);
    } catch (err: any) {
      setError(err.message || 'Auth failed');
    }
  };

  const handleLogout = async () => {
    await api.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6" style={{ background: 'var(--bg-base)' }}>
        <div className="w-full max-w-sm">
          <Link href="/" className="mono-label inline-flex items-center gap-2 hover:text-[var(--accent)]">
            <ArrowLeft size={14} /> Back to site
          </Link>
          <h1 className="display-head mt-6 text-[length:var(--type-display-md)] leading-[var(--leading-display-md)]">
            Dashboard
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {mode === 'login' ? 'Sign in to manage your portfolio content.' : 'Create an account to get started.'}
          </p>

          <form onSubmit={handleAuth} className="mt-8 space-y-4">
            <div>
              <label className="mono-label text-[0.6rem]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="site-input mt-1 w-full px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="mono-label text-[0.6rem]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="site-input mt-1 w-full px-3 py-2 text-sm"
                required
              />
            </div>
            {error && <p className="text-sm" style={{ color: 'var(--signal-error)' }}>{error}</p>}

            <button type="submit" className="btn btn-solid w-full">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            {/* Separator */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'var(--border-subtle)' }} />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 font-mono text-[0.55rem] uppercase tracking-widest"
                      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* GitHub OAuth */}
            <button
              type="button"
              onClick={() => api.signInWithGithub()}
              className="btn btn-ghost w-full gap-2 text-[0.65rem]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sign in with GitHub
            </button>

            {/* Forgot password — animated underline */}
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => {
                  if (!email) { setError('Enter your email first'); return; }
                  sessionStorage.setItem('otp-email', email);
                  sessionStorage.setItem('otp-type', 'forgot_password');
                  router.push('/auth/verify?email=' + encodeURIComponent(email) + '&type=forgot_password');
                }}
                className="group relative w-full text-center text-[0.55rem] font-mono uppercase tracking-widest transition-colors duration-150 hover:text-[var(--accent)]"
                style={{ color: 'var(--text-muted)' }}
              >
                Forgot password?
                <span className="absolute bottom-[-2px] left-1/2 h-[1px] w-0 -translate-x-1/2 bg-[var(--accent)] transition-all duration-300 group-hover:w-1/2" />
              </button>
            )}

            {/* Mode toggle — animated underline + accent color */}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="group relative w-full text-center text-[0.6rem] font-mono uppercase tracking-widest transition-colors duration-150 hover:text-[var(--accent)]"
              style={{ color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              <span className="absolute bottom-[-2px] left-1/2 h-[1px] w-0 -translate-x-1/2 bg-[var(--accent)] transition-all duration-300 group-hover:w-3/4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <header
        className="flex items-center justify-between border-b px-6 py-3"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="mono-label text-[0.6rem] hover:text-[var(--accent)]">
            <ArrowLeft size={14} className="inline" /> Site
          </Link>
          <span className="mono-label text-[0.6rem]" style={{ color: 'var(--text-muted)' }}>
            Dashboard
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.6rem]" style={{ color: 'var(--text-muted)' }}>{user.email}</span>
          <button onClick={handleLogout} className="nav-icon-btn">
            <LogOut size={14} />
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
    </div>
  );
}
