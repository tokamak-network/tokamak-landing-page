export interface ConsoleProduct {
  id: string;
  name: string;
  category: string;
  tagline: string;
  metric: string;
  color: string;
  url: string;
}

export const CONSOLE_PRODUCTS: ConsoleProduct[] = [
  {
    id: "thanos",
    name: "Thanos L2",
    category: "INFRASTRUCTURE",
    tagline: "ZK-secured optimistic rollup",
    metric: "LIVE · MAINNET",
    color: "#00e5ff",
    url: "https://thanos.tokamak.network",
  },
  {
    id: "staking",
    name: "DAO Staking",
    category: "STAKING",
    tagline: "Stake TON, earn seigniorage",
    metric: "12K+ STAKERS",
    color: "#a855f7",
    url: "https://staking.tokamak.network",
  },
  {
    id: "ton-starter",
    name: "TON Starter",
    category: "TOOLING",
    tagline: "Launchpad for builders",
    metric: "8 PROJECTS",
    color: "#22c55e",
    url: "https://ton-starter.tokamak.network",
  },
  {
    id: "bridge",
    name: "Native Bridge",
    category: "BRIDGE",
    tagline: "Secure L1 ↔ L2 transfer",
    metric: "24/7 UPTIME",
    color: "#3b82f6",
    url: "https://bridge.tokamak.network",
  },
  {
    id: "explorer",
    name: "Block Explorer",
    category: "TOOLING",
    tagline: "Indexed view of every tx",
    metric: "REAL-TIME",
    color: "#f97316",
    url: "https://explorer.tokamak.network",
  },
  {
    id: "swap",
    name: "Tokamak Swap",
    category: "DEFI",
    tagline: "Onchain DEX with native L2",
    metric: "$1.2M WEEKLY",
    color: "#ec4899",
    url: "https://swap.tokamak.network",
  },
  {
    id: "governance",
    name: "Governance Hub",
    category: "DAO",
    tagline: "Onchain proposals & voting",
    metric: "47 PROPOSALS",
    color: "#eab308",
    url: "https://gov.tokamak.network",
  },
];
