# Handover Guide

> Last updated: 2026-03-12 | Branch: `redesign/approach-a`

## 1. Adding a New Biweekly Report

### Step-by-step

1. **Place the HTML file** in `public/reports/`
   - Naming convention: `report-YYYY-MM-DD-HH.html`
   - Example: `report-2026-03-15-03.html`
   - The filename is parsed by `SLUG_PATTERN` (`/^report-(\d{4})-(\d{2})-(\d{2})-(\d{2})$/`) in `listReports.ts`

2. **Verify HTML markers exist** — the parser splits the report by HTML comment markers:
   ```html
   <!-- STATS BAR -->
   ...stats content...
   <!-- EXECUTIVE SUMMARY -->
   ...summary content...
   <!-- ECOSYSTEM LANDSCAPE -->
   ...landscape content...
   <!-- CATEGORY FOCUS & SYNERGIES -->
   ...category content...
   <!-- PROJECT CARDS -->
   ...repo cards...
   <!-- FOOTER -->
   ```
   - Old format uses `<!-- REPO CARDS -->` instead of `<!-- PROJECT CARDS -->` — both are supported via fallback

3. **Verify `<title>` tag** contains the report number:
   ```html
   <title>Biweekly Report #3 — Tokamak Network</title>
   ```
   - Regex: `/Biweekly\s+Report\s+#(\d+)/i`
   - If missing, falls back to sequential ordering (not recommended)

4. **Test locally**
   ```bash
   npm run dev
   ```
   - Visit `/about/reports` — new report should appear as featured
   - Visit `/about/reports/report-YYYY-MM-DD-HH` — detail page should render
   - Check landing page sections that pull from reports:
     - **EcosystemDashboard**: Active Repos count + Total Code Changes
     - **RepoShowcase**: Top 6 repos by code changes
     - **LatestFeed**: Report appears in feed list

5. **Run tests**
   ```bash
   npx vitest run
   ```
   - 115 tests across 8 test files should pass
   - If the new report introduces a new HTML structure, some parsers may need updates

6. **Commit & deploy**
   ```bash
   git add public/reports/report-YYYY-MM-DD-HH.html
   git commit -m "chore: add biweekly report #N (YYYY-MM-DD)"
   ```

### Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Report not appearing in list | Filename doesn't match `SLUG_PATTERN` | Rename to `report-YYYY-MM-DD-HH.html` |
| Report number shows wrong | `<title>` tag missing `#N` | Add `Biweekly Report #N` to `<title>` |
| Missing sections on detail page | HTML markers missing or changed | Add `<!-- MARKER -->` comments to HTML |
| Stats showing 0 | Stats HTML structure changed | Update `parseStatsBar()` in `parseReport.ts` |
| Landscape section empty | No `<!-- ECOSYSTEM LANDSCAPE -->` marker | Add marker or check for typos |

### Key files in the parsing pipeline

| File | Role |
|------|------|
| `src/app/lib/reports/listReports.ts` | Discovers reports, extracts metadata from filenames + titles |
| `src/app/lib/reports/parseReport.ts` | Main parser — splits HTML by markers, delegates to fragment parsers |
| `src/app/lib/reports/parseLandscapeSections.ts` | Parses ecosystem landscape categories + repos |
| `src/app/lib/reports/repoLinesUtils.ts` | Shared utils: `buildLinesMap`, `formatNum`, `RepoLines` interface |
| `src/app/lib/reports/sanitize.ts` | `sanitizeColor()` for CSS injection prevention |

---

## 2. Redesign Status

### Landing page (Approach A) — REDESIGNED

All landing page sections use the new NEAR x BlockchainX design system (dark theme, `.card-charcoal`, square corners, grain overlay).

| Section | Component | Status | Data Source |
|---------|-----------|--------|-------------|
| Header | `components/ui/header/` | Redesigned | Static |
| SimulatorHero | `sections/simulator/` | Redesigned | Client state (no API) |
| HowItWorks | `sections/how-it-works/` | Redesigned | Static |
| EcosystemDashboard | `sections/dashboard/` | Redesigned | Live API (`fetchPriceDatas`) + report parser |
| RepoShowcase | `sections/repo-showcase/` | Redesigned | Report parser (top 6 repos) |
| DeveloperCta | `sections/developer-cta/` | Redesigned | Static |
| LatestFeed | `sections/latest-feed/` | Redesigned | Report parser (all reports) |
| Footer | `components/ui/footer/` | Redesigned | Static (`navData.ts`) |

### Report pages — REDESIGNED

All 16 report components converted to the dark design system (dark surfaces, square corners, lucide icons).

| Page / Component | Location | Status | Notes |
|------------------|----------|--------|-------|
| ReportsPageLayout | `sections/reports/ReportsPageLayout.tsx` | Redesigned | Removed clip-path/FocusContext, full dark layout |
| ReportsListing | `sections/reports/ReportsListing.tsx` | Redesigned | Dark archive container |
| FeaturedReportCard | `sections/reports/FeaturedReportCard.tsx` | Redesigned | Dark card + lucide `ChevronRight` |
| ArchiveReportRow | `sections/reports/ArchiveReportRow.tsx` | Redesigned | Dark row + lucide `ChevronRight` |
| YearDivider | `sections/reports/YearDivider.tsx` | Redesigned | Dark divider |
| ReportDetail | `sections/reports/ReportDetail.tsx` | Redesigned | Dark divider + lucide `ArrowLeft` |
| StatsBar | `sections/reports/StatsBar.tsx` | Redesigned | All 3 variants dark (cards/compact/default) |
| ExecutiveSummary | `sections/reports/ExecutiveSummary.tsx` | Redesigned | Dark text + divider |
| EcosystemLandscape | `sections/reports/EcosystemLandscape.tsx` | Redesigned | 5 sub-components dark, category colors readable |
| CategoryFocusSynergies | `sections/reports/CategoryFocusSynergies.tsx` | Redesigned | FocusCard + RepoChip dark |
| RepoCardGrid | `sections/reports/RepoCardGrid.tsx` | Redesigned | Dark search input + lucide `Search` |
| RepoCard | `sections/reports/RepoCard.tsx` | Redesigned | Dark expandable card + lucide `Github`/`ChevronDown`/`Check` |
| CompactRepoRow | `sections/reports/CompactRepoRow.tsx` | Redesigned | Dark button + lucide `ChevronRight` |
| MinorReposSection | `sections/reports/MinorReposSection.tsx` | Redesigned | Dark collapsible + lucide `ChevronDown` |
| AdditionsBar | `sections/reports/AdditionsBar.tsx` | Redesigned | Dark bar track, bright green/red |
| ContributorBadge | `sections/reports/ContributorBadge.tsx` | Redesigned | Dark badge |

### Other pages — NOT REDESIGNED

| Page | Location | Status |
|------|----------|--------|
| About | `about/page.tsx` | Old design (if exists) |
| Protocols | `protocols/` | Uses old Carousel + Protocols components on main |

---

## 3. Design System Reference

### Tokens (Tailwind config)

```
primary:       #0077ff    (CTA buttons, links, accents)
black:         #000000    (page backgrounds)
surface:       #1a1a1d    (card backgrounds)
surface-light: #222225    (hover states)
text-muted:    #c5c5ca    (secondary text)
text-weak:     #929298    (tertiary text)
```

### Typography

- **Headlines**: Orbitron / Space Grotesk, UPPERCASE, `tracking-[0.06em]`, `font-[900]`
- **Body**: Proxima Nova (system sans fallback)
- **Square corners** everywhere — no `rounded-*` on major components

### Component patterns

- **`.card-charcoal`**: `bg-[#1a1a1d]` + deep shadow + hover `translateY(-8px)`
- **`.grain-overlay`**: SVG fractal noise at 4% opacity
- **`.dot-grid`**: 32px spacing dot pattern at 4% opacity
- **Icons**: `lucide-react` (^0.576.0) — never use emoji or inline SVG

---

## 4. Branch Map

| Branch | Purpose | Status |
|--------|---------|--------|
| `main` | Production | Stable — reports redesign merged |
| `redesign/approach-a` | Interactive Demo (Simulator Hero) | Active development |
| `redesign/approach-b` | Storytelling (Pain → Solution → Proof) | Paused |
| `redesign/approach-c` | Live Dashboard | Paused |

### Approach differences

- **A**: Simulator configurator hero → ecosystem metrics → repo showcase
- **B**: Pain points → solution narrative → 12-protocol showroom → proof wall
- **C**: Full-width live dashboard with real-time metrics

All three share the same design system and base components from `redesign/shared`.

---

## 5. Known Issues & Debt

1. **Single report available** — only `report-2026-02-01-15.html` exists. Adding more reports will test pagination and archive grouping in ReportsListing.

2. **EcosystemDashboard fallback prices** — if `fetchPriceDatas()` fails, hardcoded fallback values are used. These will become stale over time.

3. ~~**Report section design mismatch**~~ — resolved. All report pages now use the same dark design system as the landing page.

4. **No automated report validation** — there's no CI check that verifies a new report HTML has the required markers and structure.

5. **`parseReport.ts` size** — ~467 lines, approaching the 500-line comfort threshold. Consider splitting stat/summary/detail parsing into separate files if it grows.
