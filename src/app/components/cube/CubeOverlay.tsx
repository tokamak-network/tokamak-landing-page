"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import type { CubeData } from "./useCubeData";
import type { CellCategory } from "./constants";

interface CubeOverlayProps {
  face: string;
  row: number;
  col: number;
  category: string;
  cubeData: CubeData;
  onClose: () => void;
}

/* ── Shared Styles ── */

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 50,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.65)",
  backdropFilter: "blur(12px)",
  cursor: "pointer",
  fontFamily: "'Space Grotesk', sans-serif",
};

const panelStyle: React.CSSProperties = {
  position: "relative",
  maxWidth: 520,
  width: "92vw",
  cursor: "default",
  background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  padding: 32,
  boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
};

const closeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: 16,
  right: 16,
  width: 32,
  height: 32,
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.05)",
  color: "#999",
  fontSize: 18,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: 2,
  color: "rgba(255,255,255,0.4)",
  textTransform: "uppercase",
  marginBottom: 20,
};

const metricRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  padding: "14px 0",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: 14,
  color: "rgba(255,255,255,0.5)",
};

const metricValueStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: "#fff",
};

const bigValueStyle: React.CSSProperties = {
  fontSize: 42,
  fontWeight: 800,
  color: "#fff",
  marginBottom: 4,
};

/* ── Metric Row Component ── */

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={metricRowStyle}>
      <span style={metricLabelStyle}>{label}</span>
      <span style={metricValueStyle}>{value}</span>
    </div>
  );
}

/* ── Dashboard Views ── */

function FinancialDashboard({ data }: { data: CubeData }) {
  const price = data.tonPriceUSD;
  return (
    <div>
      <div style={titleStyle}>Financial Overview</div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          TON Price
        </div>
        <div style={bigValueStyle}>
          ${price > 0 ? price.toFixed(2) : "—"}
        </div>
        <div
          style={{
            display: "inline-block",
            fontSize: 12,
            padding: "3px 8px",
            borderRadius: 6,
            background: "rgba(74,222,128,0.15)",
            color: "#4ade80",
          }}
        >
          LIVE
        </div>
      </div>
      <MetricRow
        label="Market Cap"
        value={
          data.marketCap > 0 ? `$${(data.marketCap / 1e6).toFixed(1)}M` : "—"
        }
      />
      <MetricRow
        label="Total Staked"
        value={`${(data.stakedVolume / 1e6).toFixed(1)}M TON`}
      />
      <MetricRow
        label="Trading Volume 24h"
        value={
          data.tradingVolumeUSD > 0
            ? `$${(data.tradingVolumeUSD / 1e3).toFixed(0)}K`
            : "—"
        }
      />
      <MetricRow
        label="Fully Diluted Valuation"
        value={
          data.fullyDilutedValuation > 0
            ? `$${(data.fullyDilutedValuation / 1e6).toFixed(1)}M`
            : "—"
        }
      />
    </div>
  );
}

function DevelopmentDashboard({ data }: { data: CubeData }) {
  return (
    <div>
      <div style={titleStyle}>Development Activity</div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          Total Code Changes
        </div>
        <div style={bigValueStyle}>{data.codeChanges.toLocaleString()}</div>
      </div>
      <MetricRow
        label="Net Growth"
        value={`+${data.netGrowth.toLocaleString()} lines`}
      />
      <MetricRow
        label="Active Projects"
        value={data.activeProjects.toString()}
      />
      {/* Mini bar chart */}
      <div style={{ marginTop: 20 }}>
        <div
          style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 10 }}
        >
          Contribution Breakdown
        </div>
        <div style={{ display: "flex", gap: 4, height: 32, alignItems: "end" }}>
          {[65, 45, 78, 52, 89, 67, 43, 71, 58, 82, 47, 93].map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                background: `linear-gradient(to top, rgba(99,102,241,0.6), rgba(99,102,241,0.2))`,
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EcosystemDashboard({ data }: { data: CubeData }) {
  return (
    <div>
      <div style={titleStyle}>Ecosystem Metrics</div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          Circulating Supply
        </div>
        <div style={bigValueStyle}>
          {data.circulatingSupply > 0
            ? `${(data.circulatingSupply / 1e6).toFixed(1)}M`
            : "—"}
        </div>
      </div>
      <MetricRow
        label="TON Price"
        value={
          data.tonPriceUSD > 0 ? `$${data.tonPriceUSD.toFixed(2)}` : "—"
        }
      />
      <MetricRow
        label="Staked Volume"
        value={`${(data.stakedVolume / 1e6).toFixed(1)}M TON`}
      />
      <MetricRow
        label="Active Projects"
        value={data.activeProjects.toString()}
      />
      {/* Health indicators */}
      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        {[
          { label: "Network", ok: true },
          { label: "Staking", ok: true },
          { label: "Bridge", ok: true },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px 0",
              borderRadius: 8,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: item.ok ? "#4ade80" : "#ef4444",
                margin: "0 auto 6px",
              }}
            />
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Fallback for cells without a data category */
function ImageOverlay({ face, row, col }: { face: string; row: number; col: number }) {
  const texturePath = `/cube/textures/${face}-${row}-${col}.png`;
  return (
    <div style={{ textAlign: "center" }}>
      <Image
        src={texturePath}
        alt={`${face} ${row}-${col}`}
        width={320}
        height={320}
        style={{
          width: "100%",
          maxWidth: 320,
          height: "auto",
          borderRadius: 12,
          marginBottom: 12,
        }}
      />
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
        {face} · {row} · {col}
      </div>
    </div>
  );
}

/* ── Main Overlay ── */

export default function CubeOverlay({
  face,
  row,
  col,
  category,
  cubeData,
  onClose,
}: CubeOverlayProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const renderDashboard = () => {
    switch (category as CellCategory) {
      case "financial":
        return <FinancialDashboard data={cubeData} />;
      case "development":
        return <DevelopmentDashboard data={cubeData} />;
      case "ecosystem":
        return <EcosystemDashboard data={cubeData} />;
      default:
        return <ImageOverlay face={face} row={row} col={col} />;
    }
  };

  return (
    <div onClick={onClose} style={overlayStyle}>
      <div onClick={(e) => e.stopPropagation()} style={panelStyle}>
        <button onClick={onClose} style={closeBtnStyle}>
          ×
        </button>
        {renderDashboard()}
      </div>
    </div>
  );
}
