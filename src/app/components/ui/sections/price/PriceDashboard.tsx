import DashboardHeader from "./DashboardHeader";
import DashboardGrid from "./DashboardGrid";
export default function PriceDashboard() {
  return (
    <div className="flex flex-col w-full max-w-[995px] gap-y-[90px]">
      <DashboardHeader />
      <DashboardGrid />
    </div>
  );
}
