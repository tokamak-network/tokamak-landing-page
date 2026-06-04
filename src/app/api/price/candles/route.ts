import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
// We rely on per-fetch Next.js data cache, not route-level dynamic flags.

const RANGES = {
  "24h": { path: "minutes/60", count: 24 },
  "7d": { path: "days", count: 7 },
  "30d": { path: "days", count: 30 },
  "90d": { path: "days", count: 90 },
  "1y": { path: "weeks", count: 52 },
} as const;

type Range = keyof typeof RANGES;

interface UpbitCandle {
  trade_price: number;
  candle_date_time_kst?: string;
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("range") as Range | null;
  const range = (raw && raw in RANGES ? raw : "24h") as Range;
  const cfg = RANGES[range];

  try {
    // Both fetches use Next's data cache — the same URL is fetched at most
    // once per `revalidate` window, then served from the platform cache to
    // every subsequent request (across users + warm instances).
    const [candleRes, fxRes] = await Promise.all([
      fetch(
        `https://api.upbit.com/v1/candles/${cfg.path}?market=KRW-tokamak&count=${cfg.count}`,
        { next: { revalidate: 60, tags: ["ton-candles"] } }
      ),
      fetch("https://open.er-api.com/v6/latest/KRW", {
        next: { revalidate: 3600, tags: ["fx-rate"] },
      }),
    ]);

    if (!candleRes.ok) {
      return NextResponse.json(
        { series: [], range, error: `Upbit ${candleRes.status}` },
        { status: 502 }
      );
    }
    if (!fxRes.ok) {
      return NextResponse.json(
        { series: [], range, error: `FX ${fxRes.status}` },
        { status: 502 }
      );
    }

    const candles = (await candleRes.json()) as UpbitCandle[];
    const fx = (await fxRes.json()) as { rates?: { USD?: number } };
    const krwToUsd = fx.rates?.USD;
    if (typeof krwToUsd !== "number" || !Number.isFinite(krwToUsd)) {
      return NextResponse.json(
        { series: [], range, error: "invalid FX rate" },
        { status: 502 }
      );
    }

    // Upbit returns newest → oldest; reverse for chronological series.
    const series = candles
      .map((c) => c.trade_price * krwToUsd)
      .reverse();

    return NextResponse.json({ range, series });
  } catch (e) {
    console.error("[/api/price/candles] failed:", e);
    return NextResponse.json(
      { series: [], range, error: "fetch failed" },
      { status: 500 }
    );
  }
}
