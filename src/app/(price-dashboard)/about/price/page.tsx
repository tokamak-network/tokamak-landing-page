import type { Metadata } from "next";
import PriceOverview from "@/app/components/ui/sections/price-overview";

export const metadata: Metadata = {
  title: "TON Price & Tokenomics — Tokamak Network",
  description:
    "Live TON price, market cap, trading volume, circulating supply, and seigniorage staking metrics for Tokamak Network.",
  alternates: { canonical: "/about/price" },
};

// ISR instead of force-dynamic: price fetches use `revalidate`, so the HTML is
// cached and refreshed at most every 2 min (price up to ~120s stale — fine here).
export const revalidate = 120;

export default function PricePage() {
  return <PriceOverview />;
}
