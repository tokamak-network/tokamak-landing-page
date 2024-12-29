import { useState, useEffect } from "react";

export const useVisibilityChange = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleVisibilityChange = () => {
      setIsVisible(window.document.visibilityState === "visible");
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
};
