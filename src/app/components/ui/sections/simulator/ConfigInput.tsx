"use client";

import type { ReactNode } from "react";

interface ConfigInputProps {
  readonly title: string;
  readonly placeholder: string;
  readonly icon: ReactNode;
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export default function ConfigInput({
  title,
  placeholder,
  icon,
  value,
  onChange,
}: ConfigInputProps) {
  return (
    <div className="flex items-center gap-4 bg-black/60 border border-[#434347] p-4 focus-within:border-primary transition-colors duration-300 group">
      <div className="w-10 h-10 bg-primary/20 text-primary flex items-center justify-center group-focus-within:bg-primary group-focus-within:text-black transition-colors duration-300 flex-shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <p className="text-white text-[14px] font-[700] leading-tight uppercase tracking-[0.04em]">
          {title}
        </p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent text-[#c5c5ca] text-[12px] outline-none placeholder:text-[#929298]/60 w-full"
        />
      </div>
    </div>
  );
}
