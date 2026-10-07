import { useEffect, useState } from 'react';
import { PAPERS } from './papers';
import type { CatSubject, CatTopic, Paper, Video } from './types';
import summaryJson from './summary.json';

export * from './types';
export { PAPERS, PRICE_INR, EDITION } from './papers';

/**
 * Sheets come from the official GATE 2027 syllabus PDFs (scripts/build_syllabus.py) and are
 * downloaded per paper, only when that paper is opened (keeps the first load small).
 */
const sheetLoaders = import.meta.glob<CatSubject[]>('./generated/*.json', { import: 'default' });
const videoLoaders = import.meta.glob<Record<string, Video[] | number>>('./videos/*.json', { import: 'default' });
const SUBJECTS: Record<string, CatSubject[]> = {};
/** Sample topics: full list. Paid topics: just the count (lists come from the DB). */
const VIDEOS: Record<string, Video[] | number> = {};
const SUMMARY = summaryJson as Record<string, { subjects: number; topics: number; videos: number }>;
const pending: Record<string, Promise<void>> = {};

export function loadPaper(slug: string): Promise<void> {
  if (SUBJECTS[slug]) return Promise.resolve();
  pending[slug] ??= (async () => {
    const [ga, own, vids] = await Promise.all([
      sheetLoaders['./generated/ga.json']?.(),
      sheetLoaders[`./generated/${slug}.json`]?.(),
      videoLoaders[`./videos/${slug}.json`]?.(),
    ]);
    Object.assign(VIDEOS, vids ?? {});
    SUBJECTS[slug] = own?.length ? [...(ga ?? []), ...own] : [];
  })();
  return pending[slug];
}

/** Loads a paper's sheet; returns true once it is ready. */
export function usePaper(slug: string): boolean {
  const [, bump] = useState(0);
  const ready = !!SUBJECTS[slug] || !getPaper(slug);
  useEffect(() => { if (!ready) loadPaper(slug).then(() => bump(x => x + 1)); }, [slug, ready]);
  return ready;
}

export const getPaper = (slug?: string): Paper | undefined => PAPERS.find(p => p.slug === slug);
export const getSubjects = (slug?: string): CatSubject[] => (slug ? SUBJECTS[slug] ?? [] : []);
export const getVideos = (topicId: string): Video[] => { const v = VIDEOS[topicId]; return Array.isArray(v) ? v : []; };
export const getVideoCount = (topicId: string): number => { const v = VIDEOS[topicId]; return Array.isArray(v) ? v.length : v ?? 0; };

export interface TopicHit {
  paper: Paper;
  subject: CatSubject;
  moduleName: string;
  moduleLetter: string;
  topic: CatTopic;
  index: number;
  flat: CatTopic[];
}

export function findTopic(paperSlug: string, topicId: string): TopicHit | undefined {
  const paper = getPaper(paperSlug);
  if (!paper) return undefined;
  for (const subject of getSubjects(paperSlug)) {
    const flat = subject.modules.flatMap(m => m.topics);
    for (const m of subject.modules) {
      const topic = m.topics.find(t => t.id === topicId);
      if (topic) return { paper, subject, moduleName: m.name, moduleLetter: m.letter, topic, index: flat.indexOf(topic), flat };
    }
  }
  return undefined;
}

export function paperStats(slug: string) {
  if (!SUBJECTS[slug]) return SUMMARY[slug] ?? { subjects: 0, topics: 0, videos: 0 };
  const subs = getSubjects(slug);
  const topics = subs.flatMap(s => s.modules.flatMap(m => m.topics));
  const videos = topics.reduce((n, t) => n + getVideoCount(t.id), 0);
  return { subjects: subs.length, topics: topics.length, videos };
}
