import Header from "./components/ui/header";
import DataTicker from "./components/ui/sections/data-ticker";
import HeroVisual from "./components/ui/sections/hero-visual";
import EcosystemFlow from "./components/ui/sections/ecosystem-flow";
import EcosystemMetrics from "./components/ui/sections/ecosystem-metrics";
import RepoLeaderboard from "./components/ui/sections/repo-leaderboard";
import DeveloperCta from "./components/ui/sections/developer-cta";
import ActivityStream from "./components/ui/sections/activity-stream";
import LatestFeed from "./components/ui/sections/latest-feed";
import Footer from "./components/ui/footer";
import PulseSpine from "./components/ui/pulse-spine/PulseSpine";
import { listReports, getReportPath } from "./lib/reports/listReports";
import { parseReportSummary } from "./lib/reports/parseReport";
import { FALLBACK_REPORT } from "./lib/reports/constants";
import { fetchPriceDatas } from "./api/price";

export default async function Home() {
  // Fetch data for hero
  let codeChanges = parseInt(FALLBACK_REPORT.codeChanges.replace(/,/g, ""));
  let netGrowth = parseInt(FALLBACK_REPORT.netGrowth.replace(/,/g, ""));
  let activeProjects = parseInt(FALLBACK_REPORT.activeProjects);
  let totalStaked = 28500000;

  try {
    const metas = listReports();
    if (metas.length > 0) {
      const latest = metas[0];
      const filePath = getReportPath(latest.slug);
      if (filePath) {
        const summary = parseReportSummary(filePath, latest);
        if (summary) {
          const lc = parseInt(summary.stats.linesChanged.replace(/,/g, ""));
          if (!isNaN(lc) && lc > 0) codeChanges = lc;
          const ng = parseInt(summary.stats.netGrowth.replace(/,/g, ""));
          if (!isNaN(ng) && ng > 0) netGrowth = ng;
          const ar = parseInt(summary.stats.activeRepos.replace(/,/g, ""));
          if (!isNaN(ar) && ar > 0) activeProjects = ar;
        }
      }
    }
    const priceData = await fetchPriceDatas();
    if (priceData?.stakedVolume) {
      totalStaked = Math.floor(priceData.stakedVolume);
    }
  } catch {}

  return (
    <div className="flex flex-col items-center w-full font-display bg-black relative grain-overlay">
      <Header />
      <PulseSpine
        codeChanges={codeChanges}
        netGrowth={netGrowth}
        activeProjects={activeProjects}
        totalStaked={totalStaked}
      />
      <HeroVisual
        codeChanges={codeChanges}
        netGrowth={netGrowth}
        activeProjects={activeProjects}
        totalStaked={totalStaked}
      />
      <DataTicker />
      <EcosystemFlow />
      <EcosystemMetrics />
      <RepoLeaderboard />
      <DeveloperCta />
      <ActivityStream />
      <LatestFeed />
      <Footer />
    </div>
  );
}
