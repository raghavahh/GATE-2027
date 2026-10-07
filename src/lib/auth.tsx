import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthState {
  session: Session | null;
  ready: boolean;
  /** Paper slugs this user has paid for and not expired. */
  papers: string[];
  isAdmin: boolean;
  /** True when this login was replaced by a newer login elsewhere. */
  kicked: boolean;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string) => Promise<string | null>;
  verifyEmail: (email: string, code: string) => Promise<string | null>;
  signInPassword: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);
const redirect = () => `${location.origin}${location.pathname}`;

/** Session id claim inside the access token (used for one-active-login). */
function sessionIdOf(s: Session | null): string | null {
  try {
    return s ? JSON.parse(atob(s.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).session_id ?? null : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [papers, setPapers] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [kicked, setKicked] = useState(false);

  const load = useCallback(async (s: Session | null) => {
    if (!s) { setPapers([]); setIsAdmin(false); return; }
    const [{ data: ent }, { data: adm }] = await Promise.all([
      supabase.from('entitlements').select('paper, expires_at').gt('expires_at', new Date().toISOString()),
      supabase.rpc('is_admin'),
    ]);
    setPapers((ent ?? []).map(e => e.paper));
    setIsAdmin(!!adm);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); load(data.session).finally(() => setReady(true)); });
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, s) => {
      setSession(s);
      if (event === 'SIGNED_IN' && s) {
        await supabase.rpc('claim_session', { p_session: sessionIdOf(s) });
        setKicked(false);
      }
      load(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  // One active login: check every 60s and on focus whether this session is still the active one.
  useEffect(() => {
    if (!session) return;
    const check = async () => {
      const { data } = await supabase.rpc('is_active_session', { p_session: sessionIdOf(session) });
      if (data === false) { setKicked(true); await supabase.auth.signOut(); }
    };
    const t = setInterval(check, 60_000);
    window.addEventListener('focus', check);
    return () => { clearInterval(t); window.removeEventListener('focus', check); };
  }, [session]);

  const value: AuthState = {
    session, ready, papers, isAdmin, kicked,
    signInGoogle: async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirect() } }); },
    signInEmail: async email => {
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect() } });
      return error?.message ?? null;
    },
    verifyEmail: async (email, code) => {
      const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
      return error?.message ?? null;
    },
    signInPassword: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error?.message ?? null;
    },
    signOut: async () => { await supabase.auth.signOut(); },
    refresh: () => load(session),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside AuthProvider');
  return v;
}
