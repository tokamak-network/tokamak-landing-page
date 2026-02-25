import { describe, it, expect } from "vitest";
import {
  parseLandscapeFragment,
  parseCategoryFocusFragment,
} from "../parseLandscapeSections";

describe("parseLandscapeFragment", () => {
  const fragment = `
<div class="stats-bar">
  <div class="stat"><span class="stat-num">67</span><span class="stat-label">Repositories</span></div>
  <div class="stat"><span class="stat-num">2,161</span><span class="stat-label">Commits</span></div>
  <div class="stat"><span class="stat-num">10</span><span class="stat-label">Categories</span></div>
</div>
<div class="landscape-grid">
  <div class="category-section" data-category="Privacy & ZK">
    <div class="category-header" style="border-left-color:#7C3AED;">
      <span class="category-icon">&#x1f512;</span>
      <span class="category-title">Privacy & ZK</span>
      <span class="category-count">3 repos · 200 commits</span>
    </div>
    <div class="category-repos">
      <a href="https://github.com/tokamak-network/zk-repo" target="_blank" rel="noopener"
         class="repo-card" style="border-left:3px solid #7C3AED;">
        <div class="repo-header">
          <span class="activity-dot" style="background:#22C55E;" title="high activity"></span>
          <span class="repo-name">zk-repo</span>
        </div>
        <div class="repo-desc">A ZK repository</div>
      </a>
      <a href="https://github.com/tokamak-network/dust" target="_blank" rel="noopener"
         class="repo-card" style="border-left:3px solid #7C3AED;">
        <div class="repo-header">
          <span class="activity-dot" style="background:#EAB308;" title="medium activity"></span>
          <span class="repo-name">dust</span>
        </div>
        <div class="repo-desc">Dust protocol</div>
      </a>
    </div>
  </div>
  <div class="category-section" data-category="DeFi">
    <div class="category-header" style="border-left-color:#2A72E5;">
      <span class="category-icon">&#x1f4b0;</span>
      <span class="category-title">DeFi</span>
      <span class="category-count">2 repos · 100 commits</span>
    </div>
    <div class="category-repos">
      <a href="https://github.com/tokamak-network/staking" target="_blank" rel="noopener"
         class="repo-card" style="border-left:3px solid #2A72E5;">
        <div class="repo-header">
          <span class="activity-dot" style="background:#9CA3AF;" title="low activity"></span>
          <span class="repo-name">staking</span>
        </div>
        <div class="repo-desc">Staking contract</div>
      </a>
    </div>
  </div>
</div>
  `;

  it("parses summary totals", () => {
    const result = parseLandscapeFragment(fragment);
    expect(result.totalRepos).toBe(67);
    expect(result.totalCommits).toBe(2161);
    expect(result.totalCategories).toBe(10);
  });

  it("parses categories", () => {
    const result = parseLandscapeFragment(fragment);
    expect(result.categories).toHaveLength(2);
    expect(result.categories[0].name).toBe("Privacy & ZK");
    expect(result.categories[0].color).toBe("#7C3AED");
    expect(result.categories[0].repoCount).toBe(3);
    expect(result.categories[0].commitCount).toBe(200);
    expect(result.categories[1].name).toBe("DeFi");
  });

  it("parses repos with activity levels", () => {
    const result = parseLandscapeFragment(fragment);
    const repos = result.categories[0].repos;
    expect(repos).toHaveLength(2);
    expect(repos[0].name).toBe("zk-repo");
    expect(repos[0].description).toBe("A ZK repository");
    expect(repos[0].activity).toBe("high");
    expect(repos[0].githubUrl).toBe(
      "https://github.com/tokamak-network/zk-repo"
    );
    expect(repos[1].activity).toBe("medium");
  });

  it("parses low activity", () => {
    const result = parseLandscapeFragment(fragment);
    const defiRepos = result.categories[1].repos;
    expect(defiRepos[0].activity).toBe("low");
  });

  it("returns empty categories for empty input", () => {
    const result = parseLandscapeFragment("");
    expect(result.totalRepos).toBe(0);
    expect(result.totalCommits).toBe(0);
    expect(result.categories).toEqual([]);
  });

  it("computes activity from line data when no .activity-dot (new format)", () => {
    const newFormatRepos = `
<div class="landscape-grid">
  <div class="category-section" data-category="DeFi">
    <div class="category-header" style="border-left-color:#2A72E5;">
      <span class="category-icon">&#x1f4b0;</span>
      <span class="category-title">DeFi</span>
      <span class="category-count">3 projects · 700,000 code changes</span>
    </div>
    <div class="category-repos">
      <a class="repo-card" style="border-left:3px solid #2A72E5;">
        <div class="repo-top">
          <span class="repo-name">high-repo</span>
          <span class="repo-lines-total">551,403</span>
        </div>
        <div class="repo-desc">High activity repo</div>
        <div class="repo-bottom">
          <span class="repo-lines-detail">
            <span class="repo-lines-added">+306,677</span> /
            <span class="repo-lines-deleted">-244,726</span>
          </span>
        </div>
      </a>
      <a class="repo-card" style="border-left:3px solid #2A72E5;">
        <div class="repo-top">
          <span class="repo-name">medium-repo</span>
          <span class="repo-lines-total">50,000</span>
        </div>
        <div class="repo-desc">Medium activity repo</div>
        <div class="repo-bottom">
          <span class="repo-lines-detail">
            <span class="repo-lines-added">+30,000</span> /
            <span class="repo-lines-deleted">-20,000</span>
          </span>
        </div>
      </a>
      <a class="repo-card" style="border-left:3px solid #2A72E5;">
        <div class="repo-top">
          <span class="repo-name">low-repo</span>
          <span class="repo-lines-total">5,000</span>
        </div>
        <div class="repo-desc">Low activity repo</div>
        <div class="repo-bottom">
          <span class="repo-lines-detail">
            <span class="repo-lines-added">+3,000</span> /
            <span class="repo-lines-deleted">-2,000</span>
          </span>
        </div>
      </a>
    </div>
  </div>
</div>
    `;
    const result = parseLandscapeFragment(newFormatRepos);
    const repos = result.categories[0].repos;
    expect(repos).toHaveLength(3);

    // Activity computed from totalLines
    expect(repos[0].activity).toBe("high"); // 551,403 >= 100k
    expect(repos[1].activity).toBe("medium"); // 50,000 >= 10k
    expect(repos[2].activity).toBe("low"); // 5,000 < 10k
  });

  it("parses linesAdded and linesDeleted from new format", () => {
    const newFormatRepos = `
<div class="landscape-grid">
  <div class="category-section" data-category="DeFi">
    <div class="category-header" style="border-left-color:#2A72E5;">
      <span class="category-icon">&#x1f4b0;</span>
      <span class="category-title">DeFi</span>
      <span class="category-count">1 project · 100 code changes</span>
    </div>
    <div class="category-repos">
      <a class="repo-card" style="border-left:3px solid #2A72E5;">
        <div class="repo-top">
          <span class="repo-name">my-repo</span>
          <span class="repo-lines-total">551,403</span>
        </div>
        <div class="repo-desc">A repo</div>
        <div class="repo-bottom">
          <span class="repo-lines-detail">
            <span class="repo-lines-added">+306,677</span> /
            <span class="repo-lines-deleted">-244,726</span>
          </span>
        </div>
      </a>
    </div>
  </div>
</div>
    `;
    const result = parseLandscapeFragment(newFormatRepos);
    const repo = result.categories[0].repos[0];
    expect(repo.linesAdded).toBe(306677);
    expect(repo.linesDeleted).toBe(244726);
  });

  it("does not include linesAdded/linesDeleted for old format", () => {
    const result = parseLandscapeFragment(fragment);
    const repo = result.categories[0].repos[0];
    expect(repo.linesAdded).toBeUndefined();
    expect(repo.linesDeleted).toBeUndefined();
  });

  it("parses 'projects' and 'code changes' labels (new format)", () => {
    const newFormatFragment = `
<div class="stats-bar">
  <div class="stat"><span class="stat-num">67</span><span class="stat-label">Active Projects</span></div>
  <div class="stat"><span class="stat-num">4,898,658</span><span class="stat-label">Code Changes</span></div>
  <div class="stat"><span class="stat-num">10</span><span class="stat-label">Categories</span></div>
</div>
<div class="landscape-grid">
  <div class="category-section" data-category="DeFi">
    <div class="category-header" style="border-left-color:#2A72E5;">
      <span class="category-icon">&#x1f4b0;</span>
      <span class="category-title">DeFi</span>
      <span class="category-count">9 projects · 1,100,255 code changes</span>
    </div>
  </div>
</div>
    `;
    const result = parseLandscapeFragment(newFormatFragment);
    expect(result.totalRepos).toBe(67);
    expect(result.totalCommits).toBe(4898658);
    expect(result.totalCategories).toBe(10);
    expect(result.categories[0].repoCount).toBe(9);
    expect(result.categories[0].commitCount).toBe(1100255);
  });
});

describe("parseCategoryFocusFragment", () => {
  const fragment = `
<div class="blueprint-container">
  <div style="margin-top:20px;">
    <div style="background:#fff;border:1px solid #e8e8e8;border-radius:10px;padding:20px 24px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,0.04);border-left:4px solid #7C3AED;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <span style="font-size:18px;">&#x1f512;</span>
        <span style="font-size:16px;font-weight:700;color:#1a1a1a;">Privacy &amp; ZK</span>
        <span style="background:#f0f0f0;color:#555;padding:2px 10px;border-radius:10px;font-size:11px;font-weight:700;margin-left:auto;">10 repos · 538 commits</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
        <span class="synergy-repo-chip">zk-dex<span class="commit-count">(143)</span></span>
        <span class="synergy-repo-chip">dust<span class="commit-count">(129)</span></span>
      </div>
      <div style="margin-bottom:8px;">
        <div style="font-size:0.8rem;font-weight:600;color:#2A72E5;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Current Focus</div>
        <div style="font-size:13px;color:#444;line-height:1.5;">Privacy category is very active.</div>
      </div>
      <div style="margin-top:12px;">
        <div style="font-size:0.8rem;font-weight:600;color:#EA580C;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Potential Synergies</div>
        <ul><li>ZK + DeFi synergy</li><li>Privacy + Governance</li></ul>
      </div>
    </div>
    <div style="background:#fff;border:1px solid #e8e8e8;border-radius:10px;padding:20px 24px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,0.04);border-left:4px solid #DC2626;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <span style="font-size:18px;">&#x1f3ae;</span>
        <span style="font-size:16px;font-weight:700;color:#1a1a1a;">Gaming</span>
        <span style="background:#f0f0f0;color:#555;padding:2px 10px;border-radius:10px;font-size:11px;font-weight:700;margin-left:auto;">3 repos · 180 commits</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
        <span class="synergy-repo-chip">tokamon<span class="commit-count">(89)</span></span>
      </div>
      <div style="margin-bottom:8px;">
        <div style="font-size:0.8rem;font-weight:600;color:#2A72E5;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Current Focus</div>
        <div style="font-size:13px;color:#444;line-height:1.5;">Gaming is growing.</div>
      </div>
    </div>
  </div>
</div>
  `;

  it("parses multiple category cards", () => {
    const result = parseCategoryFocusFragment(fragment);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Privacy & ZK");
    expect(result[1].name).toBe("Gaming");
  });

  it("parses card metadata", () => {
    const result = parseCategoryFocusFragment(fragment);
    expect(result[0].color).toBe("#7C3AED");
    expect(result[0].repoCount).toBe(10);
    expect(result[0].commitCount).toBe(538);
  });

  it("parses top repos", () => {
    const result = parseCategoryFocusFragment(fragment);
    expect(result[0].topRepos).toHaveLength(2);
    expect(result[0].topRepos[0]).toEqual({ name: "zk-dex", commits: 143 });
    expect(result[0].topRepos[1]).toEqual({ name: "dust", commits: 129 });
  });

  it("parses focus narrative", () => {
    const result = parseCategoryFocusFragment(fragment);
    expect(result[0].focusNarrative).toBe("Privacy category is very active.");
    expect(result[1].focusNarrative).toBe("Gaming is growing.");
  });

  it("parses synergies when present", () => {
    const result = parseCategoryFocusFragment(fragment);
    expect(result[0].synergies).toEqual([
      "ZK + DeFi synergy",
      "Privacy + Governance",
    ]);
  });

  it("returns empty synergies when absent", () => {
    const result = parseCategoryFocusFragment(fragment);
    expect(result[1].synergies).toEqual([]);
  });

  it("returns empty array for empty input", () => {
    const result = parseCategoryFocusFragment("");
    expect(result).toEqual([]);
  });

  it("parses 'projects' and 'code changes' in badge (new format)", () => {
    const newBadge = `
<div style="background:#fff;border-left:4px solid #2A72E5;">
  <div style="display:flex;align-items:center;gap:8px;">
    <span style="font-size:18px;">&#x1f4b0;</span>
    <span style="font-size:16px;font-weight:700;color:#1a1a1a;">DeFi</span>
    <span style="background:#f0f0f0;color:#555;padding:2px 10px;border-radius:10px;font-size:11px;font-weight:700;margin-left:auto;">9 projects · 1,100,255 code changes</span>
  </div>
  <div style="margin-bottom:8px;">
    <div style="font-size:0.8rem;font-weight:600;color:#2A72E5;text-transform:uppercase;">Current Focus</div>
    <div style="font-size:13px;color:#444;">DeFi is growing.</div>
  </div>
</div>
    `;
    const result = parseCategoryFocusFragment(newBadge);
    expect(result).toHaveLength(1);
    expect(result[0].repoCount).toBe(9);
    expect(result[0].commitCount).toBe(1100255);
  });

  it("tolerates whitespace variations in inline styles", () => {
    const wsFragment = `
<div style="background:#fff; border-left: 4px  solid #AA00FF;">
  <div style="display:flex;align-items:center;gap:8px;">
    <span style="font-size: 18px;">&#x1f512;</span>
    <span style="font-size: 16px; font-weight:700;color:#1a1a1a;">Spaced Category</span>
    <span style="background:#f0f0f0;color:#555;padding:2px 10px; border-radius: 10px; font-size:11px;font-weight:700;margin-left:auto;">5 repos · 300 commits</span>
  </div>
  <div style="margin-bottom:8px;">
    <div style="font-size:0.8rem;font-weight:600;color:#2A72E5; text-transform: uppercase; letter-spacing:0.5px;margin-bottom:4px;">Current Focus</div>
    <div style="font-size:13px;color:#444;line-height:1.5;">Testing whitespace tolerance.</div>
  </div>
</div>
    `;
    const result = parseCategoryFocusFragment(wsFragment);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Spaced Category");
    expect(result[0].color).toBe("#AA00FF");
    expect(result[0].repoCount).toBe(5);
    expect(result[0].commitCount).toBe(300);
    expect(result[0].focusNarrative).toBe("Testing whitespace tolerance.");
  });
});
