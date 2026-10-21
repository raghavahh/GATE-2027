import { useEffect, useState } from 'react';
import { CONTACT_EMAIL, supabase } from '../lib/supabase';
import type { Video } from '../catalog';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Lock } from 'lucide-react';
import { findTopic, getVideoCount, getVideos, isSellable, paperStats, usePaper } from '../catalog';
import { isUnlocked, setLast, setStatus, useStore, type Status } from '../lib/store';
import { DiffBadge } from '../ui/bits';
import { BuyModal } from '../ui/BuyModal';
import { useAuth } from '../lib/auth';
import { YouTubePlayer } from '../ui/YouTubePlayer';
import { Loading, NotFound } from './Static';
import { useTitle } from '../lib/title';

/** Topic notes from get_topic_notes: summary, points, formulas [formula, note], mistakes, how GATE asks it. */
interface Notes { s: string; p: string[]; f?: [string, string][]; m?: string[]; q?: string }

const contentError = (m: string) =>
  m.includes('elsewhere') ? 'Your account is signed in on another device. Sign in again here to continue.'
  : m.includes('sign in') ? 'Sign in to see this topic.'
  : m.includes('not purchased') ? 'This topic unlocks with the full paper.'
  : 'Could not load this. Check your connection, or turn off your ad blocker for this site, then refresh.';

const STATUS: { s: Status; label: string }[] = [
  { s: 'todo', label: 'Not started' },
  { s: 'doing', label: 'Learning' },
  { s: 'done', label: 'Done' },
];

export function TopicPage() {
  const { paper: slug = '', topic: id = '' } = useParams();
  const ready = usePaper(slug);
  const hit = ready ? findTopic(slug, id) : undefined;
  const { progress } = useStore();
  const { papers, ready: authReady } = useAuth();
  const owned = isUnlocked(slug) || papers.includes(slug);
  const [buy, setBuy] = useState(false);
  const navigate = useNavigate();
  const [paid, setPaid] = useState<Video[] | null>(null);
  const [vErr, setVErr] = useState('');
  const paperOwned = isUnlocked(slug) || papers.includes(slug);
  const isSample = !!hit?.topic.sample;
  const [notes, setNotes] = useState<Notes | null | undefined>(undefined);
  const [nErr, setNErr] = useState('');
  const topicId = hit?.topic.id;
  useTitle(hit ? `${hit.topic.name} · ${hit.paper.code}` : undefined);
  // Each effect ignores a reply that arrives after the user has moved to another topic.
  useEffect(() => {
    setNotes(undefined); setNErr('');
    if (!topicId || (!isSample && !paperOwned)) { setNotes(null); return; }
    let live = true;
    supabase.rpc('get_topic_notes', { p_paper: slug, p_topic: topicId }).then(({ data, error }) => {
      if (!live) return;
      if (error) { setNotes(null); setNErr(contentError(error.message)); } else setNotes(data as Notes | null);
    });
    return () => { live = false; };
  }, [slug, topicId, isSample, paperOwned]);
  useEffect(() => {
    setPaid(null); setVErr('');
    if (!topicId || isSample || !paperOwned) return;
    let live = true;
    const fetchVideos = (id: string) => supabase.rpc('get_topic_videos', { p_paper: slug, p_topic: id });
    (async () => {
      let { data, error } = await fetchVideos(topicId);
      // Renamed/split topics: until the lists are re-uploaded under the new id, use the old topic's list.
      if (!error && !(data as Video[] | null)?.length) {
        const map = (await import('../catalog/idmap.json')).default as Record<string, string | string[]>;
        const old = Object.keys(map).find(o => [map[o]].flat().includes(topicId));
        if (old) ({ data, error } = await fetchVideos(old));
      }
      if (!live) return;
      if (error) setVErr(contentError(error.message));
      else setPaid((data ?? []) as Video[]);
    })();
    return () => { live = false; };
  }, [slug, topicId, isSample, paperOwned]);
  if (!ready || !authReady) return <Loading />;
  if (!hit) return <NotFound />;

  const { paper, subject, topic, moduleName, moduleLetter, flat, index } = hit;
  const open = owned || !!topic.sample || !isSellable(slug); // unsold papers: free syllabus browsing
  const videos = topic.sample ? getVideos(topic.id) : paid ?? [];
  const videoCount = getVideoCount(topic.id);
  const st = progress[topic.id] ?? 'todo';
  const prev = flat[index - 1];
  const next = flat[index + 1];
  if (open) setTimeout(() => setLast(slug, topic.id, topic.name), 0); // remembered for "Continue where you left off"

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
            <span className="chip bg-raised text-sub">{subject.marks ? `${subject.marks} marks · ` : ''}{subject.name}</span>
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
          <p className="mt-2 text-sub">{videoCount ? `${videoCount} hand-picked videos and ` : ''}key-point notes for this topic unlock with the full paper.</p>
          <button type="button" className="btn-primary mt-6" onClick={() => setBuy(true)}>Unlock {paper.code}</button>
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          <section aria-labelledby="v-h">
            <h2 id="v-h" className="mb-4 text-lg font-semibold">Watch{videoCount > 0 && <span className="font-normal text-sub"> · {videoCount} videos</span>}</h2>
            {vErr ? <p className="card p-6 text-hard">{vErr}</p> : videos.length ? <YouTubePlayer key={topic.id} videos={videos} /> : !topic.sample && paid === null && videoCount ? <div className="aspect-video animate-pulse rounded-card bg-surface" /> : <p className="card p-6 text-sub">Lectures for this topic are being added. Meanwhile, <a className="text-ink underline" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`GATE ${topic.name}`)}`} target="_blank" rel="noopener noreferrer">search YouTube for it</a>.</p>}
          </section>

          <section aria-labelledby="n-h" className="max-w-read">
            <h2 id="n-h" className="mb-4 text-lg font-semibold">Key points</h2>
            {notes ? (
              <div className="space-y-6 font-serif text-[17px] leading-[1.75]">
                <p>{notes.s}</p>
                <ul className="list-disc space-y-1.5 pl-5">{notes.p.map(x => <li key={x}>{x}</li>)}</ul>
                {!!notes.f?.length && (
                  <div className="card p-4 font-sans">
                    <h3 className="text-sm font-semibold">Formulas and rules</h3>
                    <ul className="mt-2 space-y-2 text-[14px]">
                      {notes.f.map(([f, n]) => <li key={f}><span className="font-mono text-brand">{f}</span>{n && <span className="block text-sub">{n}</span>}</li>)}
                    </ul>
                  </div>
                )}
                {notes.m?.map(m => (
                  <div key={m} className="border-l-2 border-hard/70 pl-4 font-sans text-[15px]">
                    <p><span className="font-medium">Common mistake:</span> <span className="text-sub">{m}</span></p>
                  </div>
                ))}
                {notes.q && <p className="rounded-lg bg-brand/10 p-4 font-sans text-[15px]"><span className="font-semibold">How GATE asks this:</span> {notes.q}</p>}
                <p className="font-sans text-xs text-sub">Spotted a mistake? Email {CONTACT_EMAIL} and we'll fix it.</p>
              </div>
            ) : nErr ? (
              <p className="card p-6 text-hard">{nErr}</p>
            ) : notes === undefined ? (
              <div className="h-40 animate-pulse rounded-card bg-surface" />
            ) : (
              <p className="card p-6 text-sub">Key-point notes for this topic are being written.{videos.length > 0 && ' The videos above cover it fully.'}</p>
            )}
          </section>
        </div>
      )}

      {open && (
        <div className="mt-12 flex flex-col gap-3 rounded-card border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-sub">{st === 'done' ? 'Done. Nice work.' : 'Finished the videos and notes?'}</p>
          <button type="button" className="btn-primary h-11 min-w-0 px-5" onClick={() => { setStatus(topic.id, 'done'); if (next) navigate(`/${slug}/${next.id}`); }}>
            <Check size={16} className="shrink-0" /> <span className="truncate">{next ? 'Mark done · Next topic' : 'Mark done'}</span>
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
        {prev ? <Link to={`/${slug}/${prev.id}`} className="card flex min-w-0 items-center gap-3 p-4 hover:border-sub"><ArrowLeft size={16} className="shrink-0 text-sub" /><span className="min-w-0 flex-1"><span className="block text-xs text-sub">Previous</span><span className="block truncate text-sm">{prev.name}</span></span></Link> : <span />}
        {next && <Link to={`/${slug}/${next.id}`} className="card flex min-w-0 items-center justify-end gap-3 p-4 text-right hover:border-sub"><span className="min-w-0 flex-1"><span className="block text-xs text-sub">Next</span><span className="block truncate text-sm">{next.name}</span></span><ArrowRight size={16} className="shrink-0 text-sub" /></Link>}
      </div>

      {buy && <BuyModal paper={paper} topicName={topic.name} counts={paperStats(slug)} onClose={() => setBuy(false)} />}
    </div>
  );
}
