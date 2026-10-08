import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import type { EmailOtpType } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

/** Landing page for the sign-in link in the email (#/auth?token_hash=…&type=email).
 *  Verifies the token itself, so the link works on any device or browser. */
export function AuthPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [err, setErr] = useState('');
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const failed = params.get('error');
    if (failed) { setErr(/expired|invalid/i.test(failed) ? 'This sign-in link has expired or was already used.' : failed); return; }
    const token_hash = params.get('token_hash');
    // Only sign-in link types; anything else in the URL is ignored.
    const t = params.get('type');
    const type: EmailOtpType = t === 'magiclink' || t === 'signup' ? t : 'email';
    if (!token_hash) { setErr('This sign-in link is incomplete.'); return; }
    supabase.auth.verifyOtp({ token_hash, type }).then(({ error }) => {
      if (!error) navigate('/me', { replace: true });
      else if (error.name === 'AuthRetryableFetchError' || error.status === 0) setErr('Network problem. Check your connection and open the link again.');
      else setErr('This sign-in link has expired or was already used.');
    }, () => setErr('Network problem. Check your connection and open the link again.'));
  }, [params, navigate]);

  return (
    <div className="mx-auto max-w-shell px-4 py-24 text-center sm:px-6">
      {err ? (
        <>
          <h1 className="text-xl font-semibold">{err}</h1>
          <p className="mt-2 text-sub">Click Sign in at the top and ask for a new code.</p>
          <Link to="/" className="btn-ghost mt-6">Go home</Link>
        </>
      ) : (
        <h1 className="text-xl font-semibold" aria-busy="true">Signing you in…</h1>
      )}
    </div>
  );
}
