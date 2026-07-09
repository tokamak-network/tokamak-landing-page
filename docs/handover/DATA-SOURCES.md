# Data Sources — Tokamak Landing Page

> Every place the app gets data, the endpoint(s) it calls, env dependencies,
> and what happens when the source fails. Verified against the code at the
> 2026-07-09 archive.

## External services (must stay alive for full functionality)

| Service | Endpoints used | Consumed by | If it fails |
|---------|----------------|-------------|-------------|
| **Tokamak Price API** `price.api.tokamak.network` | `/staking/current`, `/supply`, `/circulationSupply` | `api/price/index.ts` (`fetchPriceDatas`) | Staking/supply figures blank or fall back |
| **Upbit** `api.upbit.com` | `/v1/ticker?markets=KRW-tokamak`, `/v1/candles/{minutes/60,days,weeks}?market=KRW-tokamak` | `api/price/index.ts`, `api/price/candles/route.ts` | Price + chart empty; candles route returns 502 |
| **er-api (FX)** `open.er-api.com` | `/v6/latest/KRW` (KRW→USD) | price index + candles | Route returns 502 `invalid FX rate`; guard added in commit `e149b05` |
| **Medium** `medium.com/feed/tokamak-network` | RSS feed | `api/medium/route.ts` | `/api/medium` returns 500 + empty `posts` |
| **Firebase Realtime DB** | `push` to `biweekly-report/email-list` | `api/news-letter/route.ts` | Newsletter signup returns 500 if env vars missing |
| **Ethereum RPC (Alchemy)** | `ALCHEMY_RPC_URL` | on-chain reads (viem) | On-chain reads fail; must be env-provided (hardcoded key removed in `5a2b4cb`) |

## Internal (local filesystem) data

| Source | Reader | Notes |
|--------|--------|-------|
| `public/reports/report-YYYY-MM-DD-DD.html` | `lib/reports/listReports.ts`, `lib/reports/parseReport.ts`, `lib/ecosystem-data.ts` | Biweekly engineering reports. **This is the ecosystem showcase's data source.** Parsed via HTML comment markers. Filename format is load-bearing. |
| `public/about.md`, `public/llms.txt`, `public/llms-full.txt` | static serve | Content/LLM discovery docs |

## API routes (internal, called by the app)

### `GET /api/price`  (`api/price/route.ts` → `api/price/index.ts`)
- `dynamic = "force-dynamic"`.
- `fetchPriceDatas()` aggregates: Upbit KRW-tokamak ticker (price), er-api FX
  (KRW→USD), and `price.api.tokamak.network` staking/supply/circulation.
- Returns aggregated price/market-cap/supply/staked-volume JSON (see
  `index.ts` for the exact shape).
- On error: 500 `{ error, message }`.

### `GET /api/price/candles?range=24h|7d|30d|90d|1y`  (`api/price/candles/route.ts`)
- `runtime = "nodejs"`, relies on Next per-fetch data cache
  (`revalidate: 60` candles, `3600` FX; tags `ton-candles`, `fx-rate`).
- Range → Upbit path/count map:
  `24h→minutes/60×24`, `7d→days×7`, `30d→days×30`, `90d→days×90`, `1y→weeks×52`.
- Multiplies Upbit KRW price × FX to produce a USD series (reversed to
  chronological). Returns `{ range, series: number[] }`.
- Failure modes: 502 on Upbit/FX non-OK or invalid FX rate; 500 on fetch throw.
  All error responses include `series: []`.

### `GET /api/medium`  (`api/medium/route.ts`)
- `runtime = "nodejs"`, `dynamic = "force-dynamic"`, `revalidate = 0`,
  `maxDuration = 30`. Response is `no-store`.
- `MediumFeedParser` fetches the Medium RSS with browser-like headers (15s
  timeout race), parses with `rss-parser`, extracts the first `<img>` from
  `content:encoded` as the thumbnail via cheerio, normalizes categories.
- On error: 500 `{ error, posts: [], timestamp }`.

### `POST /api/news-letter`  (`api/news-letter/route.ts`)
- Body `{ email }`. Lazily inits Firebase from env (throws if any of the 7
  required vars missing). Pushes `{ email, subscribedAt }` to
  `biweekly-report/email-list`.
- 400 if no email; 500 on Firebase/config error; 200 `{ success: true }` on OK.

### `GET /api/governance-staking`  (`api/governance-staking/route.ts` → `index.ts`)
- `dynamic = "force-dynamic"`. `fetchGovernanceStakingData()` returns
  staking/DAO figures. 500 `{ error, message }` on failure.

## Environment variables

See `HANDOVER.md` §5 for the full table. Summary: 8 `NEXT_FIREBASE_*` keys
(newsletter) + `ALCHEMY_RPC_URL` (RPC). All live in git-ignored `.env` /
Vercel project settings. There is no committed `.env.example`.

## Fallback behavior (important for revival)

The code is defensive in most read paths:
- `getEcosystemData()` → `FALLBACK_DATA` / `FALLBACK_CATEGORIES` on any parse
  or fetch error, so the ecosystem section never crashes the page.
- Candles/medium routes return empty arrays instead of throwing to the client.
- **But**: a blank ticker or empty ecosystem usually means an external source
  or env var is down — not a code bug. Check external service health first.
