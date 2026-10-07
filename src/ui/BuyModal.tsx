import { useEffect, useRef, useState } from 'react';
import { Check, Lock, ShieldCheck, X } from 'lucide-react';
import { EDITION, PRICE_INR, type Paper } from '../catalog';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { SignInModal } from './SignInModal';

declare global { interface Window { Razorpay?: new (o: Record<string, unknown>) => { open: () => void; on: (e: string, f: (r: unknown) => void) => void } } }

function loadCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((ok, fail) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => ok();
    s.onerror = () => fail(new Error('Could not load Razorpay. Check your connection.'));
    document.body.appendChild(s);
  });
}

interface Props {
  paper: Paper;
  topicName?: string;
  counts: { subjects: number; topics: number; videos: number };
  onClose: () => void;
}

export function BuyModal({ paper, topicName, counts, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const { session, refresh } = useAuth();
  const [needSignIn, setNeedSignIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);

  async function pay() {
    if (!session) return setNeedSignIn(true);
    setBusy(true); setMsg('');
    try {
      await loadCheckout();
      const { data, error } = await supabase.functions.invoke('create-order', { body: { paper: paper.slug } });
      if (error || !data?.orderId) throw new Error(data?.error ?? 'Could not start payment. Try again.');
      const rzp = new window.Razorpay!({
        key: data.keyId, order_id: data.orderId, amount: data.amount, currency: 'INR',
        name: 'GATE A–Z', description: `${paper.code} · ${EDITION}`,
        prefill: { email: data.email }, theme: { color: '#F5A524' },
        modal: { ondismiss: () => setBusy(false) },
        handler: async (r: Record<string, string>) => {
          setMsg('Confirming your payment…');
          const v = await supabase.functions.invoke('verify-payment', { body: r });
          if (v.error || !v.data?.ok) { setMsg(v.data?.error ?? 'If money was deducted, your paper will unlock automatically within a few minutes.'); setBusy(false); return; }
          await refresh(); setDone(true); setBusy(false);
        },
      });
      rzp.on('payment.failed', () => { setMsg("Payment didn't go through. You can try again."); setBusy(false); });
      rzp.open();
    } catch (e) {
      setMsg((e as Error).message); setBusy(false);
    }
  }

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus(); };
  }, [onClose]);

  const items = [
    `All ${counts.topics} topics across ${counts.subjects} subjects, in order`,
    '3–4 hand-picked videos per topic, playing right here',
    'Key-point notes, formulas and common mistakes',
    'Previous-year questions mapped to every topic',
    'Easy / Medium / Hard tags and a focus plan',
  ];

  return (
    <>
    {needSignIn && <SignInModal reason={`Sign in to buy ${paper.code}.`} onClose={() => setNeedSignIn(false)} />}
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4" onClick={onClose}>
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
              <h2 id="buy-title" className="text-lg font-semibold">Unlock {paper.code} · {EDITION}</h2>
              <p className="text-sm text-sub">{topicName ? `You tapped: ${topicName}` : paper.name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-sub hover:bg-raised" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <ul className="mt-5 space-y-2.5">
          {items.map(t => (
            <li key={t} className="flex gap-2.5 text-[14px]"><Check size={17} className="mt-0.5 shrink-0 text-ok" />{t}</li>
          ))}
        </ul>

        <div className="mt-6 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-medium tnum">₹{PRICE_INR}</span>
          <span className="text-sm text-sub">one payment · access till 30 days after the exam</span>
        </div>
        <p className="mt-1 text-xs text-mute">One account, one active login. Each branch is bought separately. No refunds or cancellations after purchase.</p>

        <button type="button" className="btn-primary mt-5 h-11 w-full text-[15px]" disabled={busy} onClick={done ? onClose : pay}>
          {done ? `${paper.code} unlocked · Start studying` : busy ? 'Opening payment…' : `Pay ₹${PRICE_INR} with UPI`}
        </button>
        {msg && <p role="status" className="mt-3 text-center text-sm text-sub">{msg}</p>}
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-mute">
          <ShieldCheck size={14} /> Secure payment by Razorpay · UPI, cards, netbanking
        </p>
      </div>
    </div>
    </>
  );
}
