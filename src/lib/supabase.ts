import { createClient } from '@supabase/supabase-js';

/** Public (publishable) values — safe in the browser. Secret keys never go here. */
const url = import.meta.env.VITE_SUPABASE_URL || 'https://ddrnwwbtlyayvgoloion.supabase.co';
const key = import.meta.env.VITE_SUPABASE_KEY || 'sb_publishable_kbI91ey3RZOxBM10-6CV8Q_hDQlu_Z2';

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
});

export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'raghavendrapithani1@gmail.com';
