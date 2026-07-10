import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Minimal localStorage adapter that guarantees storage is never undefined
const safeStorage = {
  getItem: (key: string) => {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  setItem: (key: string, value: string) => {
    try { localStorage.setItem(key, value); } catch { /* noop */ }
  },
  removeItem: (key: string) => {
    try { localStorage.removeItem(key); } catch { /* noop */ }
  },
};

export const sbBrowser = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { storage: safeStorage, persistSession: true, autoRefreshToken: true, flowType: 'implicit' },
});
