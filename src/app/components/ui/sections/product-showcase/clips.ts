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
    id: "thanos",
    name: "Thanos L2",
    category: "Infrastructure",
    description:
      "ZK-secured optimistic rollup forming the backbone of the Tokamak network.",
    url: "https://thanos.tokamak.network",
    color: "#00e5ff",
  },
  {
    id: "ton-starter",
    name: "TON Starter",
    category: "Tooling",
    description:
      "A launchpad for builders to ship and grow on the Tokamak network.",
    url: "https://ton-starter.tokamak.network",
    color: "#22c55e",
  },
  {
    id: "explorer",
    name: "Block Explorer",
    category: "Tooling",
    description:
      "An indexed, real-time view of every transaction on Thanos L2.",
    url: "https://explorer.tokamak.network",
    color: "#f97316",
  },
  {
    id: "bridge",
    name: "Native Bridge",
    category: "Bridge",
    description:
      "Secure, audited asset transfer between Ethereum mainnet and Thanos L2.",
    url: "https://bridge.tokamak.network",
    color: "#3b82f6",
  },
  {
    id: "swap",
    name: "Tokamak Swap",
    category: "DeFi",
    description:
      "Onchain DEX with native L2 routing and deep liquidity for ecosystem assets.",
    url: "https://swap.tokamak.network",
    color: "#ec4899",
  },
  {
    id: "governance",
    name: "Governance Hub",
    category: "DAO",
    description:
      "Onchain proposals, voting, and treasury operations for the DAO.",
    url: "https://gov.tokamak.network",
    color: "#eab308",
  },
];
