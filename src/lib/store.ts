import { useSyncExternalStore } from 'react';

export type Status = 'todo' | 'doing' | 'done';

interface State {
  progress: Record<string, Status>;
  /** Paper slugs unlocked. Replaced by server entitlements once payments go live. */
  unlocked: string[];
  theme: 'dark' | 'light';
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

function set(next: Partial<State>) {
  state = { ...state, ...next };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
  subs.forEach(f => f());
}

const subscribe = (f: () => void) => { subs.add(f); return () => subs.delete(f); };

export function useStore() {
  return useSyncExternalStore(subscribe, () => state);
}

export function setStatus(topicId: string, s: Status) {
  set({ progress: { ...state.progress, [topicId]: s } });
}

export function toggleTheme() {
  const theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.classList.toggle('light', theme === 'light');
  set({ theme });
}

export const isUnlocked = (paper: string) => state.unlocked.includes(paper);

/** Dev-only preview unlock (?unlock=cs). Real unlocks come from Razorpay + server. */
export function devUnlockFromUrl() {
  const u = new URLSearchParams(location.search).get('unlock');
  if (u && import.meta.env.DEV && !state.unlocked.includes(u)) set({ unlocked: [...state.unlocked, u] });
}
