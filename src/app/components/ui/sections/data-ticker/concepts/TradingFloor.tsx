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

export default function TradingFloor({ items }: ConceptProps) {
  // Split items into market and dev categories
  const marketItems = items.slice(0, 3);
  const devItems = items.slice(3, 6);

  return (
    <div className="relative w-full h-[500px] bg-[#050510] overflow-hidden">
      {/* Scanline effect overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)',
        }}
      />

      {/* Top ticker bar - scrolling left to right */}
      <div className="absolute top-0 left-0 right-0 h-11 border-b border-cyan-900/30 bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center h-full gap-2 px-4">
          {/* LIVE indicator */}
          <div className="flex items-center gap-2 mr-6 shrink-0">
            <div className="relative">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full blur-sm animate-pulse" />
            </div>
            <span className="text-green-400 text-xs font-mono tracking-wider">LIVE</span>
          </div>

          {/* Scrolling ticker items */}
          <div className="flex gap-8 animate-scroll-left">
            {[...marketItems, ...marketItems, ...marketItems].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 shrink-0">
                <span className="text-cyan-300/60 text-xs font-['Share_Tech_Mono'] tracking-wider">
                  {item.label}
                </span>
                <span
                  className="text-cyan-400 text-sm font-['Orbitron'] font-bold"
                  style={{
                    textShadow: '0 0 10px rgba(34,211,238,0.5), 0 0 20px rgba(34,211,238,0.3)',
                  }}
                >
                  {item.prefix}{item.value}{item.suffix}
                </span>
                {item.change && (
                  <span className="text-green-400 text-xs font-mono">
                    {item.change}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center section with torus */}
      <div className="absolute inset-0 top-11 bottom-11 flex items-center justify-center">
        <div className="relative">
          {/* SVG Torus wireframe */}
          <svg
            width="300"
            height="300"
            viewBox="0 0 300 300"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <g className="animate-spin-slow" style={{ transformOrigin: 'center' }}>
              {/* Outer ring ellipses */}
              <ellipse
                cx="150"
                cy="150"
                rx="120"
                ry="80"
                fill="none"
                stroke="#2A72E5"
                strokeWidth="1.5"
                filter="url(#glow)"
                opacity="0.8"
              />
              <ellipse
                cx="150"
                cy="150"
                rx="110"
                ry="72"
                fill="none"
                stroke="#2A72E5"
                strokeWidth="1"
                filter="url(#glow)"
                opacity="0.6"
              />

              {/* Inner tube cross-sections */}
              <ellipse
                cx="90"
                cy="150"
                rx="25"
                ry="35"
                fill="none"
                stroke="#2A72E5"
                strokeWidth="1"
                filter="url(#glow)"
                opacity="0.5"
              />
              <ellipse
                cx="210"
                cy="150"
                rx="25"
                ry="35"
                fill="none"
                stroke="#2A72E5"
                strokeWidth="1"
                filter="url(#glow)"
                opacity="0.5"
              />

              {/* Vertical cross-sections */}
              <ellipse
                cx="150"
                cy="95"
                rx="35"
                ry="20"
                fill="none"
                stroke="#2A72E5"
                strokeWidth="1"
                filter="url(#glow)"
                opacity="0.4"
              />
              <ellipse
                cx="150"
                cy="205"
                rx="35"
                ry="20"
                fill="none"
                stroke="#2A72E5"
                strokeWidth="1"
                filter="url(#glow)"
                opacity="0.4"
              />

              {/* Inner ring */}
              <ellipse
                cx="150"
                cy="150"
                rx="80"
                ry="50"
                fill="none"
                stroke="#2A72E5"
                strokeWidth="1"
                filter="url(#glow)"
                opacity="0.3"
              />
            </g>
          </svg>

          {/* Center metrics */}
          <div className="relative z-10 text-center space-y-6">
            <div className="space-y-1">
              <div className="text-gray-500 text-xs font-['Share_Tech_Mono'] tracking-widest">
                TOTAL VALUE LOCKED
              </div>
              <div
                className="text-5xl font-['Orbitron'] font-bold text-blue-400"
                style={{
                  textShadow: '0 0 20px rgba(37,99,235,0.5)',
                }}
              >
                $2.4B
              </div>
            </div>

            <div className="flex gap-8 justify-center">
              <div className="space-y-1">
                <div className="text-gray-600 text-[10px] font-['Share_Tech_Mono'] tracking-widest">
                  24H VOL
                </div>
                <div
                  className="text-xl font-['Orbitron'] font-semibold text-cyan-400"
                  style={{
                    textShadow: '0 0 15px rgba(34,211,238,0.4)',
                  }}
                >
                  $156M
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-600 text-[10px] font-['Share_Tech_Mono'] tracking-widest">
                  PROTOCOLS
                </div>
                <div
                  className="text-xl font-['Orbitron'] font-semibold text-cyan-400"
                  style={{
                    textShadow: '0 0 15px rgba(34,211,238,0.4)',
                  }}
                >
                  48
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ticker bar - scrolling right to left */}
      <div className="absolute bottom-0 left-0 right-0 h-11 border-t border-amber-900/30 bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center h-full">
          <div className="flex gap-8 animate-scroll-right">
            {[...devItems, ...devItems, ...devItems].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 shrink-0">
                <span className="text-amber-300/60 text-xs font-['Share_Tech_Mono'] tracking-wider">
                  {item.label}
                </span>
                <span
                  className="text-amber-400 text-sm font-['Orbitron'] font-bold"
                  style={{
                    textShadow: '0 0 10px rgba(251,191,36,0.5), 0 0 20px rgba(251,191,36,0.3)',
                  }}
                >
                  {item.prefix}{item.value}{item.suffix}
                </span>
                {item.change && (
                  <span className="text-green-400 text-xs font-mono">
                    {item.change}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
