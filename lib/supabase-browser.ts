const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const authHeaders = { 'Content-Type': 'application/json', apikey: key };

const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

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

  /** Redirect the user to GitHub OAuth. Callback lands on /auth/callback */
  signInWithGithub() {
    const redirectTo = `${baseUrl}/auth/callback`;
    window.location.href = `${url}/auth/v1/authorize?provider=github&redirect_to=${encodeURIComponent(redirectTo)}`;
  },

  /** Handle OAuth callback — parse tokens from URL fragment */
  handleAuthCallback(): { access_token?: string; refresh_token?: string; error?: string } {
    if (typeof window === 'undefined') return {};
    const hash = window.location.hash.replace('#', '');
    const params = new URLSearchParams(hash);
    const searchParams = new URLSearchParams(window.location.search);

    const error = params.get('error') || searchParams.get('error') || searchParams.get('error_description');
    if (error) return { error };

    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (accessToken) {
      setToken(accessToken, refreshToken ?? '');
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
      return { access_token: accessToken, refresh_token: refreshToken ?? '' };
    }
    return {};
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

  async updatePassword(newPassword: string) {
    const token = getToken();
    if (!token) throw new Error('Not logged in');
    const res = await fetch(`${url}/auth/v1/user`, {
      method: 'PUT',
      headers: { ...authHeaders, Authorization: `Bearer ${token}` },
      body: JSON.stringify({ password: newPassword }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.msg || 'Password update failed');
    }
    return res.json();
  },

  async sendPasswordReset(email: string) {
    const res = await fetch(`${url}/auth/v1/recover`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.msg || 'Reset email failed');
    }
    return res.json();
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
      async update(body: any, column: string, value: any) {
        const res = await fetch(`${url}/rest/v1/${table}?${column}=eq.${value}`, {
          method: 'PATCH',
          headers: { ...self._headers(), Prefer: 'return=representation' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `UPDATE ${table} failed`);
        return { data, error: null };
      },
      eq(col: string, val: any) {
        return this; // would need full query builder — use raw fetch for now
      },
    };
  },

  // ── Profile ──
  async getProfile(userId: string) {
    const res = await fetch(`${url}/rest/v1/profiles?id=eq.${userId}&select=*`, {
      headers: this._headers(),
    });
    const data = await res.json();
    return (data ?? [])[0] || null;
  },

  async upsertProfile(profile: Record<string, any>) {
    const res = await fetch(`${url}/rest/v1/profiles`, {
      method: 'POST',
      headers: { ...this._headers(), Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify([profile]),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Profile save failed');
    return (data ?? [])[0];
  },

  // ── Storage ──
  /** Upload a file to a public bucket. Returns the public URL. */
  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    const token = getToken();
    const res = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${token}`,
        'x-upsert': 'true',
        // Don't set Content-Type — fetch auto-sets it with the boundary for binary
      },
      body: file,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Upload failed: ${res.status}`);
    }
    return `${url}/storage/v1/object/public/${bucket}/${path}`;
  },

  /** Delete a file from a bucket */
  async deleteFile(bucket: string, path: string) {
    const token = getToken();
    const res = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
      method: 'DELETE',
      headers: { apikey: key, Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Delete failed: ${res.status}`);
    }
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
