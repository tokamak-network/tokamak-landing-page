import DashboardHeader from "./DashboardHeader";
import DashboardGrid from "./DashboardGrid";

export default function PriceDashboard() {
  return (
    <div className="flex flex-col w-full max-w-[995px] gap-y-[90px] mt-[50px] max-[995px]:min-[500px]:px-[60px]">
      <DashboardHeader />
      <DashboardGrid />
    </div>
  );
}
