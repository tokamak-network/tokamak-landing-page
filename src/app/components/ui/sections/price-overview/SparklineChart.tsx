"use client";

import { useEffect, useId, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RANGES = ["24h", "7d", "30d", "90d", "1y"] as const;
type Range = (typeof RANGES)[number];

interface Props {
  /** Initial 24h series fetched at SSR time. */
  initialSeries: number[];
  /** Spot price used as a fallback when the upstream returned nothing. */
  currentUsd: number;
}

function fmtUsd(n: number) {
  if (!Number.isFinite(n)) return "—";
  return `$${n.toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })}`;
}

/**
 * Sparkline area chart with a range selector. The initial 24h series comes
 * from SSR; switching ranges triggers a client fetch to the cached
 * /api/price/candles route (Next.js data cache deduplicates across users).
 * Change% is recomputed from the visible series so it always matches the
 * range on screen.
 */
export default function SparklineChart({ initialSeries, currentUsd }: Props) {
  const reactId = useId();
  const gradId = `sparkfill-${reactId.replace(/[:]/g, "-")}`;

  const [range, setRange] = useState<Range>("24h");
  const [series, setSeries] = useState<number[]>(initialSeries);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (range === "24h") {
      setSeries(initialSeries);
      return;
    }
    const ac = new AbortController();
    setLoading(true);
    fetch(`/api/price/candles?range=${range}`, { signal: ac.signal })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.series) && d.series.length > 0) {
          setSeries(d.series);
        }
      })
      .catch(() => {
        /* aborted or network — keep previous series */
      })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, [range, initialSeries]);

  const data =
    series.length >= 2 ? series : [currentUsd, currentUsd];
  const dataPts = data.map((v, i) => ({ i, v }));
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pad = Math.max((max - min) * 0.15, max * 0.003);

  const first = data[0];
  const last = data[data.length - 1];
  const change = first > 0 ? ((last - first) / first) * 100 : 0;
  const positive = change >= 0;
  const color = positive ? "#22C55E" : "#f87171";
  const arrow = positive ? "▲" : "▼";

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header row — label + change% + range selector */}
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div className="flex flex-col gap-1.5">
          <div
            className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] tracking-[0.32em] uppercase text-[#7AB0FF]/85 font-semibold"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            <span>Price · {range.toUpperCase()}</span>
            {loading && (
              <span className="inline-block h-1 w-1 rounded-full bg-[#7AB0FF] animate-pulse" />
            )}
          </div>
          <div
            className="text-white leading-none tracking-tight tabular-nums"
            style={{ fontWeight: 800, fontSize: "clamp(20px, 2.4vw, 30px)" }}
          >
            {fmtUsd(currentUsd)}
          </div>
          <span
            className="text-[10px] sm:text-[11px] font-semibold tracking-tight"
            style={{
              color,
              textShadow: `0 0 10px ${color}66`,
              fontFamily: "var(--font-geist-mono), monospace",
            }}
          >
            {arrow} {Math.abs(change).toFixed(2)}%{" "}
            <span className="text-white/45 ml-0.5">vs start</span>
          </span>
        </div>

        {/* Range selector pills */}
        <div
          className="inline-flex items-center gap-px rounded-full border border-white/10 bg-black/40 backdrop-blur-sm p-0.5"
          role="tablist"
          aria-label="Chart range"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {RANGES.map((r) => {
            const active = r === range;
            return (
              <button
                key={r}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setRange(r)}
                className={`px-2.5 py-1 rounded-full text-[10px] tracking-[0.22em] uppercase transition-all ${
                  active
                    ? "bg-[#4A8EFA]/25 text-[#7AB0FF] shadow-[inset_0_0_0_1px_rgba(74,142,250,0.55)]"
                    : "text-white/45 hover:text-white/85"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dataPts}
            margin={{ top: 6, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.55} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis hide dataKey="i" />
            <YAxis hide domain={[min - pad, max + pad]} />
            <Tooltip
              cursor={{
                stroke: color,
                strokeWidth: 1,
                strokeDasharray: "3 3",
                opacity: 0.5,
              }}
              content={(props) => {
                const raw = props.active && props.payload?.[0]?.value;
                const v = typeof raw === "number" ? raw : Number(raw);
                if (!Number.isFinite(v)) return null;
                return (
                  <div
                    className="rounded-lg px-3 py-2 text-[11px]"
                    style={{
                      background: "#0a0e1c",
                      border: `1px solid ${color}66`,
                      color: "white",
                      fontFamily: "var(--font-geist-mono), monospace",
                      boxShadow: `0 8px 20px -8px rgba(0,0,0,0.6), 0 0 12px ${color}33`,
                    }}
                  >
                    <div style={{ color }}>{fmtUsd(v)}</div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradId})`}
              isAnimationActive
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
