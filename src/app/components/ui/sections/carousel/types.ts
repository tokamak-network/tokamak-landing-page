export interface CarouselDisplayProps {
  category: "Price" | "Supply" | "Staking";
  datas: {
    label: string;
    info: number;
    currency: string | number;
    conversion?: string | number;
    usdValue?: number;
  }[];
}
