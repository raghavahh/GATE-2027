import { useSyncExternalStore } from 'react';

export type Status = 'todo' | 'doing' | 'done';

interface State {
  progress: Record<string, Status>;
  /** Paper slugs unlocked. Replaced by server entitlements once payments go live. */
  unlocked: string[];
  theme: 'dark' | 'light';
  /** Last topic opened, for "Continue where you left off". */
  last?: { paper: string; topic: string; name: string };
}

const KEY = 'gate27:v1';
const empty: State = { progress: {}, unlocked: [], theme: 'dark' };

function read(): State {
  try {
    return { ...empty, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return empty;
  }
}

let state = read();
const subs = new Set<() => void>();

/** Topic ids change when the syllabus is corrected; move saved ticks to the new ids (split topics inherit the tick). */
if (Object.keys(state.progress).length) {
  import('../catalog/idmap.json').then(({ default: map }) => {
    const ids = map as Record<string, string | string[]>;
    if (!Object.keys(state.progress).some(k => k in ids)) return;
    const progress: Record<string, Status> = {};
    for (const [id, s] of Object.entries(state.progress)) {
      for (const n of [ids[id] ?? id].flat()) if (!progress[n] || s === 'done') progress[n] = s;
    }
    const last = state.last && ids[state.last.topic] ? { ...state.last, topic: [ids[state.last.topic]].flat()[0] } : state.last;
    set({ progress, last });
  }).catch(() => { /* keep old ids; nothing lost */ });
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
  subs.forEach(f => f());
}

const subscribe = (f: () => void) => { subs.add(f); return () => subs.delete(f); };

export function useStore() {
  return useSyncExternalStore(subscribe, () => state);
}

/** Set by lib/sync while signed in: saves each change to the student's account. */
let pusher: ((topicId: string, s: Status) => void) | null = null;
export const setPusher = (f: typeof pusher) => { pusher = f; };

export function setStatus(topicId: string, s: Status) {
  set({ progress: { ...state.progress, [topicId]: s } });
  pusher?.(topicId, s);
}

export const getProgress = () => state.progress;

/** Merges progress saved on another device. A tick ('done') on either side wins. */
export function mergeProgress(remote: Record<string, Status>) {
  const progress = { ...remote };
  for (const [id, s] of Object.entries(state.progress)) if (s === 'done' || !progress[id]) progress[id] = s;
  set({ progress });
}

export function setLast(paper: string, topic: string, name: string) {
  if (state.last?.topic !== topic) set({ last: { paper, topic, name } });
}

export function toggleTheme() {
  const theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.classList.toggle('light', theme === 'light');
  set({ theme });
}

/** Dev preview only: in production, access comes solely from server entitlements. */
export const isUnlocked = (paper: string) => import.meta.env.DEV && Array.isArray(state.unlocked) && state.unlocked.includes(paper);

/** Dev-only preview unlock (?unlock=cs). Real unlocks come from Razorpay + server. */
export function devUnlockFromUrl() {
  const u = new URLSearchParams(location.search).get('unlock');
  if (u && import.meta.env.DEV && !state.unlocked.includes(u)) set({ unlocked: [...state.unlocked, u] });
}
