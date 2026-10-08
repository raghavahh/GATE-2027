import { supabase } from './supabase';
import { getProgress, mergeProgress, setPusher, type Status } from './store';

/**
 * Keeps topic ticks in the `progress` table so they follow the student across devices.
 * Local storage stays the source while offline; on sign-in both sides are merged ('done' wins).
 */
export async function startSync(userId: string) {
  const { data, error } = await supabase.from('progress').select('topic_id, status');
  if (error) { console.warn('progress sync off:', error.message); return; }
  const remote = Object.fromEntries(data.map(r => [r.topic_id, r.status as Status]));
  mergeProgress(remote);

  const merged = getProgress();
  const up = Object.entries(merged).filter(([id, s]) => remote[id] !== s).map(([topic_id, status]) => ({ user_id: userId, topic_id, status }));
  for (let i = 0; i < up.length; i += 500) await supabase.from('progress').upsert(up.slice(i, i + 500));

  // Batch rapid ticks into one write a second later.
  let queue: Record<string, Status> = {};
  let timer: ReturnType<typeof setTimeout> | undefined;
  setPusher((topicId, s) => {
    queue[topicId] = s;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const rows = Object.entries(queue).map(([topic_id, status]) => ({ user_id: userId, topic_id, status, updated_at: new Date().toISOString() }));
      queue = {};
      supabase.from('progress').upsert(rows).then(({ error: e }) => { if (e) console.warn('progress save failed:', e.message); });
    }, 1000);
  });
}

export const stopSync = () => setPusher(null);
