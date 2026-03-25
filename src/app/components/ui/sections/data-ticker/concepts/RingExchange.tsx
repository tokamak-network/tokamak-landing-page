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

export default function RingExchange({ items }: ConceptProps) {
  // Split items for different zones
  const topMetrics = items.slice(0, 3);
  const bottomMetrics = items.slice(3, 6);
  const orbitingData = items.slice(0, 8);

  // Generate particle positions
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 15,
  }));

  return (
    <div className="relative w-full min-h-screen bg-[#040812] overflow-hidden">
      <style jsx>{`
        @keyframes torusRotate {
          from {
            transform: rotateY(0deg) rotateX(65deg);
          }
          to {
            transform: rotateY(360deg) rotateX(65deg);
          }
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(220px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(220px) rotate(-360deg);
          }
        }

        @keyframes orbitAlt {
          0% {
            transform: rotate(0deg) translateX(240px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(240px) rotate(-360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes floatReverse {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(8px);
          }
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes particleDrift {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(10px, -10px);
          }
          50% {
            transform: translate(-5px, 5px);
          }
          75% {
            transform: translate(5px, 10px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .torus-container {
          width: 400px;
          height: 400px;
          position: relative;
          transform-style: preserve-3d;
          animation: torusRotate 30s linear infinite;
        }

        .torus-ring {
          position: absolute;
          border-radius: 50%;
          border: 3px solid;
          border-color: #2a72e5;
          box-shadow: 0 0 20px rgba(42, 114, 229, 0.4),
            inset 0 0 20px rgba(42, 114, 229, 0.2);
        }

        .orbit-path {
          position: absolute;
          top: 50%;
          left: 50%;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .data-tag {
          position: absolute;
          top: -16px;
          left: -60px;
          width: 120px;
          padding: 6px 12px;
          background: rgba(4, 8, 18, 0.95);
          border: 1px solid #2a72e5;
          border-radius: 6px;
          box-shadow: 0 0 10px rgba(42, 114, 229, 0.3);
          backdrop-filter: blur(4px);
        }

        .floating-metric {
          animation: float 4s ease-in-out infinite;
        }

        .floating-metric-reverse {
          animation: floatReverse 4s ease-in-out infinite;
        }

        .ticker-container {
          animation: scroll 40s linear infinite;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #2a72e5;
          border-radius: 50%;
          opacity: 0.25;
          animation: particleDrift ease-in-out infinite,
            pulse 3s ease-in-out infinite;
        }

        .radial-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(
            circle,
            rgba(42, 114, 229, 0.15) 0%,
            rgba(42, 114, 229, 0.05) 30%,
            transparent 70%
          );
          pointer-events: none;
        }
      `}</style>

      {/* Background glow */}
      <div className="radial-glow" />

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s, 3s`,
          }}
        />
      ))}

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-16 pb-24">
        {/* Top metrics */}
        <div className="flex gap-12 mb-12">
          {topMetrics.map((item, i) => (
            <div
              key={i}
              className="floating-metric text-center"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <div
                className="text-sm font-mono text-blue-400/60 mb-1"
                style={{ fontFamily: "Share Tech Mono, monospace" }}
              >
                {item.label}
              </div>
              <div
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "Orbitron, monospace" }}
              >
                {item.prefix}
                {item.value}
                {item.suffix}
              </div>
              {item.change && (
                <div className="text-xs text-green-400 mt-1">
                  {item.change}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Torus hub with orbiting data */}
        <div className="relative flex items-center justify-center my-12">
          {/* Central torus */}
          <div className="torus-container">
            {/* Multiple rings for 3D torus effect */}
            <div
              className="torus-ring"
              style={{
                width: "400px",
                height: "120px",
                top: "140px",
                left: "0",
              }}
            />
            <div
              className="torus-ring"
              style={{
                width: "360px",
                height: "100px",
                top: "150px",
                left: "20px",
                opacity: 0.8,
              }}
            />
            <div
              className="torus-ring"
              style={{
                width: "320px",
                height: "80px",
                top: "160px",
                left: "40px",
                opacity: 0.6,
              }}
            />
            <div
              className="torus-ring"
              style={{
                width: "280px",
                height: "60px",
                top: "170px",
                left: "60px",
                opacity: 0.4,
              }}
            />

            {/* Center glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"
              style={{ animation: "pulse 4s ease-in-out infinite" }}
            />
          </div>

          {/* Orbiting data tags */}
          <div className="absolute inset-0 flex items-center justify-center">
            {orbitingData.map((item, i) => {
              const delay = -(i * (20 / orbitingData.length));
              const duration = 20 + (i % 2) * 5;
              const isAlt = i % 2 === 1;

              return (
                <div
                  key={i}
                  className="orbit-path"
                  style={{
                    animation: `${isAlt ? "orbitAlt" : "orbit"} ${duration}s linear infinite`,
                    animationDelay: `${delay}s`,
                  }}
                >
                  <div className="data-tag">
                    <div
                      className="text-[10px] text-blue-400/70 mb-0.5"
                      style={{ fontFamily: "Share Tech Mono, monospace" }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="text-sm font-bold text-white"
                      style={{ fontFamily: "Orbitron, monospace" }}
                    >
                      {item.prefix}
                      {item.value}
                      {item.suffix}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom metrics */}
        <div className="flex gap-12 mt-12">
          {bottomMetrics.map((item, i) => (
            <div
              key={i}
              className="floating-metric-reverse text-center"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <div
                className="text-sm font-mono text-blue-400/60 mb-1"
                style={{ fontFamily: "Share Tech Mono, monospace" }}
              >
                {item.label}
              </div>
              <div
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "Orbitron, monospace" }}
              >
                {item.prefix}
                {item.value}
                {item.suffix}
              </div>
              {item.change && (
                <div className="text-xs text-green-400 mt-1">
                  {item.change}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom LED ticker bar */}
      <div className="absolute bottom-0 left-0 right-0 h-9 bg-black/50 border-t border-[#D4A440] overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-[1px] bg-[#D4A440]"
          style={{
            boxShadow: "0 0 10px #D4A440, 0 0 20px rgba(212, 164, 64, 0.4)",
          }}
        />
        <div className="flex items-center h-full">
          <div className="ticker-container flex gap-8 whitespace-nowrap">
            {[...items, ...items].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-[#D4A440]"
                style={{ fontFamily: "Share Tech Mono, monospace" }}
              >
                <span className="text-xs opacity-70">{item.label}</span>
                <span className="text-sm font-bold" style={{ fontFamily: "Orbitron, monospace" }}>
                  {item.prefix}
                  {item.value}
                  {item.suffix}
                </span>
                {item.change && (
                  <span className="text-xs opacity-70">{item.change}</span>
                )}
                <span className="mx-4 opacity-30">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
