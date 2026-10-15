// GATE A–Z service worker: makes the site installable and readable offline, without ever serving
// stale pages or touching sign-in / payment traffic.
//  - Pages: network first (always fresh), cached copy only when offline.
//  - /assets/*: hashed and immutable, so cache first.
//  - Icons/images on this site: cached, refreshed in the background.
//  - Anything on other domains (Supabase, Razorpay, YouTube, Google): not touched at all.
const VERSION = 'gaz-v1';
const PAGES = `${VERSION}-pages`;
const STATIC = `${VERSION}-static`;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(PAGES).then(c => c.addAll(['/', '/papers', '/pyq'])).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // Supabase, Razorpay, YouTube, fonts: straight to the network
  if (/^\/(auth|account|admin)(\/|$)/.test(url.pathname) || url.searchParams.has('code')) return; // sign-in flows: never cached

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(PAGES).then(c => c.put(url.pathname, copy)); }
      return res;
    }).catch(() => caches.match(url.pathname).then(hit => hit || caches.match('/'))));
    return;
  }
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(STATIC).then(c => c.put(req, copy)); }
      return res;
    })));
    return;
  }
  if (/\.(png|svg|webmanifest)$/.test(url.pathname)) {
    e.respondWith(caches.open(STATIC).then(c => c.match(req).then(hit => {
      const fresh = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || fresh;
    })));
  }
});
