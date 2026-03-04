export interface DashboardMetric {
  readonly id: string;
  readonly title: string;
  readonly value: string;
  readonly changePercent: string;
  readonly changeDirection: "up" | "down";
  readonly sparkline: readonly number[];
  readonly barColor: string;
}
