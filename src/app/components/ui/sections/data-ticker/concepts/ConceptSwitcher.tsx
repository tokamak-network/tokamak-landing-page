"use client";

import { useState } from "react";
import TradingFloor from "./TradingFloor";
import ControlRoom from "./ControlRoom";
import RingExchange from "./RingExchange";

interface TickerItem {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  change?: string;
}

const CONCEPTS = [
  { id: "trading", label: "1. Trading Floor", component: TradingFloor },
  { id: "control", label: "2. Control Room", component: ControlRoom },
  { id: "ring", label: "3. Ring Exchange", component: RingExchange },
] as const;

export default function ConceptSwitcher({ items }: { items: TickerItem[] }) {
  const [active, setActive] = useState(0);

  const ActiveComponent = CONCEPTS[active].component;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Concept content */}
      <ActiveComponent items={items} />

      {/* Floating switcher buttons */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 50,
          display: "flex",
          gap: 6,
        }}
      >
        {CONCEPTS.map((concept, i) => (
          <button
            key={concept.id}
            onClick={() => setActive(i)}
            style={{
              padding: "6px 12px",
              fontSize: 11,
              fontFamily: "'Orbitron', monospace",
              fontWeight: 600,
              letterSpacing: "0.05em",
              border: `1px solid ${active === i ? "#2A72E5" : "rgba(255,255,255,0.15)"}`,
              borderRadius: 4,
              background: active === i ? "rgba(42,114,229,0.2)" : "rgba(0,0,0,0.6)",
              color: active === i ? "#fff" : "#888",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s ease",
            }}
          >
            {concept.label}
          </button>
        ))}
      </div>
    </div>
  );
}
