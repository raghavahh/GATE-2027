import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, Layers, PlayCircle, Target } from 'lucide-react';
import { CS_SUBJECTS } from '../catalog/cs';
import { EDITION, PAPERS, PRICE_INR, paperStats } from '../catalog';
import { DiffText } from '../ui/bits';
import { PaperGrid } from './Static';

const preview = CS_SUBJECTS.find(s => s.id === 'os')!.modules[2].topics;

export function Home() {
  const cs = paperStats('cs');
  return (
    <>
      <section className="mx-auto grid max-w-shell items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
        <div>
          <p className="font-mono text-sm text-brand">{EDITION} · all {PAPERS.length} papers</p>
          <h1 className="mt-3 text-[38px] font-semibold leading-[1.08] tracking-tight sm:text-[52px]">
            Every GATE topic,<br />in the right order.
          </h1>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-sub">
            Your paper's full syllabus as an A–Z sheet. Each topic has the 3–4 best videos playing right here, key-point notes and previous-year questions. Tick it off and move on.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/cs" className="btn-primary h-11 px-5 text-[15px]">Open the CS sheet <ArrowRight size={16} /></Link>
            <Link to="/papers" className="btn-ghost h-11 px-5 text-[15px]">Choose your paper</Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            {[[cs.topics, 'CS topics'], [cs.videos || '–', 'verified videos'], [`₹${PRICE_INR}`, 'per paper']].map(([n, l]) => (
              <div key={l as string}><dt className="text-xs text-mute">{l}</dt><dd className="mt-1 font-mono text-2xl tnum">{n}</dd></div>
            ))}
          </dl>
        </div>

        <div className="card overflow-hidden" aria-label="Example of a sheet">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div><p className="text-sm font-semibold">Operating Systems</p><p className="text-xs text-sub">C · Memory management</p></div>
            <span className="font-mono text-xs text-mute">8–10 marks</span>
          </div>
          <ul>
            {preview.map((t, i) => (
              <li key={t.id} className="flex items-center gap-3 border-b border-line px-5 py-3 last:border-0">
                <span className={`grid h-6 w-6 place-items-center rounded-md border ${i === 0 ? 'border-ok bg-ok text-page' : 'border-line'}`}>{i === 0 && <span className="text-[11px]">✓</span>}</span>
                <span className="flex-1 truncate text-[14px]">{t.name}</span>
                <PlayCircle size={14} className="text-mute" />
                <span className="w-16 text-right"><DiffText d={t.diff} /></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-line bg-surface/40">
        <div className="mx-auto grid max-w-shell gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          {[
            { i: Layers, t: 'One sheet, no guesswork', d: 'Every subject split into A–Z modules, ordered the way toppers study them, with typical marks per subject.' },
            { i: PlayCircle, t: 'Best videos, played here', d: 'We pick 3–4 trusted lectures per topic and play them inside the sheet. No YouTube rabbit holes.' },
            { i: Target, t: 'Know what to focus on', d: 'Easy, Medium and Hard tags plus marks per subject, so the highest-return topics come first.' },
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
          <div><h2 className="text-2xl font-semibold">Pick your paper</h2><p className="mt-1 text-sub">₹{PRICE_INR} per paper, one payment, access till 30 days after the exam.</p></div>
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
