import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Supabase reports failed/expired email links in the hash (#error=…): show them on the sign-in page.
const q = new URLSearchParams(location.search);
if (location.pathname !== '/auth' && q.get('error') && !q.get('code')) {
  // Google sign-in failed or was cancelled (PKCE returns the error in the query): explain it on the sign-in page.
  history.replaceState(null, '', `/auth?error=${encodeURIComponent(q.get('error_description') ?? q.get('error') ?? 'sign-in failed')}`);
} else if (/^#(error|access_token)=/.test(location.hash)) {
  const p = new URLSearchParams(location.hash.slice(1));
  history.replaceState(null, '', `/auth?error=${encodeURIComponent(p.get('error_description') ?? p.get('error') ?? 'sign-in failed')}`);
} else if (location.hash.startsWith('#/')) {
  // Old #/ links (shared links, bookmarks, older email templates) move to the real path.
  history.replaceState(null, '', location.hash.slice(1));
}

// Installable app (PWA). Production only, so local development never runs a stale cached build.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
