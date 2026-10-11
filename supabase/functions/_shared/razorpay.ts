// Shared helpers for Razorpay Edge Functions (Deno).
// Secrets come ONLY from Supabase function secrets: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET.
import { createClient } from 'npm:@supabase/supabase-js@2';

export const PRICE_PAISE = 14900;
export const EDITION = 'GATE 2027';
/** Access lasts 1 year from the moment of purchase. */
export const accessUntil = () => new Date(Date.now() + 365 * 86_400_000).toISOString();
/** Papers on sale: only those whose videos are curated. Add one with the SELLABLE_PAPERS secret, no redeploy needed. */
export const PAPERS = new Set((Deno.env.get('SELLABLE_PAPERS') ?? 'cs,da,ec,ee,me').split(',').map(s => s.trim()));

const ALLOWED = (Deno.env.get('ALLOWED_ORIGINS') ?? 'https://gate-az.pages.dev,https://raghavahh.github.io,http://localhost:5173,http://localhost:4173').split(',');

export function cors(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  return {
    'Access-Control-Allow-Origin': ALLOWED.includes(origin) ? origin : ALLOWED[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
}

export const json = (req: Request, body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors(req), 'Content-Type': 'application/json' } });

export const admin = () =>
  createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });

/** Verifies the caller's Supabase login and returns the user. */
export async function userFrom(req: Request) {
  const token = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data, error } = await admin().auth.getUser(token);
  if (error && error.status !== 401 && error.status !== 403) console.error('getUser', error);
  return data.user ?? null;
}

const enc = new TextEncoder();
export async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function rzp(path: string, init: RequestInit = {}) {
  const auth = btoa(`${Deno.env.get('RAZORPAY_KEY_ID')}:${Deno.env.get('RAZORPAY_KEY_SECRET')}`);
  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...init,
    signal: AbortSignal.timeout(10_000),
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`Razorpay ${path} ${res.status} ${await res.text()}`);
  return res.json();
}
