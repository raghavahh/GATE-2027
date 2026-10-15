import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { startSync, stopSync } from './sync';

interface AuthState {
  session: Session | null;
  ready: boolean;
  /** Paper slugs this user has paid for and not expired. */
  papers: string[];
  isAdmin: boolean;
  /** True when this login was replaced by a newer login elsewhere. */
  kicked: boolean;
  signInGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);
const redirect = () => `${location.origin}${location.pathname}`;
const CLAIMED = 'gate27:claimed';

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
    const [ent, adm] = await Promise.all([
      supabase.from('entitlements').select('paper, expires_at').gt('expires_at', new Date().toISOString()),
      supabase.rpc('is_admin'),
    ]);
    if (ent.error) console.error('entitlements', ent.error); // keep the last known papers rather than locking a buyer out
    else setPapers(ent.data.map(e => e.paper));
    setIsAdmin(!!adm.data);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); load(data.session).finally(() => setReady(true)); });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      // Supabase calls made inside this callback can deadlock the auth lock, so run them on the next tick.
      setTimeout(async () => {
        // SIGNED_IN also fires when a tab regains focus. Claim only once per login (session id),
        // otherwise two devices would keep taking the session back from each other.
        const sid = sessionIdOf(s);
        if (event === 'SIGNED_IN' && sid && localStorage.getItem(CLAIMED) !== sid) {
          const { error } = await supabase.rpc('claim_session', { p_session: sid });
          if (!error) { localStorage.setItem(CLAIMED, sid); setKicked(false); }
        }
        load(s);
      }, 0);
    });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  // Ticks follow the student across devices while signed in.
  const uid = session?.user.id;
  useEffect(() => {
    if (!uid) return;
    startSync(uid);
    return stopSync;
  }, [uid]);

  // One active login: check every 60s and on focus whether this session is still the active one.
  useEffect(() => {
    if (!session) return;
    const check = async () => {
      const sid = sessionIdOf(session);
      // This browser hasn't claimed this login yet (claim failed or still running): claim it now instead of
      // treating "someone else holds the row" as being kicked. Only a browser that claimed can be kicked.
      if (sid && localStorage.getItem(CLAIMED) !== sid) {
        const { error } = await supabase.rpc('claim_session', { p_session: sid });
        if (!error) { localStorage.setItem(CLAIMED, sid); setKicked(false); }
        return;
      }
      const { data } = await supabase.rpc('is_active_session', { p_session: sid });
      // 'local': end only this browser's session. The default ('global') would also sign out the new device.
      if (data === false) { setKicked(true); await supabase.auth.signOut({ scope: 'local' }); }
    };
    const t = setInterval(check, 60_000);
    window.addEventListener('focus', check);
    return () => { clearInterval(t); window.removeEventListener('focus', check); };
  }, [session]);

  const value: AuthState = {
    session, ready, papers, isAdmin, kicked,
    signInGoogle: async () => {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirect() } });
      return error?.message ?? null;
    },
    signOut: async () => { await supabase.auth.signOut({ scope: 'local' }); }, // this device only; MePage has 'all devices'
    refresh: () => load(session),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside AuthProvider');
  return v;
}
