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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-white/10">
      <span className="text-white font-[500]">{title}</span>
      <div className="flex p-1 bg-black/40 rounded-lg border border-white/5">
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(option.value)}
              className={`px-4 py-2 text-[14px] font-[500] rounded-md transition-all duration-200
                ${
                  isSelected
                    ? "bg-white/10 text-white shadow-sm border border-white/10"
                    : "text-slate-300 hover:text-white border border-transparent"
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
