"use client";
import styles from "./Roller.module.css";
import { useEffect, useId } from "react";
import { useRollerTokens } from "./hooks/useRollerToken";
import { useRollerAnimation } from "./hooks/useRollerAnimation";

interface RollerProps {
  value: number;
  suffix?: string;
  suffixPosition?: "front" | "back";
  align?: "left" | "center" | "right";
  fontSize?: number;
  rollDuration?: number;
  shiftDuration?: number;
  staggering?: boolean;
  diff?: boolean;
  rollWay?: "up" | "down";
  showAfterFontNameLoaded?: string[];
  style?: React.CSSProperties;
}

export default function Roller({
  value,
  suffix = "",
  suffixPosition = "back",
  align = "center",
  fontSize = 48,
  rollDuration = 0.6,
  shiftDuration = 0.45,
  staggering = false,
  diff = false,
  rollWay = "down",
  showAfterFontNameLoaded = [],
  style,
}: RollerProps) {
  const id = useId();
  const tokens = useRollerTokens(id, value, rollWay);

  useRollerAnimation(
    {
      id,
      value,
      rollDuration,
      shiftDuration,
      staggering,
      rollWay,
      showAfterFontNameLoaded,
      diff,
    },
    [fontSize]
  );

  useEffect(() => {
    const token = document.querySelector(
      `.token-roller[data-roller-id="${id}"] > .token`
    );
    if (!token) return;

    const { height } = token.getBoundingClientRect();
    const values = document.querySelector(
      `div.values[data-roller-id="${id}"]`
    ) as HTMLDivElement;
    values.style.height = `${height}px`;
  }, [id, value, fontSize]);

  return (
    <div
      className={`${styles.roller} ${styles[align]}`}
      style={{
        fontSize: `${fontSize}px`,
        ...style,
      }}
    >
      {suffix != "" && suffixPosition === "front" && (
        <div className={styles.suffix}>{suffix}</div>
      )}
      <div className={`${styles.values} values`} data-roller-id={id}>
        <div
          className={`${styles["token-container"]} ${styles[rollWay]}`}
          style={{
            letterSpacing: "-0.02em",
            fontFeatureSettings: '"tnum" on, "lnum" on',
          }}
        >
          {tokens}
        </div>
      </div>
      {suffix != "" && suffixPosition === "back" && (
        <div className={styles.suffix}>{suffix}</div>
      )}
    </div>
  );
}
