'use client';

import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/supabase-browser';
import { Heart, MessageCircle, Send, User, Trash2 } from 'lucide-react';

const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let vid = localStorage.getItem('sv_visitor');
  if (!vid) {
    vid = crypto.randomUUID();
    localStorage.setItem('sv_visitor', vid);
  }
  return vid;
}

function getLikedPosts(): Set<string> {
  try {
    const raw = localStorage.getItem('sv_liked');
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}

function saveLikedPosts(ids: Set<string>) {
  localStorage.setItem('sv_liked', JSON.stringify([...ids]));
}

type Comment = {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  profile?: { display_name: string | null; avatar_url: string | null };
};

export default function BlogActions({ postId }: { postId: string }) {
  const [user, setUser] = useState<any>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);
  const [profiles, setProfiles] = useState<Record<string, { display_name: string | null; avatar_url: string | null }>>({});
  const mounted = useRef(true);

  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);

  // Load user, likes count, liked status, comments
  useEffect(() => {
    api.getUser().then((u: any) => { if (mounted.current) setUser(u); });

    // Fetch likes count
    fetch(`${URL}/rest/v1/likes?post_id=eq.${postId}&select=id`, {
      headers: { apikey: ANON_KEY },
    }).then(r => r.json()).then((data: any) => {
      if (mounted.current) setLikesCount(Array.isArray(data) ? data.length : 0);
    });

    // Check if current visitor has liked
    const vid = getVisitorId();
    if (vid) {
      const likedSet = getLikedPosts();
      if (likedSet.has(postId)) {
        if (mounted.current) setLiked(true);
      } else {
        // Double-check from server
        fetch(`${URL}/rest/v1/likes?post_id=eq.${postId}&visitor_id=eq.${vid}&select=id`, {
          headers: { apikey: ANON_KEY },
        }).then(r => r.json()).then((data: any) => {
          if (Array.isArray(data) && data.length > 0 && mounted.current) {
            setLiked(true);
            const set = getLikedPosts();
            set.add(postId);
            saveLikedPosts(set);
          }
        });
      }
    }

    // Fetch comments
    fetch(`${URL}/rest/v1/comments?post_id=eq.${postId}&order=created_at.desc`, {
      headers: { apikey: ANON_KEY },
    }).then(r => r.json()).then(async (data: any) => {
      const list = (Array.isArray(data) ? data : []) as Comment[];
      if (!mounted.current) return;
      setComments(list);

      // Fetch author profiles for comments
      const authorIds = [...new Set(list.map(c => c.author_id).filter(Boolean))];
      if (authorIds.length > 0) {
        const ids = authorIds.map((id: string) => `id=eq.${id}`).join(',');
        fetch(`${URL}/rest/v1/profiles?${ids}&select=id,display_name,avatar_url`, {
          headers: { apikey: ANON_KEY },
        }).then(r => r.json()).then((profs: any) => {
          if (!mounted.current) return;
          const map: Record<string, any> = {};
          (Array.isArray(profs) ? profs : []).forEach((p: any) => { map[p.id] = p; });
          setProfiles(map);
        });
      }
    });
  }, [postId]);

  const handleLike = async () => {
    const vid = getVisitorId();
    const likedSet = getLikedPosts();

    if (liked) {
      // Unlike
      const res = await fetch(`${URL}/rest/v1/rpc/unlike_post`, {
        method: 'POST',
        headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_post_id: postId, p_visitor_id: vid }),
      });
      if (res.ok) {
        const count = await res.json();
        if (mounted.current) setLikesCount(count);
        likedSet.delete(postId);
        saveLikedPosts(likedSet);
        if (mounted.current) setLiked(false);
      }
    } else {
      // Like
      const res = await fetch(`${URL}/rest/v1/rpc/like_post`, {
        method: 'POST',
        headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_post_id: postId, p_visitor_id: vid }),
      });
      if (res.ok) {
        const count = await res.json();
        if (mounted.current) setLikesCount(count);
        likedSet.add(postId);
        saveLikedPosts(likedSet);
        if (mounted.current) setLiked(true);
      }
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user?.id) return;
    setPosting(true);

    const token = localStorage.getItem('sb-at');
    const body = JSON.stringify([{
      post_id: postId,
      author_id: user.id,
      content: commentText.trim(),
    }]);

    const res = await fetch(`${URL}/rest/v1/comments`, {
      method: 'POST',
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body,
    });

    if (res.ok) {
      const newComments = await res.json();
      setComments((prev) => [...(Array.isArray(newComments) ? newComments : []), ...prev]);
      setCommentText('');
    }
    setPosting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    const token = localStorage.getItem('sb-at');
    const res = await fetch(`${URL}/rest/v1/comments?id=eq.${commentId}`, {
      method: 'DELETE',
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  return (
    <div className="mt-16 border-t pt-10" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="flex items-center gap-6">
        {/* Like button */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm transition-colors ${
            liked ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--accent)]'
          }`}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          <span>{likesCount}</span>
        </button>

        {/* Comment count */}
        <span className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <MessageCircle size={18} />
          <span>{comments.length}</span>
        </span>
      </div>

      {/* Comment form (auth only) */}
      {user ? (
        <form onSubmit={handleComment} className="mt-8 flex gap-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="site-input flex-1 px-3 py-2 text-sm"
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={posting || !commentText.trim()}
            className="btn btn-solid text-[0.6rem] px-4"
          >
            <Send size={12} />
            {posting ? '...' : 'Send'}
          </button>
        </form>
      ) : (
        <p className="mt-8 text-sm text-[var(--text-muted)]">
          <a href="/dashboard" className="hover:text-[var(--accent)]" style={{ textDecoration: 'underline' }}>
            Sign in
          </a>{' '}
          to leave a comment.
        </p>
      )}

      {/* Comments list */}
      {comments.length > 0 && (
        <div className="mt-8 space-y-4">
          {comments.map((comment) => {
            const profile = comment.author_id ? profiles[comment.author_id] : null;
            const isOwner = user?.id === comment.author_id;
            return (
              <div key={comment.id} className="flex gap-3">
                <div className="mt-0.5 shrink-0">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: 'var(--bg-surface)' }}>
                      <User size={12} className="text-[var(--text-muted)]" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.65rem] font-medium">
                      {profile?.display_name || 'User'}
                    </span>
                    <span className="text-[0.55rem] text-[var(--text-muted)]">
                      {new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    {isOwner && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="ml-auto text-[var(--text-muted)] hover:text-[var(--signal-error)]"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{comment.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
