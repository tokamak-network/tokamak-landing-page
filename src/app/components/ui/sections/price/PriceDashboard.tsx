import DashboardHeader from "./DashboardHeader";
import DashboardGrid from "./DashboardGrid";

export default function PriceDashboard() {
  return (
    <div
      className="flex flex-col w-full max-w-[995px] 
                gap-y-[90px] 
                [@media(max-width:760px)]:gap-y-[60px] 
                [@media(max-width:995px)]:[@media(min-width:500px)]:px-[60px] 
                [@media(max-width:499px)]:px-[15px]"
    >
      <DashboardHeader />
      <DashboardGrid />
    </div>
  );
}
