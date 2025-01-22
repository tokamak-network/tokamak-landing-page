import { CLIP_PATHS } from "@/app/constants/styles";
import PriceDashboard from "./PriceDashboard";
import SectionHeader from "./client/SectionHeader";
import { FocusedBackground } from "./client/FocusedBackground";

export default function Price() {
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
      <FocusedBackground>
        <PriceDashboard />
      </FocusedBackground>
    </div>
  );
}
