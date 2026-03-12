export default function YearDivider({ year }: { year: number }) {
  return (
    <div className="flex items-center gap-[12px] pt-[32px] pb-[12px]">
      <span className="text-[13px] font-[600] text-[#929298] whitespace-nowrap">
        {year}
      </span>
      <div className="h-[1px] bg-[#434347] flex-1" />
    </div>
  );
}
