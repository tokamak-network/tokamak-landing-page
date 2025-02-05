"use client";

import { useIsMobile } from "@/app/hooks/layout/useIsMobile";

export default function SectionHeader() {
  const { isMobile } = useIsMobile(550);

  return (
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
  );
}
