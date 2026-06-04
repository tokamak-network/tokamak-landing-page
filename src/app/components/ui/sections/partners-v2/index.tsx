import Image from "next/image";
import LazyVideo from "@/app/components/shared/LazyVideo";

import EfgOff from "@/assets/partners/name=efg, Hover=off.svg";
import SKYOff from "@/assets/partners/name=SKY, Hover=off.svg";
import PolygonOff from "@/assets/partners/name=Polygon, Hover=off.svg";
import METEROff from "@/assets/partners/name=METER, Hover=off.svg";
import DSRVOff from "@/assets/partners/name=DSRV, Hover=off.svg";
import BounceOff from "@/assets/partners/name=Bounce, Hover=off.svg";
import PaycoinOff from "@/assets/partners/name=paycoin, Hover=off.svg";
import BifROSTOff from "@/assets/partners/name=BIFROST, Hover=off.svg";
import KdacOff from "@/assets/partners/name=kdac, Hover=off.svg";
import DcentOff from "@/assets/partners/name=dcent, Hover=off.svg";
import OzysOff from "@/assets/partners/name=ozys, Hover=off.svg";
import PanonyOff from "@/assets/partners/name=panony, Hover=off.svg";
import StakedOff from "@/assets/partners/name=Staked, Hover=off.svg";
import ChainlinkOff from "@/assets/partners/name=chainlink, Hover=off.svg";
import DespreadOff from "@/assets/partners/name=despread, Hover=off.svg";
import DecipherOff from "@/assets/partners/name=decipher, Hover=off.svg";
import CiphersOff from "@/assets/partners/name=ciphers, Hover=off.svg";
import OneHundredOff from "@/assets/partners/name=100n100, Hover=off.svg";
import BLOCOREOff from "@/assets/partners/name=BLOCORE, Hover=off.svg";
import AlphainOff from "@/assets/partners/name=Alphain Ventures, Hover=off.svg";
import SkytaleOff from "@/assets/partners/name=Skytale Capital, Hover=off.svg";

type Partner = {
  name: string;
  logo: string;
  link?: string;
};

const partners: Partner[] = [
  { name: "EFG", logo: EfgOff, link: "https://medium.com/tokamak-network/vitalik-buterins-big-announcements-about-plasma-evm-tokamak-network-636dc11ea257" },
  { name: "SKY", logo: SKYOff, link: "https://sky.money" },
  { name: "Polygon", logo: PolygonOff, link: "https://polygon.technology" },
  { name: "METER", logo: METEROff, link: "https://meter.io" },
  { name: "DSRV", logo: DSRVOff, link: "https://www.dsrvlabs.com" },
  { name: "Bounce", logo: BounceOff, link: "https://bounce.finance" },
  { name: "Paycoin", logo: PaycoinOff, link: "https://payprotocol.io" },
  { name: "BiFROST", logo: BifROSTOff, link: "https://thebifrost.io" },
  { name: "KDAC", logo: KdacOff, link: "https://www.kdac.io/" },
  { name: "D'CENT", logo: DcentOff, link: "https://dcentwallet.com" },
  { name: "Ozys", logo: OzysOff, link: "https://orbitchain.io" },
  { name: "Panony", logo: PanonyOff, link: "https://www.panony.com" },
  { name: "Staked", logo: StakedOff, link: "https://staked.us" },
  { name: "Chainlink", logo: ChainlinkOff, link: "https://chain.link" },
  { name: "Despread", logo: DespreadOff, link: "https://www.despread.io" },
  { name: "Decipher", logo: DecipherOff, link: "https://medium.com/decipher-media" },
  { name: "Ciphers", logo: CiphersOff },
];

const backedBy: Partner[] = [
  { name: "100N100", logo: OneHundredOff, link: "http://100and100capital.com" },
  { name: "BLOCORE", logo: BLOCOREOff, link: "https://www.blocore.com" },
  { name: "Alphain Ventures", logo: AlphainOff },
  { name: "Skytale Capital", logo: SkytaleOff },
];

const GRADIENTS: Array<[string, string]> = [
  ["#7C3AED", "#EC4899"], // purple → pink
  ["#06B6D4", "#14B8A6"], // cyan → teal
  ["#F97316", "#FBBF24"], // orange → yellow
  ["#84CC16", "#10B981"], // lime → emerald
  ["#3B82F6", "#6366F1"], // blue → indigo
  ["#D946EF", "#8B5CF6"], // magenta → violet
  ["#F43F5E", "#EF4444"], // rose → red
  ["#38BDF8", "#0EA5E9"], // sky → sapphire
];

const NOISE_DATA_URL =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")";

const MONO_STYLE = { fontFamily: "var(--font-geist-mono), monospace" } as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
      <span
        className="text-[10px] sm:text-[11px] tracking-[0.4em] text-[#7AB0FF]/90 uppercase"
        style={MONO_STYLE}
      >
        {children}
      </span>
    </div>
  );
}

function AuroraTile({ p, idx }: { p: Partner; idx: number }) {
  const [c1, c2] = GRADIENTS[idx % GRADIENTS.length];

  const body = (
    <div
      className="group relative aspect-square overflow-hidden rounded-sm border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_70px_-25px_rgba(0,0,0,0.7)]"
      style={{
        background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
      }}
    >
      {/* Aurora glow overlay (radial highlights) */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-screen opacity-60 transition-opacity duration-500 group-hover:opacity-90"
        style={{
          background: `radial-gradient(circle at 28% 22%, ${c2}66 0%, transparent 55%), radial-gradient(circle at 78% 82%, ${c1}66 0%, transparent 55%)`,
        }}
      />

      {/* Inner glass highlight */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.18)",
        }}
      />

      {/* Grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: NOISE_DATA_URL }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 py-5">
        <div className="relative w-3/5 h-[36%] mb-4">
          <Image
            src={p.logo}
            alt={p.name}
            fill
            sizes="(min-width: 1024px) 18vw, (min-width: 640px) 25vw, 40vw"
            className="object-contain transition-transform duration-500 group-hover:scale-[1.06]"
            style={{
              filter:
                "brightness(0) invert(1) drop-shadow(0 2px 10px rgba(0,0,0,0.35))",
            }}
          />
        </div>
        <span
          className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-white/95 text-center"
          style={MONO_STYLE}
        >
          {p.name}
        </span>
      </div>
    </div>
  );

  if (p.link) {
    return (
      <a
        href={p.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={p.name}
      >
        {body}
      </a>
    );
  }
  return body;
}

function SectionLabel({ tag, count }: { tag: string; count: number }) {
  return (
    <div className="flex items-center gap-4 mb-6 lg:mb-8">
      <span aria-hidden className="block h-px w-8 bg-white/20" />
      <span
        className="text-[10px] tracking-[0.4em] uppercase text-white/55"
        style={MONO_STYLE}
      >
        {tag} · {String(count).padStart(2, "0")}
      </span>
      <span aria-hidden className="block h-px flex-1 bg-white/8" />
    </div>
  );
}

export default function PartnersV2() {
  return (
    <div
      className="relative w-full bg-[#02040a] text-white overflow-hidden"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      {/* Ambient blue glow — top right (matches main page tone) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[80vh] z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 75% 18%, rgba(42,114,229,0.18) 0%, rgba(42,114,229,0.06) 35%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        {/* ─── HEADER ─── */}
        <header className="px-6 sm:px-12 lg:pl-[8%] xl:pl-[10%] lg:pr-[8%] xl:pr-[10%] pt-24 lg:pt-32 pb-12 lg:pb-16">
          <Eyebrow>PARTNERS · INDEX</Eyebrow>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight max-w-[20ch]">
            Partners &amp;{" "}
            <span className="text-[#7AB0FF] drop-shadow-[0_0_28px_rgba(42,114,229,0.55)]">
              Backers
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/55 max-w-md leading-relaxed">
            The projects, researchers, and capital partners who share our bet on a more
            scalable Ethereum.
          </p>
        </header>

        {/* ─── LOGO WALL ─── */}
        <section className="px-6 sm:px-12 lg:pl-[8%] xl:pl-[10%] lg:pr-[8%] xl:pr-[10%] pb-24 lg:pb-32">
          {/* Partners */}
          <SectionLabel tag="PARTNERS" count={partners.length} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4 mb-16 lg:mb-24">
            {partners.map((p, i) => (
              <AuroraTile key={p.name} p={p} idx={i} />
            ))}
          </div>

          {/* Backed by */}
          <SectionLabel tag="BACKED BY" count={backedBy.length} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 max-w-[1100px]">
            {backedBy.map((p, i) => (
              <AuroraTile key={p.name} p={p} idx={i + partners.length} />
            ))}
          </div>
        </section>

        {/* ─── CTA: Become a Partner ─── */}
        <section className="relative overflow-hidden">
          <LazyVideo
            src="/videos/stats.mp4"
            poster="/videos/stats-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(2,4,10,0.88) 0%, rgba(2,4,10,0.55) 40%, rgba(2,4,10,0.88) 100%)",
            }}
          />
          <div className="relative z-10 px-6 sm:px-12 py-32 lg:py-40 max-w-[900px] mx-auto text-center">
            <Eyebrow>PARTNERSHIP · OPEN</Eyebrow>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] mb-6">
              Become a Partner.
            </h2>
            <p className="text-base lg:text-lg text-white/65 max-w-md mx-auto mb-10 leading-relaxed">
              Working on something that shares the bet on a sovereign, scalable Ethereum?
              We&apos;re always open.
            </p>
            <a
              href="mailto:hello@tokamak.network"
              className="inline-flex items-center gap-3 px-7 py-3 border border-[#4A8EFA]/70 text-[#7AB0FF] text-[11px] tracking-[0.25em] uppercase hover:bg-[#2A72E5]/15 hover:border-[#4A8EFA] transition-all shadow-[0_0_24px_rgba(42,114,229,0.18)] hover:shadow-[0_0_40px_rgba(42,114,229,0.35)]"
              style={MONO_STYLE}
            >
              Get in touch
              <span aria-hidden>→</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
