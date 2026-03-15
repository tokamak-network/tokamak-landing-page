"use client";

import { useRef, useState, useEffect } from "react";
import HeatmapTooltip from "./HeatmapTooltip";

interface HeatmapData {
  date: string;
  value: number;
}

interface ContributionHeatmapProps {
  data: HeatmapData[];
}

const CELL_SIZE = 14;
const CELL_GAP = 3;
const ROWS = 7;

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAY_LABELS = ["Mon", "Wed", "Fri"];

function getColorForValue(value: number): string {
  if (value === 0) return "#1a1a1d";
  if (value < 30) return "rgba(0,119,255,0.15)";
  if (value < 50) return "rgba(0,119,255,0.35)";
  if (value < 70) return "rgba(0,119,255,0.6)";
  return "rgba(0,119,255,0.9)";
}

export default function ContributionHeatmap({ data }: ContributionHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Organize data into weeks
  const weeks: HeatmapData[][] = [];
  let currentWeek: HeatmapData[] = [];

  // Get the day of week for the first date (0 = Sunday, 6 = Saturday)
  const firstDate = new Date(data[0]?.date || new Date());
  const startDay = firstDate.getDay();

  // Fill initial empty cells
  for (let i = 0; i < startDay; i++) {
    currentWeek.push({ date: "", value: 0 });
  }

  data.forEach((item) => {
    currentWeek.push(item);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Fill last week if incomplete
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push({ date: "", value: 0 });
  }
  if (currentWeek.length === 7) {
    weeks.push(currentWeek);
  }

  // Calculate month positions
  const monthPositions: { label: string; x: number }[] = [];
  let currentMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstValidDay = week.find((d) => d.date);
    if (firstValidDay) {
      const date = new Date(firstValidDay.date);
      const month = date.getMonth();
      if (month !== currentMonth) {
        currentMonth = month;
        monthPositions.push({
          label: MONTH_LABELS[month],
          x: weekIndex * (CELL_SIZE + CELL_GAP),
        });
      }
    }
  });

  const svgWidth = weeks.length * (CELL_SIZE + CELL_GAP);
  const svgHeight = ROWS * (CELL_SIZE + CELL_GAP) + 20; // Extra 20px for month labels

  return (
    <div ref={containerRef} className="w-full flex justify-center mb-16 md:mb-20">
      <div className="hidden md:block">
        <svg
          width={svgWidth + 40}
          height={svgHeight}
          className="overflow-visible"
        >
          {/* Month labels */}
          {monthPositions.map((month, i) => (
            <text
              key={i}
              x={month.x + 40}
              y={12}
              className="text-[10px] fill-[#929298] font-[500]"
            >
              {month.label}
            </text>
          ))}

          {/* Day labels */}
          {[0, 2, 4].map((dayIndex) => (
            <text
              key={dayIndex}
              x={0}
              y={20 + dayIndex * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2 + 4}
              className="text-[10px] fill-[#929298] font-[500]"
            >
              {DAY_LABELS[dayIndex / 2]}
            </text>
          ))}

          {/* Heatmap cells */}
          <g transform="translate(40, 20)">
            {weeks.map((week, weekIndex) =>
              week.map((day, dayIndex) => {
                const x = weekIndex * (CELL_SIZE + CELL_GAP);
                const y = dayIndex * (CELL_SIZE + CELL_GAP);
                const color = getColorForValue(day.value);
                const delay = weekIndex * 10;

                return (
                  <rect
                    key={`${weekIndex}-${dayIndex}`}
                    x={x}
                    y={y}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    fill={color}
                    className={`transition-opacity duration-500 cursor-pointer hover:opacity-80 ${
                      visible ? "opacity-100" : "opacity-0"
                    } motion-reduce:opacity-100 motion-reduce:transition-none`}
                    style={{
                      transitionDelay: visible ? `${delay}ms` : "0ms",
                    }}
                    onMouseEnter={(e) => {
                      if (day.date) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredCell({
                          date: day.date,
                          value: day.value,
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                        });
                      }
                    }}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                );
              })
            )}
          </g>
        </svg>

        <HeatmapTooltip
          date={hoveredCell?.date || ""}
          value={hoveredCell?.value || 0}
          x={hoveredCell?.x || 0}
          y={hoveredCell?.y || 0}
          visible={!!hoveredCell}
        />
      </div>
    </div>
  );
}
