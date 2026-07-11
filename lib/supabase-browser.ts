import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Bypass the broken GoTrueClient storage entirely — use raw fetch for auth
// The supabase-js client is used only for DB queries (site_content, posts)
export const sbBrowser = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

// Direct REST API auth calls (avoids GoTrueClient storage bug)
const headers = {
  'Content-Type': 'application/json',
  apikey: supabaseAnonKey,
};

export async function signUp(email: string, password: string) {
  const res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || err.error_description || 'Sign up failed');
  }
  return res.json();
}

export async function signIn(email: string, password: string) {
  const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || err.error_description || 'Sign in failed');
  }
  return res.json();
}

export async function signOut() {
  // Get the access token from localStorage if it was set by the raw API call
  const accessToken = localStorage.getItem('sb-access-token');
  if (!accessToken) return;
  await fetch(`${supabaseUrl}/auth/v1/logout`, {
    method: 'POST',
    headers: { ...headers, Authorization: `Bearer ${accessToken}` },
  });
  localStorage.removeItem('sb-access-token');
}
