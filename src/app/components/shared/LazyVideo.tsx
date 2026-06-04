"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

interface LazyVideoProps {
  /** mp4 source path */
  src: string;
  /** poster shown before the video is fetched (always visible until first frame) */
  poster?: string;
  className?: string;
  style?: CSSProperties;
  /** Start fetching this far before the element enters the viewport. */
  rootMargin?: string;
  muted?: boolean;
  loop?: boolean;
  ariaHidden?: boolean;
}

/**
 * Viewport-gated background video.
 *
 * The whole point: with `preload="none"` and the <source> withheld until the
 * element nears the viewport, off-screen videos do NOT compete for bandwidth on
 * initial page load. Only the poster (a small JPG) paints up front; the actual
 * clip is fetched + played the first time it scrolls into view, and paused when
 * it leaves. This is what keeps the above-the-fold hero from being starved by a
 * dozen background clips all downloading at once.
 */
export default function LazyVideo({
  src,
  poster,
  className,
  style,
  rootMargin = "300px",
  muted = true,
  loop = true,
  ariaHidden = true,
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  // Once true, the <source> is attached and stays attached (so scrolling back
  // hits cache instead of re-downloading).
  const [activated, setActivated] = useState(false);
  const inViewRef = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setActivated(true);
          v.play?.().catch(() => {});
        } else {
          v.pause?.();
        }
      },
      { rootMargin }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [rootMargin]);

  // When the source first attaches, kick off the download + playback if we're
  // (still) on screen.
  useEffect(() => {
    const v = ref.current;
    if (!v || !activated) return;
    if (inViewRef.current) {
      if (v.readyState === 0) v.load();
      v.play?.().catch(() => {});
    }
  }, [activated]);

  return (
    <video
      ref={ref}
      muted={muted}
      loop={loop}
      playsInline
      preload="none"
      poster={poster}
      aria-hidden={ariaHidden}
      className={className}
      style={style}
    >
      {activated && <source src={src} type="video/mp4" />}
    </video>
  );
}
