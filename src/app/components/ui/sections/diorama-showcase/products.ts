export interface DioramaProduct {
  id: string;
  name: string;
  tagline: string;
  category: string;
  color: string;
  url: string;
  metric?: string;
  /** Hotspot position as % of image (0-100) */
  x: number;
  y: number;
  /** Which side to slide the detail card in from */
  cardSide: "left" | "right";
}

// 5 products, positioned to match buildings in the diorama image.
// Coordinates measured from the generated showcase-diorama.jpeg
// (eyeball estimates — tune visually in browser).
export const DIORAMA_PRODUCTS: DioramaProduct[] = [
  {
    id: "staking",
    name: "DAO Staking",
    tagline: "Stake TON, earn seigniorage rewards",
    category: "Staking",
    color: "#a855f7",
    url: "https://staking.tokamak.network",
    metric: "12k+ stakers",
    x: 11,
    y: 50,
    cardSide: "right",
  },
  {
    id: "thanos",
    name: "Thanos L2",
    tagline: "ZK-secured optimistic rollup",
    category: "Infrastructure",
    color: "#00e5ff",
    url: "https://thanos.tokamak.network",
    metric: "Live · Mainnet",
    x: 38,
    y: 32,
    cardSide: "right",
  },
  {
    id: "ton-starter",
    name: "TON Starter",
    tagline: "Launchpad for builders on Tokamak",
    category: "Tooling",
    color: "#22c55e",
    url: "https://ton-starter.tokamak.network",
    metric: "8 projects launched",
    x: 74,
    y: 25,
    cardSide: "left",
  },
  {
    id: "bridge",
    name: "Native Bridge",
    tagline: "Secure asset transfer L1 ↔ L2",
    category: "Bridge",
    color: "#3b82f6",
    url: "https://bridge.tokamak.network",
    metric: "24/7 uptime",
    x: 63,
    y: 63,
    cardSide: "left",
  },
  {
    id: "explorer",
    name: "Block Explorer",
    tagline: "Indexed view of every transaction",
    category: "Tooling",
    color: "#f97316",
    url: "https://explorer.tokamak.network",
    metric: "Real-time",
    x: 91,
    y: 60,
    cardSide: "left",
  },
];
