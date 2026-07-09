# Tokamak Landing Page — Project Handover

> **STATUS: ARCHIVED / DISCONTINUED (2026-07-09)**
>
> Active development on this landing page has stopped. This document is the
> primary handover artifact for anyone (human or AI agent) who picks the
> project back up. It captures how the app is built, how to run/deploy it,
> where the data comes from, what was left unfinished, and the non-obvious
> traps that will otherwise cost the next person hours.
>
> This document lives on the **`archive/handover-2026-07`** branch. The
> `main` branch carries a short pointer (`ARCHIVE.md`) back to here.

---

## 0. 30-second summary

- **What**: Marketing landing page for [Tokamak Network](https://tokamak.network),
  an Ethereum L2 platform. Single long-scroll page with a 3D hero, animated
  section transitions, live token/price data, an ecosystem showcase driven by
  biweekly engineering reports, a Medium blog feed, and a newsletter signup.
- **Stack**: Next.js 15 (App Router, Turbopack) · React 19 · React Three Fiber
  + Three.js · Framer Motion / `motion` · Tailwind CSS 3 · TypeScript (strict).
- **Hosting**: Vercel (SSR/ISR + Node runtime API routes). Production domain is
  `https://tokamak.network`.
- **Repo**: `github.com/tokamak-network/tokamak-landing-page` · default branch
  `main` · integration branch `dev`.
- **Runs with**: `npm install && npm run dev` → http://localhost:3000. Needs a
  `.env` (Firebase + Alchemy keys) for the newsletter and some price paths.

---

## 1. Current state — what works, what doesn't

### Working / shipped
- Full single-page experience renders and deploys. Section order (see
  `src/app/page.tsx`):
  `Header → ZkHero → Ticker → ProductShowcase → ProjectBento (Ecosystem) →
  StakingGovernance → LatestFeed → Community → Footer → SectionHud`.
- Live price ticker (TON price / market cap / supply / staking) via
  `/api/price` and `/api/price/candles`.
- Ecosystem showcase auto-built from biweekly report HTML in `public/reports/`.
- Medium blog feed via `/api/medium`.
- Newsletter email capture → Firebase Realtime Database via `/api/news-letter`.
- SEO/LLM discovery: `robots.ts`, `sitemap.ts`, `opengraph-image.tsx`, JSON-LD
  in `layout.tsx`, plus `public/llms.txt` and `public/llms-full.txt`.
- Price sub-dashboard under `src/app/(price-dashboard)/about/`.

### Incomplete / deferred (do NOT assume these are done)
- **`docs/TOWER-CONCEPT.md` is aspirational and STALE.** It describes a
  5-floor "tower" metaphor with components (`TorusScene`, `DataConsoleFloor`,
  `tower-floor`, `tower-explorer`) that **no longer exist / were never fully
  built**. The shipped page uses a different section set (`zk-hero`,
  `product-showcase`, `project-bento`, …). Treat TOWER-CONCEPT as historical
  design intent, not a map of the code.
- **`docs/LANDING-DATA-REQUIREMENTS.md`** still has open `TODO` markers for
  data wiring (TVL, on-chain tx, unique addresses, validator count). Several
  are blocked because there is **no L2 on mainnet yet**.
- Firebase config is required for the newsletter; if `.env` is missing those
  keys, `/api/news-letter` returns 500.

See `docs/handover/KNOWN-ISSUES.md` for the full, itemized list.

---

## 2. Tech stack (versions pinned in `package.json`)

| Area | Choice |
|------|--------|
| Framework | Next.js `15.1.11` (App Router, Turbopack dev) |
| Language | TypeScript 5 (strict mode) |
| UI runtime | React 19 |
| 3D | `three` 0.183, `@react-three/fiber` 9, `@react-three/drei` 10, `@react-three/postprocessing` |
| Animation | `framer-motion` 11, `motion` 11, `@gsap/react`, `lenis` (smooth scroll) |
| Styling | Tailwind CSS 3.4 + PostCSS; global CSS in `src/app/globals.css` |
| Data/chart | `recharts` 3, `date-fns` 4 |
| Web3 | `viem` 2 (read-only chain calls) |
| Backend svc | `firebase` 11 (Realtime DB for newsletter) |
| Feed parsing | `rss-parser`, `cheerio`, `axios` (Medium RSS) |
| Fonts | `next/font/google` (Space Grotesk, Orbitron, Geist, Geist Mono) + Adobe Typekit `use.typekit.net/fuc6kbq.css` |
| Tooling | ESLint 9 (`eslint-config-next`), Vitest 4, Puppeteer 24 (visual QA harness) |

> Note: the `CLAUDE.md` "Design Language" section mentions *Share Tech Mono*,
> but the actual fonts loaded in `layout.tsx` are Space Grotesk / Orbitron /
> Geist. Trust the code.

---

## 3. Repository layout (top level)

```
src/app/
  layout.tsx              Root layout: fonts, metadata, JSON-LD, FocusProvider
  page.tsx                Home page — composes all sections (ISR, revalidate=120)
  globals.css             Global styles / theme tokens
  robots.ts, sitemap.ts   SEO routes
  opengraph-image.tsx     Dynamic OG image
  (price-dashboard)/about Price sub-dashboard route group
  api/                    Route handlers (see §7)
    price/  price/candles/  medium/  news-letter/  governance-staking/
  components/
    ui/
      header/  footer/  section-hud/
      sections/           One folder per landing section (see ARCHITECTURE.md)
    shared/
  constants/  links.ts styles.ts
  hooks/                  hero/, layout/ custom hooks
  lib/                    ecosystem-data.ts, reports/, price/, utils/
  assets/                 icons/, images/, members/, partners/
  context/                FocusContext (focus/scroll coordination)
docs/                     Design + data docs (some STALE — see §1)
  handover/               ← this handover set (ARCHITECTURE.md, DATA-SOURCES.md, KNOWN-ISSUES.md)
public/
  reports/                Biweekly report HTML (data source for ecosystem!)
  llms.txt llms-full.txt  LLM/agent discovery docs
  videos/ hero/ showcase/ …  Media assets
scripts/                  Build-time helpers (texture slicing, preview)
```

A detailed component/data-flow map is in **`docs/handover/ARCHITECTURE.md`**.

---

## 4. Local development

```bash
# Node 20+ recommended (matches @types/node ^20)
npm install
cp .env.example .env     # if present; otherwise create .env — see §5
npm run dev              # Turbopack dev server → http://localhost:3000
```

Other scripts:
```bash
npm run build   # production build (next build)
npm run start   # serve the production build
npm run lint    # eslint (next lint)
npx tsc --noEmit   # type-check only
```

There is **no committed `.env.example`** — create `.env` from §5.

---

## 5. Environment variables

Defined in `.env` (git-ignored — `.env*` in `.gitignore`). Keys, from the code:

| Variable | Used by | Purpose |
|----------|---------|---------|
| `NEXT_FIREBASE_API_KEY` | `/api/news-letter` | Firebase app config |
| `NEXT_FIREBASE_AUTH_DOMAIN` | `/api/news-letter` | Firebase app config |
| `NEXT_FIREBASE_PROJECT_ID` | `/api/news-letter` | Firebase app config |
| `NEXT_FIREBASE_STORAGE_BUCKET` | `/api/news-letter` | Firebase app config |
| `NEXT_FIREBASE_MESSAGING_SENDER_ID` | `/api/news-letter` | Firebase app config |
| `NEXT_FIREBASE_APP_ID` | `/api/news-letter` | Firebase app config |
| `NEXT_FIREBASE_MEASUREMENT_ID` | (analytics, optional) | Firebase app config |
| `NEXT_FIREBASE_DATABASE_URL` | `/api/news-letter` | Realtime DB endpoint (writes to `biweekly-report/email-list`) |
| `ALCHEMY_RPC_URL` | price/on-chain reads | Ethereum RPC (read-only). Must come from env — a hardcoded key was removed in commit `5a2b4cb`. |

On Vercel these are set in **Project → Settings → Environment Variables**. If a
deploy shows the newsletter failing (500), the Firebase vars are the first
suspect.

---

## 6. Build & deploy

- **Platform**: Vercel. `.vercel` is git-ignored; the Medium route explicitly
  notes "Use Node.js runtime on Vercel". There are remote branches named
  `vercel/*` and a `dev` integration branch — the typical flow was
  feature branch → PR into `dev` → PR into `main` → Vercel builds `main`.
- **Rendering**: the home page uses **ISR** (`export const revalidate = 120`)
  so price data is at most ~120s stale instead of blocking every request on
  external API calls. Some API routes are `force-dynamic`; `/api/price/candles`
  relies on Next's per-fetch data cache.
- **Caching**: `next.config.ts` sets long-lived `Cache-Control` for static
  media (`mp4|webm|jpg|jpeg|png|webp|avif`) and whitelists remote image hosts
  (Medium CDNs, GitHub avatars).
- To deploy a revival: push to a branch connected to the Vercel project, or run
  `vercel --prod` locally if the CLI is linked. Confirm env vars first (§5).

---

## 7. Data sources & external dependencies (summary)

Full detail + response shapes: **`docs/handover/DATA-SOURCES.md`**.

| Route / loader | Talks to | Notes |
|----------------|----------|-------|
| `/api/price` (`api/price/index.ts`) | `api.upbit.com` (KRW-tokamak ticker), `open.er-api.com` (KRW→USD), `price.api.tokamak.network/{staking/current,supply,circulationSupply}` | Aggregates TON price, market cap, supply, staked volume |
| `/api/price/candles` | `api.upbit.com/v1/candles/*`, `open.er-api.com` | OHLC series for the price chart; ranges 24h/7d/30d/90d/1y |
| `/api/medium` | `medium.com/feed/tokamak-network` (RSS) | axios + cheerio; Node runtime; no-store |
| `/api/news-letter` | Firebase Realtime DB | POST `{email}` → `biweekly-report/email-list` |
| `/api/governance-staking` | `api/governance-staking/index.ts` | Staking/DAO figures |
| `getEcosystemData()` (`lib/ecosystem-data.ts`) | **local files** `public/reports/report-*.html` | Merges latest 2 biweekly reports; filesystem read at build/ISR time |
| `listReports()` (`lib/reports/listReports.ts`) | filename parsing of `public/reports/` | Report ordering + slugs |

**External services that must stay alive for full functionality**:
Tokamak price API (`price.api.tokamak.network`), Upbit public API, er-api FX,
Medium RSS, Firebase project. If any goes away, code has fallbacks in most
places (`FALLBACK_DATA`, empty arrays) but data will be stale/blank.

---

## 8. Recurring content workflow — biweekly reports

The ecosystem showcase is **not hardcoded** — it is parsed from HTML reports.
Every 2 weeks a new report was dropped into `public/reports/`. Procedure (also
in `CLAUDE.md` on `main`):

1. Copy the new report: `public/reports/report-YYYY-MM-DD-DD.html`
   (filename is parsed by `listReports.ts` — naming must be exact).
2. Fill placeholder repo descriptions in the `REPO_DESCRIPTIONS` map in
   `src/app/lib/ecosystem-data.ts` (repos whose report text ends in
   "component" show a placeholder; write a ≤60-char English description based
   on the report's *Key Accomplishments*, not guesses from the name).
3. Verify: `npx tsc --noEmit`, `npm run lint`, and check the Ecosystem carousel
   on localhost:3000.
4. Commit: `feat: add Biweekly Report #N (Month DD-DD, YYYY)`.

`getEcosystemData()` merges the **latest two** reports (dedupes repos by name,
sums code changes, keeps the higher activity level).

---

## 9. Visual QA harness — IMPORTANT GOTCHA

`CLAUDE.md` tells contributors to run a Puppeteer visual-QA harness before
committing UI changes. **Two traps:**

1. The harness lives under **`.omc/harness/`, which is git-ignored** (`.omc/`
   in `.gitignore`). A fresh clone will **not** have it. The 17 scripts
   (`zk-hero-shot.mjs`, `product-showcase-shot.mjs`, `community-shot.mjs`, …)
   exist only in this working copy.
2. `CLAUDE.md` references `node .omc/harness/evaluate.mjs`, but **there is no
   `evaluate.mjs`** in `.omc/harness/` — only the individual `*-shot.mjs` /
   `*-check.mjs` scripts. That command is stale.

If reviving the QA flow: either re-create an `evaluate.mjs` orchestrator, run
the individual scripts directly (they need the dev server on :3000 and
Puppeteer installed), or move the harness out of `.omc/` so it's tracked.

---

## 10. How to resume / revive this project

1. `git checkout main && npm install`.
2. Recreate `.env` (§5) — grab Firebase + Alchemy values from the team's secret
   store or Vercel project settings.
3. `npm run dev`, confirm the page renders and the ticker shows live numbers
   (if numbers are blank, an external price source or env var is the cause).
4. Read `docs/handover/ARCHITECTURE.md` for the component/data map before
   changing anything.
5. Decide what to do with the **stale docs** (`TOWER-CONCEPT.md`,
   `LANDING-DATA-REQUIREMENTS.md`) — either implement or delete, don't trust.
6. If continuing UI work, resolve the **harness situation** (§9) first so QA
   actually runs.
7. Add the latest biweekly report(s) so the ecosystem section isn't stale (§8).

---

## 11. Key links

- Production: https://tokamak.network
- Repo: https://github.com/tokamak-network/tokamak-landing-page
- Docs: https://docs.tokamak.network
- Rollup Hub: https://rolluphub.tokamak.network/
- Grant program, DAO, staking, socials: see `src/app/constants/links.ts`
- Price API: https://price.api.tokamak.network
- TON token (mainnet): `0x2be5e8c109e2197D077D13A82dAead6a9b3433C5`

---

## 12. Handover checklist for the next owner

- [ ] Can build (`npm run build`) and run (`npm run dev`) cleanly.
- [ ] `.env` recreated; newsletter POST succeeds (no 500).
- [ ] Live ticker shows non-zero TON price / market cap.
- [ ] Understand that `docs/TOWER-CONCEPT.md` ≠ current code.
- [ ] Decided on the QA harness (recreate `evaluate.mjs` or track `.omc/harness`).
- [ ] Latest biweekly report present in `public/reports/`.
- [ ] Verified Vercel project + env vars are intact (or re-linked).

---

## 13. Handover document map

| Doc | Contents |
|-----|----------|
| `HANDOVER.md` (this file) | Master overview, state, run/deploy, resume guide |
| `docs/handover/ARCHITECTURE.md` | Rendering pipeline, section components, data flow, directory map |
| `docs/handover/DATA-SOURCES.md` | Every external/internal data source with endpoints & shapes |
| `docs/handover/KNOWN-ISSUES.md` | Itemized unfinished work, stale docs, gotchas |
| `docs/TOWER-CONCEPT.md` | **Historical** design vision (STALE — not the code) |
| `docs/LANDING-DATA-REQUIREMENTS.md` | **Historical** data audit with open TODOs |
| `CLAUDE.md` (on `main`) | Contributor instructions + pointer to this archive |
| `ARCHIVE.md` (on `main`) | Short pointer telling humans/AI where this handover lives |

_Last updated: 2026-07-09 · Branch: `archive/handover-2026-07`_
