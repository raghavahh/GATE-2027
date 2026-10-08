import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { EDITION, getPaper, paperStats } from '../catalog';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import { Bar } from '../ui/bits';
import { Loading } from './Static';

interface Ent { paper: string; edition: string; expires_at: string; payment_id: string | null; amount_paise: number; created_at: string }

const EXAM = new Date('2027-02-06T09:00:00+05:30'); // update when official dates are announced

export function MePage() {
  const { session, ready } = useAuth();
  const { progress } = useStore();
  const [ents, setEnts] = useState<Ent[] | null>(null);
  const [err, setErr] = useState(false);
  const uid = session?.user.id;

  useEffect(() => {
    setEnts(null); setErr(false);
    if (!uid) return;
    let live = true;
    supabase.from('entitlements').select('paper, edition, expires_at, payment_id, amount_paise, created_at').order('created_at', { ascending: false })
      .then(({ data, error }) => { if (!live) return; if (error) setErr(true); else setEnts(data as Ent[]); });
    return () => { live = false; };
  }, [uid]);

  if (!ready) return <Loading />;
  if (!session) {
    return (
      <div className="mx-auto max-w-shell px-4 py-24 text-center sm:px-6">
        <h1 className="text-xl font-semibold">Sign in to see your papers</h1>
        <button type="button" className="btn-primary mt-6" onClick={() => window.dispatchEvent(new Event('open-signin'))}>Sign in</button>
      </div>
    );
  }
  if (!ents && !err) return <Loading />;
  const list = ents ?? [];

  const days = Math.max(0, Math.ceil((EXAM.getTime() - Date.now()) / 86_400_000));
  const doneIn = (slug: string) => Object.entries(progress).filter(([id, s]) => s === 'done' && id.startsWith(`${slug}-`)).length;

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-sub">{session.user.email}</p>
          <h1 className="mt-1 text-3xl font-semibold">Your papers</h1>
        </div>
        <div className="card px-4 py-3 text-right">
          <p className="font-mono text-2xl tnum">{days}</p>
          <p className="text-xs text-sub">days to {EDITION} (6 Feb 2027)</p>
        </div>
      </div>

      {err && <p role="alert" className="card mt-8 p-4 text-hard">Couldn't load your papers. Check your connection and refresh. Your purchases are safe.</p>}
      {err ? null : list.length === 0 ? (
        <div className="card mt-8 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3"><BookOpen className="shrink-0 text-brand" /><div><p className="font-medium">No papers yet</p><p className="text-sub">Pick your GATE paper and start with its free sample topics.</p></div></div>
          <Link to="/papers" className="btn-primary">Choose your paper</Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {list.map(e => {
            const p = getPaper(e.paper);
            const total = paperStats(e.paper).topics;
            const done = doneIn(e.paper);
            const active = new Date(e.expires_at) > new Date();
            return (
              <li key={e.paper + e.edition} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm text-brand">{e.paper.toUpperCase()} · {e.edition}</p>
                    <p className="mt-1 font-medium">{p?.name}</p>
                  </div>
                  <span className={`chip ${active ? 'bg-ok/10 text-ok' : 'bg-raised text-mute'}`}>{active ? 'Active' : 'Expired'}</span>
                </div>
                <div className="mt-4 flex justify-between text-xs text-sub"><span>{done}/{total} topics done</span><span>Access till {new Date(e.expires_at).toLocaleDateString('en-IN')}</span></div>
                <Bar value={done} total={total} className="mt-2" />
                <Link to={`/${e.paper}`} className="btn-ghost mt-4 w-full">Continue <ArrowRight size={15} /></Link>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="mt-12 text-lg font-semibold">Purchases</h2>
      <div className="card mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-mute"><tr>{['Date', 'Paper', 'Amount', 'Payment ID'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {list.map(e => (
              <tr key={'p' + e.paper + e.edition} className="border-t border-line">
                <td className="px-4 py-2.5 text-sub">{new Date(e.created_at).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-2.5 font-mono">{e.paper.toUpperCase()}</td>
                <td className="px-4 py-2.5 font-mono tnum">₹{(e.amount_paise / 100).toLocaleString('en-IN')}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-sub">{e.payment_id ?? '—'}</td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan={4} className="px-4 py-6 text-center text-sub">No purchases yet.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-mute">All purchases are final. <Link to="/refund" className="underline">Refund policy</Link></p>

      <div className="mt-12 flex flex-wrap gap-3 border-t border-line pt-6">
        <button type="button" className="btn-ghost" onClick={() => supabase.auth.signOut({ scope: 'global' })}>Sign out on all devices</button>
      </div>
    </div>
  );
}
