import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportDetail } from "@/app/lib/reports/parseReport";
import ReportDetail from "@/app/components/ui/sections/reports/ReportDetail";

const SLUG_PATTERN = /^report-\d{4}-\d{2}-\d{2}-\d{2}$/;

export function generateStaticParams() {
  return listReports().map((meta) => ({ slug: meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const metas = listReports();
  const meta = metas.find((m) => m.slug === slug);
  return {
    title: meta
      ? `${meta.dateLabel} Report | Tokamak Network`
      : "Development Report | Tokamak Network",
  };
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!SLUG_PATTERN.test(slug)) {
    notFound();
  }

  const filePath = getReportPath(slug);
  if (!filePath) {
    notFound();
  }

  const metas = listReports();
  const meta = metas.find((m) => m.slug === slug);
  if (!meta) {
    notFound();
  }

  const report = parseReportDetail(filePath, meta);

  return <ReportDetail report={report} />;
}
