import { PAPERS } from './papers';
import { CS_SUBJECTS } from './cs';
import type { CatSubject, CatTopic, Paper, Video } from './types';
import videosJson from './videos.json';

export * from './types';
export { PAPERS, PRICE_INR, EDITION } from './papers';

const SUBJECTS: Record<string, CatSubject[]> = { cs: CS_SUBJECTS };
const VIDEOS = videosJson as Record<string, Video[]>;

export const getPaper = (slug?: string): Paper | undefined => PAPERS.find(p => p.slug === slug);
export const getSubjects = (slug?: string): CatSubject[] => (slug ? SUBJECTS[slug] ?? [] : []);
export const getVideos = (topicId: string): Video[] => VIDEOS[topicId] ?? [];

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
  const subs = getSubjects(slug);
  const topics = subs.flatMap(s => s.modules.flatMap(m => m.topics));
  const videos = topics.reduce((n, t) => n + getVideos(t.id).length, 0);
  return { subjects: subs.length, topics: topics.length, videos };
}
