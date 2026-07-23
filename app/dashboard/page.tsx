'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/supabase-browser';
import Link from 'next/link';
import { Plus, Edit, Trash2, ExternalLink, FileText, Settings, KeyRound } from 'lucide-react';

export default function DashboardPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pwOpen, setPwOpen] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const isAdmin = userEmail === 'vsriaravindan@gmail.com';

  useEffect(() => {
    api.getUser().then(async (u: any) => {
      setUserEmail(u?.email ?? null);
      setUserId(u?.id ?? null);
      if (u?.id) {
        // Admin sees ALL posts; regular users see only their own
        const filter = u.email === 'vsriaravindan@gmail.com'
          ? '' // no filter — all posts
          : `&author_id=eq.${u.id}`;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/posts?select=id,title,slug,published,read_time,created_at,author_id${filter}&order=created_at.desc`,
          { headers: api._headers() }
        );
        const data = await res.json();
        setPosts(data ?? []);
      }
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    const token = localStorage.getItem('sb-at');
    const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
        method: 'DELETE',
        headers: { apikey: ANON_KEY!, Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Delete failed: ${res.status}`);
      }
      setPosts((p) => p.filter((x: any) => x.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePasswordChange = async () => {
    if (!userEmail) return;
    try {
      await api.sendOtp(userEmail, 'password_change');
      // Show OTP modal — the layout handles OTP input
      // The user can now enter OTP in the layout's modal
      setPwMsg('Verification code sent to your email');
    } catch (err: any) {
      setPwMsg(err.message || 'Failed to send OTP');
    }
  };

  const handlePasswordChangeDirect = async () => {
    if (newPw.length < 6) { setPwMsg('Password must be 6+ characters'); return; }
    try {
      await api.updatePassword(newPw);
      setPwMsg('Password updated successfully');
      setNewPw('');
    } catch (err: any) {
      setPwMsg(err.message || 'Failed to update password');
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="display-head text-[length:var(--type-display-md)] leading-[var(--leading-display-md)]">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {userEmail}
            {isAdmin && <span className="ml-2 text-[var(--accent)] text-[0.6rem]">(Admin — all posts visible)</span>}
          </p>
        </div>
        <Link href="/blog/new" className="btn btn-solid text-[0.65rem]">
          <Plus size={12} /> New Post
        </Link>
      </div>

      {/* Quick links */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {isAdmin && (
          <Link href="/dashboard/content" className="card-line card-line-interactive flex items-center gap-3 p-4">
            <Settings size={18} className="text-[var(--accent)]" />
            <div>
              <p className="text-sm font-medium">Site Settings</p>
              <p className="text-[0.65rem] text-[var(--text-muted)]">Edit portfolio content</p>
            </div>
          </Link>
        )}
        <Link href="/dashboard/profile" className="card-line card-line-interactive flex items-center gap-3 p-4">
          <Settings size={18} className="text-[var(--accent)]" />
          <div>
            <p className="text-sm font-medium">Profile</p>
            <p className="text-[0.65rem] text-[var(--text-muted)]">Avatar, name, GitHub link, bio</p>
          </div>
        </Link>
        <Link href="/blog" className="card-line card-line-interactive flex items-center gap-3 p-4">
          <ExternalLink size={18} className="text-[var(--accent)]" />
          <div>
            <p className="text-sm font-medium">View Blog</p>
            <p className="text-[0.65rem] text-[var(--text-muted)]">See published posts</p>
          </div>
        </Link>
        <button onClick={() => setPwOpen(!pwOpen)} className="card-line card-line-interactive flex items-center gap-3 p-4 text-left">
          <KeyRound size={18} className="text-[var(--accent)]" />
          <div>
            <p className="text-sm font-medium">Change Password</p>
            <p className="text-[0.65rem] text-[var(--text-muted)]">Send reset link to email</p>
          </div>
        </button>
      </div>

      {/* Change password form */}
      {pwOpen && (
        <div className="mb-8 rounded-sm border p-4" style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="mono-label text-[0.55rem]">Verify via OTP to change your password</p>
          <div className="mt-3 flex items-end gap-3">
          <button onClick={handlePasswordChange} className="btn btn-solid text-[0.65rem]">
            Send OTP Code
          </button>
          </div>
          {pwMsg && <p className="mt-2 text-sm" style={{ color: pwMsg.includes('sent') ? 'var(--accent)' : 'var(--signal-error)' }}>{pwMsg}</p>}
        </div>
      )}

      {/* Posts list */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="mono-label text-[0.65rem]">Posts</h2>
          <span className="text-[0.6rem] text-[var(--text-muted)]">{posts.length} total</span>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-[var(--text-muted)]">Loading...</p>
        ) : posts.length === 0 ? (
          <div className="rounded-sm border p-8 text-center" style={{ borderColor: 'var(--border-subtle)' }}>
            <FileText size={24} className="mx-auto text-[var(--text-muted)]" />
            <p className="mt-3 text-sm text-[var(--text-secondary)]">No posts yet.</p>
            <Link href="/blog/new" className="btn btn-ghost mt-4 text-[0.65rem]">
              Write your first post
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {posts.map((post: any) => (
              <div key={post.id} className="card-line flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <Link href={`/blog/${post.slug}`} className="text-sm font-medium hover:text-[var(--accent)]">
                    {post.title}
                  </Link>
                  <div className="mt-1 flex items-center gap-3 text-[0.6rem] text-[var(--text-muted)]">
                    <span>{post.published ? 'Published' : 'Draft'}</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    {post.read_time && <span>{post.read_time} min</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/blog/${post.slug}/edit`}
                    className="nav-icon-btn"
                    aria-label="Edit"
                  >
                    <Edit size={12} />
                  </Link>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="nav-icon-btn"
                    aria-label="View"
                  >
                    <ExternalLink size={12} />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="nav-icon-btn"
                    aria-label="Delete"
                  >
                    <Trash2 size={12} style={{ color: 'var(--signal-error)' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
