"use client";

interface ConfigOption {
  readonly label: string;
  readonly value: string;
}

interface ConfigSelectorProps {
  readonly title: string;
  readonly subtitle: string;
  readonly icon: string;
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
      className={`flex items-center justify-between gap-4 rounded-xl bg-black/40 border border-white/5 p-4 hover:border-primary/50 transition-colors cursor-pointer group
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-[20px]">
          {icon}
        </div>
        <div className="flex flex-col gap-0.5 text-left">
          <p className="text-white text-[14px] font-[700] leading-tight">{title}</p>
          <p className="text-slate-400 text-[12px]">
            {subtitle}
          </p>
        </div>
      </div>
      <span className="text-slate-500 group-hover:text-primary transition-colors text-[18px]">&#x203A;</span>
    </button>
  );
}
