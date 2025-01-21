// import { useFocus } from "@/context/FocusContext";
import { CLIP_PATHS } from "@/app/constants/styles";
import PriceDashboard from "./PriceDashboard";
import SectionHeader from "./SectionHeader";

export default function Price() {
  // const { isFocused } = useFocus();

  return (
    <div className="w-full h-full text-[#1C1C1C]">
      {/* TOP AREA FOR CLIP PATH */}
      <div className="relative w-full h-[134px] bg-[#1c1c1c]">
        <div
          style={{
            clipPath: CLIP_PATHS.bottomCutCorners,
            backgroundColor: "white",
          }}
          className="absolute inset-0 bg-white"
        ></div>
      </div>
      <SectionHeader />
      <div
        className="relative bg-[#1c1c1c]"
        // style={{
        //   background: isFocused
        //     ? "linear-gradient(to bottom, transparent 50%, #0078ff 50%)"
        //     : "",
        // }}
      >
        <div
          className="flex flex-col items-center pt-[60px] pb-[120px] gap-y-[90px] relative bg-white"
          style={{
            clipPath: CLIP_PATHS.polygon,
          }}
        >
          <PriceDashboard />
        </div>
      </div>
    </div>
  );
}
