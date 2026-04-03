"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyWebGLProps {
  children: ReactNode;
  /** Extra margin around viewport to pre-mount before visible. Default "200px" */
  rootMargin?: string;
  /** CSS class for the wrapper div */
  className?: string;
  /** Inline styles for the wrapper div */
  style?: React.CSSProperties;
}

export default function LazyWebGL({
  children,
  rootMargin = "200px",
  className,
  style,
}: LazyWebGLProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className} style={style}>
      {visible ? children : null}
    </div>
  );
}
