"use client";

import { useFocus } from "@/context/FocusContext";
import GetInvolve from "./GetInvolve";
import TeamGrid from "./TeamGrid";
import { CLIP_PATHS } from "@/app/constants/styles";

export default function Team() {
  const { isFocused } = useFocus();
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
      <div
        className="flex justify-center w-full py-[60px]  [@media(max-width:650px)]:py-[30px] px-[24px] bg-[#1C1C1C]
        [@media(max-width:650px)]:h-[157px]
      "
      >
        <div className="flex flex-col justify-between items-center h-[64px] text-white text-center gap-y-[9px]">
          <span className="text-[30px] leading-[30px] [@media(max-width:650px)]:text-[24px] [@media(max-width:650px)]:leading-[24px] font-[100]">
            We are networking the
            <span className="font-[400] [@media(max-width:650px)]:block">
              {" "}
              Layer 2 networks
            </span>
          </span>
          <span className="text-[15px] [@media(max-width:650px)]:text-[12px] font-[100]">
            Learn more about who we are and what we are building in Tokamak
            Network
          </span>
        </div>
      </div>
      <div
        className="relative bg-[#1c1c1c]"
        style={{
          background: isFocused
            ? "linear-gradient(to bottom, transparent 50%, #0078ff 50%)"
            : "",
        }}
      >
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
