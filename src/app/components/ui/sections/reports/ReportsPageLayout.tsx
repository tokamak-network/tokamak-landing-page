"use client";

import { useFocus } from "@/context/FocusContext";
import { CLIP_PATHS } from "@/app/constants/styles";

export default function ReportsPageLayout({
  title,
  subtitle,
  contentClassName = "max-w-[800px]",
  children,
}: {
  title: React.ReactNode;
  subtitle: string;
  contentClassName?: string;
  children: React.ReactNode;
}) {
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

      {/* DARK HERO BANNER */}
      <div
        className="flex justify-center w-full py-[60px] [@media(max-width:650px)]:py-[30px] px-[24px] bg-[#1C1C1C]
        [@media(max-width:650px)]:min-h-[157px]"
      >
        <div className="flex flex-col justify-between items-center text-white text-center gap-y-[9px]">
          <span className="text-[30px] leading-[30px] [@media(max-width:650px)]:text-[24px] [@media(max-width:650px)]:leading-[24px] font-[100]">
            {title}
          </span>
          <span className="text-[15px] [@media(max-width:650px)]:text-[12px] font-[100]">
            {subtitle}
          </span>
        </div>
      </div>

      {/* WHITE CONTENT AREA */}
      <div
        className="relative bg-[#1c1c1c]"
        style={{
          background: isFocused
            ? "linear-gradient(to bottom, transparent 50%, #0078ff 50%)"
            : "",
        }}
      >
        <div
          className="flex flex-col items-center pt-[60px] pb-[120px] relative bg-white"
          style={{
            clipPath: CLIP_PATHS.polygon,
          }}
        >
          <div className={`w-full px-[24px] flex flex-col ${contentClassName}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
