# Architecture — Tokamak Landing Page

> Companion to `HANDOVER.md`. This maps the actual, shipped code as of the
> 2026-07-09 archive. Where behavior is inferred rather than verified, it says
> so. When in doubt, trust the code over this doc.

## 1. Rendering pipeline

App Router, server-first. Two font pipelines, one root layout, one composed
home page, plus a `/about/*` route group for the price sub-dashboard.

```
RootLayout (src/app/layout.tsx)
├─ next/font/google: Space Grotesk, Orbitron, Geist, Geist Mono (CSS vars)
├─ Adobe Typekit stylesheet (use.typekit.net/fuc6kbq.css)
├─ JSON-LD <script> (Organization, WebSite, SoftwareApplication=Thanos, FAQ)
├─ inline script: window.history.scrollRestoration="manual"; scrollTo(0,0)
└─ <FocusProvider>  (src/context/FocusContext.tsx)
     └─ page.tsx / route pages
```

### Home page — `src/app/page.tsx`
- `export const revalidate = 120` → **ISR**, HTML regenerated at most every
  2 minutes so price data is ≤120s stale (was `force-dynamic`, changed for
  perf).
- Server component. On render it awaits, in parallel:
  - `getTickerData()` — from `sections/data-ticker`
  - `getEcosystemData()` — from `lib/ecosystem-data.ts`
  - then `listReports()` for the latest report href.
- Composition order (each wrapped in a `data-section` div used by the HUD):

  | Order | `data-section` | Component | Source folder |
  |-------|----------------|-----------|---------------|
  | 1 | `hero` | `ZkHero` | `sections/zk-hero` |
  | — | (ticker) | `TickerClient` | `sections/data-ticker` |
  | 2 | `production` | `ProductShowcase` | `sections/product-showcase` |
  | 3 | `ecosystem` | `ProjectBento` | `sections/project-bento` |
  | 4 | `governance` | `StakingGovernance` | `sections/staking-governance` |
  | 5 | `feed` | `LatestFeed` | `sections/latest-feed` |
  | — | `community` | `Community` | `sections/community` |
  | — | — | `Header` / `Footer` | `ui/header`, `ui/footer` |
  | — | — | `SectionHud` | `ui/section-hud` |

- `SectionHud` receives a `SECTIONS` array (`hero, production, ecosystem,
  governance, feed`) + total, and renders the scroll-progress HUD.

### Price sub-dashboard — `src/app/(price-dashboard)/about/`
Route group with its own `layout.tsx`. Pages and the section each renders:

| Route | Page file | Section component |
|-------|-----------|-------------------|
| `/about/price` | `about/price/page.tsx` | `sections/price-overview` |
| `/about/insight` | `about/insight/page.tsx` | `sections/insight-archive` (+ `subpage-hero`) |
| `/about/partners` | `about/partners/page.tsx` | `sections/partners-v2` |
| `/about/reports` | `about/reports/page.tsx` | `sections/reports-archive` (+ `subpage-hero`) |

`sections/subpage-hero` is a **shared** hero reused by the insight and reports
sub-pages.

## 2. Section component inventory

Every landing/section unit lives in `src/app/components/ui/sections/<name>/`
(typically an `index.tsx` plus local pieces). Confirmed usage:

| Section | Used by | Role (from name + usage) |
|---------|---------|--------------------------|
| `zk-hero` | home | 3D/animated hero ("Own the layer. Own your privacy."), R3F scene + video |
| `data-ticker` | home | Server loader `getTickerData()` + `TickerClient` scrolling price/metric ticker |
| `product-showcase` | home | "Live Production" product/video showcase |
| `project-bento` | home | Ecosystem bento/carousel built from `getEcosystemData()` categories |
| `staking-governance` | home | Staking + DAO governance section |
| `latest-feed` | home | Latest reports + Medium blog feed |
| `community` | home | Community/socials CTA |
| `price-overview` | `/about/price` | Price detail dashboard |
| `insight-archive` | `/about/insight` | Insight/blog archive |
| `partners-v2` | `/about/partners` | Partners grid |
| `reports-archive` | `/about/reports` | Biweekly reports archive |
| `subpage-hero` | insight + reports | Shared sub-page hero |

Shared/support UI: `ui/header`, `ui/footer`, `ui/section-hud`, and
`components/shared/`.

## 3. Data flow

```
                 ┌──────────────── external ────────────────┐
                 │ Upbit · er-api(FX) · price.api.tokamak    │
                 │ Medium RSS · Firebase RTDB                │
                 └───────────────────┬──────────────────────┘
                                     │ (fetch, server-side)
  public/reports/*.html             │
        │ (fs read)                 │
        ▼                           ▼
  lib/reports/listReports  →  lib/ecosystem-data.getEcosystemData()
        │                           │
        │                           ▼
        │                    page.tsx (ISR, revalidate=120)
        │                           │
        ▼                           ▼
   latest report href        ProjectBento / Ticker / sections
```

- **Server-side, build/ISR time**: `getEcosystemData()` and `listReports()`
  read local report HTML from `public/reports/`. `getTickerData()` and the
  price index hit external APIs.
- **Client-side**: `LatestFeed` (and price chart) fetch from the internal API
  routes (`/api/medium`, `/api/price/candles`) at runtime.

### Report parsing (`src/app/lib/reports/` + `lib/ecosystem-data.ts`)
- `listReports()` parses filenames `report-YYYY-MM-DD-DD.html` for date/slug
  ordering.
- `parseReportDetail()` extracts stats + ecosystem landscape from the HTML
  using **comment markers** (`<!-- STATS BAR -->`, `<!-- ECOSYSTEM LANDSCAPE -->`).
- `getEcosystemData()` merges the **latest 2** reports: dedupes repos by name,
  sums `linesAdded`/`linesDeleted`, keeps the higher `activity` rank
  (high>medium>low), and resolves placeholder descriptions via the
  `REPO_DESCRIPTIONS` map. Falls back to `FALLBACK_DATA` on any error.

## 4. API routes (`src/app/api/`)

| Route | Method | Runtime/caching | Backend |
|-------|--------|-----------------|---------|
| `price/` | GET | `force-dynamic` | `fetchPriceDatas()` in `price/index.ts` → Upbit ticker + er-api FX + `price.api.tokamak.network/{staking/current,supply,circulationSupply}` |
| `price/candles/` | GET `?range=24h..1y` | Node runtime, per-fetch data cache (revalidate 60/3600) | Upbit candles + er-api FX; returns `{range, series:number[]}` USD |
| `medium/` | GET | Node runtime, `force-dynamic`, `revalidate=0`, `maxDuration=30` | `medium.com/feed/tokamak-network` via axios + cheerio (thumbnail extraction) |
| `news-letter/` | POST `{email}` | default | Firebase Realtime DB `push` to `biweekly-report/email-list` |
| `governance-staking/` | GET | `force-dynamic` | `fetchGovernanceStakingData()` in `governance-staking/index.ts` |

See `DATA-SOURCES.md` for endpoints, env deps, and failure modes.

## 5. Styling & theme

- Tailwind CSS 3.4 (`tailwind.config.ts`) + PostCSS; global tokens/effects in
  `src/app/globals.css`.
- Design language: FUI (futuristic UI), dark theme, cyan `#00e5ff` accent,
  Orbitron for display headers. Body base color `#c5c5ca` on black (see
  `layout.tsx` body classes).
- Custom clip-path "angular cut corner" styles live in `constants/styles.ts`.
- Long-cache headers for static media set in `next.config.ts`.

## 6. Context, hooks, state

- `context/FocusContext.tsx` — `FocusProvider` wraps the app; coordinates
  focus/scroll state across sections (used by the HUD and section transitions).
- `hooks/hero/useVisibilityChange.ts` — pause/resume hero work on tab
  visibility change (perf; relates to the mobile hero deferral in commit
  `d821746`).
- `hooks/layout/useIsMobile.ts` — responsive breakpoint hook.

## 7. Assets & media

- `public/` holds videos (`intro-video.mp4`, showcase clips), posters, report
  HTML, `llms.txt`/`llms-full.txt`, favicon, logos.
- `src/assets/` holds imported icons/images/members/partners used by components.
- `_video_originals_backup/` (repo root, git-ignored) holds pre-re-encode video
  masters — not deployed.

## 8. Things that are NOT what they seem

- `docs/TOWER-CONCEPT.md` describes components (`TorusScene`,
  `DataConsoleFloor`, `tower-floor`, `tower-explorer`) that are **not** in the
  shipped tree. It is design intent, not architecture.
- `CLAUDE.md` mentions Share Tech Mono and a `.omc/harness/evaluate.mjs` that
  don't match the code (see `KNOWN-ISSUES.md`).
- Many directories contain a `CLAUDE.md` — these are AI-context breadcrumbs and
  are git-ignored except `CLAUDE.md` (root) and
  `sections/data-ticker/CLAUDE.md`.
