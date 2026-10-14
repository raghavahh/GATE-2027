// Pings IndexNow (Bing, Yandex, Seznam, Naver…) with every URL in the built sitemaps so they recrawl quickly.
// The key file public/006099de7dc91d5e2f3dcb11ae41e6fd.txt proves we own the site. usage after a deploy: npm run build && node scripts/indexnow.mjs
import { readFileSync, readdirSync } from 'fs';
const KEY = '006099de7dc91d5e2f3dcb11ae41e6fd';
const HOST = 'gate-az.pages.dev';
const urls = readdirSync('dist').filter(f => /^sitemap-.+\.xml$/.test(f))
  .flatMap(f => [...readFileSync(`dist/${f}`, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));
for (let i = 0; i < urls.length; i += 10000) {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls.slice(i, i + 10000) }),
  });
  console.log(`IndexNow: ${urls.slice(i, i + 10000).length} URLs → ${res.status} ${res.statusText}`);
}
