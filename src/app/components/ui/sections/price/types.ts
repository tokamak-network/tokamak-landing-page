export type DashboardItem = {
  title: string;
  gridCols: number;
  subItems: {
    value: string;
    unit: string;
    subText: string;
    tooltip?: React.ReactNode;
    link?: string;
  }[];
};
