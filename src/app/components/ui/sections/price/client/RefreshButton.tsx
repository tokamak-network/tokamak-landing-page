"use client";

import { refreshPriceData } from "@/app/lib/price/fetchPriceData";
import Image from "next/image";
import { useState } from "react";
import refreshIcon from "@/assets/icons/price/refresh.svg";
import refreshIconHover from "@/assets/icons/price/refresh_hover.svg";

export function RefreshButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    setIsClicked(true);
    try {
      await refreshPriceData();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[136px] h-[33px] relative">
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        onMouseLeave={() => setIsClicked(false)}
        className={`w-full h-full border border-tokamak-black rounded-[16.5px] flex items-center px-[12px] gap-x-[9px] text-[14px] transition-colors group
          ${
            !isClicked
              ? "hover:bg-tokamak-black hover:text-white hover:border-tokamak-black"
              : ""
          }`}
      >
        <Image
          src={refreshIcon}
          alt={"refresh icon"}
          className={`${!isClicked ? "group-hover:hidden" : ""}`}
        />
        <Image
          src={refreshIconHover}
          alt={"refresh icon hover"}
          className={`hidden ${!isClicked ? "group-hover:block" : ""}`}
        />
        {"Live Update"}
      </button>
    </div>
  );
}
