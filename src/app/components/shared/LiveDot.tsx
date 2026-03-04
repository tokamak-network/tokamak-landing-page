export default function LiveDot() {
  return (
    <span className="relative flex h-[8px] w-[8px]">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#28a745] opacity-75" />
      <span className="relative inline-flex rounded-full h-[8px] w-[8px] bg-[#28a745]" />
    </span>
  );
}
