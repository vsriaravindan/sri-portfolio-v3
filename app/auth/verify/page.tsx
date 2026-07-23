'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/supabase-browser';
import { Loader2, CheckCircle, ArrowLeft, Mail } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || sessionStorage.getItem('otp-email') || '';
  const type = (searchParams.get('type') || sessionStorage.getItem('otp-type') || 'signup') as 'signup' | 'password_change' | 'forgot_password';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'sending' | 'input' | 'verifying' | 'done'>('sending');
  const [msg, setMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Password change state (shown after OTP verification)
  const [pwNew, setPwNew] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => {
    if (!email) {
      router.push('/dashboard');
      return;
    }
    // Auto-send OTP on page load
    sendOtpCode();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const sendOtpCode = async () => {
    setStep('sending');
    setMsg('');
    try {
      await api.sendOtp(email, type);
      setStep('input');
      setCooldown(30);
    } catch (err: any) {
      setMsg(err.message || 'Failed to send OTP');
      setStep('input');
    }
  };

  const handleDigit = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
    // Auto-submit when all 6 digits entered
    if (val && idx === 5) {
      setTimeout(() => submitOtp([...next.slice(0, 5), val].join('')), 200);
    }
  };

  const handleKeydown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const submitOtp = async (code?: string) => {
    const finalCode = code || otp.join('');
    if (finalCode.length !== 6) { setMsg('Enter the full 6-digit code'); return; }
    setStep('verifying');
    setMsg('');
    try {
      await api.verifyOtp(email, finalCode, type);

      if (type === 'password_change' || type === 'forgot_password') {
        // Show password change form
        setStep('done');
        setMsg('Identity confirmed. Enter your new password below.');
      } else {
        // signup — redirect to dashboard
        sessionStorage.removeItem('otp-email');
        sessionStorage.removeItem('otp-type');
        router.push('/dashboard');
      }
    } catch (err: any) {
      setMsg(err.message || 'Invalid OTP');
      setStep('input');
    }
  };

  const handlePasswordChange = async () => {
    if (pwNew.length < 6) { setPwMsg('Password must be 6+ characters'); return; }
    try {
      await api.updatePassword(pwNew);
      sessionStorage.removeItem('otp-email');
      sessionStorage.removeItem('otp-type');
      router.push('/dashboard');
    } catch (err: any) {
      setPwMsg(err.message || 'Failed to update password');
    }
  };

  if (!email) return null;

  return (
    <div className="flex min-h-screen items-center justify-center px-6" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-sm">
        <Link href="/dashboard" className="mono-label inline-flex items-center gap-2 hover:text-[var(--accent)]">
          <ArrowLeft size={14} /> Back
        </Link>

        <div className="mt-8">
          <Mail size={28} className="text-[var(--accent)]" />
          <h1 className="display-head mt-4 text-[length:var(--type-display-md)] leading-[var(--leading-display-md)]">
            {type === 'signup' ? 'Verify Your <em>Email</em>' :
             type === 'password_change' ? 'Confirm Password <em>Change</em>' :
             'Reset Your <em>Password</em>'}
          </h1>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            A 6-digit code was sent to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
          </p>
        </div>

        {/* OTP Input */}
        {step === 'sending' && (
          <div className="flex justify-center py-10">
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
          </div>
        )}

        {step === 'input' && (
          <div className="mt-8">
            <div className="flex justify-center gap-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeydown(i, e)}
                  className="site-input h-12 w-12 text-center text-lg font-mono"
                  autoFocus={i === 0}
                  style={{ fontSize: '1.1rem' }}
                />
              ))}
            </div>

            {msg && (
              <p className={`mt-4 text-center text-sm ${msg.includes('Invalid') || msg.includes('Failed') ? 'text-[var(--signal-error)]' : ''}`}
                 style={{ color: msg.includes('Invalid') || msg.includes('Failed') ? 'var(--signal-error)' : 'var(--accent)' }}>
                {msg}
              </p>
            )}

            <button onClick={() => submitOtp()} className="btn btn-solid mt-6 w-full">
              Verify Code
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={sendOtpCode}
                disabled={cooldown > 0}
                className="w-full text-center text-[0.55rem] font-mono uppercase tracking-widest hover:text-[var(--accent)] disabled:opacity-40"
                style={{ color: 'var(--text-muted)' }}
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
              </button>
            </div>
          </div>
        )}

        {step === 'verifying' && (
          <div className="flex justify-center py-10">
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
          </div>
        )}

        {/* Post-OTP: Password change form */}
        {step === 'done' && (type === 'password_change' || type === 'forgot_password') && (
          <div className="mt-8 rounded-sm border p-5" style={{ borderColor: 'var(--border-subtle)' }}>
            <CheckCircle size={24} className="text-[var(--accent)]" />
            <p className="mt-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Identity Confirmed
            </p>
            <p className="mt-1 text-[0.65rem]" style={{ color: 'var(--text-muted)' }}>
              Enter your new password below.
            </p>

            <div className="mt-5 space-y-3">
              <input
                type="password"
                value={pwNew}
                onChange={(e) => setPwNew(e.target.value)}
                placeholder="New password (6+ characters)"
                className="site-input w-full px-3 py-2 text-sm"
              />
              {pwMsg && (
                <p className={`text-sm ${pwMsg.includes('success') ? 'text-[var(--accent)]' : 'text-[var(--signal-error)]'}`}>
                  {pwMsg}
                </p>
              )}
              <button onClick={handlePasswordChange} className="btn btn-solid w-full">
                Update Password
              </button>
            </div>
          </div>
        )}

        {/* Post-OTP: Signup success */}
        {step === 'done' && type === 'signup' && (
          <div className="mt-8 text-center">
            <CheckCircle size={40} className="mx-auto" style={{ color: 'var(--accent)' }} />
            <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Redirecting to dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
