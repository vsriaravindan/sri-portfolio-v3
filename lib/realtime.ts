import { RealtimeClient } from '@supabase/realtime-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const WS_URL = URL.replace('https://', 'wss://') + '/realtime/v1';

let client: RealtimeClient | null = null;

function getClient(): RealtimeClient {
  if (!client) {
    client = new RealtimeClient(WS_URL, {
      params: { apikey: ANON_KEY },
    });
    client.connect();
  }
  return client;
}

/**
 * Subscribe to new comments on a given post.
 * Returns an unsubscribe function — call it on cleanup (component unmount).
 */
export function subscribeComments(
  postId: string,
  callback: (comment: Record<string, unknown>) => void,
): () => void {
  const c = getClient();
  const channel = c.channel(`comments:${postId}`);

  channel.on(
    'postgres_changes' as any,
    {
      event: 'INSERT',
      schema: 'public',
      table: 'comments',
      filter: `post_id=eq.${postId}`,
    },
    (payload: { new: Record<string, unknown> }) => {
      callback(payload.new);
    },
  );

  channel.subscribe();

  return () => {
    c.removeChannel(channel);
  };
}

/**
 * Subscribe to new comment likes (INSERT) and unlikes (DELETE) on this post's comments.
 * Returns an unsubscribe function.
 * The callback receives { type: 'INSERT'|'DELETE', comment_id: string, user_id: string, count: number? }
 * `count` is only available on INSERT (from the like_comment RPC response — not from Realtime; 
 *  we re-fetch from the comment row for accuracy).
 */
export function subscribeCommentLikes(
  callback: (payload: { type: 'INSERT' | 'DELETE'; comment_id: string; user_id: string }) => void,
): () => void {
  const c = getClient();
  const channel = c.channel('comment-likes');

  channel.on(
    'postgres_changes' as any,
    { event: 'INSERT', schema: 'public', table: 'comment_likes' },
    (payload: { new: { comment_id: string; user_id: string } }) => {
      callback({ type: 'INSERT', comment_id: payload.new.comment_id, user_id: payload.new.user_id });
    },
  );

  channel.on(
    'postgres_changes' as any,
    { event: 'DELETE', schema: 'public', table: 'comment_likes' },
    (payload: { old: { comment_id: string; user_id: string } }) => {
      callback({ type: 'DELETE', comment_id: payload.old.comment_id, user_id: payload.old.user_id });
    },
  );

  channel.subscribe();

  return () => {
    c.removeChannel(channel);
  };
}

/**
 * Full disconnect — only call when the app no longer needs Realtime at all.
 */
export function disconnectRealtime() {
  if (client) {
    client.disconnect();
    client = null;
  }
}
