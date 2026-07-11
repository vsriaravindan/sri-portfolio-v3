const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const authHeaders = { 'Content-Type': 'application/json', apikey: key };

// Pure REST — no GoTrueClient, no storage bug
export const api = {
  // ── Auth ──
  async signUp(email: string, password: string) {
    const res = await fetch(`${url}/auth/v1/signup`, {
      method: 'POST', headers: authHeaders,
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.error_description || 'Signup failed');
    if (data.access_token) setToken(data.access_token, data.refresh_token ?? '');
    return data;
  },

  async signIn(email: string, password: string) {
    const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: 'POST', headers: authHeaders,
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.error_description || 'Login failed');
    setToken(data.access_token, data.refresh_token ?? '');
    return data;
  },

  async signOut() {
    const token = getToken();
    if (!token) return;
    await fetch(`${url}/auth/v1/logout`, {
      method: 'POST',
      headers: { ...authHeaders, Authorization: `Bearer ${token}` },
    });
    clearToken();
  },

  async getUser() {
    const token = getToken();
    if (!token) return null;
    const res = await fetch(`${url}/auth/v1/user`, {
      headers: { ...authHeaders, Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return res.ok ? data : null;
  },

  // ── DB Queries (Supabase REST API) ──
  async from(table: string) {
    const self = this;
    return {
      async select(columns = '*') {
        const res = await fetch(`${url}/rest/v1/${table}?select=${columns}`, {
          headers: self._headers(),
        });
        if (!res.ok) throw new Error(`GET ${table} failed: ${res.status}`);
        return { data: await res.json(), error: null };
      },
      async upsert(body: any) {
        const res = await fetch(`${url}/rest/v1/${table}`, {
          method: 'POST',
          headers: { ...self._headers(), Prefer: 'resolution=merge-duplicates' },
          body: JSON.stringify(Array.isArray(body) ? body : [body]),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          return { error: { message: err.message || `UPSERT ${table} failed: ${res.status}` } };
        }
        return { error: null };
      },
      async insert(body: any) {
        const res = await fetch(`${url}/rest/v1/${table}`, {
          method: 'POST',
          headers: { ...self._headers(), Prefer: 'return=representation' },
          body: JSON.stringify(Array.isArray(body) ? body : [body]),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `INSERT ${table} failed`);
        return { data, error: null };
      },
      eq(col: string, val: any) {
        return this; // would need full query builder — use raw fetch for now
      },
    };
  },

  _headers() {
    const token = getToken();
    const h: Record<string, string> = { apikey: key, 'Content-Type': 'application/json' };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  },
};

// ── Token management ──
function setToken(access: string, refresh: string) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem('sb-at', access); localStorage.setItem('sb-rt', refresh); } catch {}
}

function getToken() {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem('sb-at'); } catch { return null; }
}

function clearToken() {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem('sb-at'); localStorage.removeItem('sb-rt'); } catch {}
}
