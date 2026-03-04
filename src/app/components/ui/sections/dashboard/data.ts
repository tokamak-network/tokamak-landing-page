import type { DashboardMetric } from "./types";

export const DASHBOARD_METRICS: readonly DashboardMetric[] = [
  {
    id: "total-staked",
    title: "Total Staked",
    value: "28,500,000 TON",
    changePercent: "+2.4%",
    changeDirection: "up",
    sparkline: [40, 55, 48, 62, 58, 72, 68, 80],
  },
  {
    id: "circulating-supply",
    title: "Circulating Supply",
    value: "42,800,000 TON",
    changePercent: "-0.3%",
    changeDirection: "down",
    sparkline: [70, 68, 72, 65, 60, 58, 55, 52],
  },
  {
    id: "burned",
    title: "Burned",
    value: "1,200,000 TON",
    changePercent: "+0.8%",
    changeDirection: "up",
    sparkline: [20, 25, 30, 28, 35, 40, 38, 45],
  },
  {
    id: "biweekly-commits",
    title: "Biweekly Commits",
    value: "1,247",
    changePercent: "+12.5%",
    changeDirection: "up",
    sparkline: [30, 45, 55, 48, 60, 72, 85, 90],
  },
  {
    id: "active-projects",
    title: "Active Projects",
    value: "42",
    changePercent: "+4.8%",
    changeDirection: "up",
    sparkline: [25, 28, 30, 32, 35, 36, 38, 42],
  },
  {
    id: "dao-vault",
    title: "DAO Vault",
    value: "8,450,000 TON",
    changePercent: "+1.2%",
    changeDirection: "up",
    sparkline: [60, 62, 58, 65, 70, 68, 75, 80],
  },
] as const;
