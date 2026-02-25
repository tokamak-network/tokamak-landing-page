import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  listReports,
  getReportPath,
} from "@/app/lib/reports/listReports";
import { parseReportDetail } from "@/app/lib/reports/parseReport";
import ReportDetail from "@/app/components/ui/sections/reports/ReportDetail";

export function generateStaticParams() {
  return listReports().map((meta) => ({ slug: meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const all = listReports();
  const found = all.find((r) => r.slug === slug);
  const label = found
    ? `Biweekly Report #${found.reportNumber} — ${found.dateLabel}`
    : "Biweekly Report";
  return { title: `${label} | Tokamak Network` };
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const all = listReports();
  const found = all.find((r) => r.slug === slug);
  if (!found) {
    notFound();
  }

  const filePath = getReportPath(slug);
  if (!filePath) {
    notFound();
  }

  const report = parseReportDetail(filePath, found);

  return <ReportDetail report={report} />;
}
