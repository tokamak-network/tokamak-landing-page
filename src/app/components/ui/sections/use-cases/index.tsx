import UseCaseCard from "./UseCaseCard";

const USE_CASES = [
  {
    icon: "\u{1F3AE}",
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
    icon: "\u{1F4B0}",
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
    icon: "\u{1F3E2}",
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
    <section className="w-full bg-[#1C1C1C] flex justify-center px-[25px] [@media(max-width:1000px)]:px-[15px] py-[90px] [@media(max-width:640px)]:py-[60px]">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <h2 className="text-[30px] font-[100] text-white mb-[9px] text-center">
          Built for <span className="font-[600]">Every Use Case</span>
        </h2>
        <p className="text-[15px] font-[300] text-white/50 mb-[60px] text-center">
          Custom L2s solve real problems across industries
        </p>
        <div className="flex gap-[24px] w-full [@media(max-width:800px)]:flex-col [@media(max-width:800px)]:items-center">
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
