export interface ShowcaseClip {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  /** Optional local video sources (mp4 + webm). When absent, falls back to gradient placeholder. */
  videoMp4?: string;
  videoWebm?: string;
  poster?: string;
  /** Brand accent color used for placeholder gradient + CTA. */
  color: string;
}

export const SHOWCASE_CLIPS: ShowcaseClip[] = [
  {
    id: "toki",
    name: "Toki",
    category: "Staking UX",
    description:
      "Friendly staking experience with raffle gamification — built on Tokamak governance.",
    url: "https://toki.tokamak.network",
    color: "#a855f7",
    videoMp4: "/showcase/toki.mp4",
    videoWebm: "/showcase/toki.webm",
  },
  {
    id: "tokagent",
    name: "Tokagent",
    category: "AI Agent",
    description:
      "Autonomous AI agents that interact with Tokamak protocols on behalf of users.",
    url: "https://tokagent.network/",
    color: "#00e5ff",
    videoMp4: "/showcase/tokagent.mp4",
    videoWebm: "/showcase/tokagent.webm",
  },
  {
    id: "tonnel",
    name: "Tonnel",
    category: "Bridge",
    description:
      "Cross-chain tunnel connecting Tokamak to external ecosystems with ZK-secured transfers.",
    url: "https://tonnel.tokamak.network",
    color: "#3b82f6",
  },
];
