'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { api } from '@/lib/supabase-browser';
import { subscribeComments, subscribeCommentLikes } from '@/lib/realtime';
import { Heart, MessageCircle, Send, User, Trash2, Reply, Loader2 } from 'lucide-react';

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
  parent_id: string | null;
  likes_count?: number;
  profile?: { display_name: string | null; avatar_url: string | null };
};

export default function BlogActions({ postId }: { postId: string }) {
  const [user, setUser] = useState<any>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [profiles, setProfiles] = useState<Record<string, { display_name: string | null; avatar_url: string | null }>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyingId, setReplyingId] = useState<string | null>(null); // which comment is being replied-to (for the submit)
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [commentLikesCount, setCommentLikesCount] = useState<Record<string, number>>({});
  const [likeLoading, setLikeLoading] = useState<Set<string>>(new Set());
  const mounted = useRef(true);

  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);

  // ── Initial data load ──
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

    // Fetch comments (now includes likes_count from the comments table)
    fetch(`${URL}/rest/v1/comments?post_id=eq.${postId}&select=*,likes_count&order=created_at.desc`, {
      headers: { apikey: ANON_KEY },
    }).then(r => r.json()).then(async (data: any) => {
      const list = (Array.isArray(data) ? data : []) as Comment[];
      if (!mounted.current) return;
      setComments(list);

      // Build likes_count map from comments
      const likesMap: Record<string, number> = {};
      list.forEach(c => { if (c.likes_count) likesMap[c.id] = c.likes_count; });
      setCommentLikesCount(likesMap);

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

  // ── Fetch user's liked comments ──
  useEffect(() => {
    if (!user?.id) return;
    fetch(`${URL}/rest/v1/comment_likes?user_id=eq.${user.id}&select=comment_id`, {
      headers: { apikey: ANON_KEY },
    })
      .then(r => r.json())
      .then((data: any) => {
        if (!mounted.current) return;
        const ids = (Array.isArray(data) ? data : []).map((cl: any) => cl.comment_id);
        setLikedComments(new Set(ids));
      })
      .catch(() => {});
  }, [user?.id]);

  // ── Live comment subscription ──
  useEffect(() => {
    const unsub = subscribeComments(postId, (newComment: any) => {
      if (!mounted.current) return;
      setComments((prev) => {
        if (prev.some((c) => c.id === newComment.id)) return prev;
        const authorId = newComment.author_id as string;
        if (authorId) {
          fetch(`${URL}/rest/v1/profiles?id=eq.${authorId}&select=id,display_name,avatar_url`, {
            headers: { apikey: ANON_KEY },
          })
            .then((r) => r.json())
            .then((profs: any) => {
              if (!mounted.current) return;
              const p = Array.isArray(profs) ? profs[0] : null;
              if (p) setProfiles((prev) => ({ ...prev, [authorId]: p }));
            })
            .catch(() => {});
        }
        const comment: Comment = {
          id: newComment.id as string,
          content: newComment.content as string,
          created_at: newComment.created_at as string,
          author_id: newComment.author_id as string,
          parent_id: (newComment.parent_id as string) ?? null,
          likes_count: 0,
        };
        return [comment, ...prev];
      });
    });
    return () => unsub();
  }, [postId]);

  // ── Live comment likes subscription ──
  useEffect(() => {
    const unsub = subscribeCommentLikes((payload) => {
      if (!mounted.current) return;
      const { type, comment_id, user_id } = payload;

      if (type === 'INSERT') {
        setCommentLikesCount((prev) => ({
          ...prev,
          [comment_id]: (prev[comment_id] ?? 0) + 1,
        }));
        // Mark as liked if current user is the liker
        if (user?.id === user_id) {
          setLikedComments((prev) => new Set(prev).add(comment_id));
        }
      } else {
        setCommentLikesCount((prev) => ({
          ...prev,
          [comment_id]: Math.max(0, (prev[comment_id] ?? 1) - 1),
        }));
        if (user?.id === user_id) {
          setLikedComments((prev) => {
            const next = new Set(prev);
            next.delete(comment_id);
            return next;
          });
        }
      }
    });
    return () => unsub();
  }, [user?.id]);

  // ── Handlers ──

  const handleLike = async () => {
    const vid = getVisitorId();
    const likedSet = getLikedPosts();

    if (liked) {
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
    setCommentError('');

    const token = localStorage.getItem('sb-at');
    try {
      const res = await fetch(`${URL}/rest/v1/rpc/insert_comment`, {
        method: 'POST',
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          p_post_id: postId,
          p_content: commentText.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Comment failed: ${res.status}`);
      }

      const newComment = await res.json();
      if (newComment && user?.id) {
        fetch(`${URL}/rest/v1/profiles?id=eq.${user.id}&select=id,display_name,avatar_url`, {
          headers: { apikey: ANON_KEY },
        })
          .then((r) => r.json())
          .then((profs: any) => {
            if (!mounted.current) return;
            const p = Array.isArray(profs) ? profs[0] : null;
            if (p) setProfiles((prev) => ({ ...prev, [user.id]: p }));
          })
          .catch(() => {});
      }
      const entry: Comment = {
        id: newComment.id as string,
        content: newComment.content as string,
        created_at: newComment.created_at as string,
        author_id: newComment.author_id as string,
        parent_id: null,
        likes_count: 0,
      };
      setComments((prev) => [entry, ...prev]);
      setCommentText('');
    } catch (err: any) {
      setCommentError(err.message || 'Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText('');
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyText.trim() || !user?.id) return;
    setReplyingId(parentId);
    setCommentError('');

    const token = localStorage.getItem('sb-at');
    try {
      const res = await fetch(`${URL}/rest/v1/rpc/insert_comment`, {
        method: 'POST',
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          p_post_id: postId,
          p_content: replyText.trim(),
          p_parent_id: parentId,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Reply failed: ${res.status}`);
      }

      const newComment = await res.json();
      if (newComment && user?.id) {
        fetch(`${URL}/rest/v1/profiles?id=eq.${user.id}&select=id,display_name,avatar_url`, {
          headers: { apikey: ANON_KEY },
        })
          .then((r) => r.json())
          .then((profs: any) => {
            if (!mounted.current) return;
            const p = Array.isArray(profs) ? profs[0] : null;
            if (p) setProfiles((prev) => ({ ...prev, [user.id]: p }));
          })
          .catch(() => {});
      }
      const entry: Comment = {
        id: newComment.id as string,
        content: newComment.content as string,
        created_at: newComment.created_at as string,
        author_id: newComment.author_id as string,
        parent_id: parentId,
        likes_count: 0,
      };
      setComments((prev) => [entry, ...prev]);
      setReplyingTo(null);
      setReplyText('');
    } catch (err: any) {
      setCommentError(err.message || 'Failed to post reply');
    } finally {
      setReplyingId(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    const token = localStorage.getItem('sb-at');
    try {
      const res = await fetch(`${URL}/rest/v1/rpc/delete_comment`, {
        method: 'POST',
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_comment_id: commentId }),
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } else {
        const err = await res.json().catch(() => ({}));
        setCommentError(err.message || 'Delete failed');
      }
    } catch (err: any) {
      setCommentError(err.message || 'Delete failed');
    }
  };

  const handleLikeComment = useCallback(async (commentId: string) => {
    if (!user?.id) return;
    setLikeLoading((prev) => new Set(prev).add(commentId));
    const token = localStorage.getItem('sb-at');
    try {
      const res = await fetch(`${URL}/rest/v1/rpc/like_comment`, {
        method: 'POST',
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_comment_id: commentId }),
      });
      if (res.ok) {
        const count = await res.json();
        if (mounted.current) {
          setCommentLikesCount((prev) => ({ ...prev, [commentId]: count }));
          setLikedComments((prev) => new Set(prev).add(commentId));
        }
      }
    } catch {} finally {
      setLikeLoading((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  }, [user?.id]);

  const handleUnlikeComment = useCallback(async (commentId: string) => {
    if (!user?.id) return;
    setLikeLoading((prev) => new Set(prev).add(commentId));
    const token = localStorage.getItem('sb-at');
    try {
      const res = await fetch(`${URL}/rest/v1/rpc/unlike_comment`, {
        method: 'POST',
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_comment_id: commentId }),
      });
      if (res.ok) {
        const count = await res.json();
        if (mounted.current) {
          setCommentLikesCount((prev) => ({ ...prev, [commentId]: count }));
          setLikedComments((prev) => {
            const next = new Set(prev);
            next.delete(commentId);
            return next;
          });
        }
      }
    } catch {} finally {
      setLikeLoading((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  }, [user?.id]);

  // ── Derived data ──
  const topLevel = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId);

  // ── Render helpers ──

  const CommentRow = ({ comment, isReply }: { comment: Comment; isReply?: boolean }) => {
    const profile = comment.author_id ? profiles[comment.author_id] : null;
    const isOwner = user?.id === comment.author_id;
    const isLiked = likedComments.has(comment.id);
    const likeCount = commentLikesCount[comment.id] ?? comment.likes_count ?? 0;
    const isLoading = likeLoading.has(comment.id);
    const replies = getReplies(comment.id);

    return (
      <div className={isReply ? 'ml-8 border-l-2 pl-4' : ''} style={{ borderLeftColor: isReply ? 'var(--border-subtle)' : undefined }}>
        <div className="flex gap-3 py-3">
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
            </div>
            <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{comment.content}</p>

            <div className="mt-1.5 flex items-center gap-3">
              {/* Like button */}
              {user && (
                <button
                  onClick={() => isLiked ? handleUnlikeComment(comment.id) : handleLikeComment(comment.id)}
                  disabled={isLoading}
                  className={`flex items-center gap-1 text-[0.6rem] transition-colors ${
                    isLiked ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--accent)]'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 size={10} className="animate-spin" />
                  ) : (
                    <Heart size={10} fill={isLiked ? 'currentColor' : 'none'} />
                  )}
                  <span>{likeCount > 0 ? likeCount : ''}</span>
                </button>
              )}

              {/* Reply button */}
              {user && !isReply && (
                <button
                  onClick={() => handleReply(comment.id)}
                  className="flex items-center gap-1 text-[0.6rem] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  <Reply size={10} />
                  Reply
                </button>
              )}

              {/* Delete button */}
              {isOwner && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="ml-auto text-[var(--text-muted)] hover:text-[var(--signal-error)] transition-colors"
                >
                  <Trash2 size={10} />
                </button>
              )}
            </div>

            {/* Inline reply form */}
            {replyingTo === comment.id && (
              <form
                onSubmit={(e) => { e.preventDefault(); handleSubmitReply(comment.id); }}
                className="mt-2 flex gap-2"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="site-input flex-1 px-2 py-1 text-[0.75rem]"
                  maxLength={1000}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={replyingId === comment.id || !replyText.trim()}
                  className="btn btn-solid text-[0.5rem] px-3"
                >
                  {replyingId === comment.id ? (
                    <Loader2 size={10} className="animate-spin" />
                  ) : (
                    <Send size={10} />
                  )}
                </button>
              </form>
            )}

            {/* Nested replies */}
            {replies.length > 0 && (
              <div className="mt-1 space-y-1">
                {replies.map((reply) => (
                  <CommentRow key={reply.id} comment={reply} isReply />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-16 border-t pt-10" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="flex items-center gap-6">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm transition-colors ${
            liked ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--accent)]'
          }`}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          <span>{likesCount}</span>
        </button>
        <span className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <MessageCircle size={18} />
          <span>{comments.length}</span>
        </span>
      </div>

      {/* Top-level comment form */}
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

      {commentError && (
        <p className="mt-4 text-sm" style={{ color: 'var(--signal-error)' }}>{commentError}</p>
      )}

      {/* Comments list */}
      {topLevel.length > 0 && (
        <div className="mt-8 space-y-2">
          {topLevel.map((comment) => (
            <CommentRow key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
