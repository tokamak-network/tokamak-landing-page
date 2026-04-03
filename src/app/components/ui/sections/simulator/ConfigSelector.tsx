"use client";

import type { ReactNode } from "react";

interface ConfigOption {
  readonly label: string;
  readonly value: string;
}

interface ConfigSelectorProps {
  readonly title: string;
  readonly subtitle: string;
  readonly icon: ReactNode;
  readonly options: readonly ConfigOption[];
  readonly selected: string;
  readonly onSelect: (value: string) => void;
  readonly disabled?: boolean;
}

export default function ConfigSelector({
  title,
  subtitle,
  icon,
  options,
  selected,
  onSelect,
  disabled = false,
}: ConfigSelectorProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        const currentIdx = options.findIndex((o) => o.value === selected);
        const nextIdx = (currentIdx + 1) % options.length;
        onSelect(options[nextIdx].value);
      }}
      className={`flex items-center justify-between gap-4 bg-black/60 border border-[#434347] p-4 hover:border-primary transition-colors duration-300 cursor-pointer group
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary/20 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors duration-300">
          {icon}
        </div>
        <div className="flex flex-col gap-0.5 text-left">
          <p className="text-white text-[14px] font-[700] leading-tight uppercase tracking-[0.04em]">
            {title}
          </p>
          <p className="text-[#929298] text-[12px]">{subtitle}</p>
        </div>
      </div>
      <span className="text-[#434347] group-hover:text-primary transition-colors duration-300 text-[18px]">
        &#x203A;
      </span>
    </button>
  );
}
