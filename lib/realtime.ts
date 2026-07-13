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
 * Full disconnect — only call when the app no longer needs Realtime at all.
 */
export function disconnectRealtime() {
  if (client) {
    client.disconnect();
    client = null;
  }
}
