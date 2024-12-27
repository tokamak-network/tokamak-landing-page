"use client";

import { useFocus } from "@/context/FocusContext";

export default function InsightBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isFocused } = useFocus();
  return (
    <div
      className="w-full h-full"
      style={{
        background: isFocused
          ? "linear-gradient(to bottom, transparent 50%, #0078ff 50%)"
          : "",
      }}
    >
      {children}
    </div>
  );
}
