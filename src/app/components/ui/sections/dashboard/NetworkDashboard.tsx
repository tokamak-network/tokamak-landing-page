"use client";

import { DASHBOARD_METRICS } from "./data";
import { SparklineChart } from "./SparklineChart";
import type { DashboardMetric } from "./types";
import LiveDot from "@/app/components/shared/LiveDot";

function DashboardCard({ metric }: { readonly metric: DashboardMetric }) {
  const isPositive = metric.changeDirection === "up";

  return (
    <div className="flex flex-col justify-between p-[20px] bg-[#242424] rounded-[16px] border border-[#333] hover:border-[#0078FF]/40 transition-colors duration-200 min-h-[180px]">
      <div className="flex items-center justify-between mb-[12px]">
        <span className="text-[13px] font-[400] text-white/50 uppercase tracking-wider">
          {metric.title}
        </span>
        <LiveDot />
      </div>

      <div className="mb-[8px]">
        <span className="text-[24px] [@media(max-width:640px)]:text-[20px] font-[600] text-white leading-tight">
          {metric.value}
        </span>
      </div>

      <div className="flex items-center gap-[4px] mb-[16px]">
        <span
          className={`text-[13px] font-[500] ${
            isPositive ? "text-[#28a745]" : "text-[#cb2431]"
          }`}
        >
          {metric.changePercent}
        </span>
        <span className="text-[11px] text-white/30">vs last period</span>
      </div>

      <SparklineChart
        data={metric.sparkline}
        color={isPositive ? "#28a745" : "#cb2431"}
      />
    </div>
  );
}

export default function NetworkDashboard() {
  return (
    <section className="w-full bg-[#1C1C1C] flex justify-center px-[25px] [@media(max-width:1000px)]:px-[15px] py-[80px] [@media(max-width:640px)]:py-[50px]">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <h2 className="text-[30px] font-[100] text-white mb-[9px] text-center">
          Network <span className="font-[600]">Status</span>
        </h2>
        <p className="text-[15px] font-[300] text-white/50 mb-[50px] text-center">
          Real-time ecosystem metrics
        </p>
        <div className="w-full grid grid-cols-3 [@media(max-width:900px)]:grid-cols-2 [@media(max-width:640px)]:grid-cols-1 gap-[16px]">
          {DASHBOARD_METRICS.map((metric) => (
            <DashboardCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
