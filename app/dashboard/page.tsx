'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/supabase-browser';
import Link from 'next/link';
import { Plus, Edit, Trash2, ExternalLink, FileText, Settings, KeyRound, Star } from 'lucide-react';
import { toast } from '@/components/Toast';

export default function DashboardPage() {
  const router = useRouter();
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
        // Note: 'featured' column only exists after seed-posts-featured-v1.sql
        // is run. Try to fetch it; if the column doesn't exist, fall back
        // gracefully so the dashboard still renders.
        let res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/posts?select=id,title,slug,published,featured,read_time,created_at,author_id${filter}&order=created_at.desc`,
          { headers: api._headers() }
        );
        if (res.status === 400) {
          // Fallback: featured column missing — fetch without it.
          res = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/posts?select=id,title,slug,published,read_time,created_at,author_id${filter}&order=created_at.desc`,
            { headers: api._headers() }
          );
        }
        const data = await res.json();
        // Coerce to array — Supabase error responses are objects, not arrays.
        setPosts(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    const token = localStorage.getItem('sb-at');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
        method: 'DELETE',
        headers: api._headers(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Delete failed: ${res.status}`);
      }
      setPosts((p) => p.filter((x: any) => x.id !== id));
      toast('Post deleted', 'success');
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    if (!isAdmin) return; // only admin can feature
    const token = localStorage.getItem('sb-at');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...api._headers(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !current }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Update failed: ${res.status}`);
      }
      setPosts((p) => p.map((x: any) => (x.id === id ? { ...x, featured: !current } : x)));
      toast(current ? 'Removed from homepage' : 'Featured on homepage', 'success');
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const handlePasswordChange = () => {
    if (!userEmail) return;
    sessionStorage.setItem('otp-email', userEmail);
    sessionStorage.setItem('otp-type', 'password_change');
    router.push('/auth/verify?email=' + encodeURIComponent(userEmail) + '&type=password_change');
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
            <p className="text-[0.65rem] text-[var(--text-muted)]">Verify via OTP to change password</p>
          </div>
        </button>
      </div>

      {/* Change password form */}
      {pwOpen && (
        <div className="mb-8 rounded-sm border p-4" style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="mono-label text-[0.55rem]">Verify via OTP to change your password</p>
          <button onClick={handlePasswordChange} className="btn btn-solid text-[0.65rem]">
          Send OTP Code
          </button>
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
                    {post.featured && (
                      <span style={{ color: 'var(--accent)' }}>★ Featured on home</span>
                    )}
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    {post.read_time && <span>{post.read_time} min</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => handleToggleFeatured(post.id, !!post.featured)}
                      className="nav-icon-btn"
                      aria-label={post.featured ? 'Unfeature from home' : 'Feature on home'}
                      title={post.featured ? 'Unfeature from home' : 'Feature on home'}
                      style={post.featured ? { color: 'var(--accent)' } : undefined}
                    >
                      <Star
                        size={12}
                        fill={post.featured ? 'currentColor' : 'none'}
                      />
                    </button>
                  )}
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
