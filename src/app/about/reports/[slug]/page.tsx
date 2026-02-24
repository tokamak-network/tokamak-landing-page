import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  listReports,
  getReportPath,
  parseSlug,
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
  const meta = parseSlug(slug);
  return {
    title: meta
      ? `${meta.dateLabel} Report | Tokamak Network`
      : "Biweekly Report | Tokamak Network",
  };
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const meta = parseSlug(slug);
  if (!meta) {
    notFound();
  }

  const filePath = getReportPath(slug);
  if (!filePath) {
    notFound();
  }

  const report = parseReportDetail(filePath, meta);

  return <ReportDetail report={report} />;
}
