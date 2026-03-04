import { Gamepad2, Coins, Building2 } from "lucide-react";
import UseCaseCard from "./UseCaseCard";

const USE_CASES = [
  {
    icon: <Gamepad2 size={24} />,
    title: "Gaming",
    description:
      "Run your game on a dedicated L2 with ultra-low latency and no congestion from other apps.",
    features: [
      "Sub-second transaction finality",
      "Custom gas token support",
      "Dedicated block space",
    ],
  },
  {
    icon: <Coins size={24} />,
    title: "DeFi",
    description:
      "Build financial protocols on a chain tailored for high-throughput trading and privacy.",
    features: [
      "MEV-resistant ordering",
      "Privacy-preserving transactions",
      "High-frequency trading support",
    ],
  },
  {
    icon: <Building2 size={24} />,
    title: "Enterprise",
    description:
      "Deploy permissioned L2s with compliance-ready configurations for institutional use.",
    features: [
      "Permissioned validator sets",
      "KYC-compatible access control",
      "Ethereum-grade security",
    ],
  },
] as const;

export default function UseCases() {
  return (
    <section className="relative z-10 w-full flex justify-center px-6 py-[100px] [@media(max-width:640px)]:py-[60px]">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <h2 className="text-[36px] md:text-[40px] font-[700] text-white tracking-[-0.02em] mb-4 text-center">
          Built for Every Use Case
        </h2>
        <p className="text-[16px] text-slate-400 mb-[60px] text-center">
          Custom L2s solve real problems across industries
        </p>
        <div className="flex gap-6 w-full [@media(max-width:800px)]:flex-col [@media(max-width:800px)]:items-center">
          {USE_CASES.map((useCase) => (
            <UseCaseCard
              key={useCase.title}
              icon={useCase.icon}
              title={useCase.title}
              description={useCase.description}
              features={useCase.features}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
