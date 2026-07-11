'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/supabase-browser';
import { Save, Loader2, ArrowLeft, Camera, Check, ExternalLink } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [displayName, setDisplayName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [bio, setBio] = useState('');
  const [blogHandle, setBlogHandle] = useState('');

  useEffect(() => {
    api.getUser().then(async (u: any) => {
      setUser(u);
      if (u?.id) {
        const p = await api.getProfile(u.id);
        setProfile(p);
        setDisplayName(p?.display_name || '');
        setGithubUrl(p?.github_url || '');
        setBio(p?.bio || '');
        setBlogHandle(p?.blog_handle || '');
      }
      setLoading(false);
    });
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    if (!file.type.startsWith('image/')) { setError('Only image files allowed'); return; }
    if (file.size > 2 * 1024 * 1024) { setError('Max 2MB'); return; }

    setUploading(true);
    setError('');
    try {
      const ext = file.name.split('.').pop() || 'png';
      const path = `${user.id}/avatar.${ext}`;
      const avatarUrl = await api.uploadFile('avatars', path, file);
      setProfile((p: any) => ({ ...p, avatar_url: avatarUrl }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    setError('');
    const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const token = localStorage.getItem('sb-at');
    try {
      const res = await fetch(`${URL}/rest/v1/rpc/upsert_my_profile`, {
        method: 'POST',
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          p_display_name: displayName.trim() || null,
          p_github_url: githubUrl.trim() || null,
          p_bio: bio.trim() || null,
          p_blog_handle: blogHandle.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Profile save failed: ${res.status}`);
      }
      const data = await res.json();
      const updated = Array.isArray(data) ? data[0] : data;
      setProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-[var(--text-secondary)]">Sign in to manage your profile.</p>
        <Link href="/dashboard" className="btn btn-ghost mt-4 text-[0.65rem]">
          <ArrowLeft size={12} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="display-head text-[length:var(--type-display-md)] leading-[var(--leading-display-md)]">
            Profile
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {user.email}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-solid text-[0.65rem]"
        >
          {saving ? (
            <Loader2 size={12} className="animate-spin" />
          ) : saved ? (
            <Check size={12} />
          ) : (
            <Save size={12} />
          )}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-[var(--signal-error)]">{error}</p>
      )}

      {/* Avatar */}
      <div className="mb-8 flex items-center gap-6">
        <div className="relative">
          <div
            className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full"
            style={{
              background: profile?.avatar_url ? 'none' : 'var(--bg-surface)',
              border: '2px solid var(--border-strong)',
            }}
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="font-mono text-xl text-[var(--text-muted)]">
                {(displayName || user.email?.[0] || '?').toUpperCase()}
              </span>
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border"
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-contrast)',
              borderColor: 'var(--accent)',
            }}
          >
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
        <div>
          <p className="text-sm font-medium">{displayName || 'Add a display name'}</p>
          <p className="text-[0.65rem] text-[var(--text-muted)]">Click camera icon to upload photo</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <label className="mono-label text-[0.55rem]">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name on blog posts"
            className="site-input mt-1 w-full px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mono-label text-[0.55rem]">GitHub URL</label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/yourhandle"
            className="site-input mt-1 w-full px-3 py-2 text-sm"
          />
          {profile?.github_username && (
            <p className="mt-1 flex items-center gap-1 text-[0.6rem] text-[var(--text-muted)]">
              <ExternalLink size={10} />
              Connected as @{profile.github_username}
            </p>
          )}
        </div>

        <div>
          <label className="mono-label text-[0.55rem]">Bio (shown under blog posts)</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short bio about yourself"
            rows={3}
            className="site-input mt-1 w-full resize-y px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mono-label text-[0.55rem]">Blog Handle</label>
          <input
            type="text"
            value={blogHandle}
            onChange={(e) => setBlogHandle(e.target.value)}
            placeholder="your-handle"
            className="site-input mt-1 w-full px-3 py-2 font-mono text-sm"
          />
          <p className="mt-1 text-[0.6rem] text-[var(--text-muted)]">
            Public profile URL: /blog/author/{blogHandle || 'your-handle'}
          </p>
        </div>
      </div>
    </div>
  );
}
