import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileCheck2, FileText, Lock } from 'lucide-react';
import { PAPERS, PRICE_INR, PYQ_PRICE_INR, isSellable, paperStats } from '../catalog';
import YEARS from '../catalog/pyq-years.json';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { BuyModal } from '../ui/BuyModal';
import { SignInModal } from '../ui/SignInModal';
import { useTitle } from '../lib/title';

interface PyqSet { label: string; qp: string; key: string | null }
type Year = { year: number; sets: PyqSet[] };
const yearsOf = YEARS as Record<string, number[]>;

/** Official question papers and answer keys, year by year. ₹20 per paper, or included with the full paper. */
export function PyqPage() {
  const [params, setParams] = useSearchParams();
  const slug = params.get('paper') ?? 'cs';
  const paper = PAPERS.find(p => p.slug === slug);
  const years = yearsOf[slug] ?? [];
  const { session, papers, ready } = useAuth();
  const owned = papers.includes(slug) || papers.includes(`pyq-${slug}`);
  const [links, setLinks] = useState<Year[] | null>(null);
  const [err, setErr] = useState('');
  const [buy, setBuy] = useState<'pyq' | 'paper' | null>(null);
  const [signIn, setSignIn] = useState(false);
  useTitle(`GATE ${paper?.code ?? ''} previous year papers ${years.length ? `${Math.min(...years)}–${Math.max(...years)}` : ''}`);

  // Links come from the server, only for buyers (or admins).
  useEffect(() => {
    setLinks(null); setErr('');
    if (!session) return;
    let live = true;
    supabase.rpc('get_pyqs', { p_paper: slug }).then(({ data, error }) => {
      if (!live) return;
      if (error) setErr(/not purchased/.test(error.message) ? '' : 'Could not load the papers. Refresh to try again.');
      else setLinks((data ?? []) as Year[]);
    });
    return () => { live = false; };
  }, [slug, session, owned]);

  const unlocked = !!links;
  const range = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '';

  return (
    <div className="mx-auto max-w-read px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold">Previous-year papers</h1>
      <p className="mt-2 text-sub">Official GATE question papers and answer keys, year by year, opened straight from the organising IIT.</p>

      <label htmlFor="pyq-paper" className="mt-8 block text-sm font-medium">Your paper</label>
      <select id="pyq-paper" value={slug} onChange={e => setParams({ paper: e.target.value }, { replace: true })}
        className="mt-1.5 h-11 w-full rounded-lg border border-line bg-surface px-3 outline-none focus:border-brand/60">
        {PAPERS.filter(p => yearsOf[p.slug]?.length).map(p => <option key={p.slug} value={p.slug}>{p.code} · {p.name}</option>)}
      </select>

      {years.length === 0 ? (
        <p className="card mt-6 p-6 text-sub">No official papers yet for {paper?.code ?? slug.toUpperCase()}.</p>
      ) : !unlocked && ready ? (
        <div className="card mt-6 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/15 text-brand"><Lock size={18} /></span>
            <div>
              <p className="font-semibold">GATE {paper?.code} papers {range} · {years.length} years</p>
              <p className="text-sm text-sub">Question papers and answer keys for every year, 1 year of access.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm text-sub tnum">{years.map(y => <span key={y}>{y}</span>)}</div>
          {err && <p className="mt-3 text-sm text-hard">{err}</p>}
          <button type="button" className="btn-primary mt-5 h-11 w-full" onClick={() => (session ? setBuy('pyq') : setSignIn(true))}>
            Unlock {paper?.code} PYQs · ₹{PYQ_PRICE_INR}
          </button>
          {paper && isSellable(slug) && (
            <button type="button" className="btn-ghost mt-2 h-11 w-full" onClick={() => (session ? setBuy('paper') : setSignIn(true))}>
              Or get the full {paper.code} course · ₹{PRICE_INR} (PYQs included)
            </button>
          )}
        </div>
      ) : !unlocked ? (
        <div className="mt-6 h-40 animate-pulse rounded-card bg-surface" />
      ) : (
        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
          {links!.map(y => (
            <li key={y.year} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
              <span className="w-16 shrink-0 font-mono text-lg tnum">{y.year}</span>
              <div className="flex flex-1 flex-col gap-2">
                {y.sets.map(s => (
                  <div key={s.qp} className="flex flex-wrap items-center gap-2">
                    {y.sets.length > 1 && <span className="w-24 text-sm text-sub">{s.label}</span>}
                    <a href={s.qp} target="_blank" rel="noopener noreferrer" className="btn-ghost h-9 px-3 text-sm"><FileText size={15} /> Question paper</a>
                    {s.key && <a href={s.key} target="_blank" rel="noopener noreferrer" className="btn-ghost h-9 px-3 text-sm"><FileCheck2 size={15} /> Answer key</a>}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {paper && isSellable(slug) && <p className="mt-6 text-sm text-sub">Studying {paper.code}? <Link to={`/${paper.slug}`} className="text-ink underline">Open the {paper.code} A–Z sheet</Link> and solve each year after finishing its subjects.</p>}
      <p className="mt-3 text-xs text-sub">GATE 2027 is organised by IIT Madras. Papers before 2019 are in the official archives of earlier organising institutes.</p>

      {buy && paper && <BuyModal paper={paper} kind={buy} counts={paperStats(slug)} onClose={() => setBuy(null)} />}
      {signIn && <SignInModal reason={`Sign in to unlock GATE ${paper?.code ?? ''} previous-year papers.`} onClose={() => setSignIn(false)} />}
    </div>
  );
}
