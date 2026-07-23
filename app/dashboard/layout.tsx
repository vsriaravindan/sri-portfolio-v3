'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/supabase-browser';
import Link from 'next/link';
import { ArrowLeft, LogOut, Loader2, CheckCircle } from 'lucide-react';
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

  // OTP state
  const [otpStep, setOtpStep] = useState<'idle' | 'sending' | 'input' | 'verifying' | 'done'>('idle');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpType, setOtpType] = useState<'signup' | 'password_change' | 'forgot_password'>('signup');
  const [otpMsg, setOtpMsg] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(0);

  // Change password state (OTP-gated)
  const [pwNew, setPwNew] = useState('');
  const [pwMsg, setPwMsg] = useState('');

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

  // OTP cooldown timer
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = setInterval(() => setOtpCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [otpCooldown]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'signup') {
        await api.signUp(email, password);
      }
      const userData = await api.signIn(email, password);
      setUser(userData as any);
    } catch (err: any) {
      setError(err.message || 'Auth failed');
    }
  };

  const handleLogout = async () => {
    await api.signOut();
    setUser(null);
  };

  // ── OTP helpers ──
  const startOtp = async (type: 'signup' | 'password_change' | 'forgot_password', targetEmail?: string) => {
    const e = targetEmail || email;
    if (!e) return;
    setOtpStep('sending');
    setOtpType(type);
    setOtpEmail(e);
    setOtpMsg('');
    try {
      await api.sendOtp(e, type);
      setOtpStep('input');
      setOtpCooldown(30);
      setOtp(['', '', '', '', '', '']);
    } catch (err: any) {
      setOtpMsg(err.message || 'Failed to send OTP');
      setOtpStep('idle');
    }
  };

  const handleOtpDigit = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    // Auto-advance
    if (val && idx < 5) {
      const input = document.getElementById(`otp-${idx + 1}`);
      input?.focus();
    }
  };

  const handleOtpKeydown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const input = document.getElementById(`otp-${idx - 1}`);
      input?.focus();
    }
  };

  const submitOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) { setOtpMsg('Enter the full 6-digit code'); return; }
    setOtpStep('verifying');
    setOtpMsg('');
    try {
      await api.verifyOtp(otpEmail, code, otpType);
      setOtpStep('done');
      if (otpType === 'password_change') {
        // After OTP verified, allow password change
        setPwMsg('OTP verified — you can now change your password');
      }
    } catch (err: any) {
      setOtpMsg(err.message || 'Invalid OTP');
      setOtpStep('input');
    }
  };

  const resendOtp = () => {
    if (otpCooldown > 0) return;
    startOtp(otpType, otpEmail);
  };

  const confirmPasswordChange = async () => {
    if (pwNew.length < 6) { setPwMsg('Password must be 6+ characters'); return; }
    try {
      await api.updatePassword(pwNew);
      setPwMsg('Password updated successfully');
      setPwNew('');
      setOtpStep('idle');
    } catch (err: any) {
      setPwMsg(err.message || 'Failed to update password');
    }
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
            {error && <p className="text-sm text-[var(--signal-error)]">{error}</p>}
            <button type="submit" className="btn btn-solid w-full">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'var(--border-subtle)' }} />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 font-mono text-[0.55rem] uppercase tracking-widest" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
                  Or continue with
                </span>
              </div>
            </div>

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

            {mode === 'login' && (
              <button
                type="button"
                onClick={() => startOtp('forgot_password')}
                className="w-full text-center text-[0.55rem] font-mono uppercase tracking-widest hover:text-[var(--accent)]"
                style={{ color: 'var(--text-muted)' }}
              >
                Forgot password?
              </button>
            )}

            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="w-full text-center text-[0.6rem] font-mono uppercase tracking-widest"
              style={{ color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </form>

          {/* Signup OTP prompt */}
          {mode === 'signup' && (
            <div className="mt-6 rounded-sm border p-4" style={{ borderColor: 'var(--border-subtle)' }}>
              <p className="mono-label text-[0.55rem] mb-2">Step 2: Verify your email</p>
              <button
                type="button"
                onClick={() => startOtp('signup', email)}
                disabled={!email}
                className="btn btn-solid w-full text-[0.65rem]"
              >
                {otpStep === 'sending' ? 'Sending...' : 'Send Verification Code'}
              </button>
            </div>
          )}
        </div>

        {/* Global OTP Modal */}
        {(otpStep === 'input' || otpStep === 'verifying') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
            <div className="w-full max-w-sm rounded-sm border p-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-base)' }}>
              <h3 className="text-sm font-semibold">
                {otpType === 'signup' ? 'Verify Email' :
                 otpType === 'password_change' ? 'Change Password' : 'Reset Password'}
              </h3>
              <p className="mt-2 text-[0.65rem]" style={{ color: 'var(--text-muted)' }}>
                Enter the 6-digit code sent to <strong style={{ color: 'var(--text-primary)' }}>{otpEmail}</strong>
              </p>

              {otpStep === 'input' && (
                <>
                  <div className="mt-5 flex justify-center gap-2">
                    {otp.map((d, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleOtpDigit(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeydown(i, e)}
                        className="site-input h-10 w-10 text-center text-sm font-mono"
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>

                  {otpMsg && (
                    <p className={`mt-3 text-center text-[0.6rem] ${otpMsg.includes('Invalid') || otpMsg.includes('Failed') ? 'text-[var(--signal-error)]' : 'text-[var(--accent)]'}`}>
                      {otpMsg}
                    </p>
                  )}

                  <button onClick={submitOtp} className="btn btn-solid mt-5 w-full text-[0.65rem]">
                    Verify Code
                  </button>

                  <div className="mt-3 text-center">
                    <button
                      onClick={resendOtp}
                      disabled={otpCooldown > 0}
                      className="text-[0.55rem] font-mono uppercase tracking-widest hover:text-[var(--accent)] disabled:opacity-40"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : 'Resend code'}
                    </button>
                  </div>
                </>
              )}

              {otpStep === 'verifying' && (
                <div className="flex justify-center py-6">
                  <Loader2 size={20} className="animate-spin" style={{ color: 'var(--accent)' }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* OTP Done Modal */}
        {otpStep === 'done' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
            <div className="w-full max-w-sm rounded-sm border p-6 text-center" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-base)' }}>
              <CheckCircle size={32} className="mx-auto" style={{ color: 'var(--accent)' }} />
              <h3 className="mt-3 text-sm font-semibold">
                {otpType === 'signup' ? 'Email Verified' : 'Identity Confirmed'}
              </h3>
              <p className="mt-2 text-[0.6rem]" style={{ color: 'var(--text-muted)' }}>
                {otpType === 'signup' ? 'Your email has been verified. You can now sign in.' :
                 otpType === 'password_change' ? 'Identity confirmed. Enter your new password below.' :
                 'Identity confirmed. Enter your new password below.'}
              </p>
              <button
                onClick={() => setOtpStep('idle')}
                className="btn btn-ghost mt-4 text-[0.65rem]"
              >
                Continue
              </button>
            </div>
          </div>
        )}
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

      {/* OTP-gated password change section (shown on all dashboard pages via layout) */}
      {otpStep !== 'idle' && (
        <div className="mx-auto max-w-5xl px-6 pt-4">
          <div className="rounded-sm border p-4" style={{ borderColor: 'var(--border-subtle)' }}>
            {otpStep === 'done' && otpType === 'password_change' ? (
              <div className="flex flex-col gap-3">
                <p className="text-[0.6rem] font-mono uppercase tracking-widest text-[var(--accent)]">
                  ✓ Verified — enter new password
                </p>
                <div className="flex gap-3">
                  <input
                    type="password"
                    value={pwNew}
                    onChange={(e) => setPwNew(e.target.value)}
                    placeholder="New password (6+ chars)"
                    className="site-input flex-1 px-3 py-2 text-sm"
                  />
                  <button onClick={confirmPasswordChange} className="btn btn-solid text-[0.65rem]">
                    Update Password
                  </button>
                </div>
                {pwMsg && <p className={`text-[0.6rem] ${pwMsg.includes('successfully') ? 'text-[var(--accent)]' : 'text-[var(--signal-error)]'}`}>{pwMsg}</p>}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-[0.6rem]" style={{ color: 'var(--text-muted)' }}>
                  {otpStep === 'sending' ? 'Sending OTP...' : 'Waiting for OTP verification...'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
    </div>
  );
}
