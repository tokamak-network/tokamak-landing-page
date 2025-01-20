"use client";

import { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

export default function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible && (
        <div
          className="absolute z-50 bg-white border border-[#DEDEDE] text-[13px] leading-[18px] text-[#252525] bottom-[calc(100%+10px)] left-1/2 transform -translate-x-1/2 p-[9px]"
          style={{
            minWidth: "max-content",
          }}
        >
          <div className="inline-block leading-[normal]">{content}</div>
          <div className="absolute w-[10px] h-[10px] bg-white border-b border-r border-[#DEDEDE] bottom-[-6px] left-1/2 transform -translate-x-1/2 rotate-45"></div>
        </div>
      )}
    </div>
  );
}
