import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown, Lock, PlayCircle, Search } from 'lucide-react';
import { EDITION, PRICE_INR, getPaper, isSellable, usePaper, getSubjects, getVideoCount, paperStats, type CatSubject, type CatTopic, type Diff } from '../catalog';
import { isUnlocked, setStatus, useStore, type Status } from '../lib/store';
import { Bar, DiffText, StatusBox } from '../ui/bits';
import { BuyModal } from '../ui/BuyModal';
import { useAuth } from '../lib/auth';
import { Loading, NotFound } from './Static';

const nextStatus: Record<Status, Status> = { todo: 'doing', doing: 'done', done: 'todo' };
type Filter = 'all' | Diff;

export function PaperPage() {
  const { paper: slug = '' } = useParams();
  const paper = getPaper(slug);
  const ready = usePaper(slug);
  const subjects = getSubjects(slug);
  const { progress } = useStore();
  const { papers, ready: authReady } = useAuth();
  const owned = isUnlocked(slug) || papers.includes(slug);
  const sellable = isSellable(slug);
  // Not on sale yet: the syllabus sheet is free to browse in full.
  const unlocked = owned || !sellable;
  const stats = paperStats(slug);
  const [buyFor, setBuyFor] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const allTopics = useMemo(() => subjects.flatMap(s => s.modules.flatMap(m => m.topics)), [subjects]);
  const done = allTopics.filter(t => progress[t.id] === 'done').length;

  if (!paper) return <NotFound />;
  if (!ready || !authReady) return <Loading />;

  if (!subjects.length) {
    return (
      <div className="mx-auto max-w-shell px-4 py-16 sm:px-6">
        <p className="font-mono text-sm text-brand">{paper.code}</p>
        <h1 className="mt-1 text-3xl font-semibold">{paper.name}</h1>
        <p className="mt-3 max-w-xl text-sub">This paper's A–Z sheet is being built. Its free PYQ papers are already in the PYQ hub.</p>
        <div className="mt-6 flex gap-3"><Link to="/pyq" className="btn-primary">Open PYQs</Link><Link to="/papers" className="btn-ghost">All papers</Link></div>
      </div>
    );
  }

  const canSee = (t: CatTopic, i: number) => unlocked || t.sample || i % 3 === 0;
  const match = (t: CatTopic) => (filter === 'all' || t.diff === filter) && (!q || t.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-shell px-4 pb-20 sm:px-6">
      <section className="flex flex-col gap-6 border-b border-line py-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-sm text-brand">{paper.code} · {EDITION}</p>
          <h1 className="mt-1 text-[28px] font-semibold leading-tight sm:text-[34px]">{paper.name}</h1>
          <p className="mt-2 text-sub tnum">{stats.subjects} subjects · {stats.topics} topics · {stats.videos} videos</p>
        </div>
        <div className="w-full md:w-80">
          {!sellable ? (
            <div className="card p-4">
              <p className="text-sm font-medium">Videos for {paper.code} are being curated</p>
              <p className="mt-1 text-xs text-sub">The full syllabus sheet is free. Buying opens once every topic has its videos.</p>
            </div>
          ) : unlocked ? (
            <div className="card p-4">
              <div className="flex justify-between text-sm"><span className="text-sub">Your progress</span><span className="font-mono tnum">{done}/{allTopics.length}</span></div>
              <Bar value={done} total={allTopics.length} className="mt-2" />
            </div>
          ) : (
            <div className="card flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-mono text-xl tnum">₹{PRICE_INR}</p>
                <p className="text-xs text-sub">Full {paper.code} access till 30 days after the exam</p>
              </div>
              <button type="button" className="btn-primary" onClick={() => setBuyFor('')}>Unlock {paper.code}</button>
            </div>
          )}
        </div>
      </section>

      <div className="sticky top-14 z-30 -mx-4 flex flex-wrap items-center gap-2 border-b border-line bg-page/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <label className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search topics" aria-label="Search topics" className="h-9 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-mute focus:border-brand/60" />
        </label>
        <div className="flex gap-1 rounded-lg border border-line bg-surface p-1" role="group" aria-label="Difficulty">
          {(['all', 'E', 'M', 'H'] as Filter[]).map(f => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={`h-7 rounded-md px-3 text-xs font-medium transition-colors duration-150 ${filter === f ? 'bg-raised text-ink' : 'text-sub hover:text-ink'}`}>
              {f === 'all' ? 'All' : f === 'E' ? 'Easy' : f === 'M' ? 'Medium' : 'Hard'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {subjects.map((s, si) => (
          <SubjectBlock
            key={s.id}
            s={s}
            idx={si}
            isOpen={open[s.id] ?? si < 2}
            toggle={() => setOpen(o => ({ ...o, [s.id]: !(o[s.id] ?? si < 2) }))}
            progress={progress}
            canSee={canSee}
            match={match}
            unlocked={unlocked}
            paperSlug={slug}
            onLocked={name => setBuyFor(name ?? '')}
          />
        ))}
      </div>

      {buyFor !== null && <BuyModal paper={paper} topicName={buyFor || undefined} counts={stats} onClose={() => setBuyFor(null)} />}
    </div>
  );
}

interface BlockProps {
  s: CatSubject;
  idx: number;
  isOpen: boolean;
  toggle: () => void;
  progress: Record<string, Status>;
  canSee: (t: CatTopic, i: number) => boolean;
  match: (t: CatTopic) => boolean;
  unlocked: boolean;
  paperSlug: string;
  onLocked: (name?: string) => void;
}

function SubjectBlock({ s, idx, isOpen, toggle, progress, canSee, match, unlocked, paperSlug, onLocked }: BlockProps) {
  const topics = s.modules.flatMap(m => m.topics);
  const done = topics.filter(t => progress[t.id] === 'done').length;
  let counter = 0;

  return (
    <section className="card overflow-hidden">
      <button type="button" onClick={toggle} aria-expanded={isOpen} className="flex w-full items-center gap-4 p-4 text-left hover:bg-raised/50 sm:p-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-raised font-mono text-sm text-sub tnum">{String(idx + 1).padStart(2, '0')}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[16px] font-semibold">{s.name}</span>
          <span className="mt-0.5 block truncate text-[13px] text-sub">{s.focus}</span>
        </span>
        <span className="hidden text-right sm:block">
          {s.marks && <span className="block font-mono text-sm tnum">{s.marks} <span className="text-mute">marks</span></span>}
          <span className="block font-mono text-xs text-mute tnum">{done}/{topics.length} done</span>
        </span>
        <ChevronDown size={18} className={`shrink-0 text-mute transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="border-t border-line">
          {s.modules.map(m => {
            const rows = m.topics.map(t => ({ t, i: counter++ })).filter(({ t }) => match(t));
            const visible = rows.filter(({ t, i }) => canSee(t, i));
            const hidden = rows.length - visible.length;
            if (!rows.length) return null;
            return (
              <div key={m.letter}>
                <div className="flex items-center gap-2 bg-raised/40 px-4 py-2 text-xs font-medium uppercase tracking-wider text-mute sm:px-5">
                  <span className="font-mono text-brand">{m.letter}</span>{m.name}
                </div>
                <ul>
                  {visible.map(({ t }) => {
                    const st = progress[t.id] ?? 'todo';
                    const vids = getVideoCount(t.id);
                    const open = unlocked || t.sample;
                    return (
                      <li key={t.id} className="flex items-center gap-3 border-t border-line px-4 py-2.5 sm:px-5">
                        {open ? (
                          <StatusBox s={st} label={`Status of ${t.name}: ${st}`} onClick={() => setStatus(t.id, nextStatus[st])} />
                        ) : (
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-line text-mute"><Lock size={12} /></span>
                        )}
                        {open ? (
                          <Link to={`/${paperSlug}/${t.id}`} className="min-w-0 flex-1 truncate text-[14px] hover:text-brand">{t.name}</Link>
                        ) : (
                          <button type="button" onClick={() => onLocked(t.name)} className="min-w-0 flex-1 truncate text-left text-[14px] text-sub hover:text-ink">{t.name}</button>
                        )}
                        {t.sample && !unlocked && <span className="chip bg-ok/10 text-ok">Free</span>}
                        <span className="hidden w-20 items-center gap-1 text-xs text-mute sm:flex tnum"><PlayCircle size={13} />{vids || '–'}</span>
                        <span className="w-16 text-right"><DiffText d={t.diff} /></span>
                      </li>
                    );
                  })}
                  {hidden > 0 && (
                    <li className="border-t border-line">
                      <button type="button" onClick={() => onLocked()} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] text-mute hover:bg-raised/50 sm:px-5">
                        <span className="grid h-6 w-6 place-items-center rounded-md border border-dashed border-line"><Lock size={12} /></span>
                        {hidden} more topic{hidden > 1 ? 's' : ''} in this module, unlock to see
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
