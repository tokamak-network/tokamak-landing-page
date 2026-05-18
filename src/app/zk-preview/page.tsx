export const dynamic = "force-dynamic";

import ZkHero from "../components/ui/sections/zk-hero";

export default function ZkPreviewPage() {
  return (
    <main className="bg-black min-h-screen text-white">
      <ZkHero />

      {/* Spacer so we know the hero section ends */}
      <section className="flex h-screen items-center justify-center">
        <div className="text-center font-mono text-cyan-400/40 text-xs tracking-[0.3em]">
          ↑ HERO ENDS · next section goes here
        </div>
      </section>
    </main>
  );
}
