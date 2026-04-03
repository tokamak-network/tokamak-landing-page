"use client";

interface TickerItem {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  change?: string;
}

interface ConceptProps {
  items: TickerItem[];
}

const LOGS = [
  "[12:34] tokamak-thanos   feat: update sepolia images tag",
  "[12:35] tokamak-infra    fix: deprecated Makefile targets",
  "[12:36] tokamak-titan    refactor: flatten contract dirs",
  "[12:37] tokamak-thanos   chore: bump op-node dependency",
];

function MetricDisplay({ label, value, prefix, suffix, change }: TickerItem) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          fontSize: 10,
          color: "#5a6a80",
          letterSpacing: "0.12em",
          marginBottom: 6,
          fontFamily: "'Share Tech Mono', monospace",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "clamp(18px, 2vw, 28px)",
          fontWeight: 700,
          color: "#00d9ff",
          textShadow: "0 0 12px rgba(0, 217, 255, 0.5)",
        }}
      >
        {prefix}
        {value}
        {suffix ? ` ${suffix}` : ""}
      </div>
      {change && (
        <div
          style={{
            fontSize: 11,
            color: change.startsWith("+") ? "#22c55e" : "#ef4444",
            marginTop: 4,
          }}
        >
          {change}
        </div>
      )}
    </div>
  );
}

export default function ControlRoom({ items }: ConceptProps) {
  const marketData = items.slice(0, 3);
  const devData = items.slice(3);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#030810",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "40px 32px",
        fontFamily: "'Share Tech Mono', monospace",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes cr-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes cr-pulse { 0%,100%{box-shadow:0 0 20px rgba(42,114,229,0.3)} 50%{box-shadow:0 0 35px rgba(42,114,229,0.6)} }
        @keyframes cr-scan { 0%{top:-30%} 100%{top:130%} }
        @keyframes cr-rotate { 0%{transform:rotateX(65deg) rotateZ(0deg)} 100%{transform:rotateX(65deg) rotateZ(360deg)} }
        @keyframes cr-scroll { 0%{transform:translateY(0)} 100%{transform:translateY(-50%)} }
        @keyframes cr-progress { 0%,100%{opacity:1;width:73%} 50%{opacity:0.7;width:76%} }
      `}</style>

      {/* Monitors grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
          gap: 20,
          flex: 1,
          minHeight: 0,
          maxHeight: "70vh",
        }}
      >
        {/* Left monitor — Market Data */}
        <div
          style={{
            background: "#0a1020",
            border: "1px solid rgba(42,114,229,0.25)",
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Corner brackets */}
          <div style={{ position: "absolute", top: 0, left: 0, width: 16, height: 16, borderTop: "2px solid rgba(42,114,229,0.5)", borderLeft: "2px solid rgba(42,114,229,0.5)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: 16, height: 16, borderTop: "2px solid rgba(42,114,229,0.5)", borderRight: "2px solid rgba(42,114,229,0.5)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 16, height: 16, borderBottom: "2px solid rgba(42,114,229,0.5)", borderLeft: "2px solid rgba(42,114,229,0.5)" }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottom: "2px solid rgba(42,114,229,0.5)", borderRight: "2px solid rgba(42,114,229,0.5)" }} />

          {/* CRT scanline */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          {/* Scan beam */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "30%",
              background: "linear-gradient(180deg, transparent, rgba(42,114,229,0.04), transparent)",
              animation: "cr-scan 6s linear infinite",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Header */}
          <div
            style={{
              padding: "10px 14px",
              borderBottom: "1px solid rgba(42,114,229,0.2)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#2A72E5",
              fontFamily: "'Orbitron', monospace",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 6px #22c55e",
                animation: "cr-blink 1.5s infinite",
              }}
            />
            MARKET DATA
          </div>

          {/* Metrics */}
          <div style={{ padding: "20px 16px", flex: 1 }}>
            {marketData.map((item, i) => (
              <MetricDisplay key={i} {...item} />
            ))}
          </div>
        </div>

        {/* Center monitor — Tokamak Reactor */}
        <div
          style={{
            background: "#0a1020",
            border: "1px solid rgba(42,114,229,0.3)",
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            animation: "cr-pulse 3s ease-in-out infinite",
          }}
        >
          {/* Corner brackets */}
          <div style={{ position: "absolute", top: 0, left: 0, width: 20, height: 20, borderTop: "2px solid rgba(42,114,229,0.6)", borderLeft: "2px solid rgba(42,114,229,0.6)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: 20, height: 20, borderTop: "2px solid rgba(42,114,229,0.6)", borderRight: "2px solid rgba(42,114,229,0.6)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 20, height: 20, borderBottom: "2px solid rgba(42,114,229,0.6)", borderLeft: "2px solid rgba(42,114,229,0.6)" }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderBottom: "2px solid rgba(42,114,229,0.6)", borderRight: "2px solid rgba(42,114,229,0.6)" }} />

          {/* CRT scanline */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Header */}
          <div
            style={{
              padding: "10px 14px",
              borderBottom: "1px solid rgba(42,114,229,0.2)",
              textAlign: "center",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "#2A72E5",
              fontFamily: "'Orbitron', monospace",
            }}
          >
            TOKAMAK REACTOR
          </div>

          {/* Reactor content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px 30px",
              gap: 16,
            }}
          >
            {/* Rotating torus SVG */}
            <div
              style={{
                width: "clamp(140px, 15vw, 200px)",
                height: "clamp(140px, 15vw, 200px)",
                perspective: 400,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  transformStyle: "preserve-3d",
                  animation: "cr-rotate 8s linear infinite",
                }}
              >
                <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
                  <defs>
                    <filter id="cr-glow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Outer ring */}
                  <ellipse cx="100" cy="100" rx="80" ry="40" fill="none" stroke="#2A72E5" strokeWidth="2.5" opacity="0.7" filter="url(#cr-glow)" />
                  {/* Mid ring */}
                  <ellipse cx="100" cy="100" rx="60" ry="30" fill="none" stroke="#00d9ff" strokeWidth="1.5" opacity="0.5" />
                  {/* Inner ring */}
                  <ellipse cx="100" cy="100" rx="40" ry="20" fill="none" stroke="#2A72E5" strokeWidth="1" opacity="0.3" />
                  {/* Cross ring (tube cross-section hint) */}
                  <ellipse cx="100" cy="100" rx="15" ry="40" fill="none" stroke="#2A72E5" strokeWidth="1" opacity="0.2" />
                  {/* Center glow */}
                  <circle cx="100" cy="100" r="8" fill="rgba(42,114,229,0.15)" />
                </svg>
              </div>
            </div>

            {/* Status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "'Orbitron', monospace",
                fontSize: 13,
                fontWeight: 600,
                color: "#22c55e",
                textShadow: "0 0 8px rgba(34,197,94,0.6)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 8px #22c55e",
                }}
              />
              STATUS: ONLINE
            </div>

            {/* Progress bar */}
            <div style={{ width: "80%", maxWidth: 300 }}>
              <div
                style={{
                  width: "100%",
                  height: 6,
                  background: "rgba(42,114,229,0.15)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #2A72E5, #00d9ff)",
                    borderRadius: 3,
                    animation: "cr-progress 3s ease-in-out infinite",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 9,
                  color: "#5a6a80",
                  marginTop: 4,
                  letterSpacing: "0.08em",
                }}
              >
                <span>CONTAINMENT</span>
                <span>73%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right monitor — Dev Metrics */}
        <div
          style={{
            background: "#0a1020",
            border: "1px solid rgba(42,114,229,0.25)",
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Corner brackets */}
          <div style={{ position: "absolute", top: 0, left: 0, width: 16, height: 16, borderTop: "2px solid rgba(42,114,229,0.5)", borderLeft: "2px solid rgba(42,114,229,0.5)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: 16, height: 16, borderTop: "2px solid rgba(42,114,229,0.5)", borderRight: "2px solid rgba(42,114,229,0.5)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 16, height: 16, borderBottom: "2px solid rgba(42,114,229,0.5)", borderLeft: "2px solid rgba(42,114,229,0.5)" }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottom: "2px solid rgba(42,114,229,0.5)", borderRight: "2px solid rgba(42,114,229,0.5)" }} />

          {/* CRT scanline */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "30%",
              background: "linear-gradient(180deg, transparent, rgba(42,114,229,0.04), transparent)",
              animation: "cr-scan 6s linear infinite",
              animationDelay: "2s",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Header */}
          <div
            style={{
              padding: "10px 14px",
              borderBottom: "1px solid rgba(42,114,229,0.2)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#2A72E5",
              fontFamily: "'Orbitron', monospace",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 6px #22c55e",
                animation: "cr-blink 1.5s infinite",
                animationDelay: "0.7s",
              }}
            />
            DEV METRICS
          </div>

          {/* Metrics */}
          <div style={{ padding: "20px 16px", flex: 1 }}>
            {devData.map((item, i) => (
              <MetricDisplay key={i} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom terminal */}
      <div
        style={{
          marginTop: 16,
          background: "#080e08",
          border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: 4,
          padding: "10px 14px",
          height: 80,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{ animation: "cr-scroll 16s linear infinite" }}>
          {[...LOGS, ...LOGS, ...LOGS].map((log, i) => (
            <div
              key={i}
              style={{
                fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                fontSize: 12,
                color: "#22c55e",
                marginBottom: 6,
                whiteSpace: "nowrap",
                opacity: 0.8,
              }}
            >
              &gt; {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
