interface SparklineChartProps {
  readonly data: readonly number[];
  readonly color?: string;
}

export function SparklineChart({
  data,
  color = "#0078FF",
}: SparklineChartProps) {
  const max = Math.max(...data);

  return (
    <div className="flex items-end gap-[2px] h-[32px] w-full">
      {data.map((value, i) => {
        const heightPercent = max > 0 ? (value / max) * 100 : 0;
        const isLast = i === data.length - 1;
        return (
          <div
            key={`bar-${i}`}
            className="flex-1 rounded-[1px] min-w-[3px]"
            style={{
              height: `${Math.max(heightPercent, 4)}%`,
              backgroundColor: isLast ? color : `${color}40`,
            }}
          />
        );
      })}
    </div>
  );
}
