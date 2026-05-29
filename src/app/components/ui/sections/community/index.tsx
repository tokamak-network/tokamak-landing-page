import { LINKS } from "@/app/constants/links";
import LazyVideo from "@/app/components/shared/LazyVideo";

interface Channel {
  id: "telegram" | "discord";
  name: string;
  tagline: string;
  description: string;
  href: string;
  /** Brand accent — used for glow, border highlight, dot pulse, icon. */
  color: string;
  /** Handle / username surfaced as a small label. */
  handle: string;
  /** Optional ambient background video (mp4). */
  videoSrc?: string;
  /** Optional poster image shown before video loads. */
  videoPoster?: string;
}

const CHANNELS: Channel[] = [
  {
    id: "telegram",
    name: "Telegram",
    tagline: "Announcements & dev chat.",
    description:
      "Real-time signal from the core team — releases, AMAs, and quick technical answers.",
    href: LINKS.TELEGRAM,
    color: "#229ED9",
    handle: "t.me/tokamak_network",
    videoSrc: "/community/telegram.mp4",
    videoPoster: "/community/telegram-poster.jpeg",
  },
  {
    id: "discord",
    name: "Discord",
    tagline: "Hang out with builders.",
    description:
      "Where ecosystem teams, contributors, and stakers gather around proposals and project work.",
    href: LINKS.DISCORD,
    color: "#5865F2",
    handle: "discord.gg/tokamak",
    videoSrc: "/community/discord.mp4",
    videoPoster: "/community/discord-poster.jpeg",
  },
];

export default function Community() {
  return (
    <section
      className="relative w-full bg-black py-20 sm:py-28 px-4 sm:px-6"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      {/* Header — matches ProjectBento / LatestFeed eyebrow + title style */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-3 mb-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
          <span
            className="text-[10px] sm:text-[11px] tracking-[0.5em] text-[#7AB0FF]/85 uppercase"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Community
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
        </div>
        <h2
          className="text-4xl sm:text-6xl lg:text-7xl text-white tracking-[-0.04em] leading-[0.95]"
          style={{ fontWeight: 900 }}
        >
          Join the{" "}
          <em className="not-italic text-[#7AB0FF]">conversation</em>.
        </h2>
      </div>

      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-5 md:grid-cols-2">
        {CHANNELS.map((c) => (
          <CommunityCard key={c.id} channel={c} />
        ))}
      </div>
    </section>
  );
}

function CommunityCard({ channel }: { channel: Channel }) {
  return (
    <a
      href={channel.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-2xl border bg-[#040814] p-6 sm:p-8 transition-all hover:scale-[1.005]"
      style={{
        borderColor: `${channel.color}33`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Ambient background video (optional, per channel) — viewport-gated. */}
      {channel.videoSrc && (
        <LazyVideo
          src={channel.videoSrc}
          poster={channel.videoPoster}
          className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-500 group-hover:opacity-85"
          style={{ filter: "saturate(0.9) contrast(1.05)" }}
        />
      )}
      {/* Dark wash for legibility on top of video */}
      {channel.videoSrc && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#040814]/85 via-[#040814]/55 to-[#040814]/85"
        />
      )}

      {/* Brand-color glow that intensifies on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse 70% 80% at 80% 20%, ${channel.color}33 0%, ${channel.color}11 40%, transparent 75%)`,
        }}
      />

      {/* Top row — handle label + live dot + arrow */}
      <div className="relative z-10 mb-10 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
            style={{
              background: channel.color,
              boxShadow: `0 0 8px ${channel.color}`,
            }}
          />
          <span
            className="text-[10px] tracking-[0.32em] uppercase font-semibold text-white/70"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            {channel.handle}
          </span>
        </div>
        <span
          className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M4 10L10 4M10 4H5M10 4V9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {/* Brand glyph */}
      <div
        className="relative z-10 mb-8"
        style={{ color: channel.color }}
        aria-hidden
      >
        {channel.id === "telegram" ? <TelegramGlyph /> : <DiscordGlyph />}
      </div>

      {/* Name + tagline + description */}
      <div className="relative z-10">
        <h3
          className="leading-[0.95] tracking-[-0.03em] text-white uppercase"
          style={{
            fontWeight: 900,
            fontSize: "clamp(32px, 3.6vw, 52px)",
          }}
        >
          {channel.name}
        </h3>
        <p
          className="mt-3 text-[15px] sm:text-base font-medium"
          style={{ color: channel.color }}
        >
          {channel.tagline}
        </p>
        <p className="mt-2 max-w-md text-sm text-white/55 leading-relaxed">
          {channel.description}
        </p>
      </div>
    </a>
  );
}

function TelegramGlyph() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="opacity-90"
    >
      <path d="M21.954 2.293 1.59 10.157c-1.39.557-1.382 1.331-.254 1.677l5.226 1.63 12.087-7.625c.571-.348 1.094-.16.665.221L9.523 14.876l-.001.002.001-.001-.36 5.396c.529 0 .762-.242 1.058-.529l2.539-2.469 5.281 3.901c.973.535 1.673.26 1.915-.902l3.465-16.331c.355-1.426-.544-2.071-1.467-1.65Z" />
    </svg>
  );
}

function DiscordGlyph() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="opacity-90"
    >
      <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3a14.55 14.55 0 0 0-.617 1.265 18.27 18.27 0 0 0-5.487 0A14.66 14.66 0 0 0 9.832 3a19.74 19.74 0 0 0-3.76 1.369C2.79 9.04 1.88 13.6 2.34 18.085a19.86 19.86 0 0 0 6.04 3.05c.488-.66.92-1.36 1.29-2.099a12.84 12.84 0 0 1-2.03-.97c.171-.124.338-.253.5-.386 3.928 1.793 8.18 1.793 12.054 0 .164.134.331.263.5.386a12.82 12.82 0 0 1-2.034.972c.37.738.802 1.438 1.29 2.098a19.78 19.78 0 0 0 6.041-3.05c.532-5.246-.91-9.764-3.673-13.717ZM9.32 15.348c-1.183 0-2.153-1.099-2.153-2.45 0-1.352.953-2.452 2.153-2.452 1.2 0 2.17 1.105 2.153 2.452 0 1.351-.953 2.45-2.153 2.45Zm5.36 0c-1.183 0-2.153-1.099-2.153-2.45 0-1.352.953-2.452 2.153-2.452 1.2 0 2.17 1.105 2.153 2.452 0 1.351-.953 2.45-2.153 2.45Z" />
    </svg>
  );
}
