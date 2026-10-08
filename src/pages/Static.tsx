import { Link } from 'react-router-dom';
import { PAPERS, isSellable, paperStats, type Paper } from '../catalog';

const STATUS_CHIP: Record<'live' | 'syllabus' | 'soon', [string, string]> = {
  live: ['Videos live', 'bg-ok/10 text-ok'],
  syllabus: ['Free syllabus · videos soon', 'bg-raised text-sub'],
  soon: ['Coming soon', 'bg-raised text-mute'],
};
const chipFor = (p: Paper) => (isSellable(p.slug) ? 'live' : p.status === 'soon' ? 'soon' : 'syllabus');

export function PaperGrid({ limit }: { limit?: number }) {
  const list = limit ? PAPERS.slice(0, limit) : PAPERS;
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {list.map(p => {
        const [label, cls] = STATUS_CHIP[chipFor(p)];
        const n = paperStats(p.slug).topics;
        return (
          <li key={p.code}>
            <Link to={`/${p.slug}`} className="card flex h-full flex-col p-4 transition-colors duration-150 hover:border-mute">
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-medium">{p.code}</span>
                <span className={`chip ${cls}`}>{label}</span>
              </div>
              <span className="mt-2 text-[14px] leading-snug">{p.name}</span>
              <span className="mt-auto pt-3 text-xs text-mute tnum">{n ? `${n} topics` : p.note ?? 'Syllabus in progress'}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function PapersPage() {
  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold">All GATE papers</h1>
      <p className="mt-2 text-sub">Each paper is a separate ₹310 sheet. Papers marked “Videos live” can be bought now; the rest are free to browse while their videos are curated.</p>
      <PaperGrid />
    </div>
  );
}

const PATTERN = [
  ['Questions', '65'], ['Marks', '100'], ['Duration', '3 hours'], ['General Aptitude', '15 marks'],
  ['Question types', 'MCQ, MSQ, NAT'], ['Negative marking', 'MCQ only: −⅓ (1-mark), −⅔ (2-mark)'],
];

const STEPS = [
  ['Start with weightage', 'Open your paper sheet and sort your time by the marks shown on each subject. High-marks subjects first.'],
  ['One topic at a time', 'Watch one video, read the key points, then solve that topic\'s PYQs before moving on.'],
  ['Easy before Hard', 'Clear every Easy and Medium topic first. Hard topics are worth it only once the basics are solid.'],
  ['Never skip General Aptitude', 'Same 15 marks in every paper and the easiest to score. Do a little every day.'],
  ['Revise on a cycle', 'Revisit finished topics after 1 day, 1 week and 1 month. Keep a notebook of your mistakes.'],
  ['Mocks from 6 weeks out', 'Full-length timed tests under exam conditions, then review every wrong answer.'],
  ['Exam day: three passes', 'First pass the questions you know, second pass the doable ones, last pass the rest. Guess carefully on MCQs only.'],
];

export function GuidePage() {
  return (
    <div className="mx-auto max-w-read px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold">How to prepare</h1>
      <p className="mt-2 text-sub">Check the official GATE 2027 brochure for final details.</p>

      <h2 className="mt-10 text-lg font-semibold">The exam at a glance</h2>
      <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
        {PATTERN.map(([k, v]) => <div key={k} className="bg-surface p-4"><dt className="text-xs text-mute">{k}</dt><dd className="mt-1 text-[14px] font-medium">{v}</dd></div>)}
      </dl>

      <h2 className="mt-10 text-lg font-semibold">How to score more</h2>
      <ol className="mt-3 space-y-4">
        {STEPS.map(([t, d], i) => (
          <li key={t} className="flex gap-4">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-raised font-mono text-xs tnum">{i + 1}</span>
            <div><p className="font-medium">{t}</p><p className="text-sub">{d}</p></div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="mx-auto max-w-shell px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-brand">404</p>
      <h1 className="mt-2 text-2xl font-semibold">This page doesn't exist</h1>
      <Link to="/" className="btn-ghost mt-6">Go home</Link>
    </div>
  );
}

export function Loading() {
  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6" aria-busy="true" aria-label="Loading">
      <div className="h-4 w-24 animate-pulse rounded bg-raised" />
      <div className="mt-3 h-9 w-2/3 animate-pulse rounded bg-raised" />
      <div className="mt-8 space-y-3">{[0, 1, 2, 3].map(i => <div key={i} className="h-20 animate-pulse rounded-card bg-surface" />)}</div>
    </div>
  );
}
