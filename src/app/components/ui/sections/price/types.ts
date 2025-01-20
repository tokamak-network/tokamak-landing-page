export type DashboardItem = {
  title: string;
  gridCols: number;
  subItems: {
    value: string;
    unit: string;
    subText: string;
    tooltip?: string;
    link?: string;
  }[];
};
