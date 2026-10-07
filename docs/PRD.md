# GATE A–Z — Product Requirements Document (v2)

| | |
|---|---|
| Product | **GATE A–Z** (working name) — every GATE paper as an A–Z sheet with in-site videos, notes and PYQs |
| Version | 2.0 — supersedes v1 (all decisions below are current) |
| Date | 7 October 2026 |
| Owner | Founder — contact `raghavendrapithani1@gmail.com` |
| Repo | `github.com/raghavahh/GATE-2027` (React 19 + Vite + TypeScript + Tailwind) |
| Live | `https://gate-az.pages.dev` (Cloudflare Pages, auto-deploys from main) |
| Backend | Supabase project `gate-az` (Mumbai, ap-south-1) |

**Legend:** **[DONE]** shipped · **[NEXT]** next build step · **[LATER]** after launch · **[DECIDED]** founder decision · **[OPEN]** needs founder input.

---

## 1. Summary

### 1.1 One line
For each of the 30 GATE papers, the complete official syllabus as an A–Z sheet; every topic has 3–4 hand-picked YouTube lectures **playing inside the site**, key-point notes, previous-year questions (PYQs) and an Easy/Medium/Hard tag — **₹310 per paper, one payment, access for that exam season.**

### 1.2 Problem
- GATE material is scattered across thousands of videos and PDFs; students waste weeks choosing what to study and whom to trust.
- Coaching costs ₹10,000+; most students can't afford it.
- DSA has structured free sheets (Striver A2Z, LeetCode lists); **no equivalent exists for every GATE paper.**

### 1.3 Business model [DECIDED]

| Item | Rule |
|---|---|
| Price | **₹310 per paper**, one-time |
| Access period | From purchase until **30 days after that year's GATE exam** (one "season") |
| Editions | New edition every year (GATE 2027 → 2028 → 2029…). Students buy again each season → repeat revenue |
| Multiple papers | Each paper bought separately (2 papers = ₹620) |
| Refunds / cancellations | **None after purchase** (stated in popup, Terms and Refund page) |
| Payment | Razorpay (UPI first, cards, netbanking) — Indian buyers only |
| Fees | ~2% + GST ≈ ₹7.3 → **~₹303 net per sale** |
| Running cost | ₹0 at launch (Supabase free, Cloudflare Pages free) |

### 1.4 Goals
1. Sell CS first, then every paper, before GATE 2027.
2. Look and feel premium and trustworthy — like LeetCode / Striver A2Z / Brilliant, never "AI slop".
3. Make sharing accounts inconvenient: **one account = one person = one active login.**
4. Give the founder full visibility: sales, users, logins, conversion, abuse.

### 1.5 Non-goals (v1)
Live classes · doubt forum · mock-test engine · native apps · AI chatbot · coupons/bundles · Hindi UI.

### 1.6 Success metrics (first 90 days)
Papers sold (primary) · visitor→signup % · signup→paid % · buy-popup→paid % · weekly active learners · topics completed per learner · refund requests (should be 0) · broken-video rate < 1%.

---

## 2. UI/UX (binding)

### 2.1 Reference products studied and what we take from each

| Product | What we borrow | What we avoid |
|---|---|---|
| **LeetCode** problem list | Dense rows: status · title · difficulty colour (Easy teal / Medium amber / Hard red) · stats column; sticky filter bar; progress donut | Ads, cluttered sidebars |
| **Striver A2Z sheet (takeUforward)** | Step-wise accordions with "x/y done" per step, resource icons per row, revision marking, overall progress bar | Busy colours, heavy banners |
| **Brilliant / Khan Academy** | Calm lesson pages, mastery states, one clear next action | Gamification overload |
| **Coursera / Udemy player** | Video on the left, playlist on the right, "next lecture" flow | Upsell interruptions |
| **Linear / Stripe docs** | Restraint, typographic hierarchy, hairline borders, fast feel | — |
| **Notion** | Readable long-form notes typography | — |

### 2.2 Principles
Content first · one primary action per view · honest numbers only · fast on ₹12k Android phones on 4G · progress you can feel.

### 2.3 Anti-slop rules
No gradients/glow/glassmorphism · no emoji icons · no AI illustrations or stock photos · no hype copy ("unlock your potential") · no fake testimonials/counters/timers · no "Ask AI" bubbles · one icon set (Lucide) · one accent colour.

### 2.4 Design system [DONE]
- **Type:** IBM Plex Sans (UI), IBM Plex Serif (notes body, 17–18 px / 1.75), JetBrains Mono (numbers, codes, prices).
- **Themes:** dark default, light toggle; tokens as CSS variables (`--page --surface --raised --line --ink --sub --mute --brand --easy --medium --hard --ok`).
- **Brand accent:** saffron `#F5A524` (dark) / `#B45309` (light). Difficulty: teal/amber/red. Contrast ≥ 4.5:1.
- **Shape:** 8 px controls, 12 px cards, 16 px modals; 1 px hairlines; no card shadows.
- **Motion:** 150–200 ms; respects reduced-motion.

### 2.5 Screens

| Screen | Status | Must have |
|---|---|---|
| **Home** | [DONE] → polish [NEXT] | Hero with real sheet preview, real stats, paper picker, 3 value points, guide CTA. **Polish:** product screenshot strip, "How it works" 3 steps, FAQ, sticky CTA on mobile |
| **All papers** | [DONE] | 30 cards with live/coming status and real topic counts; filter Engineering/Science/Other [NEXT] |
| **Paper sheet** | [DONE] → polish [NEXT] | Header (price/unlock or progress), sticky search + difficulty filter, subject accordions with marks + x/y done, A–Z modules, topic rows (status box · title · free chip · video count · difficulty). Curiosity rule: locked papers show ~1 in 3 topic names + "N more topics, unlock to see". **Polish:** progress ring per subject, "Continue where you left off", status filter (todo/doing/done), revision star |
| **Topic page** | [DONE] → polish [NEXT] | Breadcrumb, title, difficulty + marks chips, status control, **in-site video player + playlist**, key points (notes), PYQ list, prev/next. Locked → single unlock card (never blurred real content) |
| **Buy popup** | [DONE] → real checkout [NEXT] | What's included (real counts), ₹310, season access, one login, **no refunds**, Pay with UPI → Razorpay |
| **Sign in** | [DONE] | Google (primary), email 6-digit code; one-login notice |
| **"Signed out elsewhere" banner** | [DONE] | Shown when a newer login replaces this one |
| **Dashboard** | [NEXT] | Owned papers, overall progress, continue, revision due, days to exam |
| **PYQ hub** | [DONE] basic → full [NEXT] | Year × paper table 2007–2026 with official links |
| **How to prepare** | [DONE] | Exam pattern, 7 scoring rules; per-paper strategy pages [NEXT] |
| **Account** | [NEXT] | Purchases, expiry date, sign out everywhere |
| **Legal** | [NEXT] | Terms, Privacy, Refund ("no refunds or cancellations"), Contact — required by Razorpay |
| **Admin** | [DONE] v1 → v2 [NEXT] | Revenue, sales, users, logins today, sales by paper, recent purchases. **v2:** funnel, most-tapped locked topics, user search, manual grant/revoke, block user, CSV export |

### 2.6 Performance and accessibility
LCP ≤ 2.5 s on mid Android/4G · initial JS ≤ 200 KB gz (code-split per page; sheets loaded per paper [NEXT]) · YouTube iframe only after tap · WCAG 2.2 AA: focus rings, keyboard, 44 px targets, aria on modals.

---

## 3. Content

### 3.1 Syllabus [DONE for 26 papers]
- Generated from the **official GATE 2027 syllabus PDFs (IIT Madras)** by `scripts/build_syllabus.py` → `src/catalog/generated/<paper>.json`.
- Each listed syllabus item = one topic; sections = subjects; labelled sub-areas = A–Z modules.
- General Aptitude (official, 29 topics) is added to every paper.
- **[NEXT]** TF, XE, XL, XH (different PDF names on the official site). XE/XL/XH/GG need section choice (compulsory + optional sections).
- **[NEXT]** Manual pass on the 6 biggest papers: fix split artefacts, add typical marks per subject, review difficulty tags (currently auto-estimated).

### 3.2 Videos [IN PROGRESS]
- 3–4 per topic, found by `scripts/find_videos.py`: YouTube search per topic → keep trusted GATE educators → **every video verified embeddable via YouTube oEmbed** → stored with title + channel.
- Played through the official embed (`youtube-nocookie.com`), never downloaded or re-hosted; creators credited.
- Weekly health check [LATER] to replace removed videos.
- Status: CS and DA done; remaining papers running.

### 3.3 Notes [NEXT]
Per topic: why it matters · definition · how it works · formulas · 2 worked examples · common mistakes · exam tip · "I can…" checklist. Original writing, technically reviewed. Priority CS → DA → EC/EE/ME/CE.

### 3.4 PYQs
Free hub with official links (2007–2026). **[NEXT]** topic-wise mapping (Year · Set · Q.No · Marks · Type) for paid papers; question text not reproduced.

### 3.5 Free vs paid

| | Free | Paid |
|---|---|---|
| Papers, subjects, module names, ~1/3 topic names, counts | ✓ | ✓ |
| 1 sample topic per subject (videos + notes) | ✓ | ✓ |
| PYQ hub, guides | ✓ | ✓ |
| All topics, videos, notes, PYQ map, progress | — | ✓ |

---

## 4. Accounts, one login and anti-sharing

| Rule | Implementation |
|---|---|
| Sign-in | Google OAuth (primary) [NEXT: Google Cloud client] and email 6-digit code [DONE; needs custom SMTP for public users] |
| No passwords | Nothing shareable |
| **One active login** [DONE] | On sign-in the client calls `claim_session(session_id)`; every 60 s and on focus it calls `is_active_session`; if a newer login exists → signed out + banner |
| Paid content only for active session [NEXT] | Content RPCs check entitlement **and** active session server-side |
| Device limit [LATER] | Max 2 registered devices; swap needs email code, once per 15 days |
| Watermark [NEXT] | Faint email on notes pages |
| Rate limit [NEXT] | 120 topic loads/hour per user; abuse flagged in admin |
| Honest limit | Screenshots/screen recording can't be prevented; we stop casual sharing |

---

## 5. Payments (Razorpay) — security design [NEXT]

### 5.1 Flow
1. User taps **Pay ₹310** (must be signed in; popup signs in inline).
2. Browser calls Edge Function **`create-order`** with `{ paper }` + user JWT.
   - Server checks paper exists and user doesn't already own it this edition.
   - **Amount comes from the server (31000 paise), never from the browser.**
   - Creates Razorpay Order (`notes: { user_id, paper, edition }`), stores it in `orders` (status `created`).
3. Browser opens Razorpay Checkout with `order_id` + **Key ID** (public).
4. On success, browser sends `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature` to **`verify-payment`**.
   - Server recomputes **HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)** and compares in constant time.
   - Server fetches the payment from Razorpay API: status `captured`, amount `31000`, order matches.
   - Inserts `entitlements` row (unique per user + paper + edition; idempotent on `payment_id`), `expires_at` = exam date + 30 days.
5. **Webhook `razorpay-webhook`** (`payment.captured`, `order.paid`) does the same grant as a fallback if the browser closed. Verifies `X-Razorpay-Signature` with the **webhook secret**; stores event id to process each event once.
6. Paper unlocks instantly; receipt email [LATER].

### 5.2 Rules
- `KEY_SECRET` and `WEBHOOK_SECRET` live **only** in Supabase Edge Function secrets — set by the founder in the dashboard, never in the repo or browser.
- Browser can never write `entitlements` (Row Level Security: select-own only).
- Duplicate payments: second grant ignored (unique constraint); founder refunds manually if ever needed (policy is no refunds, but duplicates are refunded by law/decency).
- Pending UPI: poll order status up to 10 minutes.
- Razorpay requires website verification: Terms, Privacy, Refund, Contact pages must be live.

---

## 6. Backend (Supabase)

### 6.1 Tables
`profiles` [DONE] · `entitlements` [DONE] · `active_sessions` [DONE] · `events` [DONE] · `admins` [DONE] · `orders` [NEXT] · `webhook_events` [NEXT] · `topic_content` (notes, PYQ refs) [NEXT] · `topic_videos` [NEXT] · `progress` (server sync) [NEXT].

### 6.2 Security
- RLS on every table; users read only their own rows.
- `security definer` functions with `search_path=''`; `anon` cannot call session functions.
- **Paid content moves out of the JavaScript bundle into the database** [NEXT]: videos and notes served by `get_topic(paper, topic)` only when entitled + active session (samples always allowed). Today they ship in the bundle — acceptable for staging only.
- Admin data only via `admin_*` functions that check `is_admin()`.
- Edge Functions verify the user JWT; CORS limited to the site domain.

### 6.3 Analytics events
`page_view`, `paper_view`, `topic_view`, `locked_tap`, `buy_popup_open`, `checkout_start`, `payment_success`, `payment_failed`, `sample_open`, `video_play`, `status_change`, `login`, `session_replaced`.

---

## 7. Hosting and operations
- **Now:** GitHub Pages (staging). **Before payments:** move to **Cloudflare Pages** (free plan allows commercial use; GitHub Pages and Vercel Hobby do not). Custom domain recommended (~₹500–1,000/yr) [OPEN].
- Supabase free tier pauses after ~7 days idle → keep-alive ping [NEXT].
- Weekly DB backup [LATER].

---

## 8. Legal pages [NEXT]
- **Terms:** single-user licence, one active login, sharing → suspension without refund, season access definition, accuracy disclaimer, Indian law.
- **Privacy (DPDP Act 2023):** data collected (email, purchases, progress, session ids, events), purpose, retention, deletion on request, processors (Supabase, Razorpay, Cloudflare/GitHub, Google).
- **Refund & cancellation:** **No refunds or cancellations once purchased.** Duplicate charges refunded.
- **Contact:** `raghavendrapithani1@gmail.com`, name and city [OPEN].
- **Disclaimer:** not affiliated with IISc/IITs/GATE organisers; videos belong to creators.

---

## 9. Delivery plan

| Step | Scope | Needs from founder |
|---|---|---|
| **1** | Run `supabase/schema.sql`; URL config; make self admin | Founder (10 min) |
| **2** | Google sign-in | Google Cloud OAuth client (guided) |
| **3** | UI/UX polish pass (home, sheet, topic, dashboard, account, legal pages) | — |
| **4** | Razorpay: `orders`, `create-order`, `verify-payment`, `razorpay-webhook`, checkout in popup | Razorpay Key ID; founder pastes secrets into Supabase |
| **5** | Move videos/notes to DB + `get_topic` (real lock), watermark, rate limit | — |
| **6** | Cloudflare Pages + domain; Razorpay website approval | Cloudflare account |
| **7** | Remaining 4 papers, notes, PYQ maps, admin v2 | — |
| **8** | Launch posts (GATE communities, LinkedIn, Shorts) | Founder |

## 10. Open decisions
1. Brand name and domain. 2. Device limit (default 2). 3. Name + city for legal pages. 4. GATE 2027 exam end date for `expires_at` (default: 30 days after the last official exam day).
