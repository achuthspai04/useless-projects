"use client";

import { useState } from "react";

const DEFAULT_HOVER_SCALE = 1.8;
// Seconds of offset per dot, so a cluster doesn't pulse in lockstep. Applied as a *negative*
// delay, which starts each dot part-way into its cycle instead of holding it still on load.
const BREATHE_STAGGER_S = 0.8;

function pickDifferentIndex(assets: readonly string[], excludeIndex: number) {
  const others = assets.map((_, i) => i).filter((i) => i !== excludeIndex);
  return others[Math.floor(Math.random() * others.length)];
}

// A dot badge that breathes - a slow expand/contract on a loop - and, on hover, grows and swaps
// to a random *different* color from `assets` (re-rolled fresh every hover-in), reverting to its
// own base color on hover-out. The breathing sits on a wrapper rather than the image because both
// it and the hover growth animate `transform`, and one element can only carry one of those.
export function HoverDot({
  assets,
  baseIndex,
  size,
  hoverScale = DEFAULT_HOVER_SCALE,
  className,
  style,
}: {
  assets: readonly string[];
  baseIndex: number;
  size: number;
  hoverScale?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  // null = at rest, showing its own base color.
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const isHovered = hoverIndex !== null;

  return (
    <span
      className={`animate-dot-breathe block ${className ?? ""}`}
      style={{
        ...style,
        width: size,
        height: size,
        animationDelay: `-${baseIndex * BREATHE_STAGGER_S}s`,
      }}
    >
      <img
        src={assets[isHovered ? hoverIndex : baseIndex]}
        alt=""
        className="block h-full w-full cursor-pointer"
        style={{ transform: isHovered ? `scale(${hoverScale})` : "scale(1)" }}
        onMouseEnter={() => setHoverIndex(pickDifferentIndex(assets, baseIndex))}
        onMouseLeave={() => setHoverIndex(null)}
      />
    </span>
  );
}
