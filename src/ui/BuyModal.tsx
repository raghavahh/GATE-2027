import { useEffect, useRef, useState } from 'react';
import { Check, Lock, ShieldCheck, X } from 'lucide-react';
import { EDITION, PRICE_INR, PYQ_PRICE_INR, type Paper } from '../catalog';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { SignInModal } from './SignInModal';

declare global { interface Window { Razorpay?: new (o: Record<string, unknown>) => { open: () => void; on: (e: string, f: (r: unknown) => void) => void } } }

/** Rejects if `p` takes longer than `ms` (slow or blocked networks must not leave the button spinning forever). */
const within = <T,>(p: Promise<T>, ms: number, msg: string) =>
  Promise.race([p, new Promise<never>((_, fail) => setTimeout(() => fail(new Error(msg)), ms))]);

function loadCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  document.getElementById('rzp-checkout')?.remove(); // a failed earlier attempt
  return within(new Promise<void>((ok, fail) => {
    const s = document.createElement('script');
    s.id = 'rzp-checkout';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => ok();
    s.onerror = () => fail(new Error('Could not load Razorpay. Check your connection, or turn off any ad blocker.'));
    document.body.appendChild(s);
  }), 15000, 'Razorpay is taking too long to load. Check your connection and try again.');
}

/** Instagram, Facebook, WhatsApp and similar in-app browsers often break UPI app switching. */
const IN_APP = typeof navigator !== 'undefined' && /Instagram|FBAN|FBAV|FB_IAB|WhatsApp|Line\/|Snapchat|; wv\)/i.test(navigator.userAgent);

/** Calls an Edge Function. On a non-2xx reply supabase-js drops the body, so read our { error } message from it. */
async function call(name: string, body: Record<string, unknown>): Promise<{ data?: Record<string, string> & { ok?: boolean }; error?: string }> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (!error) return { data };
  const ctx = (error as { context?: Response }).context;
  const msg = await ctx?.json?.().then((j: { error?: string }) => j.error).catch(() => undefined);
  return { error: msg ?? 'Network problem. Check your connection and try again.' };
}

interface Props {
  paper: Paper;
  topicName?: string;
  counts: { subjects: number; topics: number; videos: number };
  onClose: () => void;
  /** 'paper' (default, ₹49: everything) or 'pyq' (₹20: that paper's previous-year papers only). */
  kind?: 'paper' | 'pyq';
}

export function BuyModal({ paper, topicName, counts, onClose, kind = 'paper' }: Props) {
  const pyq = kind === 'pyq';
  const sku = pyq ? `pyq-${paper.slug}` : paper.slug;
  const price = pyq ? PYQ_PRICE_INR : PRICE_INR;
  const label = pyq ? `${paper.code} PYQs` : paper.code;
  const panel = useRef<HTMLDivElement>(null);
  const { session, papers, refresh } = useAuth();
  const [needSignIn, setNeedSignIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  /** Payment ID that Razorpay took but we couldn't confirm yet: keep checking instead of offering Pay again. */
  const [pending, setPending] = useState('');
  /** Last successful checkout reply, so the background re-check can retry verify-payment too. */
  const lastPaid = useRef<Record<string, string> | null>(null);
  const wantPay = useRef(false);
  const lock = useRef(false); // no closing while signing in or confirming a payment
  const closeRef = useRef(onClose);
  const refreshRef = useRef(refresh);
  useEffect(() => { lock.current = needSignIn || busy; closeRef.current = onClose; refreshRef.current = refresh; });

  async function pay() {
    if (!session) { wantPay.current = true; return setNeedSignIn(true); }
    setBusy(true); setMsg('');
    try {
      await loadCheckout();
      const { data, error } = await within(call('create-order', { paper: sku }), 20000, 'Network problem. Check your connection and try again.');
      if (error && /already own/i.test(error)) { await refresh(); setDone(true); setBusy(false); return; } // paid earlier (e.g. webhook granted it)
      if (error || !data?.orderId) throw new Error(error ?? 'Could not start payment. Try again.');
      // Until Razorpay approves live keys, checkout runs in test mode: real UPI apps can't pay a test QR.
      const test = String(data.keyId).startsWith('rzp_test_');
      let paid = false;
      const rzp = new window.Razorpay!({
        key: data.keyId, order_id: data.orderId, amount: data.amount, currency: 'INR',
        name: 'GATE A–Z', description: test ? 'TEST MODE · no real money · UPI ID: success@razorpay' : `${label} · ${EDITION}`,
        prefill: { email: data.email }, theme: { color: '#F5A524' },
        modal: { ondismiss: () => {
          if (paid) return;
          setBusy(false);
          if (test) { setMsg('Payments are in test mode until launch: real UPI apps and QR codes won’t work yet. To try it, pick UPI and enter success@razorpay.'); return; }
          // A UPI payment can succeed while the browser was in the background and the window was closed:
          // the webhook still grants it, so keep checking for a minute before offering Pay again.
          setMsg('If you already paid, we’re confirming it now. This takes up to a minute.');
          setPending(`order:${data.orderId}`);
        } },
        handler: async (r: Record<string, string>) => {
          paid = true;
          lastPaid.current = r;
          setMsg('Confirming your payment…');
          try {
            let v = await call('verify-payment', r);
            if (!v.data?.ok) { await new Promise(t => setTimeout(t, 3000)); v = await call('verify-payment', r); } // one retry for a flaky network
            await refresh();
            if (v.data?.ok) { setDone(true); setMsg(''); return; }
            setMsg(`${v.error ?? 'We could not confirm the payment yet.'} Checking again automatically. Payment ID: ${r.razorpay_payment_id}`);
          } catch {
            setMsg(`Checking your payment… Payment ID: ${r.razorpay_payment_id}`);
          }
          setPending(r.razorpay_payment_id);
          setBusy(false);
        },
      });
      rzp.on('payment.failed', (r: unknown) => {
        const reason = (r as { error?: { description?: string } })?.error?.description;
        setMsg(`That attempt didn't go through${reason ? `: ${reason}` : ''}. You can try another method in the payment window.`);
      });
      rzp.open();
    } catch (e) {
      setMsg((e as Error).message); setBusy(false);
    }
  }

  // Signed in from the prompt: carry on to payment.
  useEffect(() => {
    if (session && wantPay.current) { wantPay.current = false; setNeedSignIn(false); pay(); }
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  // Payment possibly taken but not confirmed: the webhook grants it. Re-check every 5 s for 2 minutes
  // (and retry verify-payment when we have the checkout reply).
  const owned = papers.includes(sku) || (pyq && papers.includes(paper.slug));
  useEffect(() => {
    if (!pending) return;
    if (owned) { setDone(true); setPending(''); setMsg(''); return; }
    const isOrder = pending.startsWith('order:');
    let n = 0;
    const t = setInterval(() => {
      if (++n > 24) {
        clearInterval(t); setPending('');
        setMsg(isOrder ? '' : `Still confirming. Refresh this page in a few minutes, or email us with Payment ID ${pending}.`);
        return;
      }
      if (lastPaid.current && n % 3 === 0) call('verify-payment', lastPaid.current).catch(() => undefined);
      refreshRef.current();
    }, 5000);
    return () => clearInterval(t);
  }, [pending, owned]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !lock.current) closeRef.current(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus(); };
  }, []);
  const close = () => { if (!lock.current) onClose(); };

  // Only promise what exists today: people are paying for exactly this list.
  const items = pyq ? [
    `Official GATE ${paper.code} question papers and answer keys, every year`,
    'Opens straight from the organising IIT, on any device',
    '1 year of access',
    `Want lectures and notes too? The full ${paper.code} course (₹${PRICE_INR}) includes these PYQs`,
  ] : [
    `All ${counts.topics} topics across ${counts.subjects} subjects, in syllabus order`,
    `${counts.videos} hand-picked videos, playing right here`,
    'Key-point notes, formulas and common mistakes, added topic by topic through the season',
    'Easy / Medium / Hard tag on every topic and progress tracking',
    `${paper.code} previous-year papers with answer keys (worth ₹${PYQ_PRICE_INR}) included`,
  ];

  return (
    <>
    {/* Hidden (not closed) while the sign-in dialog is up, so only one backdrop shows; it returns to finish the payment. */}
    <div className={`fixed inset-0 z-50 items-end justify-center bg-black/60 sm:items-center sm:p-4 ${needSignIn ? 'hidden' : 'flex'}`} onClick={close}>
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="buy-title"
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-t-2xl border border-line bg-surface p-5 outline-none sm:rounded-2xl sm:p-6"
        style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/15 text-brand"><Lock size={18} /></span>
            <div>
              <h2 id="buy-title" className="text-lg font-semibold">Unlock {label} · {EDITION}</h2>
              <p className="text-sm text-sub">{topicName ? `${topicName} is in ${paper.code}` : paper.name}</p>
            </div>
          </div>
          <button type="button" onClick={close} className="grid h-9 w-9 place-items-center rounded-lg text-sub hover:bg-raised" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <ul className="mt-5 space-y-2.5">
          {items.map(t => (
            <li key={t} className="flex gap-2.5 text-[14px]"><Check size={17} className="mt-0.5 shrink-0 text-ok" />{t}</li>
          ))}
        </ul>

        <div className="mt-6 flex items-baseline gap-2">
          <span className="text-3xl font-semibold tnum">₹{price}</span>
          <span className="text-sm text-sub">one payment · 1 year of access</span>
        </div>
        <p className="mt-1 text-xs text-sub">One account, one active login. Each branch is bought separately. No refunds or cancellations after purchase.</p>

        <button type="button" className="btn-primary mt-5 h-11 w-full text-[15px]" disabled={busy || !!pending} onClick={done ? onClose : pay}>
          {done ? `${label} unlocked${pyq ? '' : ' · Start studying'}` : pending ? 'Confirming payment…' : busy ? 'Opening payment…' : `Pay ₹${price} with UPI`}
        </button>
        {msg && <p role="status" className="mt-3 text-center text-sm text-sub">{msg}</p>}
        {IN_APP && !done && <p className="mt-2 text-center text-xs text-mute">Paying from Instagram or WhatsApp? Open this page in Chrome first (⋮ → Open in browser) so the UPI app can return here.</p>}
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-sub">
          <ShieldCheck size={14} /> Secure payment by Razorpay · UPI, cards, netbanking
        </p>
      </div>
    </div>
    {needSignIn && <SignInModal reason={`Sign in to buy ${label}.`} onClose={() => {
      setNeedSignIn(false);
      // Closed without signing in: forget the pending purchase. (After a sign-in the effect above carries on.)
      supabase.auth.getSession().then(({ data }) => { if (!data.session) wantPay.current = false; });
    }} />}
    </>
  );
}
