"use client";

import { useState, useRef } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

export default function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    // 약간의 지연 시간을 두어 마우스가 이동할 시간을 줌
    // 툴팁 영역으로 이동 시 isVisible 유지
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100); // 100ms의 지연 시간
  };

  return (
    <div className="relative inline-block">
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>

      {isVisible && (
        <div
          className="absolute z-50 bg-white border border-[#DEDEDE] text-[13px] leading-[18px] text-[#252525] bottom-[calc(100%+10px)] left-1/2 transform -translate-x-1/2 p-[9px]"
          style={{
            minWidth: "max-content",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="inline-block leading-[normal]">{content}</div>
          <div className="absolute w-[10px] h-[10px] bg-white border-b border-r border-[#DEDEDE] bottom-[-6px] left-1/2 transform -translate-x-1/2 rotate-45"></div>
        </div>
      )}
    </div>
  );
}
