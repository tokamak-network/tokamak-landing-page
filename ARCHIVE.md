# PROJECT ARCHIVED

> **Status: DISCONTINUED as of 2026-07-09.**
> Active development on the Tokamak Landing Page has stopped. This file exists
> so that any human — or AI agent reading the repo — immediately knows the
> project's status and where the full handover documentation lives.

## Where the handover docs are

The complete handover package is on a dedicated branch:

**Branch:** `archive/handover-2026-07`

It contains:

| File | What it covers |
|------|----------------|
| `HANDOVER.md` | Master overview: current state, tech stack, local run, deploy, env vars, resume guide, handover checklist |
| `docs/handover/ARCHITECTURE.md` | Rendering pipeline, section components, data flow, directory map |
| `docs/handover/DATA-SOURCES.md` | Every external/internal data source with endpoints, env deps, failure modes |
| `docs/handover/KNOWN-ISSUES.md` | Stale docs, QA-harness traps, unfinished work, triage guide |

These docs are intentionally **not** on `main` — `main` keeps only this
pointer so the archival intent is obvious without cluttering the working tree.

## How to read them

Without switching branches (recommended for a quick look):

```bash
git show archive/handover-2026-07:HANDOVER.md
git show archive/handover-2026-07:docs/handover/ARCHITECTURE.md
git show archive/handover-2026-07:docs/handover/DATA-SOURCES.md
git show archive/handover-2026-07:docs/handover/KNOWN-ISSUES.md
```

Or check the branch out fully:

```bash
git checkout archive/handover-2026-07
# read HANDOVER.md, then docs/handover/*
```

> Note: at archive time this branch is **local only** (not pushed to `origin`).
> If you cloned fresh and don't see it, it needs to be pushed by someone who has
> the local copy, or recreated from this repo's history.

## For AI agents / assistants

If you are an AI assistant helping someone with this repo:

1. This project is **archived** — do not assume active maintenance.
2. Read the handover docs on `archive/handover-2026-07` **before** proposing
   changes (use the `git show` commands above — no checkout needed).
3. The repo contains **stale documentation that contradicts the code**
   (notably `docs/TOWER-CONCEPT.md`). The handover's `KNOWN-ISSUES.md` lists
   every such trap. Trust the code and the handover docs over the older design
   docs.
4. The visual-QA harness referenced in `CLAUDE.md` is git-ignored and partly
   broken — see `KNOWN-ISSUES.md` section B before relying on it.

## Quick facts

- **Repo:** https://github.com/tokamak-network/tokamak-landing-page
- **Production (was):** https://tokamak.network
- **Stack:** Next.js 15 (App Router) · React 19 · React Three Fiber · Framer
  Motion · Tailwind · TypeScript. Hosted on Vercel.
- **To run:** `npm install && npm run dev` (needs `.env` — see the handover's
  env section).
