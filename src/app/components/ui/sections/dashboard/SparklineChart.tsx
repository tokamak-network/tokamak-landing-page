interface SparklineChartProps {
  readonly data: readonly number[];
  readonly color?: string;
}

export function SparklineChart({
  data,
  color = "#135bec",
}: SparklineChartProps) {
  const max = Math.max(...data);
  const steps = data.length;

  return (
    <div className="flex items-end gap-1 h-10 w-full opacity-60 group-hover:opacity-100 transition-opacity">
      {data.map((value, i) => {
        const heightPercent = max > 0 ? (value / max) * 100 : 0;
        const opacity = 0.2 + (i / (steps - 1)) * 0.8;
        return (
          <div
            key={`bar-${i}`}
            className="w-full rounded-t min-w-[3px]"
            style={{
              height: `${Math.max(heightPercent, 4)}%`,
              backgroundColor: color,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
}
