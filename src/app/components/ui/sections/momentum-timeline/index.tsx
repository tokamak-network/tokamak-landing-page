import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportSummary } from "@/app/lib/reports/parseReport";
import TimelineClient from "./TimelineClient";

export default function MomentumTimeline() {
  const metas = listReports();
  let currentCodeChanges = "4,898,658";
  let currentNetGrowth = "2,979,570";

  if (metas.length > 0) {
    const latest = metas[0];
    const filePath = getReportPath(latest.slug);
    if (filePath) {
      const summary = parseReportSummary(filePath, latest);
      if (summary) {
        currentCodeChanges = summary.stats.linesChanged || currentCodeChanges;
        currentNetGrowth = summary.stats.netGrowth || currentNetGrowth;
      }
    }
  }

  return (
    <section id="momentum-timeline" className="relative z-10 w-full">
      <TimelineClient
        currentCodeChanges={currentCodeChanges}
        currentNetGrowth={currentNetGrowth}
      />
    </section>
  );
}
