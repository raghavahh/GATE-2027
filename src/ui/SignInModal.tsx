import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { googleEnabled } from '../lib/supabase';

/** Sign-in is Google only. An existing account (made earlier with an email code) opens with the same
 *  Gmail: Supabase links the Google login to it automatically, so bought papers stay. */
const friendly = (m: string) =>
  /not enabled|unsupported provider/i.test(m) ? 'Google sign-in is being switched on. Please try again in a few minutes.'
  : /fetch|network/i.test(m) ? 'Network problem. Check your connection and try again.'
  : m;

export function SignInModal({ onClose, reason }: { onClose: () => void; reason?: string }) {
  const { signInGoogle } = useAuth();
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const google = async () => {
    setBusy(true); setErr('');
    try {
      // Supabase sends the browser to a raw error page if the provider is off: check first.
      if ((await googleEnabled()) === false) { setErr('Google sign-in is being switched on. Please try again in a few minutes.'); setBusy(false); return; }
      const e = await signInGoogle(); // on success the browser leaves for Google
      if (e) { setErr(friendly(e)); setBusy(false); }
    } catch (e) {
      setErr(friendly((e as Error).message)); setBusy(false);
    }
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

        <button type="button" disabled={busy} onClick={google} className="btn-primary mt-5 h-12 w-full text-[15px]">
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
          {busy ? 'Opening Google…' : 'Continue with Google'}
        </button>
        <p className="mt-3 text-center text-xs text-sub">Already bought a paper? Use the same Gmail you signed up with: your papers stay in your account.</p>
        {err && <p role="alert" className="mt-3 text-center text-sm text-hard">{err}</p>}
        <p className="mt-5 text-xs text-mute">One account, one active login. Signing in here signs out your other device. Signed up with a non-Gmail address? Email us and we'll move your papers to your Gmail.</p>
      </div>
    </div>
  );
}
