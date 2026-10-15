import { createClient } from '@supabase/supabase-js';

/** Public (publishable) values — safe in the browser. Secret keys never go here. */
const url = import.meta.env.VITE_SUPABASE_URL || 'https://ddrnwwbtlyayvgoloion.supabase.co';
const key = import.meta.env.VITE_SUPABASE_KEY || 'sb_publishable_kbI91ey3RZOxBM10-6CV8Q_hDQlu_Z2';

/** Public auth settings (which sign-in providers are switched on in the Supabase dashboard). */
export const authSettings = (): Promise<{ external?: Record<string, boolean> } | null> =>
  fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } }).then(r => (r.ok ? r.json() : null), () => null);

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
});

export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'raghavendrapithani1@gmail.com';
