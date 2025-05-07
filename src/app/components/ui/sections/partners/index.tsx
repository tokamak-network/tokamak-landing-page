"use client";

import { useFocus } from "@/context/FocusContext";

import { CLIP_PATHS } from "@/app/constants/styles";
import PartnersGrid from "./PartnersGrid";
import { useIsMobile } from "@/app/hooks/layout/useIsMobile";

export default function Partners() {
  const { isFocused } = useFocus();
  const { isMobile } = useIsMobile(550);

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
        className="flex justify-center items-center w-full py-[60px]  [@media(max-width:650px)]:py-[30px] px-[24px] bg-[#1C1C1C]
        [@media(max-width:650px)]:h-[157px]
      "
      >
        <div className="flex flex-col justify-between items-center h-full text-white text-center gap-y-[9px]">
          <span className="text-[30px] leading-[30px] [@media(max-width:650px)]:text-[24px] [@media(max-width:650px)]:leading-[24px] font-[400]">
            Partners
          </span>
          {isMobile ? (
            <span className="text-[12px] w-full max-w-[312px] font-[100]">
              Tokamak Network works with a variety of partners to make Ethereum
              more scalable and provide users with a better decentralized
              application experience.
            </span>
          ) : (
            <span className="text-[15px] [@media(max-width:650px)]:text-[12px] font-[100]">
              Tokamak Network works with a variety of partners to make Ethereum
              more scalable <br /> and provide users with a better decentralized
              application experience.
            </span>
          )}
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
          <PartnersGrid />
        </div>
      </div>
    </div>
  );
}
