"use client";

import dynamic from "next/dynamic";
import type { FlowCategory } from "./index";

const EcosystemGlobe = dynamic(() => import("./EcosystemGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-[1200px] mx-auto h-[400px] md:h-[600px] flex items-center justify-center">
      <div className="text-gray-600 font-orbitron text-sm animate-pulse">
        Loading 3D...
      </div>
    </div>
  ),
});

interface GlobeWrapperProps {
  categories: FlowCategory[];
  totalRepos: number;
}

export default function GlobeWrapper({
  categories,
  totalRepos,
}: GlobeWrapperProps) {
  return <EcosystemGlobe categories={categories} totalRepos={totalRepos} />;
}
