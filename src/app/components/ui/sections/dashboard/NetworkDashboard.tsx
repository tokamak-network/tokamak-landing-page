"use client";

import { DASHBOARD_METRICS } from "./data";
import { SparklineChart } from "./SparklineChart";
import type { DashboardMetric } from "./types";

function TrendBadge({
  percent,
  direction,
}: {
  readonly percent: string;
  readonly direction: "up" | "down";
}) {
  const isUp = direction === "up";

  return (
    <span
      className={`text-[12px] font-[500] flex items-center px-2 py-0.5 rounded border
        ${isUp ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-rose-400 bg-rose-400/10 border-rose-400/20"}`}
    >
      <span className="text-[14px] mr-0.5">{isUp ? "↑" : "↓"}</span>
      {percent.replace(/^[+-]/, "")}
    </span>
  );
}

function DashboardCard({ metric }: { readonly metric: DashboardMetric }) {
  return (
    <div className="flex flex-col rounded-xl border border-border-color bg-surface p-6 gap-4 relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <p className="text-slate-400 text-[14px] font-[500] flex items-center gap-2">
          {metric.title}
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </p>
        <TrendBadge percent={metric.changePercent} direction={metric.changeDirection} />
      </div>

      <p className="text-white text-[30px] font-[700] tracking-tight leading-tight">
        {metric.value}
      </p>

      <div className="mt-2">
        <SparklineChart data={metric.sparkline} color={metric.barColor} />
      </div>
    </div>
  );
}

export default function NetworkDashboard() {
  return (
    <section className="w-full flex justify-center px-6 [@media(max-width:1000px)]:px-4 py-[80px] [@media(max-width:640px)]:py-[50px]">
      <div className="w-full max-w-[1200px] flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-[24px] font-[700] tracking-tight">
            Network Status
          </h2>
          <span className="flex items-center gap-2 text-[12px] font-[500] text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            System Operational
          </span>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 [@media(min-width:1024px)]:grid-cols-3 gap-4">
          {DASHBOARD_METRICS.map((metric) => (
            <DashboardCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
