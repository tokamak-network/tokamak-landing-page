import { CLIP_PATHS } from "@/app/constants/styles";
import MetricCard from "./MetricCard";

const METRICS = [
  {
    label: "Active Projects",
    value: "42",
    description: "Repositories with recent activity",
    delay: 0,
  },
  {
    label: "Total Staked",
    value: "28,500,000",
    description: "TON staked across the network",
    delay: 200,
  },
  {
    label: "Code Changes",
    value: "4,898,658",
    description: "Lines changed in latest report",
    delay: 400,
  },
] as const;

export default function EcosystemDashboard() {
  return (
    <section
      className="w-full bg-[#F7F8FA] flex justify-center px-[25px] [@media(max-width:1000px)]:px-[15px] py-[90px] [@media(max-width:640px)]:py-[60px]"
      style={{ clipPath: CLIP_PATHS.polygon }}
    >
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <h2 className="text-[30px] font-[100] text-[#1C1C1C] mb-[9px] text-center">
          Ecosystem <span className="font-[600]">Dashboard</span>
        </h2>
        <p className="text-[15px] font-[300] text-[#808992] mb-[60px] text-center">
          Live metrics from the Tokamak Network ecosystem
        </p>
        <div className="flex gap-[24px] w-full [@media(max-width:800px)]:flex-col [@media(max-width:800px)]:items-center">
          {METRICS.map((metric) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              description={metric.description}
              delay={metric.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
