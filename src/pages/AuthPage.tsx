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
    const token_hash = params.get('token_hash');
    const type = (params.get('type') ?? 'email') as EmailOtpType;
    if (!token_hash) { setErr('This sign-in link is incomplete.'); return; }
    supabase.auth.verifyOtp({ token_hash, type }).then(({ error }) => {
      if (error) setErr('This sign-in link has expired or was already used.');
      else navigate('/me', { replace: true });
    });
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
