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
    <section className="relative z-10 w-full flex justify-center px-6 py-[100px] [@media(max-width:640px)]:py-[60px]">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <h2 className="text-[36px] md:text-[40px] font-[700] text-white tracking-[-0.02em] mb-4 text-center text-glow">
          Ecosystem Dashboard
        </h2>
        <p className="text-[16px] text-slate-400 mb-[60px] text-center">
          Live metrics from the Tokamak Network ecosystem
        </p>
        <div className="flex gap-6 w-full [@media(max-width:800px)]:flex-col [@media(max-width:800px)]:items-center">
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
