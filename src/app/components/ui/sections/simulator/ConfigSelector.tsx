"use client";

interface ConfigOption {
  readonly label: string;
  readonly value: string;
}

interface ConfigSelectorProps {
  readonly title: string;
  readonly options: readonly ConfigOption[];
  readonly selected: string;
  readonly onSelect: (value: string) => void;
  readonly disabled?: boolean;
}

export default function ConfigSelector({
  title,
  options,
  selected,
  onSelect,
  disabled = false,
}: ConfigSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-[500] text-white/60 uppercase tracking-wider">
        {title}
      </span>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(option.value)}
              className={`px-4 py-2 rounded-[10px] text-[14px] font-[500] transition-all duration-200 border
                ${
                  isSelected
                    ? "bg-[#0078FF] text-white border-[#0078FF] shadow-[0_0_12px_rgba(0,120,255,0.3)]"
                    : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:border-white/40"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
