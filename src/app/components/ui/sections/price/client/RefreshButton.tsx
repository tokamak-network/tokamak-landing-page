"use client";

import { refreshPriceData } from "@/app/lib/price/fetchPriceData";
import Image from "next/image";
import { useState } from "react";
import refreshIcon from "@/assets/icons/price/refresh.svg";
import refreshIconHover from "@/assets/icons/price/refresh_hover.svg";

export function RefreshButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await refreshPriceData();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isLoading}
      className="w-[136px] h-[33px] border border-tokamak-black rounded-[16.5px] flex items-center px-[12px] gap-x-[9px] text-[14px] hover:bg-tokamak-black hover:text-white transition-colors group"
    >
      <Image
        src={refreshIcon}
        alt={"refresh icon"}
        className={`group-hover:hidden ${isLoading ? "animate-spin" : ""}`}
      />
      <Image
        src={refreshIconHover}
        alt={"refresh icon hover"}
        className="hidden group-hover:block"
      />
      {isLoading ? "Updating..." : "Live Update"}
    </button>
  );
}
