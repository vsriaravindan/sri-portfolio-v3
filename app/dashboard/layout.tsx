'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/supabase-browser';
import Link from 'next/link';
import { ArrowLeft, LogOut, Loader2 } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    api.getUser().then((user) => {
      setUser(user as any);
      setLoading(false);
    });
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'signup') {
        await api.signUp(email, password);
      }
      const user = await api.signIn(email, password);
      setUser(user as any);
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
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Sign in to manage your portfolio content.
          </p>

          <form onSubmit={handleAuth} className="mt-8 space-y-4">
            <div>
              <label className="mono-label text-[0.6rem]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-sm border bg-transparent px-3 py-2 text-sm"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                required
              />
            </div>
            <div>
              <label className="mono-label text-[0.6rem]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-sm border bg-transparent px-3 py-2 text-sm"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                required
              />
            </div>
            {error && <p className="text-sm text-[var(--signal-error)]">{error}</p>}
            <button type="submit" className="btn btn-solid w-full">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="mono-label w-full text-center text-[0.6rem] hover:text-[var(--accent)]"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
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
          <span className="font-mono text-[0.6rem] text-[var(--text-muted)]">{user.email}</span>
          <button onClick={handleLogout} className="nav-icon-btn">
            <LogOut size={14} />
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
    </div>
  );
}
