"use client";

import { useState } from "react";

interface StreamItem {
  time: string;
  repoName: string;
  text: string;
}

interface StreamClientProps {
  items: StreamItem[];
}

export default function StreamClient({ items }: StreamClientProps) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section id="activity-stream" className="relative z-10 w-full flex justify-center px-6 py-[80px]">
      <div className="w-full max-w-[1280px] flex flex-col items-center">
        {/* Section header */}
        <h2 className="text-[38px] md:text-[48px] font-[900] text-white tracking-[0.06em] uppercase mb-3 text-center">
          Activity
        </h2>
        <div className="w-10 h-[3px] bg-primary mx-auto mb-5" />
        <p className="text-[16px] text-[#929298] mb-[60px] text-center">
          Latest development activity across the ecosystem
        </p>

        {/* Stream container */}
        <div
          className="relative w-full h-[400px] [@media(max-width:768px)]:h-[200px] overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Top/bottom fade masks */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

          {/* Scrolling content - CSS animation */}
          <div
            className={`flex flex-col gap-0 animate-scroll-vertical ${isPaused ? "[animation-play-state:paused]" : ""}`}
          >
            {/* Duplicate items for seamless loop */}
            {[...items, ...items].map((item, i) => (
              <div
                key={`${item.repoName}-${item.text}-${i}`}
                className="flex items-start gap-4 px-6 py-3 border-b border-[#1a1a1d] hover:bg-[#0a0a0a] transition-colors duration-200"
              >
                <span className="text-[11px] text-[#929298] font-orbitron shrink-0 w-[80px] tabular-nums">
                  {item.time}
                </span>
                <span className="text-[13px] font-[700] text-primary shrink-0 min-w-[120px]">
                  {item.repoName}
                </span>
                <span className="text-[13px] text-[#c5c5ca] leading-relaxed">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
