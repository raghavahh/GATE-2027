import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileCheck2, FileText } from 'lucide-react';
import { PAPERS } from '../catalog';
import { Loading } from './Static';

interface PyqSet { label: string; qp: string; key: string | null }
type Pyq = Record<string, { year: number; sets: PyqSet[] }[]>;

/** Year-wise official papers and answer keys for every branch (links checked; all hosted by IIT Guwahati). */
export function PyqPage() {
  const [params, setParams] = useSearchParams();
  const slug = params.get('paper') ?? 'cs';
  const [data, setData] = useState<Pyq | null>(null);
  useEffect(() => { import('../catalog/pyq.json').then(m => setData(m.default as Pyq)); }, []);

  const paper = PAPERS.find(p => p.slug === slug);
  const years = data?.[slug] ?? [];

  return (
    <div className="mx-auto max-w-read px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold">Previous-year papers</h1>
      <p className="mt-2 text-sub">Free for everyone. Every link opens the official question paper or answer key hosted by the GATE organising IIT.</p>

      <label htmlFor="pyq-paper" className="mt-8 block text-sm font-medium">Your paper</label>
      <select id="pyq-paper" value={slug} onChange={e => setParams({ paper: e.target.value }, { replace: true })}
        className="mt-1.5 h-11 w-full rounded-lg border border-line bg-surface px-3 outline-none focus:border-brand/60">
        {PAPERS.filter(p => data?.[p.slug]?.length || !data).map(p => <option key={p.slug} value={p.slug}>{p.code} · {p.name}</option>)}
      </select>

      {!data ? <Loading /> : years.length === 0 ? (
        <p className="card mt-6 p-6 text-sub">No official papers yet for {paper?.code ?? slug.toUpperCase()}.</p>
      ) : (
        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
          {years.map(y => (
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

      {paper && <p className="mt-6 text-sm text-sub">Studying {paper.code}? <Link to={`/${paper.slug}`} className="text-ink underline">Open the {paper.code} A–Z sheet</Link> and solve each year after finishing its subjects.</p>}
      <p className="mt-3 text-xs text-sub">Papers before 2019 are in the official archive of earlier organising institutes. GATE 2027 is organised by IIT Madras.</p>
    </div>
  );
}
