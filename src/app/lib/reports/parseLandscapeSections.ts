import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import type {
  ActivityLevel,
  EcosystemLandscape,
  LandscapeCategory,
  LandscapeRepo,
  CategoryFocusItem,
} from "@/app/components/ui/sections/reports/types";
import { sanitizeUrl } from "./parseReport";

// ── Ecosystem Landscape ──

function parseActivityLevel(title: string): ActivityLevel {
  const lower = title.toLowerCase();
  if (lower.includes("high")) return "high";
  if (lower.includes("medium")) return "medium";
  return "low";
}

function parseRepoCard(
  el: AnyNode,
  $: cheerio.CheerioAPI,
  categoryColor: string
): LandscapeRepo {
  const anchor = $(el);
  return {
    name: anchor.find(".repo-name").text().trim(),
    description: anchor.find(".repo-desc").text().trim(),
    githubUrl: sanitizeUrl(anchor.attr("href") || ""),
    activity: parseActivityLevel(
      anchor.find(".activity-dot").attr("title") || ""
    ),
    categoryColor,
  };
}

function parseCategorySection(
  el: AnyNode,
  $: cheerio.CheerioAPI
): LandscapeCategory {
  const section = $(el);
  const header = section.find(".category-header");

  const icon = header.find(".category-icon").text().trim();
  const name = header.find(".category-title").text().trim();

  // Parse "10 repos · 538 commits" or "10 projects · 538 code changes" from .category-count
  const countText = header.find(".category-count").text().trim();
  const repoMatch = countText.match(/(\d+)\s*(?:repos?|projects?)/i);
  const commitMatch = countText.match(/([\d,]+)\s*(?:commits?|code\s*changes?)/i);
  const repoCount = repoMatch ? parseInt(repoMatch[1], 10) : 0;
  const commitCount = commitMatch
    ? parseInt(commitMatch[1].replace(/,/g, ""), 10)
    : 0;

  // Extract color from border-left-color style
  const style = header.attr("style") || "";
  const colorMatch = style.match(/border-left-color:\s*(#[0-9A-Fa-f]{3,8})/);
  const color = colorMatch ? colorMatch[1] : "#888";

  const repos: LandscapeRepo[] = section
    .find(".repo-card")
    .toArray()
    .map((card) => parseRepoCard(card, $, color));

  return { name, icon, color, repoCount, commitCount, repos };
}

export function parseLandscapeFragment(fragment: string): EcosystemLandscape {
  const $ = cheerio.load(fragment);

  // Summary stats from .stats-bar
  let totalRepos = 0;
  let totalCommits = 0;
  let totalCategories = 0;

  $(".stats-bar .stat").each((_: number, el: AnyNode) => {
    const num = parseInt(
      $(el).find(".stat-num").text().trim().replace(/,/g, ""),
      10
    );
    const label = $(el).find(".stat-label").text().trim().toLowerCase();
    if (label.includes("repositor") || label.includes("project")) totalRepos = num || 0;
    else if (label.includes("commit") || label.includes("change")) totalCommits = num || 0;
    else if (label.includes("categor")) totalCategories = num || 0;
  });

  const categories: LandscapeCategory[] = $(".category-section")
    .toArray()
    .map((el) => parseCategorySection(el, $));

  return { totalRepos, totalCommits, totalCategories, categories };
}

// ── Category Focus & Synergies ──

export function parseCategoryFocusFragment(
  fragment: string
): CategoryFocusItem[] {
  const $ = cheerio.load(fragment);
  const items: CategoryFocusItem[] = [];

  // Each card is a div with inline border-left:4px solid #COLOR
  $("div")
    .filter((_: number, el: AnyNode) =>
      /border-left:\s*4px\s+solid/.test($(el).attr("style") || "")
    )
    .each((_: number, el: AnyNode) => {
    const card = $(el);
    const headerRow = card.children("div").first();

    // Icon: first span with font-size:18px
    const icon = headerRow
      .find("span")
      .filter((_i: number, s: AnyNode) =>
        /font-size:\s*18px/.test($(s).attr("style") || "")
      )
      .text()
      .trim();

    // Name: span with font-size:16px (distinguishes from badge which is 11px)
    const name = headerRow
      .find("span")
      .filter((_i: number, s: AnyNode) =>
        /font-size:\s*16px/.test($(s).attr("style") || "")
      )
      .text()
      .trim();

    // Badge: "N repos · M commits"
    const badgeText = headerRow
      .find("span")
      .filter((_b: number, b: AnyNode) =>
        /border-radius:\s*10px/.test($(b).attr("style") || "")
      )
      .text()
      .trim();
    const repoMatch = badgeText.match(/(\d+)\s*(?:repos?|projects?)/i);
    const commitMatch = badgeText.match(/([\d,]+)\s*(?:commits?|code\s*changes?)/i);
    const repoCount = repoMatch ? parseInt(repoMatch[1], 10) : 0;
    const commitCount = commitMatch
      ? parseInt(commitMatch[1].replace(/,/g, ""), 10)
      : 0;

    // Color from border-left
    const style = card.attr("style") || "";
    const colorMatch = style.match(/border-left:\s*4px\s+solid\s*(#[0-9A-Fa-f]{3,8})/);
    const color = colorMatch ? colorMatch[1] : "#888";

    // Top repos from .synergy-repo-chip
    const topRepos = card
      .find(".synergy-repo-chip")
      .toArray()
      .map((chip) => {
        const chipEl = $(chip);
        const commitText = chipEl.find(".commit-count").text().trim();
        const commits = parseInt(commitText.replace(/[^0-9]/g, ""), 10) || 0;
        // Remove the commit count text to get just the name
        const chipClone = chipEl.clone();
        chipClone.find(".commit-count").remove();
        const repoName = chipClone.text().trim();
        return { name: repoName, commits };
      });

    // Uppercase label divs (shared query for focus + synergies)
    const uppercaseDivs = card.find("div").filter((_f: number, d: AnyNode) =>
      /text-transform:\s*uppercase/.test($(d).attr("style") || "")
    );

    // Focus narrative: text after "Current Focus" label
    let focusNarrative = "";
    uppercaseDivs.each(
      (_i: number, labelEl: AnyNode) => {
        const labelText = $(labelEl).text().trim().toLowerCase();
        if (labelText.includes("current focus")) {
          focusNarrative = $(labelEl).next("div").text().trim();
        }
      }
    );

    // Synergies: <li> items under "Potential Synergies" section
    const synergies: string[] = [];
    uppercaseDivs.each(
      (_i: number, labelEl: AnyNode) => {
        const labelText = $(labelEl).text().trim().toLowerCase();
        if (labelText.includes("potential synergies")) {
          $(labelEl)
            .parent()
            .find("li")
            .each((_j: number, li: AnyNode) => {
              const text = $(li).text().trim();
              if (text) synergies.push(text);
            });
        }
      }
    );

    items.push({
      name,
      icon,
      color,
      repoCount,
      commitCount,
      topRepos,
      focusNarrative,
      synergies,
    });
  });

  return items;
}
