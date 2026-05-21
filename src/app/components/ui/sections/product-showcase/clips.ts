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
  /** Short tags surfaced in the synced meta panel. */
  tags?: string[];
}

export const SHOWCASE_CLIPS: ShowcaseClip[] = [
  {
    id: "rolluphub",
    name: "Rollup Hub",
    category: "L2 Platform",
    description:
      "Launch and manage Tokamak L2 rollups from one platform.",
    url: "https://rolluphub.tokamak.network/",
    color: "#2A72E5",
    videoMp4: "/showcase/rolluphub.mp4",
    videoWebm: "/showcase/rolluphub.webm",
    tags: ["L2", "Rollups", "Launchpad"],
  },
  {
    id: "tonnel",
    name: "Tonnel",
    category: "Bridge",
    description:
      "Cross-chain tunnel connecting Tokamak to external ecosystems with ZK-secured transfers.",
    url: "https://tonnel.tokamak.network",
    color: "#3b82f6",
    tags: ["Bridge", "ZK-secured", "Cross-chain"],
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
    tags: ["AI Agent", "Autonomous", "Onchain"],
  },
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
    tags: ["Staking", "Gamified", "Mainnet"],
  },
];
