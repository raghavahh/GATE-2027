import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, Check, Layers, PlayCircle, Target } from 'lucide-react';
import { EDITION, PAPERS, PRICE_INR, getSubjects, getVideoCount, isSellable, paperStats, usePaper } from '../catalog';
import { useStore } from '../lib/store';
import { DiffText } from '../ui/bits';
import { PaperGrid } from './Static';

export function Home() {
  const cs = paperStats('cs');
  const { last } = useStore();
  // Preview the real CS sheet: its Operating System subject, first module.
  usePaper('cs');
  const os = getSubjects('cs').find(s => s.id === 'cs-operating-system');
  const preview = os?.modules[0];
  return (
    <>
      {last && (
        <div className="mx-auto max-w-shell px-4 pt-6 sm:px-6">
          <Link to={`/${last.paper}/${last.topic}`} className="card flex items-center gap-3 p-4 hover:border-sub">
            <PlayCircle size={20} className="shrink-0 text-brand" />
            <span className="min-w-0 flex-1"><span className="block text-xs text-sub">Continue where you left off · {last.paper.toUpperCase()}</span><span className="block truncate font-medium">{last.name}</span></span>
            <ArrowRight size={16} className="shrink-0 text-sub" />
          </Link>
        </div>
      )}
      <section className="mx-auto grid max-w-shell items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
        <div>
          <p className="font-mono text-sm text-brand">{EDITION} · all {PAPERS.length} papers</p>
          <h1 className="mt-3 text-[38px] font-semibold leading-[1.08] tracking-tight sm:text-[52px]">
            Every GATE topic,<br />in the right order.
          </h1>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-sub">
            Your paper's official {EDITION} syllabus as an A–Z sheet. Hand-picked lectures for each topic play right here; tick it off and move to the next. Official previous-year papers with answer keys come with every paper.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/cs" className="btn-primary h-11 px-5 text-[15px]">Open the CS sheet <ArrowRight size={16} /></Link>
            <Link to="/papers" className="btn-ghost h-11 px-5 text-[15px]">Choose your paper</Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            {[[cs.topics, 'CS topics'], [cs.videos || '–', 'CS lectures'], [`₹${PRICE_INR}`, 'per paper']].map(([n, l]) => (
              <div key={l as string}><dt className="text-xs text-sub">{l}</dt><dd className="mt-1 text-2xl font-semibold tnum">{n}</dd></div>
            ))}
          </dl>
        </div>

        <div className="card overflow-hidden" aria-label="A real part of the CS sheet">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div><p className="text-sm font-semibold">{os?.name ?? 'Operating System'}</p><p className="text-xs text-sub">From the real CS sheet{os?.marks ? ` · ${os.marks} marks` : ''}</p></div>
            <Link to="/cs" className="text-xs text-brand hover:underline">Open</Link>
          </div>
          <ul>
            {(preview?.topics ?? []).slice(0, 6).map((t, i) => (
              <li key={t.id} className="flex items-center gap-3 border-b border-line px-5 py-3 last:border-0">
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border ${i === 0 ? 'border-ok bg-ok text-page' : 'border-line-strong'}`}>{i === 0 && <Check size={14} strokeWidth={3} />}</span>
                <span className="flex-1 truncate text-[14px]">{t.name}</span>
                <span className="flex items-center gap-1 text-xs text-sub tnum"><PlayCircle size={13} />{getVideoCount(t.id) || '–'}</span>
                <span className="w-14 text-right"><DiffText d={t.diff} /></span>
              </li>
            ))}
            {!preview && [0, 1, 2, 3, 4].map(i => <li key={i} className="h-12 animate-pulse border-b border-line bg-surface last:border-0" />)}
          </ul>
        </div>
      </section>

      <section className="border-y border-line bg-surface/40">
        <div className="mx-auto grid max-w-shell gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          {[
            { i: Layers, t: 'The official syllabus, nothing missed', d: `Every topic of the ${EDITION} syllabus, grouped subject by subject and module by module.` },
            { i: PlayCircle, t: 'Best lectures, played here', d: 'Hand-picked lectures from trusted GATE teachers, played inside the sheet. No YouTube rabbit holes.' },
            { i: Target, t: 'Always know what\'s next', d: 'Easy, Medium and Hard tags, a tick for every topic and a one-tap “next topic”, so you never lose your place.' },
          ].map(({ i: I, t, d }) => (
            <div key={t}>
              <I size={22} className="text-brand" />
              <h3 className="mt-4 text-[17px] font-semibold">{t}</h3>
              <p className="mt-2 text-sub">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-shell px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><h2 className="text-2xl font-semibold">Pick your paper</h2><p className="mt-1 text-sub">₹{PRICE_INR} per paper, one payment, 1 year of access. {PAPERS.filter(p => isSellable(p.slug)).map(p => p.code).join(', ')} have lectures now.</p></div>
          <Link to="/papers" className="text-sm text-brand hover:underline">All {PAPERS.length} papers</Link>
        </div>
        <PaperGrid limit={8} />
      </section>

      <section className="mx-auto max-w-shell px-4 pb-20 sm:px-6">
        <div className="card flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex gap-4">
            <BookOpenCheck size={26} className="shrink-0 text-brand" />
            <div><h2 className="text-xl font-semibold">Not sure where to start?</h2><p className="mt-1 text-sub">Read how the exam is marked and how to plan your months before GATE.</p></div>
          </div>
          <Link to="/guide" className="btn-ghost">Read the guide</Link>
        </div>
      </section>
    </>
  );
}
