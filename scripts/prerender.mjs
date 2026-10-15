// Pre-renders every public page into real HTML after `vite build`, so search engines and AI crawlers
// (GPTBot, ClaudeBot, PerplexityBot… which do not run JavaScript) see each page's own title, description,
// structured data and syllabus content. The React app still boots on top and replaces #root as before.
//
// Writes into dist/: <route>.html for every public page (Cloudflare Pages serves /ee from ee.html),
// shell.html + 404.html (bare app shell, noindex), robots.txt, sitemap index + per-paper sitemaps, llms.txt.
// Only public information goes in: the official syllabus, marks, difficulty, video counts, free PYQ links.
// Paid lecture lists and notes stay behind the paywall.
// usage: node scripts/prerender.mjs   (run by `npm run build`)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const CAT = join(ROOT, 'src', 'catalog');
const SITE = 'https://gate-az.pages.dev';
const EDITION = 'GATE 2027';
const PRICE = 49;
const TODAY = new Date().toISOString().slice(0, 10);
const json = p => JSON.parse(readFileSync(p, 'utf8'));
// "Last updated" = the last real change to the syllabus/catalog content (never the build time).
// Pinned in src/catalog/updated.txt (Cloudflare builds from a shallow clone, so git history can't tell us).
// Bump that date only when the syllabus, lectures or notes really change.
const UPDATED = existsSync(join(CAT, 'updated.txt')) ? readFileSync(join(CAT, 'updated.txt'), 'utf8').trim() : TODAY;
const UPDATED_TEXT = new Date(`${UPDATED}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const OG_IMAGE = `${SITE}/og.png`;
// Official profiles of GATE A–Z (Instagram, YouTube, X…): add them here once they exist; they become schema sameAs.
const SAME_AS = [];

// ---------- data ----------
const PAPERS = [...readFileSync(join(CAT, 'papers.ts'), 'utf8').matchAll(/p\('([A-Z]{2})', '([^']+)', '(\w+)'(?:, '(\w+)')?/g)]
  .map(([, code, name, group, status]) => ({ code, slug: code.toLowerCase(), name, group, status: status ?? 'soon' }));
const SELLABLE = new Set(json(join(CAT, 'sellable.json')));
const SUMMARY = json(join(CAT, 'summary.json'));
const PYQ = json(join(CAT, 'pyq.json'));
const GA = json(join(CAT, 'generated', 'ga.json'));
const CANON_GA = 'cs'; // General Aptitude topics are identical in every paper: one canonical URL each
const sheet = slug => {
  const f = join(CAT, 'generated', `${slug}.json`);
  const own = existsSync(f) ? json(f) : [];
  return own.length ? [...own, ...GA] : [];
};
const videoCount = slug => {
  const f = join(CAT, 'videos', `${slug}.json`);
  const v = existsSync(f) ? json(f) : {};
  return id => (Array.isArray(v[id]) ? v[id].length : typeof v[id] === 'number' ? v[id] : 0);
};
const DIFF = { E: 'Easy', M: 'Medium', H: 'Hard' };
const upper = m => Number(String(m ?? '').split(/[–-]/).pop()) || 0;

// ---------- html helpers ----------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const a = (href, text, cls = 'text-brand') => `<a href="${esc(href)}"${cls ? ` class="${cls}"` : ''}>${esc(text)}</a>`;
const ld = obj => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const ORG = { '@type': 'Organization', '@id': `${SITE}/#org`, name: 'GATE A–Z', url: `${SITE}/`, logo: `${SITE}/favicon.svg`, image: OG_IMAGE,
  founder: { '@type': 'Person', name: 'Pithani Raghavendra' }, areaServed: 'IN', ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  description: `Topic-wise ${EDITION} syllabus sheets with hand-picked video lectures, key-point notes and free official previous-year papers for every GATE paper.` };
const crumbs = items => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + url })) });
const faqLd = qa => ({ '@type': 'FAQPage', mainEntity: qa.map(([q, ans]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: ans } })) });
const faqHtml = qa => `<section class="mt-10"><h2 class="text-lg font-semibold">Frequently asked questions</h2>${qa.map(([q, ans]) => `<h3 class="mt-4 font-semibold">${esc(q)}</h3><p class="mt-1 text-sub">${esc(ans)}</p>`).join('')}</section>`;
const NAV = `<header class="mx-auto max-w-shell px-4 py-4 sm:px-6"><a href="/" class="font-semibold">GATE A–Z</a> · ${a('/papers', 'Papers')} · ${a('/pyq', 'PYQs')} · ${a('/guide', 'How to prepare')} · ${a('/about', 'About')}</header>`;
const FOOT = `<footer class="mx-auto max-w-shell px-4 py-10 text-sm text-sub sm:px-6">GATE A–Z · ${EDITION} · ₹${PRICE} per paper, 1 year of access · ${a('/about', 'About')} · ${a('/terms', 'Terms')} · ${a('/privacy', 'Privacy')} · ${a('/refund', 'Refunds')} · ${a('/delivery', 'Delivery')} · ${a('/contact', 'Contact')}. Not affiliated with IISc, the IITs or the GATE organisers. Videos belong to their creators and play through YouTube's official player.</footer>`;

const TEMPLATE = readFileSync(join(DIST, 'index.html'), 'utf8');
// The template must be Vite's fresh index.html; re-running on an already pre-rendered dist would nest pages.
if (TEMPLATE.includes('application/ld+json')) throw new Error('dist/index.html is already pre-rendered: run `npm run build` instead');
const clamp = d => (d.length <= 160 ? d : `${d.slice(0, 157).replace(/[\s,;:·–-]+\S*$/, '')}…`);
const table = (head, rows) => `<table class="mt-3"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
function page({ title, description, body = '', graph = [], noindex = false, canonical = '/' }) {
  const url = SITE + canonical;
  description = clamp(description);
  if (!noindex) graph = [...graph, { '@type': 'WebPage', '@id': url, url, name: title, description, inLanguage: 'en', dateModified: UPDATED,
    isPartOf: { '@id': `${SITE}/#site` }, publisher: { '@id': `${SITE}/#org` }, author: { '@type': 'Person', name: 'Pithani Raghavendra', url: `${SITE}/about` }, primaryImageOfPage: OG_IMAGE }];
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    '<meta name="author" content="Pithani Raghavendra" />',
    noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    graph.length ? ld({ '@context': 'https://schema.org', '@graph': graph }) : '',
  ].filter(Boolean).join('\n    ');
  let html = TEMPLATE
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/\s*<meta name="description"[^>]*>/, '')
    .replace(/\s*<meta property="og:(title|description|url)"[^>]*>/g, '')
    .replace('<meta name="twitter:card" content="summary" />', '<meta name="twitter:card" content="summary_large_image" />')
    .replace('</head>', `    ${head}\n  </head>`);
  if (body) html = html.replace('<div id="root"></div>', () => `<div id="root">${NAV}<main class="mx-auto max-w-shell px-4 py-10 sm:px-6">${body}<p class="mt-10 text-sm text-sub">By <a href="/about" rel="author" class="text-brand">Pithani Raghavendra</a> · Last updated <time datetime="${UPDATED}">${UPDATED_TEXT}</time></p></main>${FOOT}</div>`);
  return html;
}
let pages = 0;
const out = (route, html) => {
  const f = join(DIST, route === '/' ? 'index.html' : `${route.slice(1)}.html`);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, html, 'utf8');
  pages++;
};
const sitemaps = { pages: ['/', '/papers', '/pyq', '/guide', '/about', '/terms', '/privacy', '/refund', '/delivery', '/contact'] };

// ---------- per paper ----------
const live = PAPERS.map(p => ({ ...p, subjects: sheet(p.slug) })).filter(p => p.subjects.length);
// GATE 2027 has 30 papers; a paper without a published sheet yet (Robotics & Automation) is named, not hidden.
const TOTAL = PAPERS.length;
const SOON = PAPERS.filter(p => !live.some(l => l.slug === p.slug)).map(p => `${p.name} (${p.code})`);
const sellCodes = live.filter(p => SELLABLE.has(p.slug)).map(p => p.code);
for (const p of live) {
  const sell = SELLABLE.has(p.slug);
  const vc = videoCount(p.slug);
  const flat = p.subjects.flatMap(s => s.modules.flatMap(m => m.topics.map(t => ({ t, s, m }))));
  const stats = SUMMARY[p.slug] ?? {};
  const nTopics = stats.topics || flat.length;
  const years = (PYQ[p.slug] ?? []).map(y => y.year);
  const yr = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '';
  const top = p.subjects.filter(s => s.marks).sort((x, y) => upper(y.marks) - upper(x.marks)).slice(0, 3);
  const course = { '@type': 'Course', '@id': `${SITE}/${p.slug}#course`, name: `${EDITION} ${p.name} (${p.code}) — topic-wise preparation`,
    description: `Every topic of the official ${EDITION} ${p.code} syllabus in order${sell ? ', with hand-picked video lectures and key-point notes for each topic' : ''}.`,
    provider: { '@id': `${SITE}/#org` }, url: `${SITE}/${p.slug}`, inLanguage: 'en', educationalLevel: 'GATE aspirants (engineering / science graduates)',
    ...(sell ? { offers: { '@type': 'Offer', price: PRICE, priceCurrency: 'INR', category: 'Paid', availability: 'https://schema.org/InStock', url: `${SITE}/${p.slug}` },
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Online', courseWorkload: 'P1Y' } } : { isAccessibleForFree: true }) };
  const qa = [
    [`What is in the ${EDITION} ${p.code} syllabus?`, `The ${EDITION} ${p.name} (${p.code}) paper covers ${p.subjects.map(s => s.name).join(', ')}: ${nTopics} topics in ${p.subjects.length} subjects, including General Aptitude (15 marks).`],
    ...(top.length ? [[`Which ${p.code} subjects carry the most marks?`, `Typically ${top.map(s => `${s.name} (about ${s.marks} marks)`).join(', ')}. These are typical ranges from recent papers, not official figures.`]] : []),
    [`What is the ${EDITION} exam pattern?`, '65 questions for 100 marks in 3 hours: MCQ, MSQ and NAT questions. General Aptitude is 15 marks. Only MCQs have negative marking (−1/3 for 1-mark and −2/3 for 2-mark questions).'],
    ...(yr ? [[`Where can I download GATE ${p.code} previous-year papers?`, `Official GATE ${p.code} question papers and answer keys from ${yr} are linked free at ${SITE}/pyq?paper=${p.slug}.`]] : []),
    sell ? [`How much does GATE A–Z ${p.code} cost?`, `₹${PRICE} once for 1 year of full ${p.code} access: every topic's hand-picked lectures and notes. One topic in each subject is free to try first.`]
      : [`Is the GATE A–Z ${p.code} sheet free?`, `Yes. The full ${p.code} syllabus sheet is free to browse; lectures for ${p.code} are being curated.`],
  ];
  const subjHtml = p.subjects.map(s => `<section class="mt-8"><h2 class="text-lg font-semibold">${esc(s.name)}${s.marks ? ` <span class="text-sub">· about ${esc(s.marks)} marks</span>` : ''}</h2>${s.focus ? `<p class="mt-1 text-sub">${esc(s.focus)}</p>` : ''}${s.modules.map(m => `<h3 class="mt-4 font-semibold">${esc(m.letter)}. ${esc(m.name)}</h3><ul class="mt-2">${m.topics.map(t => `<li>${a(`/${p.slug}/${t.id}`, t.name, '')} <span class="text-sub">· ${DIFF[t.diff] ?? ''}${vc(t.id) ? ` · ${vc(t.id)} lectures` : ''}${t.sample ? ' · free sample' : ''}</span></li>`).join('')}</ul>`).join('')}</section>`).join('');
  out(`/${p.slug}`, page({ canonical: `/${p.slug}`,
    title: `${EDITION} ${p.code} Syllabus, Topic-wise Lectures & PYQs | GATE A–Z`,
    description: `${EDITION} ${p.code} syllabus as a topic-wise sheet: ${p.subjects.length} subjects, ${nTopics} topics${stats.videos ? `, ${stats.videos} hand-picked lectures` : ''}, subject marks and free official PYQs.${sell ? ` ₹${PRICE} per year.` : ''}`,
    body: `<p class="font-mono text-sm text-brand">${p.code} · ${EDITION}</p>
<h1 class="mt-2 text-3xl font-semibold">${EDITION} ${esc(p.name)} (${p.code}) syllabus — topic-wise A–Z sheet</h1>
<p class="mt-3 text-sub">The official ${EDITION} ${p.code} syllabus as one ordered checklist: ${p.subjects.length} subjects, ${nTopics} topics${stats.videos ? `, ${stats.videos} hand-picked lectures` : ''}. ${sell ? `Tick topics off as you go. ₹${PRICE} for 1 year of full access; one topic per subject is free.` : 'The full sheet is free to browse.'}${yr ? ` Free official previous-year papers: ${a(`/pyq?paper=${p.slug}`, `GATE ${p.code} PYQs ${yr}`)}.` : ''}</p>
<h2 class="mt-8 text-lg font-semibold">${p.code} subjects and typical marks</h2>${table(['Subject', 'Typical marks', 'Topics'], p.subjects.map(s => [esc(s.name), esc(s.marks || '–'), String(s.modules.reduce((n, m) => n + m.topics.length, 0))]))}
${subjHtml}${faqHtml(qa)}`,
    graph: [ORG, course, crumbs([['GATE A–Z', '/'], ['Papers', '/papers'], [`${p.code} ${p.name}`, `/${p.slug}`]]), faqLd(qa)] }));
  sitemaps[p.slug] = [`/${p.slug}`];

  flat.forEach(({ t, s, m }, i) => {
    const isGa = t.id.startsWith('ga-');
    const canonical = isGa ? `/${CANON_GA}/${t.id}` : `/${p.slug}/${t.id}`;
    const n = vc(t.id);
    const prev = flat[i - 1]?.t, next = flat[i + 1]?.t;
    const sibs = m.topics.filter(x => x.id !== t.id);
    out(`/${p.slug}/${t.id}`, page({ canonical,
      title: `${t.name} – GATE 2027 ${p.code} ${s.name} | GATE A–Z`,
      description: `${t.name} for GATE 2027 ${p.code} (${s.name}): ${(DIFF[t.diff] ?? '').toLowerCase()} topic${s.marks ? `, subject worth about ${s.marks} marks` : ''}${n ? `, ${n} hand-picked lectures` : ''}. In syllabus order, with free official PYQs.`,
      body: `<p class="text-sm text-sub">${a(`/${p.slug}`, p.code)} / ${esc(s.name)} / ${esc(m.letter)} ${esc(m.name)}</p>
<h1 class="mt-2 text-3xl font-semibold">${esc(t.name)} — GATE 2027 ${p.code}</h1>
<p class="mt-3 text-sub">${DIFF[t.diff] ?? ''} topic · ${esc(s.name)}${s.marks ? ` (about ${esc(s.marks)} marks in GATE ${p.code})` : ''} · Module ${esc(m.letter)}: ${esc(m.name)}</p>
<p class="mt-3">${esc(t.name)} is on the official ${EDITION} ${esc(p.name)} syllabus under ${esc(s.name)} → ${esc(m.name)}. ${n ? `GATE A–Z has ${n} hand-picked video lectures for it, playing right on the page. ` : ''}${t.sample ? 'This topic is a free sample: watch it without paying.' : sell ? `Lectures and notes unlock with the full ${p.code} paper: ₹${PRICE} for 1 year.` : ''}</p>
${sibs.length ? `<h2 class="mt-8 text-lg font-semibold">More in ${esc(m.name)}</h2><ul class="mt-2">${sibs.map(x => `<li>${a(`/${p.slug}/${x.id}`, x.name, '')}</li>`).join('')}</ul>` : ''}
<p class="mt-8">${prev ? `Previous: ${a(`/${p.slug}/${prev.id}`, prev.name)}` : ''}${prev && next ? ' · ' : ''}${next ? `Next: ${a(`/${p.slug}/${next.id}`, next.name)}` : ''}</p>
<p class="mt-3">${a(`/${p.slug}`, `Full ${EDITION} ${p.code} syllabus sheet`)}${yr ? ` · ${a(`/pyq?paper=${p.slug}`, `GATE ${p.code} previous-year papers`)}` : ''}</p>`,
      graph: [ORG, crumbs([['GATE A–Z', '/'], [p.code, `/${p.slug}`], [t.name, canonical]]),
        { '@type': 'LearningResource', name: `${t.name} (GATE 2027 ${p.code})`, url: SITE + canonical, learningResourceType: 'Video lectures and notes',
          educationalLevel: 'GATE', teaches: t.name, about: s.name, isAccessibleForFree: !!t.sample,
          isPartOf: { '@id': `${SITE}/${isGa ? CANON_GA : p.slug}#course` }, provider: { '@id': `${SITE}/#org` } }] }));
    if (!isGa || p.slug === CANON_GA) sitemaps[p.slug].push(`/${p.slug}/${t.id}`);
  });
}

// ---------- site pages ----------
const homeQa = [
  ['What is GATE A–Z?', `GATE A–Z turns your paper's official ${EDITION} syllabus into an ordered A–Z checklist. Each topic has hand-picked video lectures from trusted GATE teachers that play on the page, plus key-point notes; tick it off and move to the next. Official previous-year papers are free.`],
  ['How much does it cost?', `₹${PRICE} per paper, paid once, for 1 year of access. One topic in every subject is free to try. Papers with lectures now: ${sellCodes.join(', ')}.`],
  ['Which GATE papers are covered?', `${live.length} of the ${TOTAL} ${EDITION} papers have a free syllabus sheet${SOON.length ? ` (${SOON.join(', ')}, new in ${EDITION}, is coming)` : ''}; lectures are live for ${sellCodes.join(', ')}.`],
  ['Are the previous-year papers free?', 'Yes. Official GATE question papers and answer keys are linked free on the PYQ page, paper by paper.'],
];
out('/', page({ canonical: '/',
  title: 'GATE A–Z · GATE 2027 syllabus topic-wise, best lectures, free PYQs',
  description: `Every ${EDITION} topic in order for ${live.length} of the ${TOTAL} papers: hand-picked lectures on the page, key-point notes, free official PYQs. ₹${PRICE} per paper, 1 year.`,
  body: `<p class="font-mono text-sm text-brand">${EDITION} · all ${TOTAL} papers</p><h1 class="mt-3 text-3xl font-semibold">Every GATE topic, in the right order.</h1>
<p class="mt-4 text-sub">Your paper's official ${EDITION} syllabus as an A–Z sheet. Hand-picked lectures for each topic play right here; tick it off and move to the next. Official previous-year papers are free. ₹${PRICE} per paper, 1 year.</p>
<h2 class="mt-10 text-lg font-semibold">How does GATE A–Z work?</h2>
<p class="mt-2">You open your paper's sheet, which lists every topic of the official ${EDITION} syllabus in order, and study one topic at a time.</p>
<ol class="mt-2"><li>Pick your paper: the sheet shows every subject with its typical marks, so you start where the marks are.</li><li>Open a topic: the best lecture for it, picked from established GATE teachers, plays right on the page, with short key-point notes below.</li><li>Tick it done: the sheet keeps your progress and takes you to the next topic.</li><li>Practise: solve the official previous-year papers for your paper, free on the PYQ page.</li></ol>
<h2 class="mt-10 text-lg font-semibold">Which papers have lectures, and what does it cost?</h2>
<p class="mt-2">${sellCodes.length} papers have hand-picked lectures today, each ₹${PRICE} for 1 year; the syllabus sheet for every other paper is free.</p>
${table(['Paper', 'Topics', 'Lectures', 'Price'], live.filter(p => SELLABLE.has(p.slug)).map(p => [a(`/${p.slug}`, `${p.code} — ${p.name}`, ''), String(SUMMARY[p.slug]?.topics ?? ''), String(SUMMARY[p.slug]?.videos ?? ''), `₹${PRICE} / 1 year`]))}
<h2 class="mt-10 text-lg font-semibold">Pick your paper</h2><ul class="mt-2">${live.map(p => `<li>${a(`/${p.slug}`, `${p.code} — ${p.name}`, '')}${SELLABLE.has(p.slug) ? ' <span class="text-sub">· lectures live</span>' : ''}</li>`).join('')}</ul>${faqHtml(homeQa)}`,
  graph: [ORG, { '@type': 'WebSite', '@id': `${SITE}/#site`, url: `${SITE}/`, name: 'GATE A–Z', publisher: { '@id': `${SITE}/#org` }, inLanguage: 'en' }, faqLd(homeQa)] }));

out('/papers', page({ canonical: '/papers', title: 'All GATE 2027 papers — syllabus sheets | GATE A–Z',
  description: `All ${TOTAL} ${EDITION} papers: free topic-wise syllabus sheets. Lectures live for ${sellCodes.join(', ')}.`,
  body: `<h1 class="text-3xl font-semibold">All ${EDITION} papers</h1><ul class="mt-4">${live.map(p => `<li>${a(`/${p.slug}`, `${p.code} — ${p.name}`, '')} <span class="text-sub">· ${SUMMARY[p.slug]?.topics ?? ''} topics</span></li>`).join('')}</ul>`,
  graph: [ORG, crumbs([['GATE A–Z', '/'], ['Papers', '/papers']]), { '@type': 'ItemList', itemListElement: live.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/${p.slug}`, name: `${EDITION} ${p.name} (${p.code})` })) }] }));

const pyqPapers = live.filter(p => PYQ[p.slug]?.length);
out('/pyq', page({ canonical: '/pyq', title: 'GATE previous year papers with answer keys (official PDFs, free) | GATE A–Z',
  description: 'Free official GATE question papers and answer keys for every paper, year by year, linked straight to the official GATE websites.',
  body: `<h1 class="text-3xl font-semibold">GATE previous-year papers — official PDFs, free</h1><p class="mt-3 text-sub">Every link goes to the official GATE organising institute's PDF.</p>${pyqPapers.map(p => `<section class="mt-8"><h2 class="text-lg font-semibold">GATE ${p.code} — ${esc(p.name)}</h2><ul class="mt-2">${PYQ[p.slug].map(y => `<li>${y.year}: ${y.sets.map(s => `${a(s.qp, `${s.label} question paper`)}${s.key ? ` · ${a(s.key, 'answer key')}` : ''}`).join(' · ')}</li>`).join('')}</ul></section>`).join('')}`,
  graph: [ORG, crumbs([['GATE A–Z', '/'], ['PYQs', '/pyq']])] }));

const guideQa = [
  ['What is the GATE 2027 exam pattern?', '65 questions, 100 marks, 3 hours. Question types: MCQ, MSQ and NAT. General Aptitude carries 15 marks in every paper. Negative marking applies to MCQs only: −1/3 for 1-mark and −2/3 for 2-mark questions.'],
  ['How should I plan GATE 2027 preparation?', 'Start with the subjects that carry the most marks, study one topic at a time (lecture, key points, then that topic\'s PYQs), clear Easy and Medium topics before Hard ones, practise General Aptitude daily, revise after 1 day, 1 week and 1 month, and take full-length mocks from 6 weeks out.'],
];
out('/guide', page({ canonical: '/guide', title: 'How to prepare for GATE 2027: exam pattern and study plan | GATE A–Z',
  description: 'GATE 2027 exam pattern (65 questions, 100 marks, 3 hours, MCQ/MSQ/NAT, negative marking) and a step-by-step way to prepare topic by topic.',
  body: `<h1 class="text-3xl font-semibold">How to prepare for GATE 2027</h1><p class="mt-2 text-sub">Check the official GATE 2027 brochure for final details.</p>${faqHtml(guideQa)}`,
  graph: [ORG, crumbs([['GATE A–Z', '/'], ['How to prepare', '/guide']]), faqLd(guideQa)] }));

out('/about', page({ canonical: '/about', title: 'About GATE A–Z: who runs it and how lectures are picked',
  description: `GATE A–Z is an independent project by Pithani Raghavendra, India: official ${EDITION} syllabus sheets with hand-picked lectures, notes and free PYQs.`,
  body: `<h1 class="text-3xl font-semibold">About GATE A–Z</h1>
<p class="mt-3">GATE A–Z turns your paper's official ${EDITION} syllabus into one ordered checklist, so you always know what to study next. Every topic has hand-picked video lectures that play on the page and short key-point notes; you tick it off and move to the next.</p>
<h2 class="mt-8 text-lg font-semibold">Who runs it?</h2><p class="mt-2">GATE A–Z is an independent project built and run by Pithani Raghavendra, India. It is not a coaching institute and is not affiliated with IISc, the IITs or the GATE organisers.</p>
<h2 class="mt-8 text-lg font-semibold">How are the sheets made?</h2><p class="mt-2">Each sheet follows the official ${EDITION} syllabus PDF for that paper, split into subjects, modules and topics in syllabus order. Subject marks are typical ranges from recent papers, and every topic carries an Easy, Medium or Hard tag.</p>
<h2 class="mt-8 text-lg font-semibold">How are lectures picked?</h2><p class="mt-2">For every topic, GATE lectures from established teachers and channels on YouTube are checked against that exact topic, and the best two to five are kept. The videos belong to their creators and play through YouTube's official player.</p>
<h2 class="mt-8 text-lg font-semibold">What does it cost?</h2><p class="mt-2">₹${PRICE} per paper, paid once, for 1 year of access. One topic in every subject is free to try, and official previous-year papers are free for everyone.</p>
<h2 class="mt-8 text-lg font-semibold">How do I report a mistake?</h2><p class="mt-2">Email the address on the ${a('/contact', 'contact page')}; corrections are made quickly.</p>`,
  graph: [ORG, crumbs([['GATE A–Z', '/'], ['About', '/about']]), { '@type': 'AboutPage', '@id': `${SITE}/about#about`, url: `${SITE}/about`, about: { '@id': `${SITE}/#org` } }] }));

for (const [route, title] of [['/terms', 'Terms'], ['/privacy', 'Privacy'], ['/refund', 'Refunds and cancellations'], ['/delivery', 'Delivery and access'], ['/contact', 'Contact']])
  out(route, page({ canonical: route, title: `${title} | GATE A–Z`, description: `GATE A–Z ${title.toLowerCase()}: ₹${PRICE} per paper, 1 year of online access.` }));

// App-only routes and unknown URLs: bare shell, never indexed. 404.html makes unknown paths real 404s.
const shell = page({ title: 'GATE A–Z', description: 'GATE A–Z', noindex: true });
writeFileSync(join(DIST, 'shell.html'), shell, 'utf8');
writeFileSync(join(DIST, '404.html'), shell, 'utf8');

// ---------- crawl files ----------
const map = urls => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n')}\n</urlset>\n`;
for (const [k, urls] of Object.entries(sitemaps)) writeFileSync(join(DIST, `sitemap-${k}.xml`), map(urls), 'utf8');
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(sitemaps).map(k => `<sitemap><loc>${SITE}/sitemap-${k}.xml</loc><lastmod>${TODAY}</lastmod></sitemap>`).join('\n')}\n</sitemapindex>\n`, 'utf8');

writeFileSync(join(DIST, 'robots.txt'), `# Search engines and AI assistants are welcome to read and cite the public pages.
User-agent: *
Allow: /
Disallow: /admin
Disallow: /me
Disallow: /auth

User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: PerplexityBot
User-agent: Google-Extended
User-agent: Applebot-Extended
Allow: /
Disallow: /admin
Disallow: /me
Disallow: /auth

Sitemap: ${SITE}/sitemap.xml
`, 'utf8');

writeFileSync(join(DIST, 'llms.txt'), `# GATE A–Z

> GATE A–Z (${SITE}) turns each ${EDITION} paper's official syllabus into an ordered, topic-wise checklist (free for all papers). For the papers with lectures live (${sellCodes.join(', ')}), topics have hand-picked video lectures from trusted GATE teachers that play on the page, plus key-point notes (formulas, common mistakes, how GATE asks it). Official previous-year question papers and answer keys are free. Price: ₹${PRICE} per paper, paid once, for 1 year of access; one topic per subject is free to try. Not affiliated with IISc, the IITs or the GATE organisers.

## Key pages
- [All ${EDITION} papers](${SITE}/papers): free syllabus sheets for ${live.length} of the ${TOTAL} papers
- [GATE previous-year papers](${SITE}/pyq): official question papers and answer keys, free
- [How to prepare for ${EDITION}](${SITE}/guide): exam pattern and study plan

## ${EDITION} syllabus sheets (topic-wise, with subject marks)
${live.map(p => `- [${EDITION} ${p.code}: ${p.name}](${SITE}/${p.slug}): ${SUMMARY[p.slug]?.topics ?? ''} topics${SELLABLE.has(p.slug) ? `, ${SUMMARY[p.slug]?.videos ?? ''} hand-picked lectures, ₹${PRICE}/year` : ', free sheet'}`).join('\n')}

## Exam facts
- ${EDITION}: 65 questions, 100 marks, 3 hours; MCQ, MSQ and NAT questions; General Aptitude is 15 marks in every paper; negative marking on MCQs only (−1/3 for 1-mark, −2/3 for 2-mark).
`, 'utf8');

console.log(`prerender: ${pages} pages · ${Object.values(sitemaps).flat().length} sitemap URLs · ${live.length} papers`);
