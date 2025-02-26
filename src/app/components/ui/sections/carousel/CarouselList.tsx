"use client";

import { formatCurrencyString, formatNumber } from "@/app/lib/utils/format";
import "./carousel.css";
import { CarouselDisplayProps } from "./types";
import { useEffect, useState } from "react";
import { refreshPriceData } from "@/app/lib/price/fetchPriceData";

function CarouselItem({ category, datas }: CarouselDisplayProps) {
  const categoryTitel =
    category === "Price"
      ? "Price TODAY"
      : category === "Supply"
      ? "TON SUPPLY"
      : "TON LOCKED";

  return (
    <div className="flex items-center gap-x-[75px] w-full whitespace-nowrap">
      <h1 className="text-[21px]">{categoryTitel}</h1>
      {datas.map((data) => {
        if (data.usdValue) {
          return (
            <div className="flex items-center gap-x-[24px]" key={data.label}>
              <h2 className="opacity-[0.75] text-[13px] ">{data.label}</h2>
              <div className="flex flex-col">
                <div className="flex gap-x-[6px] items-center">
                  <strong className="text-[21px] leading-[26px]">
                    {formatNumber(data.info)}
                  </strong>
                  <p className="text-[12px] self-end leading-[15px] max-h-[15px] font-bold">
                    {formatNumber(data.currency)}
                    {data.conversion
                      ? ` / ${formatCurrencyString(data.conversion)}`
                      : ""}
                  </p>
                </div>
                <span className="text-[12px] opacity-[0.35]">
                  $ {formatNumber(data.usdValue)}
                </span>
              </div>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-x-[24px]" key={data.label}>
            <h2 className="opacity-[0.75] text-[13px]">{data.label}</h2>
            <div className="flex gap-x-[6px] items-center">
              <strong className="text-[21px]">{formatNumber(data.info)}</strong>
              <p className="text-[12px] self-end pb-[4px]">
                {formatNumber(data.currency)}
                {data.conversion
                  ? ` / ${formatCurrencyString(data.conversion)}`
                  : ""}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CarouselList({
  carouselDatas,
}: {
  carouselDatas: CarouselDisplayProps[];
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  useEffect(() => {
    refreshPriceData();
    setIsRefreshing(true);
  }, []);

  if (!isRefreshing) return null;

  return (
    <div className="flex w-full items-center slider">
      <div className="flex items-center gap-x-[120px] text-white font-bold slideTrack">
        {[
          ...carouselDatas,
          ...carouselDatas,
          ...carouselDatas,
          ...carouselDatas,
        ].map((data, index) => (
          <CarouselItem key={index} {...data} />
        ))}
      </div>
    </div>
  );
}
