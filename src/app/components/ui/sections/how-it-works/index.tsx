const STEPS = [
  {
    number: "01",
    color: "text-[#22c55e]",
    title: "Choose a Preset",
    description:
      "Select General, DeFi, Gaming, or Full. Each preset defines unique genesis predeploys and module bundles optimized for your use case.",
  },
  {
    number: "02",
    color: "text-primary",
    title: "Name & Deploy",
    description:
      "Enter your chain name and pick testnet or mainnet. Keys are auto-generated, modules auto-configured. Zero extra inputs needed.",
  },
  {
    number: "03",
    color: "text-[#8b5cf6]",
    title: "Customize Later",
    description:
      "Add Telegram alerts, CoinMarketCap integration, custom domains, or upgrade your preset anytime — all post-deploy.",
  },
] as const;

export default function HowItWorks() {
  return (
    <section className="relative z-10 w-full flex justify-center px-6 pb-[160px] [@media(max-width:640px)]:pb-[80px]">
      <div className="w-full max-w-[1280px]">
        <h2 className="text-[32px] md:text-[40px] font-[900] text-white mb-3">
          How it works
        </h2>
        <p className="text-[16px] text-[#929298] mb-12">
          From preset selection to running L2 in three inputs. Everything else is automatic.
        </p>

        <div className="grid grid-cols-3 gap-6 [@media(max-width:800px)]:grid-cols-1">
          {STEPS.map((step) => (
            <div key={step.number} className="bg-surface p-8 flex flex-col gap-4">
              <span className={`text-[13px] font-[700] uppercase tracking-[0.1em] ${step.color}`}>
                STEP {step.number}
              </span>
              <h3 className="text-[22px] font-[900] text-white leading-tight">
                {step.title}
              </h3>
              <p className="text-[15px] text-[#929298] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
