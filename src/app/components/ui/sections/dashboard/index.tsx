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
    <section className="relative z-10 w-full flex justify-center px-6 py-[160px] [@media(max-width:640px)]:py-[80px]">
      <div className="w-full max-w-[1280px] flex flex-col items-center">
        <h2 className="text-[38px] md:text-[48px] font-[900] text-white tracking-[0.06em] uppercase mb-4 text-center">
          Ecosystem
        </h2>
        <p className="text-[16px] text-[#929298] mb-[80px] text-center">
          Live metrics from the Tokamak Network ecosystem
        </p>
        <div className="flex gap-0 w-full [@media(max-width:800px)]:flex-col [@media(max-width:800px)]:gap-[1px]">
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
