"use client";

import { useFocus } from "@/context/FocusContext";
import { CLIP_PATHS } from "@/app/constants/styles";
import { MediumPost } from "../insight/types";
import InsightGrid from "./InsightGrid";

export default function ExploringInsight({ posts }: { posts: MediumPost[] }) {
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
          <span className="text-[30px] leading-[30px] [@media(max-width:650px)]:text-[24px] [@media(max-width:650px)]:leading-[24px]">
            Exploring
            <span className="font-bold [@media(max-width:650px)]:block">
              {" "}
              Insights
            </span>
          </span>
          <span className="text-[15px] [@media(max-width:650px)]:text-[12px]">
            Follow the news, research, and updates from Tokamak Network
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
          className="flex flex-col items-center pt-[60px] pb-[90px] gap-y-[90px] relative bg-white"
          style={{
            clipPath: CLIP_PATHS.polygon,
          }}
        >
          <InsightGrid posts={posts} />
        </div>
      </div>
    </div>
  );
}
