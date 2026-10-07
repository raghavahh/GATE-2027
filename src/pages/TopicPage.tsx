import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { findTopic, getVideos, paperStats } from '../catalog';
import { getLessonById } from '../data/syllabus';
import { isUnlocked, setStatus, useStore, type Status } from '../lib/store';
import { DiffBadge } from '../ui/bits';
import { BuyModal } from '../ui/BuyModal';
import { useAuth } from '../lib/auth';
import { YouTubePlayer } from '../ui/YouTubePlayer';
import { NotFound } from './Static';

const STATUS: { s: Status; label: string }[] = [
  { s: 'todo', label: 'Not started' },
  { s: 'doing', label: 'Learning' },
  { s: 'done', label: 'Done' },
];

export function TopicPage() {
  const { paper: slug = '', topic: id = '' } = useParams();
  const hit = findTopic(slug, id);
  const { progress } = useStore();
  const { papers } = useAuth();
  const owned = isUnlocked(slug) || papers.includes(slug);
  const [buy, setBuy] = useState(false);
  if (!hit) return <NotFound />;

  const { paper, subject, topic, moduleName, moduleLetter, flat, index } = hit;
  const open = owned || !!topic.sample;
  const videos = getVideos(topic.id);
  const lesson = topic.lesson ? getLessonById(topic.lesson)?.lesson : undefined;
  const st = progress[topic.id] ?? 'todo';
  const prev = flat[index - 1];
  const next = flat[index + 1];

  return (
    <div className="mx-auto max-w-shell px-4 pb-20 sm:px-6">
      <nav className="flex flex-wrap items-center gap-1.5 pt-6 text-sm text-sub" aria-label="Breadcrumb">
        <Link to={`/${slug}`} className="hover:text-ink">{paper.code}</Link><span className="text-mute">/</span>
        <span>{subject.name}</span><span className="text-mute">/</span>
        <span><span className="font-mono text-brand">{moduleLetter}</span> {moduleName}</span>
      </nav>

      <header className="mt-3 flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold leading-tight sm:text-[32px]">{topic.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <DiffBadge d={topic.diff} />
            <span className="chip bg-raised text-sub">{subject.marks} marks · {subject.name}</span>
            {topic.sample && !owned && <span className="chip bg-ok/10 text-ok">Free sample</span>}
          </div>
        </div>
        {open && (
          <div className="flex gap-1 rounded-lg border border-line bg-surface p-1" role="group" aria-label="Your status">
            {STATUS.map(x => (
              <button key={x.s} type="button" onClick={() => setStatus(topic.id, x.s)} aria-pressed={st === x.s}
                className={`h-8 rounded-md px-3 text-[13px] font-medium transition-colors duration-150 ${st === x.s ? (x.s === 'done' ? 'bg-ok text-page' : 'bg-raised text-ink') : 'text-sub hover:text-ink'}`}>
                {x.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {!open ? (
        <div className="mx-auto mt-10 max-w-lg text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand/15 text-brand"><Lock size={20} /></span>
          <h2 className="mt-4 text-xl font-semibold">This topic is part of {paper.code}</h2>
          <p className="mt-2 text-sub">{videos.length ? `${videos.length} videos, ` : ''}key-point notes and PYQs for this topic unlock with the full paper.</p>
          <button type="button" className="btn-primary mt-6" onClick={() => setBuy(true)}>Unlock {paper.code}</button>
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          <section aria-labelledby="v-h">
            <h2 id="v-h" className="mb-4 text-lg font-semibold">Watch <span className="font-normal text-mute">· {videos.length} videos</span></h2>
            {videos.length ? <YouTubePlayer videos={videos} /> : <p className="card p-6 text-sub">Videos for this topic are being verified and will appear soon.</p>}
          </section>

          <section aria-labelledby="n-h" className="max-w-read">
            <h2 id="n-h" className="mb-4 text-lg font-semibold">Key points</h2>
            {lesson ? (
              <div className="space-y-6 font-serif text-[17px] leading-[1.75]">
                <p>{lesson.overview.whyItMatters}</p>
                <div>
                  <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-mute">Definition</h3>
                  <p className="mt-1">{lesson.explanation.definition}</p>
                </div>
                <ul className="list-disc space-y-1.5 pl-5">{lesson.explanation.howItWorks.map(x => <li key={x}>{x}</li>)}</ul>
                {lesson.formulasAndRules.length > 0 && (
                  <div className="card p-4 font-sans">
                    <h3 className="text-sm font-semibold">Formulas</h3>
                    <ul className="mt-2 space-y-2 text-[14px]">
                      {lesson.formulasAndRules.map(f => <li key={f.id}><span className="font-mono text-brand">{f.formula ?? f.name}</span><span className="block text-sub">{f.rule}</span></li>)}
                    </ul>
                  </div>
                )}
                {lesson.commonMistakes.map(m => (
                  <div key={m.pitfall} className="border-l-2 border-hard/70 pl-4 font-sans text-[15px]">
                    <p className="font-medium">Common mistake: {m.pitfall}</p>
                    <p className="text-sub">{m.correction}</p>
                  </div>
                ))}
                <p className="rounded-lg bg-brand/10 p-4 font-sans text-[15px]"><span className="font-semibold">Key takeaway:</span> {lesson.explanation.keyTakeaway}</p>
              </div>
            ) : (
              <p className="card p-6 text-sub">Key-point notes for this topic are being written.</p>
            )}
          </section>
        </div>
      )}

      <div className="mt-12 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
        {prev ? <Link to={`/${slug}/${prev.id}`} className="card flex items-center gap-3 p-4 hover:border-mute"><ArrowLeft size={16} className="text-mute" /><span className="min-w-0"><span className="block text-xs text-mute">Previous</span><span className="block truncate text-sm">{prev.name}</span></span></Link> : <span />}
        {next && <Link to={`/${slug}/${next.id}`} className="card flex items-center justify-end gap-3 p-4 text-right hover:border-mute"><span className="min-w-0"><span className="block text-xs text-mute">Next</span><span className="block truncate text-sm">{next.name}</span></span><ArrowRight size={16} className="text-mute" /></Link>}
      </div>

      {buy && <BuyModal paper={paper} topicName={topic.name} counts={paperStats(slug)} onClose={() => setBuy(false)} />}
    </div>
  );
}
