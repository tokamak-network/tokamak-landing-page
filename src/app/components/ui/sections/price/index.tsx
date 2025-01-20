"use client";

import { useFocus } from "@/context/FocusContext";

import { CLIP_PATHS } from "@/app/constants/styles";
import PriceDashboard from "./PriceDashboard";
import { useIsMobile } from "@/app/hooks/layout/useIsMobile";

export default function Price() {
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
          <span className="text-[30px] leading-[30px] [@media(max-width:650px)]:text-[24px] [@media(max-width:650px)]:leading-[24px]">
            Tokamak Network Tokenomics Dashboard
          </span>
          {isMobile ? (
            <span className="text-[12px] w-full max-w-[312px]">
              A more comprehensive dashboard showing TON(Tokamak) token details
              and other liquidity metrics with easy explanations.
            </span>
          ) : (
            <span className="text-[15px] [@media(max-width:650px)]:text-[12px]">
              A more comprehensive dashboard showing TON(Tokamak) token details
              and other liquidity metrics with easy explanations.
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
          <PriceDashboard />
        </div>
      </div>
    </div>
  );
}
