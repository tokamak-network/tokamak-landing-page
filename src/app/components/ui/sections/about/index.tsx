import GetInvolve from "./GetInvolve";
import TeamGrid from "./TeamGrid";
import { CLIP_PATHS } from "@/app/constants/styles";

export default function About() {
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
      <div className="flex justify-center w-full py-[60px] px-[24px] bg-[#1C1C1C]">
        <div className="flex flex-col justify-between items-center h-[64px]  text-white text-center gap-y-[9px]">
          <span className="text-[30px] leading-[30px]">
            We are networking the
            <span className="font-bold [@media(max-width:650px)]:block">
              {" "}
              Layer 2 networks
            </span>
          </span>
          <span className="text-[15px]">
            Learn more about who we are and what we are building in Tokamak
            Network
          </span>
        </div>
      </div>
      <div className="relative bg-[#1c1c1c]">
        <div
          className="flex flex-col items-center pt-[60px] pb-[120px] gap-y-[90px] relative bg-white"
          style={{
            clipPath: CLIP_PATHS.polygon,
          }}
        >
          <TeamGrid />
          <div className="flex justify-center w-full">
            <GetInvolve />
          </div>
        </div>
      </div>
    </div>
  );
}
