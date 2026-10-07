import type { CatModule, CatSubject, CatTopic, Diff } from './types';

export const slug = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Topic. `lesson` links an existing notes lesson. */
export const T = (name: string, diff: Diff, lesson?: string): CatTopic => ({ id: slug(name), name, diff, lesson });

/** Module (lettered A–Z inside a subject). */
export const M = (letter: string, name: string, topics: CatTopic[]): CatModule => ({ letter, name, topics });

/**
 * Subject. Topic ids become `<subjectId>--<topic-slug>` (unique across papers when the
 * subject id is paper-prefixed, e.g. `ec-signals`). First topic is the free sample.
 * `marks` = typical recent range, for prioritising only.
 */
export const S = (id: string, name: string, marks: string, focus: string, modules: CatModule[]): CatSubject => {
  const first = modules[0]?.topics[0];
  if (first) first.sample = true;
  modules.forEach(m => m.topics.forEach(t => (t.id = `${id}--${t.id}`)));
  return { id, name, marks, focus, modules };
};
