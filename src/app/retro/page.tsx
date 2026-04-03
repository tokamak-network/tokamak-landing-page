"use client";

import { useEffect, useState, useRef, CSSProperties } from "react";

/* ═══════════════ TYPES ═══════════════ */
interface PriceData {
  tonPrice: { current: { usd: number; krw: number } };
  marketCap: number;
  tradingVolumeUSD: number;
  stakedVolume: number;
  stakedVolumeUSD: number;
}

const FALLBACK: PriceData = {
  tonPrice: { current: { usd: 3.42, krw: 4850 } },
  marketCap: 180_000_000,
  tradingVolumeUSD: 1_200_000,
  stakedVolume: 28_400_000,
  stakedVolumeUSD: 97_000_000,
};

/* ═══════════════ HELPERS ═══════════════ */
function fmt(n: number, d = 2): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(d)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(d)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(d)}K`;
  return n.toFixed(d);
}
const glow = (c: string, r = 8) => `0 0 ${r}px ${c}, 0 0 ${r * 2}px ${c}66`;

/* ═══════════════ ANIMATED NUMBER ═══════════════ */
function Num({ value, dec = 2 }: { value: number; dec?: number }) {
  const [d, setD] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const p = prev.current;
    const diff = value - p;
    if (Math.abs(diff) < 0.001) { setD(value); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1500, 1);
      setD(p + diff * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    prev.current = value;
  }, [value]);
  return <>{d.toFixed(dec)}</>;
}

/* ═══════════════ MINI CHART ═══════════════ */
function MiniChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  const data = useRef<number[]>([]);
  useEffect(() => {
    let v = 50;
    for (let i = 0; i < 60; i++) { v += (Math.random() - 0.48) * 8; v = Math.max(10, Math.min(90, v)); data.current.push(v); }
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const draw = () => {
      const w = c.width, h = c.height;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "#39ff1415"; ctx.lineWidth = 0.5;
      for (let y = 0; y < h; y += h / 5) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      for (let x = 0; x < w; x += w / 8) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      const last = data.current[data.current.length - 1];
      let next = last + (Math.random() - 0.48) * 5;
      next = Math.max(10, Math.min(90, next));
      data.current.push(next);
      if (data.current.length > 60) data.current.shift();
      ctx.strokeStyle = "#39ff14"; ctx.lineWidth = 2;
      ctx.shadowColor = "#39ff14"; ctx.shadowBlur = 8;
      ctx.beginPath();
      data.current.forEach((v, i) => { const x = (i / 59) * w; const y = h - (v / 100) * h; if (i === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); } });
      ctx.stroke(); ctx.shadowBlur = 0;
      ctx.lineTo((data.current.length - 1) / 59 * w, h); ctx.lineTo(0, h); ctx.closePath();
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#39ff1430"); g.addColorStop(1, "#39ff1405");
      ctx.fillStyle = g; ctx.fill();
    };
    draw();
    const id = setInterval(draw, 1500);
    return () => clearInterval(id);
  }, []);
  return <canvas ref={ref} width={300} height={160} style={{ width: "100%", height: "100%" }} />;
}

/* ═══════════════════════════════════════════════════════
   COMPONENT 1: GREEN CRT MONITOR
   - Retro CRT monitor with thick bezel, curved screen
   - Live chart canvas on the green phosphor display
   ═══════════════════════════════════════════════════════ */
function GreenMonitor({ volume }: { volume: number }) {
  return (
    <div style={{
      position: "absolute", left: "22%", top: "10%",
      width: "16%", aspectRatio: "0.95",
      zIndex: 3, transform: "rotate(2deg)",
    }}>
      {/* Monitor back/depth shadow */}
      <div style={{
        position: "absolute", inset: "-3%",
        background: "linear-gradient(160deg, #2a2a35 0%, #15151f 100%)",
        borderRadius: "8% / 6%",
        boxShadow: "0 8px 30px rgba(0,0,0,0.6), 0 0 40px rgba(57,255,20,0.08)",
      }} />
      {/* Monitor body */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(145deg, #3a3a4a 0%, #252535 30%, #1e1e2e 70%, #181828 100%)",
        borderRadius: "6% / 5%",
        border: "1px solid #4a4a5a",
        overflow: "hidden",
      }}>
        {/* Top bezel with brand */}
        <div style={{
          height: "10%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 8%",
        }}>
          <div style={{
            fontFamily: "'VT323', monospace", fontSize: "clamp(4px, 0.5vw, 8px)",
            color: "#666", letterSpacing: "0.15em",
          }}>
            TKM/USD
          </div>
          <div style={{
            fontFamily: "'VT323', monospace", fontSize: "clamp(3px, 0.4vw, 7px)",
            color: "#555",
          }}>
            VOLUME ▲
          </div>
        </div>

        {/* Screen area with bezel */}
        <div style={{
          position: "absolute", left: "7%", right: "7%",
          top: "12%", bottom: "18%",
          background: "#0a1a08",
          borderRadius: "4% / 3%",
          border: "2px solid #222",
          boxShadow: "inset 0 0 20px rgba(57,255,20,0.15), inset 0 0 60px rgba(0,0,0,0.5), 0 0 8px rgba(57,255,20,0.1)",
          overflow: "hidden",
        }}>
          {/* Phosphor glow layer */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 50%, rgba(57,255,20,0.06) 0%, transparent 70%)",
            pointerEvents: "none", zIndex: 1,
          }} />
          {/* Scanlines */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
          }} />
          {/* Chart canvas */}
          <div style={{ position: "relative", zIndex: 3, width: "100%", height: "100%", padding: "4%" }}>
            <MiniChart />
          </div>
          {/* Screen curvature - corner darken */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 4,
            boxShadow: "inset 0 0 30px rgba(0,0,0,0.4)",
            borderRadius: "inherit",
          }} />
        </div>

        {/* Bottom panel with controls */}
        <div style={{
          position: "absolute", bottom: "3%", left: "7%", right: "7%",
          height: "12%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 4%",
        }}>
          {/* Status LED */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.3vw" }}>
            <div style={{
              width: "clamp(3px, 0.4vw, 6px)", height: "clamp(3px, 0.4vw, 6px)",
              borderRadius: "50%", background: "#39ff14",
              boxShadow: glow("#39ff14", 3),
            }} />
            <span style={{
              fontFamily: "'VT323', monospace",
              fontSize: "clamp(3px, 0.35vw, 6px)", color: "#39ff14aa",
            }}>
              LIVE
            </span>
          </div>
          {/* Volume display */}
          <span style={{
            fontFamily: "'VT323', monospace",
            fontSize: "clamp(4px, 0.4vw, 7px)", color: "#39ff14",
            textShadow: glow("#39ff14", 2),
          }}>
            ${fmt(volume, 1)}
          </span>
          {/* Power button */}
          <div style={{
            width: "clamp(6px, 0.7vw, 10px)", height: "clamp(6px, 0.7vw, 10px)",
            borderRadius: "50%", background: "linear-gradient(145deg, #555, #333)",
            border: "1px solid #222",
          }} />
        </div>
      </div>

      {/* Monitor stand */}
      <div style={{
        position: "absolute", bottom: "-12%", left: "30%", right: "30%",
        height: "15%",
        background: "linear-gradient(180deg, #2a2a3a 0%, #1e1e2e 100%)",
        clipPath: "polygon(15% 0, 85% 0, 100% 100%, 0 100%)",
        borderBottom: "2px solid #3a3a4a",
      }} />
      {/* Stand base */}
      <div style={{
        position: "absolute", bottom: "-18%", left: "18%", right: "18%",
        height: "6%",
        background: "linear-gradient(180deg, #333345 0%, #252535 100%)",
        borderRadius: "0 0 30% 30% / 0 0 60% 60%",
        border: "1px solid #444",
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COMPONENT 2: TURNTABLE / VINYL RECORD PLAYER
   - Detailed turntable with platter, vinyl, tonearm
   ═══════════════════════════════════════════════════════ */
function TurntableComponent() {
  return (
    <div style={{
      position: "absolute", left: "52%", top: "4%",
      width: "18%", aspectRatio: "1.1",
      zIndex: 2, transform: "rotate(-2deg)",
    }}>
      {/* Base platform */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(155deg, #4a4450 0%, #35303a 25%, #2a252f 50%, #201c25 100%)",
        borderRadius: "5%",
        border: "1px solid #5a5560",
        boxShadow: "0 6px 25px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        overflow: "hidden",
      }}>
        {/* Platter ring */}
        <div style={{
          position: "absolute", left: "8%", top: "10%",
          width: "68%", aspectRatio: "1",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #333 0%, #2a2a2a 50%, #222 100%)",
          border: "2px solid #444",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}>
          {/* Vinyl record */}
          <div style={{
            position: "absolute", inset: "4%",
            borderRadius: "50%",
            animation: "spin 3s linear infinite",
            background: `
              radial-gradient(circle,
                #1a1a1a 0%,
                #111 18%,
                #1a1a1a 19%,
                #111 20%,
                #1a1a1a 22%,
                transparent 23%
              ),
              repeating-radial-gradient(
                circle,
                #1a1a1a 0px,
                #222 1px,
                #1a1a1a 2px,
                #181818 3px
              )
            `,
            boxShadow: "0 0 15px rgba(0,0,0,0.5)",
          }}>
            {/* Record label */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "32%", aspectRatio: "1",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ff6b9d 0%, #e0507a 40%, #cc3366 100%)",
              boxShadow: "0 0 10px rgba(255,107,157,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* Spindle hole */}
              <div style={{
                width: "14%", aspectRatio: "1", borderRadius: "50%",
                background: "#0a0a1a",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
              }} />
            </div>
            {/* Light reflection streak */}
            <div style={{
              position: "absolute", top: "10%", left: "45%",
              width: "10%", height: "35%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
              borderRadius: "50%",
              transform: "rotate(-20deg)",
              pointerEvents: "none",
            }} />
          </div>
        </div>

        {/* Tonearm base */}
        <div style={{
          position: "absolute", right: "10%", top: "12%",
          width: "8%", aspectRatio: "1",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #666 0%, #444 100%)",
          border: "1px solid #777",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          zIndex: 3,
        }} />
        {/* Tonearm */}
        <div style={{
          position: "absolute", right: "12%", top: "15%",
          width: "2%", height: "45%",
          background: "linear-gradient(90deg, #888, #666, #888)",
          transform: "rotate(-25deg)",
          transformOrigin: "top center",
          borderRadius: "2px",
          zIndex: 2,
          boxShadow: "1px 1px 4px rgba(0,0,0,0.3)",
        }}>
          {/* Headshell */}
          <div style={{
            position: "absolute", bottom: "-2px", left: "-3px",
            width: "200%", height: "12%",
            background: "#999",
            borderRadius: "2px",
            transform: "rotate(-15deg)",
          }} />
        </div>

        {/* Control buttons row */}
        <div style={{
          position: "absolute", bottom: "8%", left: "10%",
          display: "flex", gap: "4%",
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: "clamp(4px, 0.5vw, 8px)", height: "clamp(4px, 0.5vw, 8px)",
              borderRadius: "50%",
              background: i === 0 ? "#39ff14" : "linear-gradient(145deg, #555, #333)",
              border: "1px solid #444",
              boxShadow: i === 0 ? glow("#39ff14", 2) : "none",
            }} />
          ))}
        </div>

        {/* Cable */}
        <svg style={{ position: "absolute", bottom: "5%", right: "5%", width: "30%", height: "20%", overflow: "visible" }}>
          <path d="M 0 10 Q 20 0, 40 15 T 80 5" fill="none" stroke="#ff6b9d55" strokeWidth="1.5" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COMPONENT 3: LIVE ACTIVITY CARD
   - Dark card with neon pink header, green scrolling text
   ═══════════════════════════════════════════════════════ */
const ACTIVITIES = [
  "NEW STAKE: 15,200 TKM by 0x4f...c2a",
  "BLOCK VALIDATED: #2,489,101",
  "SWAP: 500 TKM → 0.8 ETH",
  "GAME REWARD: 1.5 TKM claimed",
  "UNSTAKE: 3,000 TKM by 0xa2...f1b",
  "BRIDGE: 2,000 TKM L1 → L2",
  "GOVERNANCE: Vote #47 passed",
  "DEPLOY: Contract 0x7c...e3d",
];

function LiveActivityCard({ activityIdx }: { activityIdx: number }) {
  return (
    <div style={{
      position: "absolute", left: "69%", top: "7%",
      width: "24%", aspectRatio: "2",
      zIndex: 4, transform: "rotate(1deg)",
    }}>
      {/* Card body */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(155deg, #1e1a28 0%, #151220 50%, #0f0c18 100%)",
        borderRadius: "6%",
        border: "1px solid rgba(255,107,157,0.3)",
        boxShadow: "0 6px 25px rgba(0,0,0,0.5), 0 0 15px rgba(255,107,157,0.08)",
        overflow: "hidden",
      }}>
        {/* Pink accent line at top */}
        <div style={{
          height: "3px",
          background: "linear-gradient(90deg, #ff6b9d, #ff4477, #ff6b9d)",
          boxShadow: `0 0 8px #ff6b9d`,
        }} />

        {/* Header */}
        <div style={{
          padding: "4% 6% 2%",
          display: "flex", alignItems: "center", gap: "0.4vw",
        }}>
          {/* Live indicator dot */}
          <div style={{
            width: "clamp(4px, 0.4vw, 7px)", height: "clamp(4px, 0.4vw, 7px)",
            borderRadius: "50%", background: "#39ff14",
            boxShadow: glow("#39ff14", 3),
            animation: "pulse 2s ease-in-out infinite",
          }} />
          <span style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(4px, 0.45vw, 8px)",
            color: "#ff6b9d",
            textShadow: glow("#ff6b9d", 3),
          }}>
            LIVE ACTIVITY:
          </span>
        </div>

        {/* Activity lines */}
        <div style={{
          padding: "2% 6%",
          display: "flex", flexDirection: "column",
          gap: "0.25vw", overflow: "hidden",
        }}>
          {ACTIVITIES.slice(activityIdx, activityIdx + 5).map((a, i) => (
            <div key={`${activityIdx}-${i}`} style={{
              fontFamily: "'VT323', monospace",
              fontSize: "clamp(5px, 0.6vw, 10px)",
              color: "#39ff14",
              textShadow: glow("#39ff14", 2),
              opacity: 1 - i * 0.18,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              transition: "opacity 0.5s",
            }}>
              {`> ${a}`}
            </div>
          ))}
        </div>

        {/* Corner decoration */}
        <div style={{
          position: "absolute", bottom: "5%", right: "5%",
          width: "clamp(8px, 1vw, 16px)", height: "clamp(8px, 1vw, 16px)",
          border: "1px solid rgba(0,229,255,0.2)",
          borderTop: "none", borderLeft: "none",
          borderRadius: "0 0 4px 0",
        }} />
        <div style={{
          position: "absolute", top: "15%", left: "5%",
          width: "clamp(6px, 0.6vw, 10px)", height: "clamp(6px, 0.6vw, 10px)",
          border: "1px solid rgba(0,229,255,0.15)",
          borderBottom: "none", borderRight: "none",
          borderRadius: "4px 0 0 0",
        }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COMPONENT 4: CRT TV
   - Retro wooden CRT TV with curved screen, knobs, antenna
   ═══════════════════════════════════════════════════════ */
function CrtTV() {
  return (
    <div style={{
      position: "absolute", left: "28%", top: "42%",
      width: "24%", aspectRatio: "1.05",
      zIndex: 4, transform: "rotate(-1deg)",
    }}>
      {/* TV body - wooden frame */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(160deg, #5a4030 0%, #4a3020 25%, #3a2515 50%, #2e1a0e 100%)",
        borderRadius: "5% / 4%",
        border: "2px solid #6a5040",
        boxShadow: "0 8px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        overflow: "hidden",
      }}>
        {/* Wood grain texture - subtle lines */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.08,
          background: `repeating-linear-gradient(
            95deg, transparent, transparent 8px,
            rgba(255,200,150,0.3) 8px, rgba(255,200,150,0.3) 9px
          )`,
          pointerEvents: "none",
        }} />

        {/* Antenna */}
        <div style={{
          position: "absolute", top: "-20%", left: "30%",
          width: "2px", height: "22%",
          background: "linear-gradient(180deg, #888, #555)",
          transform: "rotate(-15deg)",
          transformOrigin: "bottom center",
          boxShadow: "1px 0 3px rgba(0,0,0,0.3)",
          zIndex: 5,
        }} />
        <div style={{
          position: "absolute", top: "-18%", right: "32%",
          width: "2px", height: "20%",
          background: "linear-gradient(180deg, #888, #555)",
          transform: "rotate(15deg)",
          transformOrigin: "bottom center",
          boxShadow: "1px 0 3px rgba(0,0,0,0.3)",
          zIndex: 5,
        }} />

        {/* Screen bezel area */}
        <div style={{
          position: "absolute", left: "6%", right: "20%",
          top: "6%", bottom: "14%",
          background: "#111",
          borderRadius: "4% / 3%",
          border: "3px solid #3a2a1a",
          boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)",
          overflow: "hidden",
        }}>
          {/* Screen with video */}
          <video
            autoPlay muted loop playsInline
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.9,
              filter: "saturate(1.3) contrast(1.1) brightness(0.9)",
            }}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* CRT curvature shadow */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)",
            borderRadius: "inherit",
          }} />
          {/* Scanlines */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
          }} />
          {/* Screen reflection */}
          <div style={{
            position: "absolute", top: "-20%", left: "-10%",
            width: "60%", height: "60%",
            background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
            transform: "rotate(-10deg)",
            pointerEvents: "none",
          }} />
        </div>

        {/* Control panel (right side) */}
        <div style={{
          position: "absolute", right: "3%", top: "10%",
          width: "12%", height: "70%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "space-around",
          padding: "5% 0",
        }}>
          {/* Channel dial */}
          <div style={{
            width: "70%", aspectRatio: "1",
            borderRadius: "50%",
            background: "linear-gradient(145deg, #6a5545, #3a2515)",
            border: "1px solid #7a6555",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}>
            <div style={{
              position: "absolute", top: "20%", left: "45%",
              width: "10%", height: "30%",
              background: "#ddd",
              borderRadius: "1px",
            }} />
          </div>
          {/* Volume knob */}
          <div style={{
            width: "55%", aspectRatio: "1",
            borderRadius: "50%",
            background: "linear-gradient(145deg, #5a4535, #2a1505)",
            border: "1px solid #6a5545",
          }} />
          {/* Speaker grille */}
          <div style={{
            width: "80%", aspectRatio: "0.8",
            display: "flex", flexDirection: "column",
            gap: "2px", justifyContent: "center",
          }}>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{
                height: "2px",
                background: "#2a1a0a",
                borderRadius: "1px",
              }} />
            ))}
          </div>
        </div>

        {/* Bottom label */}
        <div style={{
          position: "absolute", bottom: "3%", left: "6%",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(3px, 0.4vw, 7px)",
          color: "#ffffffaa",
          textShadow: "0 0 4px rgba(0,0,0,0.5)",
        }}>
          WATCH EPISODE 4
        </div>
      </div>

      {/* TV legs */}
      <div style={{
        position: "absolute", bottom: "-6%", left: "18%",
        width: "6%", height: "8%",
        background: "linear-gradient(90deg, #5a4535, #3a2515)",
        borderRadius: "0 0 3px 3px",
        transform: "perspective(100px) rotateY(-5deg)",
      }} />
      <div style={{
        position: "absolute", bottom: "-6%", right: "22%",
        width: "6%", height: "8%",
        background: "linear-gradient(90deg, #3a2515, #5a4535)",
        borderRadius: "0 0 3px 3px",
        transform: "perspective(100px) rotateY(5deg)",
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COMPONENT 5: GAME BOY
   - Classic Game Boy with screen, d-pad, buttons
   ═══════════════════════════════════════════════════════ */
function GameBoyCard() {
  return (
    <div style={{
      position: "absolute", left: "76%", top: "24%",
      width: "14%", aspectRatio: "0.6",
      zIndex: 4, transform: "rotate(3deg)",
    }}>
      {/* Game Boy body */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(165deg, #d4ccbc 0%, #c0b8a8 30%, #b0a898 60%, #a09888 100%)",
        borderRadius: "5% 5% 12% 12% / 3% 3% 8% 8%",
        border: "1px solid #888",
        boxShadow: "0 6px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
        overflow: "hidden",
      }}>
        {/* Screen surround (dark area) */}
        <div style={{
          position: "absolute", left: "10%", right: "10%",
          top: "5%", height: "42%",
          background: "linear-gradient(180deg, #555 0%, #444 50%, #3a3a3a 100%)",
          borderRadius: "4% 4% 10% 10% / 3% 3% 6% 6%",
          border: "1px solid #333",
        }}>
          {/* Screen line accent */}
          <div style={{
            position: "absolute", top: "5%", left: "8%",
            width: "40%", height: "2px",
            background: "linear-gradient(90deg, #8a2255, #5a1535)",
            borderRadius: "1px",
          }} />
          {/* "DOT MATRIX" label */}
          <div style={{
            position: "absolute", top: "7%", left: "8%",
            fontFamily: "'VT323', monospace",
            fontSize: "clamp(2px, 0.22vw, 4px)",
            color: "#888", letterSpacing: "0.15em",
          }}>
            DOT MATRIX WITH STEREO SOUND
          </div>

          {/* LCD Screen */}
          <div style={{
            position: "absolute", left: "8%", right: "8%",
            top: "18%", bottom: "10%",
            background: "linear-gradient(180deg, #8bac0f 0%, #9bbc0f 50%, #8bac0f 100%)",
            borderRadius: "2px",
            border: "2px solid #2a2a2a",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.2)",
            overflow: "hidden",
            padding: "6%",
          }}>
            {/* Header */}
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(2px, 0.28vw, 5px)",
              color: "#306230",
              marginBottom: "4%",
              textAlign: "center",
            }}>
              GAMING LDR:
            </div>
            {/* Leaderboard */}
            {[
              { rank: 1, name: "NeoByte", val: "94k" },
              { rank: 2, name: "GigaGmr", val: "88k" },
              { rank: 3, name: "Pxl_Pro", val: "81k" },
            ].map(item => (
              <div key={item.rank} style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "clamp(2px, 0.22vw, 4px)",
                color: "#306230",
                display: "flex", justifyContent: "space-between",
                marginBottom: "3%",
              }}>
                <span>{item.rank}. {item.name}</span>
                <span>{item.val}</span>
              </div>
            ))}
            {/* LCD pixel overlay */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              opacity: 0.08,
              backgroundImage: `repeating-linear-gradient(0deg, #000 0px, transparent 1px, transparent 2px),
                repeating-linear-gradient(90deg, #000 0px, transparent 1px, transparent 2px)`,
            }} />
          </div>
        </div>

        {/* "Nintendo GAME BOY" label */}
        <div style={{
          position: "absolute", left: "12%", top: "50%",
          fontFamily: "'VT323', monospace",
          fontSize: "clamp(3px, 0.32vw, 5px)",
          color: "#666",
          letterSpacing: "0.15em",
          fontWeight: "bold",
        }}>
          Nintendo <span style={{ fontFamily: "'Press Start 2P'", fontSize: "clamp(3px, 0.35vw, 6px)", color: "#444" }}>GAME BOY</span>™
        </div>

        {/* D-pad */}
        <div style={{
          position: "absolute", left: "15%", top: "58%",
          width: "28%", aspectRatio: "1",
        }}>
          {/* Vertical bar */}
          <div style={{
            position: "absolute", left: "33%", top: "0%",
            width: "34%", height: "100%",
            background: "linear-gradient(90deg, #333 0%, #2a2a2a 50%, #333 100%)",
            borderRadius: "3px",
          }} />
          {/* Horizontal bar */}
          <div style={{
            position: "absolute", left: "0%", top: "33%",
            width: "100%", height: "34%",
            background: "linear-gradient(180deg, #333 0%, #2a2a2a 50%, #333 100%)",
            borderRadius: "3px",
          }} />
          {/* Center circle */}
          <div style={{
            position: "absolute", left: "38%", top: "38%",
            width: "24%", aspectRatio: "1",
            borderRadius: "50%", background: "#1a1a1a",
          }} />
        </div>

        {/* A and B buttons */}
        <div style={{
          position: "absolute", right: "12%", top: "60%",
          display: "flex", gap: "8%",
          transform: "rotate(-25deg)",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "clamp(8px, 1vw, 16px)", aspectRatio: "1",
              borderRadius: "50%",
              background: "linear-gradient(145deg, #a02060, #801040)",
              border: "1px solid #601030",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            }} />
            <span style={{ fontFamily: "'Press Start 2P'", fontSize: "clamp(2px, 0.2vw, 4px)", color: "#555" }}>B</span>
          </div>
          <div style={{ textAlign: "center", marginTop: "-20%" }}>
            <div style={{
              width: "clamp(8px, 1vw, 16px)", aspectRatio: "1",
              borderRadius: "50%",
              background: "linear-gradient(145deg, #a02060, #801040)",
              border: "1px solid #601030",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            }} />
            <span style={{ fontFamily: "'Press Start 2P'", fontSize: "clamp(2px, 0.2vw, 4px)", color: "#555" }}>A</span>
          </div>
        </div>

        {/* SELECT / START */}
        <div style={{
          position: "absolute", bottom: "18%", left: "30%",
          display: "flex", gap: "8%",
          transform: "rotate(-25deg)",
        }}>
          {["SELECT", "START"].map(label => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{
                width: "clamp(10px, 1.2vw, 18px)", height: "clamp(4px, 0.4vw, 6px)",
                borderRadius: "3px",
                background: "linear-gradient(180deg, #777, #555)",
                border: "1px solid #444",
              }} />
              <div style={{
                fontFamily: "'VT323', monospace",
                fontSize: "clamp(2px, 0.2vw, 3px)",
                color: "#777", marginTop: "2px",
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Speaker grille (bottom right) */}
        <div style={{
          position: "absolute", bottom: "5%", right: "8%",
          width: "25%", aspectRatio: "1.2",
        }}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{
              height: "2px", marginBottom: "3px",
              background: "#999",
              borderRadius: "1px",
              transform: `rotate(-30deg) translateY(${i * 1}px)`,
              opacity: 0.5,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COMPONENT 6: CASSETTE TAPE
   - Retro cassette with label, reels, tape window
   ═══════════════════════════════════════════════════════ */
function CassetteTape() {
  return (
    <div style={{
      position: "absolute", left: "60%", top: "68%",
      width: "28%", aspectRatio: "1.6",
      zIndex: 4, transform: "rotate(-2deg)",
    }}>
      {/* Cassette body */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(165deg, #e8e0d4 0%, #d8d0c4 30%, #c8c0b4 60%, #b8b0a4 100%)",
        borderRadius: "4% / 6%",
        border: "1px solid #999",
        boxShadow: "0 4px 15px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.4)",
        overflow: "hidden",
      }}>
        {/* Label area */}
        <div style={{
          position: "absolute", left: "6%", right: "6%",
          top: "8%", height: "42%",
          background: "linear-gradient(180deg, #fff 0%, #f8f8f8 50%, #f0f0f0 100%)",
          borderRadius: "3px",
          border: "1px solid #ccc",
          padding: "3% 5%",
        }}>
          {/* Rainbow stripe */}
          <div style={{
            height: "3px", marginBottom: "4%",
            background: "linear-gradient(90deg, #ff3333, #ff8833, #ffff33, #33ff33, #3388ff, #8833ff)",
            borderRadius: "1px",
          }} />
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(3px, 0.38vw, 7px)",
            color: "#333",
            marginBottom: "3%",
          }}>
            TOKAMAK Q3 REPORT
          </div>
          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: "clamp(5px, 0.5vw, 9px)",
            color: "#666",
          }}>
            ECOSYSTEM UPDATES
          </div>
          {/* Small label details */}
          <div style={{
            position: "absolute", bottom: "8%", right: "5%",
            fontFamily: "'VT323', monospace",
            fontSize: "clamp(3px, 0.25vw, 5px)",
            color: "#aaa",
          }}>
            SIDE A · 60min
          </div>
        </div>

        {/* Tape window */}
        <div style={{
          position: "absolute", left: "15%", right: "15%",
          top: "55%", height: "25%",
          background: "rgba(0,0,0,0.08)",
          borderRadius: "30% 30% 5% 5% / 20% 20% 5% 5%",
          border: "1px solid #bbb",
          display: "flex", alignItems: "center",
          justifyContent: "space-around",
          padding: "0 10%",
        }}>
          {/* Left reel */}
          <div style={{
            width: "22%", aspectRatio: "1",
            borderRadius: "50%",
            border: "2px solid #888",
            background: `radial-gradient(circle, #333 25%, transparent 27%),
              radial-gradient(circle, transparent 50%, #666 52%, transparent 54%),
              radial-gradient(circle, transparent 70%, #555 72%, transparent 74%),
              #ddd`,
            animation: "spin 3s linear infinite",
          }} />
          {/* Tape between reels */}
          <div style={{
            width: "30%", height: "15%",
            background: "#4a3020",
            borderRadius: "1px",
          }} />
          {/* Right reel */}
          <div style={{
            width: "22%", aspectRatio: "1",
            borderRadius: "50%",
            border: "2px solid #888",
            background: `radial-gradient(circle, #333 25%, transparent 27%),
              radial-gradient(circle, transparent 50%, #666 52%, transparent 54%),
              radial-gradient(circle, transparent 70%, #555 72%, transparent 74%),
              #ddd`,
            animation: "spin 3s linear infinite reverse",
          }} />
        </div>

        {/* Screw holes */}
        {[{ l: "5%", t: "5%" }, { r: "5%", t: "5%" }, { l: "5%", b: "5%" }, { r: "5%", b: "5%" }].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos,
            width: "clamp(3px, 0.35vw, 6px)", aspectRatio: "1",
            borderRadius: "50%",
            background: "radial-gradient(circle, #999, #777)",
            border: "1px solid #aaa",
          } as CSSProperties} />
        ))}

        {/* READ NOW link */}
        <div style={{
          position: "absolute", bottom: "6%", right: "6%",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(3px, 0.35vw, 6px)",
          color: "#ff6b9d",
          cursor: "pointer",
          textShadow: glow("#ff6b9d", 3),
        }}>
          READ NOW →
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ MAIN PAGE ═══════════════ */
export default function RetroPage() {
  const [price, setPrice] = useState<PriceData>(FALLBACK);
  const [activityIdx, setActivityIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [hideOverlays, setHideOverlays] = useState(false);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      try {
        const r = await fetch("/api/price"); const d = await r.json();
        if (d?.tonPrice) setPrice(d);
      } catch { /* fallback */ }
    };
    load(); const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActivityIdx(i => (i + 1) % ACTIVITIES.length), 2000);
    return () => clearInterval(id);
  }, []);

  const usd = price.tonPrice.current.usd;
  const staked = price.stakedVolume;
  const mcap = price.marketCap;
  const vol = price.tradingVolumeUSD;

  if (!mounted) return <div style={{ width: "100vw", height: "100vh", background: "#0a0a1a" }} />;

  return (
    <>
      {/* ═══ SECTION 1: VIDEO HERO ═══ */}
      <section style={{
        width: "100vw", height: "100vh", position: "relative", overflow: "hidden",
        background: "#0a0a1a",
      }}>
        <video autoPlay muted loop playsInline style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", opacity: 0.4,
        }}>
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(10,10,26,0.3) 0%, rgba(10,10,26,0.8) 100%)",
        }} />
        <div style={{
          position: "relative", zIndex: 2, height: "100%",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <h1 style={{
            fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(20px, 4vw, 56px)",
            color: "#fff", textShadow: glow("#00e5ff", 16), letterSpacing: "0.05em", marginBottom: 16,
          }}>TOKAMAK NETWORK</h1>
          <p style={{
            fontFamily: "'VT323', monospace", fontSize: "clamp(16px, 2vw, 28px)",
            color: "#00e5ff", textShadow: glow("#00e5ff", 6), opacity: 0.8,
          }}>BUILDING UNSTOPPABLE</p>
          <div style={{
            position: "absolute", bottom: 40, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 8, animation: "bounce 2s ease-in-out infinite",
          }}>
            <span style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: "#ffffff66" }}>SCROLL TO EXPLORE</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="#00e5ff" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: CONSTELLATION LAYOUT ═══ */}
      <section style={{
        width: "100vw", aspectRatio: "16 / 9",
        position: "relative", overflow: "hidden",
        background: "radial-gradient(ellipse at 30% 40%, #1a0a3e 0%, #0a0a1a 50%, #050510 100%)",
      }}>
        {/* Ambient blobs */}
        <div style={{ position: "absolute", right: 0, top: 0, width: "35%", height: "45%",
          background: "radial-gradient(circle at 80% 20%, #ff6b9d22 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: 0, bottom: 0, width: "40%", height: "50%",
          background: "radial-gradient(circle at 20% 80%, #4a0a3e33 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, bottom: 0, width: "35%", height: "45%",
          background: "radial-gradient(circle at 90% 90%, #ff6b9d15 0%, transparent 50%)", pointerEvents: "none" }} />

        {/* Toggle button */}
        <button onClick={() => setHideOverlays(o => !o)} style={{
          position: "absolute", top: 8, right: 8, zIndex: 60,
          background: "rgba(0,0,0,0.7)", color: "#fff", border: "1px solid #333",
          borderRadius: 6, padding: "4px 10px", fontSize: 11, fontFamily: "monospace", cursor: "pointer",
        }}>
          {hideOverlays ? "SHOW" : "HIDE"} OVERLAY
        </button>

        {/* Nav */}
        <nav style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "5.5%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 2.5%", zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
              fontSize: "clamp(12px, 1.3vw, 22px)", color: "#00e5ff", textShadow: glow("#00e5ff", 6) }}>⬡ TOKAMAK</span>
            <span style={{ fontFamily: "'VT323', monospace", fontSize: "clamp(8px, 0.7vw, 13px)",
              color: "#ffffff88", letterSpacing: "0.1em" }}>BLOCKCHAIN NETWORK</span>
          </div>
          <div style={{ display: "flex", gap: "2vw", alignItems: "center" }}>
            {["Dashboard", "Ecosystem", "Gaming", "Staking", "Community", "Docs"].map((item, i) => (
              <span key={item} style={{
                fontFamily: i === 2 || i === 3 ? "'Press Start 2P'" : "'VT323'",
                fontSize: i === 2 || i === 3 ? "clamp(5px, 0.55vw, 10px)" : "clamp(8px, 0.9vw, 15px)",
                color: i === 2 ? "#ff6b9d" : i === 3 ? "#00e5ff" : "#ffffffaa", cursor: "pointer",
                textShadow: i === 2 ? glow("#ff6b9d", 4) : i === 3 ? glow("#00e5ff", 4) : "none",
              }}>{item}</span>
            ))}
          </div>
        </nav>

        {/* Giant price */}
        <div style={{ position: "absolute", left: "2%", top: "14%", zIndex: 6 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(5px, 0.6vw, 10px)",
            color: "#ffffffcc", letterSpacing: "0.1em", marginBottom: "0.4vw" }}>TKM PRICE (USD)</div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
            fontSize: "clamp(36px, 9vw, 145px)", color: "#00e5ff",
            textShadow: `0 0 30px #00e5ff, 0 0 60px #00e5ffcc, 0 0 100px #00e5ff66`, lineHeight: 1 }}>
            $<Num value={usd} dec={2} />
          </div>
        </div>

        {/* Diagonal staked */}
        <div style={{ position: "absolute", left: "20%", top: "38%", zIndex: 6,
          transform: "rotate(-4deg)", transformOrigin: "left center" }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
            fontSize: "clamp(18px, 4.5vw, 72px)", color: "#ff6b9d",
            textShadow: `0 0 20px #ff6b9d, 0 0 40px #ff6b9dcc, 0 0 80px #ff6b9d44`,
            lineHeight: 1, whiteSpace: "nowrap" }}>
            <Num value={staked / 1e6} dec={1} />M TON STAKED
          </div>
        </div>

        {/* Object components */}
        {!hideOverlays && <>
          <GreenMonitor volume={vol} />
          <TurntableComponent />
          <LiveActivityCard activityIdx={activityIdx} />
          <CrtTV />
          <GameBoyCard />
          <CassetteTape />
        </>}

        {/* Connection lines */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}>
          <defs>
            <filter id="g"><feGaussianBlur stdDeviation="2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path d="M 30% 30% Q 40% 35%, 38% 45%" fill="none" stroke="#00e5ff" strokeWidth="1" strokeDasharray="6 4" opacity="0.2" filter="url(#g)" style={{ animation: "dash 3s linear infinite" }} />
          <path d="M 60% 22% Q 68% 28%, 76% 26%" fill="none" stroke="#ff6b9d" strokeWidth="1" strokeDasharray="6 4" opacity="0.2" filter="url(#g)" style={{ animation: "dash 4s linear infinite" }} />
          <path d="M 50% 58% Q 58% 62%, 60% 70%" fill="none" stroke="#00e5ff" strokeWidth="1" strokeDasharray="6 4" opacity="0.15" filter="url(#g)" style={{ animation: "dash 5s linear infinite" }} />
          <line x1="5%" y1="88%" x2="95%" y2="88%" stroke="#00e5ff" strokeWidth="0.5" strokeDasharray="8 6" opacity="0.1" filter="url(#g)" />
        </svg>

        {/* Bottom stats */}
        <div style={{ position: "absolute", bottom: "4%", left: "3%", display: "flex", gap: "2vw", zIndex: 8 }}>
          {[
            { label: "MARKET CAP:", value: `$${fmt(mcap, 1)}`, color: "#00e5ff" },
            { label: "24H VOLUME:", value: `$${fmt(vol, 1)}`, color: "#39ff14" },
            { label: "REPOS:", value: "49", color: "#ff6b9d" },
          ].map(s => (
            <div key={s.label} style={{ fontFamily: "'VT323', monospace",
              fontSize: "clamp(8px, 0.9vw, 14px)", color: "#ffffffaa" }}>
              {s.label} <span style={{ color: s.color, textShadow: glow(s.color, 4) }}>{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Press+Start+2P&family=VT323&display=swap');
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes dash { to { stroke-dashoffset: -40; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </>
  );
}
