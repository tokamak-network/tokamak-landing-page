"use client";

import { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
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
        <div className="absolute z-50 w-[300px] p-[15px] bg-white rounded-[10px] shadow-lg border border-[#DEDEDE] text-[13px] leading-[18px] text-[#252525] bottom-[calc(100%+10px)] left-1/2 transform -translate-x-1/2">
          {content}
          <div className="absolute w-[10px] h-[10px] bg-white border-b border-r border-[#DEDEDE] bottom-[-6px] left-1/2 transform -translate-x-1/2 rotate-45"></div>
        </div>
      )}
    </div>
  );
}
