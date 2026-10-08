import { useEffect } from 'react';

/** Sets the browser/search-result title for a page ("Deadlock · CS · GATE A–Z"). */
export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · GATE A–Z` : 'GATE A–Z · Every GATE 2027 topic, in order';
  }, [title]);
}
