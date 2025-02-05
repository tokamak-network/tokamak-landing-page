"use client";
import { CLIP_PATHS } from "@/app/constants/styles";
import { useFocus } from "@/context/FocusContext";

export function FocusedBackground({ children }: { children: React.ReactNode }) {
  const { isFocused } = useFocus();
  return (
    <div
      className="relative bg-[#1c1c1c]"
      style={{
        background: isFocused
          ? "linear-gradient(to bottom, transparent 50%, #0078ff 50%)"
          : "",
      }}
    >
      <div
        className="flex flex-col items-center pb-[120px] gap-y-[90px] relative bg-white"
        style={{
          clipPath: CLIP_PATHS.polygon,
        }}
      >
        {children}
      </div>
    </div>
  );
}
