import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

interface Stats {
  users: number; users_today: number; sales: number; revenue_paise: number; logins_today: number;
  sales_by_paper: Record<string, number>;
  recent: { email: string; paper: string; amount_paise: number; payment_id: string | null; created_at: string }[];
}

const inr = (p: number) => `₹${(p / 100).toLocaleString('en-IN')}`;

export function AdminPage() {
  const { session, isAdmin, ready } = useAuth();
  const [s, setS] = useState<Stats | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    supabase.rpc('admin_stats').then(({ data, error }) => (error ? setErr(error.message) : setS(data as Stats)));
  }, [isAdmin]);

  if (!ready) return null;
  if (!session || !isAdmin) {
    return <div className="mx-auto max-w-shell px-4 py-24 text-center sm:px-6"><h1 className="text-xl font-semibold">Not available</h1></div>;
  }

  const tiles: [string, string | number][] = s ? [
    ['Revenue', inr(s.revenue_paise)], ['Sales', s.sales], ['Users', s.users], ['New today', s.users_today], ['Logins today', s.logins_today],
  ] : [];

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      {err && <p className="mt-4 text-hard">{err}</p>}
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {tiles.map(([k, v]) => <div key={k} className="card p-4"><dt className="text-xs text-mute">{k}</dt><dd className="mt-1 font-mono text-2xl tnum">{v}</dd></div>)}
      </dl>
      {s && (
        <>
          <h2 className="mt-10 text-lg font-semibold">Sales by paper</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(s.sales_by_paper).sort((a, b) => b[1] - a[1]).map(([p, n]) => <span key={p} className="chip bg-raised font-mono">{p.toUpperCase()} · {n}</span>)}
            {!Object.keys(s.sales_by_paper).length && <span className="text-sub">No sales yet.</span>}
          </div>
          <h2 className="mt-10 text-lg font-semibold">Recent purchases</h2>
          <div className="card mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-mute"><tr>{['Time', 'Email', 'Paper', 'Amount', 'Payment ID'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
              <tbody>
                {s.recent.map(r => (
                  <tr key={(r.payment_id ?? '') + r.created_at} className="border-t border-line">
                    <td className="px-4 py-2.5 whitespace-nowrap text-sub">{new Date(r.created_at).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2.5">{r.email}</td>
                    <td className="px-4 py-2.5 font-mono">{r.paper.toUpperCase()}</td>
                    <td className="px-4 py-2.5 font-mono tnum">{inr(r.amount_paise)}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-sub">{r.payment_id ?? 'manual'}</td>
                  </tr>
                ))}
                {!s.recent.length && <tr><td colSpan={5} className="px-4 py-6 text-center text-sub">No purchases yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
