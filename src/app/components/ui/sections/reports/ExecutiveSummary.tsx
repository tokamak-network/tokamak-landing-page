export default function ExecutiveSummary({
  headline,
  narrative,
}: {
  headline: string;
  narrative: string;
}) {
  if (!headline && !narrative) return null;

  return (
    <div className="flex flex-col gap-[12px]">
      <h2 className="text-[20px] font-[600] text-[#1C1C1C]">
        Executive Summary
      </h2>
      {headline && (
        <p className="text-[16px] font-[500] text-[#1C1C1C] leading-[1.5]">
          {headline}
        </p>
      )}
      {narrative && (
        <p className="text-[14px] text-[#444] leading-[1.7]">{narrative}</p>
      )}
    </div>
  );
}
