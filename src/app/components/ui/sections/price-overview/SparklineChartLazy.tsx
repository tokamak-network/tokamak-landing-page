"use client";

import dynamic from "next/dynamic";

// recharts (~90kB gz) is heavy and only powers this one chart on /about/price.
// Load it as a separate client chunk (ssr:false) so it stays out of the page's
// initial JS bundle — the chart hydrates in shortly after the page is ready.
const SparklineChart = dynamic(() => import("./SparklineChart"), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[240px] w-full animate-pulse rounded-2xl bg-white/[0.04]" />
  ),
});

export default SparklineChart;
