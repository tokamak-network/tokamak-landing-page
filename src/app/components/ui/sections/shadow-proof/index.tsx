"use client";

import { useEffect, useState } from "react";
import LazyWebGL from "../../LazyWebGL";
import ShadowProofScene from "./Scene";
import HUDOverlay from "./HUDOverlay";

export default function ShadowProof() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className="relative w-full h-screen bg-black overflow-hidden"
      aria-label="Zero-knowledge proof demonstration"
    >
      <div className="absolute inset-0">
        {mounted && (
          <LazyWebGL style={{ width: "100%", height: "100%" }}>
            <ShadowProofScene />
          </LazyWebGL>
        )}
      </div>
      <HUDOverlay />
    </section>
  );
}
