import { useState, useEffect } from "react";

export const useIsMobile = (breakpoint: number = 640) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 초기 체크
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkIsMobile();

    // resize 이벤트 리스너
    window.addEventListener("resize", checkIsMobile);

    // 클린업
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, [breakpoint]);

  return { isMobile };
};
