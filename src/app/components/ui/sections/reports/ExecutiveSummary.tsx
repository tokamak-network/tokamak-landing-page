export default function ExecutiveSummary({
  headline,
  narrative,
}: {
  headline: string;
  narrative: string;
}) {
  if (!headline && !narrative) return null;

  const paragraphs = narrative
    ? narrative.split("\n\n").filter((p) => p.trim())
    : [];

  return (
    <div className="flex flex-col gap-[16px]">
      <span className="text-[11px] font-[700] text-[#0078FF] uppercase tracking-[0.05em]">
        Executive Summary
      </span>

      {headline && (
        <h2 className="text-[24px] [@media(max-width:640px)]:text-[20px] font-[700] text-white leading-[1.3]">
          {headline}
        </h2>
      )}

      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#434347] to-transparent" />

      {paragraphs.length > 0 && (
        <div className="flex flex-col gap-[12px]">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-[15px] text-[#c5c5ca] leading-[1.8]"
            >
              {p}
            </p>
          ))}
        </div>
      )}

      {narrative && paragraphs.length === 0 && (
        <p className="text-[15px] text-[#c5c5ca] leading-[1.8]">{narrative}</p>
      )}
    </div>
  );
}
