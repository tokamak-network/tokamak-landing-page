import fs from "fs";
import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import type {
  ReportStats,
  ReportSummary,
  ReportDetail,
  ReportMeta,
  RepoCardData,
  Contributor,
} from "@/app/components/ui/sections/reports/types";

const DEFAULT_STATS: ReportStats = {
  commits: "0",
  linesChanged: "0",
  activeRepos: "0",
  contributors: "0",
  netGrowth: "0",
};

function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return url;
    }
    return "";
  } catch {
    return "";
  }
}

function extractBetweenComments(
  html: string,
  startMarker: string,
  endMarker: string
): string {
  const startIdx = html.indexOf(`<!-- ${startMarker} -->`);
  const endIdx = html.indexOf(`<!-- ${endMarker} -->`);

  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return "";

  const afterStart = startIdx + `<!-- ${startMarker} -->`.length;
  return html.slice(afterStart, endIdx).trim();
}

function parseStats(html: string): ReportStats {
  const statsHtml = extractBetweenComments(html, "STATS BAR", "BODY");
  if (!statsHtml) return { ...DEFAULT_STATS };

  const $ = cheerio.load(statsHtml);
  const statDivs = $("div[style*='text-align:center']");

  const labels: Record<string, keyof ReportStats> = {
    "total commits": "commits",
    "lines changed": "linesChanged",
    "active repositories": "activeRepos",
    contributors: "contributors",
    "net growth": "netGrowth",
  };

  const entries: Partial<ReportStats> = {};
  statDivs.each((_: number, el: AnyNode) => {
    const value = $(el).find("div").first().text().trim();
    const label = $(el).find("div").last().text().trim().toLowerCase();

    for (const [key, field] of Object.entries(labels)) {
      if (label.includes(key)) {
        entries[field] = value;
        break;
      }
    }
  });

  return { ...DEFAULT_STATS, ...entries };
}

function parseExecutiveSummary(html: string): {
  headline: string;
  narrative: string;
} {
  const summaryHtml = extractBetweenComments(
    html,
    "EXECUTIVE SUMMARY",
    "REPO CARDS"
  );
  if (!summaryHtml) return { headline: "", narrative: "" };

  const $ = cheerio.load(summaryHtml);
  const headline: string =
    $("p[style*='font-weight:bold']").first().text().trim() ||
    $("p").first().text().trim();
  const paragraphs = $("p").toArray();
  const narrative: string =
    paragraphs.length > 1
      ? $(paragraphs[paragraphs.length - 1]).text().trim()
      : "";

  return { headline, narrative };
}

function extractRepoStats(
  card: cheerio.Cheerio<AnyNode>
): RepoCardData["stats"] {
  const statsText: string = card
    .find("div[style*='display:flex'][style*='gap:20px']")
    .first()
    .text();

  const extractNum = (pattern: RegExp): string => {
    const match = statsText.match(pattern);
    return match ? match[1] : "0";
  };

  return {
    commits: extractNum(/Commits:\s*([\d,]+)/),
    contributors: extractNum(/Contributors:\s*([\d,]+)/),
    linesAdded: extractNum(/(\+[\d,]+)/),
    linesDeleted: extractNum(/(-[\d,]+)/),
    netLines: extractNum(/Net:\s*([+-]?[\d,]+)/),
  };
}

function extractAccomplishments(
  sections: Record<string, cheerio.Cheerio<AnyNode>>,
  $: cheerio.CheerioAPI
): string[] {
  const accomplishments: string[] = [];
  const h4 = sections["key accomplishments"];
  if (h4) {
    h4.next("ul")
      .find("li")
      .each((_: number, li: AnyNode) => {
        accomplishments.push($(li).text().trim());
      });
  }
  return accomplishments;
}

function extractContributors(
  sections: Record<string, cheerio.Cheerio<AnyNode>>,
  $: cheerio.CheerioAPI
): Contributor[] {
  const contributors: Contributor[] = [];
  const h4 = sections["top contributors"];
  if (h4) {
    h4.nextAll("div")
      .first()
      .find("a")
      .each((_: number, a: AnyNode) => {
        const profileUrl = sanitizeUrl($(a).attr("href") || "");
        const name: string = $(a).find("span").text().trim();
        const avatarUrl = sanitizeUrl($(a).find("img").attr("src") || "");
        if (name) {
          contributors.push({ name, avatarUrl, profileUrl });
        }
      });
  }
  return contributors;
}

function parseRepoCards(html: string): RepoCardData[] {
  const cardsHtml = extractBetweenComments(html, "REPO CARDS", "FOOTER");
  if (!cardsHtml) return [];

  const $ = cheerio.load(cardsHtml);
  const cards: RepoCardData[] = [];

  const cardDivs = $(
    "div[style*='background:#fff'][style*='border:1px solid #e8e8e8'][style*='border-radius:12px']"
  );

  cardDivs.each((_: number, cardEl: AnyNode) => {
    const card = $(cardEl);

    const repoName: string = card.find("h3").first().text().trim();
    const githubUrl = sanitizeUrl(card.find("h3 a").first().attr("href") || "");
    const description: string = card.find("h3").first().next("p").text().trim();

    const repoStats = extractRepoStats(card);

    const sections: Record<string, cheerio.Cheerio<AnyNode>> = {};
    card.find("h4").each((_i: number, h4: AnyNode) => {
      const title: string = $(h4).text().trim().toLowerCase();
      sections[title] = $(h4);
    });

    const accomplishments = extractAccomplishments(sections, $);

    const codeAnalysis: string = sections["code analysis"]
      ? sections["code analysis"].next("p").text().trim()
      : "";

    const nextSteps: string = sections["next steps"]
      ? sections["next steps"].next("p").text().trim()
      : "";

    const topContributors = extractContributors(sections, $);

    cards.push({
      repoName,
      githubUrl,
      description,
      stats: repoStats,
      accomplishments,
      codeAnalysis,
      nextSteps,
      topContributors,
    });
  });

  return cards;
}

export function parseReportSummary(
  filePath: string,
  meta: ReportMeta
): ReportSummary {
  try {
    const html = fs.readFileSync(filePath, "utf-8");
    const stats = parseStats(html);
    const { headline } = parseExecutiveSummary(html);

    return {
      ...meta,
      stats,
      executiveHeadline: headline,
    };
  } catch {
    return {
      ...meta,
      stats: { ...DEFAULT_STATS },
      executiveHeadline: "",
    };
  }
}

export function parseReportDetail(
  filePath: string,
  meta: ReportMeta
): ReportDetail {
  try {
    const html = fs.readFileSync(filePath, "utf-8");
    const stats = parseStats(html);
    const { headline, narrative } = parseExecutiveSummary(html);
    const repos = parseRepoCards(html);

    return {
      ...meta,
      stats,
      executiveHeadline: headline,
      executiveNarrative: narrative,
      repos,
    };
  } catch {
    return {
      ...meta,
      stats: { ...DEFAULT_STATS },
      executiveHeadline: "",
      executiveNarrative: "",
      repos: [],
    };
  }
}
