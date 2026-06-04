import type { Metadata } from "next";
import PartnersV2 from "@/app/components/ui/sections/partners-v2";

export const metadata: Metadata = {
  title: "Partners — Tokamak Network",
  description:
    "Ecosystem partners, researchers, and capital partners backing Tokamak Network's bet on a more scalable Ethereum.",
  alternates: { canonical: "/about/partners" },
};

export default function PartnersPage() {
  return <PartnersV2 />;
}
