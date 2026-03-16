/**
 * Squarified treemap layout algorithm.
 *
 * Two-level layout:
 *   1. Partition the root rectangle among categories (proportional to totalLines).
 *   2. Within each category rectangle, partition among repos.
 *
 * All coordinates are returned as percentages (0-100) so consumers can
 * use `position: absolute` with `%` units.
 */

// ── Public types ────────────────────────────────────────────────────

export interface TreemapRepo {
  repoName: string;
  githubUrl: string;
  linesChanged: number;
  linesAdded: number;
  linesDeleted: number;
  netGrowth: number;
  commits: string;
  isActive: boolean;
}

export interface TreemapCategory {
  name: string;
  color: string;
  repos: TreemapRepo[];
}

export interface TreemapRect {
  x: number;
  y: number;
  w: number;
  h: number;
  categoryName: string;
  categoryColor: string;
  repo?: TreemapRepo;
}

// ── Internal helpers ────────────────────────────────────────────────

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface SizedItem<T> {
  value: number;
  data: T;
}

/**
 * Squarify a list of sized items into a rectangle.
 * Returns sub-rects in the same order as the input items.
 *
 * Algorithm: strip-based squarify. At each step, try adding the next
 * item to the current strip. Accept it if the worst aspect ratio in
 * the strip does not increase; otherwise lay out the current strip
 * and start a new one.
 */
function squarify<T>(items: SizedItem<T>[], container: Rect): { rect: Rect; data: T }[] {
  if (items.length === 0) return [];

  const totalValue = items.reduce((s, i) => s + i.value, 0);
  if (totalValue <= 0) return [];

  // Sort descending by value for better aspect ratios.
  const sorted = items
    .map((item, originalIndex) => ({ ...item, originalIndex }))
    .sort((a, b) => b.value - a.value);

  const results: { rect: Rect; data: T; originalIndex: number }[] = [];

  let remaining: Rect = { ...container };
  let stripItems: typeof sorted = [];
  let stripTotal = 0;
  let totalRemaining = totalValue;

  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];
    const candidateStrip = [...stripItems, item];
    const candidateTotal = stripTotal + item.value;

    if (stripItems.length === 0) {
      stripItems = candidateStrip;
      stripTotal = candidateTotal;
      continue;
    }

    const currentWorst = worstAspectRatio(stripItems.map((s) => s.value), stripTotal, remaining, totalRemaining);
    const candidateWorst = worstAspectRatio(candidateStrip.map((s) => s.value), candidateTotal, remaining, totalRemaining);

    if (candidateWorst <= currentWorst) {
      stripItems = candidateStrip;
      stripTotal = candidateTotal;
    } else {
      // Lay out current strip
      const laid = layoutStrip(stripItems, stripTotal, remaining, totalRemaining);
      results.push(...laid);
      totalRemaining -= stripTotal;
      remaining = cutRect(remaining, stripTotal, totalRemaining + stripTotal);
      stripItems = [item];
      stripTotal = item.value;
    }
  }

  // Lay out final strip
  if (stripItems.length > 0) {
    const laid = layoutStrip(stripItems, stripTotal, remaining, totalRemaining);
    results.push(...laid);
  }

  // Restore original order
  results.sort((a, b) => a.originalIndex - b.originalIndex);
  return results.map((r) => ({ rect: r.rect, data: r.data }));
}

function worstAspectRatio(values: number[], stripTotal: number, container: Rect, totalRemaining: number): number {
  const shorter = Math.min(container.w, container.h);
  if (shorter <= 0 || totalRemaining <= 0) return Infinity;

  // The strip occupies a fraction of the container along the longer axis
  const stripFraction = stripTotal / totalRemaining;
  const isHorizontal = container.w >= container.h;
  const stripLength = isHorizontal
    ? container.w * stripFraction
    : container.h * stripFraction;
  const stripBreadth = isHorizontal ? container.h : container.w;

  if (stripLength <= 0 || stripBreadth <= 0) return Infinity;

  let worst = 0;
  for (const v of values) {
    const itemFraction = v / stripTotal;
    const itemBreadth = stripBreadth * itemFraction;
    if (itemBreadth <= 0) continue;
    const ratio = Math.max(stripLength / itemBreadth, itemBreadth / stripLength);
    if (ratio > worst) worst = ratio;
  }
  return worst;
}

function layoutStrip<T>(
  items: (SizedItem<T> & { originalIndex: number })[],
  stripTotal: number,
  container: Rect,
  totalRemaining: number,
): { rect: Rect; data: T; originalIndex: number }[] {
  if (totalRemaining <= 0) return [];

  const stripFraction = stripTotal / totalRemaining;
  const isHorizontal = container.w >= container.h;

  const results: { rect: Rect; data: T; originalIndex: number }[] = [];
  let offset = 0;

  for (const item of items) {
    const itemFraction = item.value / stripTotal;

    let rect: Rect;
    if (isHorizontal) {
      const stripW = container.w * stripFraction;
      const itemH = container.h * itemFraction;
      rect = {
        x: container.x,
        y: container.y + offset,
        w: stripW,
        h: itemH,
      };
      offset += itemH;
    } else {
      const stripH = container.h * stripFraction;
      const itemW = container.w * itemFraction;
      rect = {
        x: container.x + offset,
        y: container.y,
        w: itemW,
        h: stripH,
      };
      offset += itemW;
    }

    results.push({ rect, data: item.data, originalIndex: item.originalIndex });
  }

  return results;
}

function cutRect(container: Rect, usedTotal: number, totalRemaining: number): Rect {
  const fraction = usedTotal / totalRemaining;
  const isHorizontal = container.w >= container.h;

  if (isHorizontal) {
    const usedW = container.w * fraction;
    return {
      x: container.x + usedW,
      y: container.y,
      w: container.w - usedW,
      h: container.h,
    };
  } else {
    const usedH = container.h * fraction;
    return {
      x: container.x,
      y: container.y + usedH,
      w: container.w,
      h: container.h - usedH,
    };
  }
}

// ── Public API ───────────────────────────────────────────────────────

export function computeTreemapLayout(categories: TreemapCategory[]): TreemapRect[] {
  // Filter to categories that have repos with activity
  const activeCategories = categories
    .map((cat) => {
      const activeRepos = cat.repos.filter((r) => r.linesChanged > 0);
      const totalLines = activeRepos.reduce((s, r) => s + r.linesChanged, 0);
      return { ...cat, repos: activeRepos, totalLines };
    })
    .filter((cat) => cat.totalLines > 0)
    .sort((a, b) => b.totalLines - a.totalLines);

  if (activeCategories.length === 0) return [];

  const rootRect: Rect = { x: 0, y: 0, w: 100, h: 100 };

  // Use sqrt-dampened values so small categories still get a visible area.
  // Pure proportional layout makes tiny categories invisible; sqrt compresses
  // the range while preserving relative order.
  const catItems: SizedItem<(typeof activeCategories)[number]>[] = activeCategories.map((cat) => ({
    value: Math.sqrt(cat.totalLines),
    data: cat,
  }));

  const catRects = squarify(catItems, rootRect);
  const result: TreemapRect[] = [];

  // Level 2: within each category, lay out repos
  for (const { rect: catRect, data: cat } of catRects) {
    // Add category-level rect (no repo)
    result.push({
      x: catRect.x,
      y: catRect.y,
      w: catRect.w,
      h: catRect.h,
      categoryName: cat.name,
      categoryColor: cat.color,
    });

    // Repos within category
    const repoItems: SizedItem<TreemapRepo>[] = cat.repos.map((repo) => ({
      value: repo.linesChanged,
      data: repo,
    }));

    const repoRects = squarify(repoItems, catRect);
    for (const { rect: repoRect, data: repo } of repoRects) {
      result.push({
        x: repoRect.x,
        y: repoRect.y,
        w: repoRect.w,
        h: repoRect.h,
        categoryName: cat.name,
        categoryColor: cat.color,
        repo,
      });
    }
  }

  return result;
}
