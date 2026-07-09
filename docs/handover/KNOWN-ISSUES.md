# Known Issues, Stale Docs & Unfinished Work

> The traps and loose ends that will cost the next owner time if undocumented.
> Captured at the 2026-07-09 archive. Severity is a rough guide.

## A. Stale / misleading documentation

| # | Issue | Severity | Detail |
|---|-------|----------|--------|
| A1 | `docs/TOWER-CONCEPT.md` does not match the code | High | Describes a 5-floor "tower" with `TorusScene`, `DataConsoleFloor`, `tower-floor/`, `tower-explorer/` components. **None of these exist in the shipped tree.** The real page uses `zk-hero`, `product-showcase`, `project-bento`, etc. Treat as historical design vision only. Either rewrite to match or delete on revival. |
| A2 | `docs/LANDING-DATA-REQUIREMENTS.md` has open TODOs | Medium | "Approach A" data audit. Many `_TODO` markers unresolved. Some are permanently blocked (see C1). |
| A3 | `CLAUDE.md` font list is wrong | Low | Says "Share Tech Mono"; actual fonts (`layout.tsx`) are Space Grotesk / Orbitron / Geist / Geist Mono. |
| A4 | `README.md` is the default create-next-app template | Low | Contains no project-specific info. `HANDOVER.md` supersedes it. |

## B. Visual QA harness

| # | Issue | Severity | Detail |
|---|-------|----------|--------|
| B1 | Harness is git-ignored | High | `CLAUDE.md` mandates running a Puppeteer visual-QA harness before UI commits, but it lives in `.omc/harness/` and `.omc/` is in `.gitignore`. **A fresh clone has no harness.** The 17 scripts exist only in the original working copy. |
| B2 | `evaluate.mjs` referenced but absent | High | `CLAUDE.md` says `node .omc/harness/evaluate.mjs`. That file does **not** exist — only individual `*-shot.mjs` / `*-check.mjs` scripts. The documented command fails. |
| B3 | Fix options | — | (a) recreate an `evaluate.mjs` orchestrator, (b) run individual scripts (dev server on :3000 + Puppeteer required), or (c) move the harness out of `.omc/` so it's tracked in git. |

## C. Unfinished data wiring

| # | Item | Severity | Detail |
|---|------|----------|--------|
| C1 | On-chain metrics (TVL, tx count, unique addresses, validator/sequencer count) | Medium | Not wired. Blocked: **no L2 on mainnet yet** (per `LANDING-DATA-REQUIREMENTS.md`). Revisit when mainnet L2 exists. |
| C2 | `SimulatorHero` config accuracy | Low | Throughput/Privacy/VM options and 6-step deploy animation are marketing placeholders; product team never fully validated them. (Note: the current home page composes `zk-hero`, not a `SimulatorHero` — verify whether this section is still present before acting.) |
| C3 | Placeholder repo descriptions | Low (recurring) | New biweekly reports introduce repos whose description ends in "component". These render a placeholder until added to `REPO_DESCRIPTIONS` in `lib/ecosystem-data.ts`. Recurring maintenance task, not a bug. |

## D. Operational / environment

| # | Item | Severity | Detail |
|---|------|----------|--------|
| D1 | No committed `.env.example` | Medium | The required env keys are only discoverable from code (`HANDOVER.md` §5). Consider adding a redacted `.env.example` on revival. |
| D2 | Newsletter hard-depends on Firebase | Medium | Missing any of 7 `NEXT_FIREBASE_*` vars → `/api/news-letter` 500. Values must be restored from the team secret store / Vercel settings. |
| D3 | External API single points of failure | Low | Upbit / er-api / Medium / `price.api.tokamak.network` outages blank out data. Code falls back gracefully but shows stale/empty content. |
| D4 | Content freshness | Low (recurring) | Ecosystem section reflects the latest 2 reports in `public/reports/`. If archived long, the newest report there defines "current" — add fresh reports on revival. |

## E. Branch / repo hygiene at archive time

- Many stale feature/experiment branches exist locally and on `origin`
  (`redesign/approach-a..c`, `option-b`, `private-design`, `r2-cli-*`,
  `feat/*`, `vercel/*`). Prune before serious revival to avoid confusion.
- `dev` is the integration branch; `main` is what Vercel builds.
- This handover set lives on `archive/handover-2026-07` (local only at archive
  time — not pushed to `origin` per the archival decision).

## Quick triage for a reviver

1. Blank ticker/ecosystem → external source or env var (D2/D3), not code.
2. UI-change workflow broken → the harness (B1/B2).
3. Docs contradict code → trust code; A1/A3 are the known offenders.
4. "Where do I set X?" → env in Vercel settings (D1/D2).
