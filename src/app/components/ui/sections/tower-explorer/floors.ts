export interface Floor {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
  metric?: { value: string; unit: string };
  accent: string; // CSS color for glow/particles
}

export const FLOORS: Floor[] = [
  {
    id: "ignition",
    label: "IGNITION",
    title: "Tokamak\nFusion Core",
    description:
      "The reactor crown channels plasma energy through a toroidal magnetic field, powering the entire Tokamak Network Layer 2 ecosystem.",
    image: "/tower/tower-top.png",
    metric: { value: "14", unit: "Active Projects" },
    accent: "#00e5ff",
  },
  {
    id: "confinement",
    label: "CONFINEMENT",
    title: "On-Demand\nRollup Creation",
    description:
      "Launch your own OP Stack-based L2 chain in minutes. Thanos provides modular, production-ready rollup infrastructure.",
    image: "/tower/tower-mid.png",
    metric: { value: "1.2s", unit: "Block Time" },
    accent: "#00bcd4",
  },
  {
    id: "plasma",
    label: "PLASMA STABILITY",
    title: "Seigniorage\nStaking",
    description:
      "TON stakers earn seigniorage rewards while securing the network. A self-sustaining plasma of economic incentives.",
    image: "/tower/floor-ecosystem-1.png",
    metric: { value: "42M+", unit: "TON Staked" },
    accent: "#18ffff",
  },
  {
    id: "energy",
    label: "ENERGY RELEASE",
    title: "Cross-Chain\nBridge",
    description:
      "Seamless asset transfers between L1 and L2. Cross-trade protocol enables trustless, fast bridging across chains.",
    image: "/tower/tower-bot.png",
    metric: { value: "<3min", unit: "Bridge Time" },
    accent: "#ff6d00",
  },
  {
    id: "fusion",
    label: "FUSION COMPLETE",
    title: "The Future\nis On-Chain",
    description:
      "DAO governance, DeFi protocols, and developer tools — all powered by the Tokamak fusion reactor.",
    image: "/tower/torus-hero.png",
    accent: "#00e5ff",
  },
];
