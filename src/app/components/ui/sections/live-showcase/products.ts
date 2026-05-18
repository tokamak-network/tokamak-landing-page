export interface ShowcaseProduct {
  id: string;
  name: string;
  tagline: string;
  category: string;
  color: string;
  url: string;
  metric?: string;
}

// Placeholder data — replace with curated live products
export const SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
  {
    id: "thanos",
    name: "Thanos L2",
    tagline: "ZK-secured optimistic rollup",
    category: "Infrastructure",
    color: "#00e5ff",
    url: "https://thanos.tokamak.network",
    metric: "Live · Mainnet",
  },
  {
    id: "staking",
    name: "DAO Staking",
    tagline: "Stake TON, earn seigniorage rewards",
    category: "Staking",
    color: "#a855f7",
    url: "https://staking.tokamak.network",
    metric: "12k+ stakers",
  },
  {
    id: "ton-starter",
    name: "TON Starter",
    tagline: "Launchpad for builders on Tokamak",
    category: "Tooling",
    color: "#22c55e",
    url: "https://ton-starter.tokamak.network",
    metric: "8 projects launched",
  },
  {
    id: "explorer",
    name: "Block Explorer",
    tagline: "Indexed view of every transaction",
    category: "Tooling",
    color: "#f97316",
    url: "https://explorer.tokamak.network",
    metric: "Real-time",
  },
  {
    id: "bridge",
    name: "Native Bridge",
    tagline: "Secure asset transfer L1 ↔ L2",
    category: "Bridge",
    color: "#3b82f6",
    url: "https://bridge.tokamak.network",
    metric: "24/7 uptime",
  },
  {
    id: "swap",
    name: "Tokamak Swap",
    tagline: "Onchain DEX with native L2 routing",
    category: "DeFi",
    color: "#ec4899",
    url: "https://swap.tokamak.network",
    metric: "$1.2M weekly vol",
  },
  {
    id: "governance",
    name: "Governance Hub",
    tagline: "Onchain proposals and voting",
    category: "DAO",
    color: "#eab308",
    url: "https://gov.tokamak.network",
    metric: "47 proposals",
  },
];
