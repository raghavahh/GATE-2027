import { useEffect, useState } from 'react';
import { Mail, X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { authSettings } from '../lib/supabase';

/** Supabase's own messages are technical; say what to do instead. */
const friendly = (m: string, step: 'start' | 'code' | 'password') =>
  /rate|too many|security purposes/i.test(m) ? 'Too many codes asked for. Wait a minute, then try again.'
  : /fetch|network/i.test(m) ? 'Network problem. Check your connection and try again.'
  // Accounts are created by email code, so most people have no password: point them back to the code.
  : step === 'password' && /invalid|credentials/i.test(m) ? 'Wrong email or password. Never set a password? Tap "Email me a code instead".'
  : /sending|smtp|mail/i.test(m) ? "We couldn't send the email just now. Try again in a minute, or email us if it keeps failing."
  : /expired|invalid/i.test(m) ? 'That code is wrong or has expired. Ask for a new one.'
  : m;


export function SignInModal({ onClose, reason }: { onClose: () => void; reason?: string }) {
  const { signInGoogle, signInEmail, verifyEmail, signInPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'start' | 'code' | 'password'>('start');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  // Google sign-in appears by itself once the Google provider is switched on in the Supabase dashboard.
  const [GOOGLE, setGoogle] = useState(false);
  useEffect(() => { authSettings().then(st => setGoogle(!!st?.external?.google)); }, []);
  /** Seconds until another code may be sent (protects the email quota from repeated taps). */
  const [wait, setWait] = useState(0);
  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait(w => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const run = async (f: () => Promise<string | null>, ok: () => void) => {
    setBusy(true); setErr('');
    try {
      const e = await f();
      if (e) setErr(friendly(e, step)); else ok();
    } catch (e) {
      setErr(friendly((e as Error).message, step));
    } finally {
      setBusy(false);
    }
  };
  const sendCode = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Enter a valid email address.');
    if (wait > 0) return;
    return run(() => signInEmail(email.trim()), () => { setStep('code'); setCode(''); setWait(60); });
  };
  const check = () => {
    if (!/^\d{6,10}$/.test(code.trim())) return setErr('Enter the code from your email.');
    return run(() => verifyEmail(email.trim(), code.trim()), onClose);
  };
  const withPassword = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Enter a valid email address.');
    if (!password) return setErr('Enter your password.');
    return run(() => signInPassword(email.trim(), password), onClose);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="si-title" onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-t-2xl border border-line bg-surface p-6 sm:rounded-2xl" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        <div className="flex items-start justify-between">
          <div>
            <h2 id="si-title" className="text-lg font-semibold">Sign in</h2>
            <p className="text-sm text-sub">{reason ?? 'Track progress and unlock papers.'}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg text-sub hover:bg-raised"><X size={18} /></button>
        </div>

        {step !== 'code' ? (
          <>
            {GOOGLE && <><button type="button" onClick={signInGoogle} className="btn-ghost mt-5 h-11 w-full">
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
              Continue with Google
            </button>
            <div className="my-5 flex items-center gap-3 text-xs text-mute"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div></>}
            <label htmlFor="si-email" className={`block text-sm font-medium ${GOOGLE ? '' : 'mt-5'}`}>Email</label>
            <input id="si-email" type="email" autoComplete="email" value={email} onChange={e => { setEmail(e.target.value); setErr(''); }}
              placeholder="you@gmail.com" className="mt-1.5 h-11 w-full rounded-lg border border-line bg-page px-3 outline-none focus:border-brand/60" />
            {step === 'password' ? (
              <>
                <label htmlFor="si-pass" className="mt-3 block text-sm font-medium">Password</label>
                <input id="si-pass" type="password" autoComplete="current-password" value={password} onChange={e => { setPassword(e.target.value); setErr(''); }}
                  onKeyDown={e => e.key === 'Enter' && withPassword()}
                  className="mt-1.5 h-11 w-full rounded-lg border border-line bg-page px-3 outline-none focus:border-brand/60" />
                <button type="button" disabled={busy} onClick={withPassword} className="btn-primary mt-3 h-11 w-full">{busy ? 'Signing in…' : 'Sign in'}</button>
                <button type="button" onClick={() => { setStep('start'); setErr(''); }} className="mt-3 w-full text-sm text-sub hover:text-ink">Email me a code instead</button>
              </>
            ) : (
              <>
                <button type="button" disabled={busy || wait > 0} onClick={sendCode} className="btn-primary mt-3 h-11 w-full"><Mail size={16} />{busy ? 'Sending…' : wait > 0 ? `Email me a code (${wait}s)` : 'Email me a code'}</button>
                <button type="button" onClick={() => { setStep('password'); setErr(''); }} className="mt-3 w-full text-sm text-sub hover:text-ink">Sign in with password</button>
              </>
            )}
          </>
        ) : (
          <>
            <p className="mt-5 text-sm text-sub">We emailed <span className="text-ink">{email}</span>. Type the code from that email below, or tap the sign-in link in it.</p>
            <label htmlFor="si-code" className="mt-4 block text-sm font-medium">Code</label>
            <input id="si-code" inputMode="numeric" autoComplete="one-time-code" maxLength={10} value={code} onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setErr(''); }}
              className="mt-1.5 h-11 w-full rounded-lg border border-line bg-page px-3 font-mono tracking-[0.4em] outline-none focus:border-brand/60" />
            <button type="button" disabled={busy} onClick={check} className="btn-primary mt-3 h-11 w-full">{busy ? 'Checking…' : 'Sign in'}</button>
            <div className="mt-3 flex justify-between gap-3 text-sm">
              <button type="button" onClick={() => setStep('start')} className="text-sub hover:text-ink">Use a different email</button>
              <button type="button" disabled={wait > 0 || busy} onClick={sendCode} className="text-sub hover:text-ink disabled:text-mute">{wait > 0 ? `Resend in ${wait}s` : 'Resend code'}</button>
            </div>
          </>
        )}
        {err && <p role="alert" className="mt-3 text-sm text-hard">{err}</p>}
        <p className="mt-5 text-xs text-mute">One account, one active login. Signing in here signs out your other device.</p>
      </div>
    </div>
  );
}
