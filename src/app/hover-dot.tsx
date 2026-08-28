"use client";

import { useState } from "react";

const DEFAULT_HOVER_SCALE = 1.8;

function pickDifferentIndex(assets: readonly string[], excludeIndex: number) {
  const others = assets.map((_, i) => i).filter((i) => i !== excludeIndex);
  return others[Math.floor(Math.random() * others.length)];
}

// A dot badge that, on hover, grows and swaps to a random *different* color from `assets`
// (re-rolled fresh every hover-in), reverting to its own base color on hover-out.
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
    <img
      src={assets[isHovered ? hoverIndex : baseIndex]}
      alt=""
      className={`cursor-pointer transition-transform duration-300 ease-out ${className ?? ""}`}
      style={{
        ...style,
        width: size,
        height: size,
        transform: isHovered ? `scale(${hoverScale})` : "scale(1)",
      }}
      onMouseEnter={() => setHoverIndex(pickDifferentIndex(assets, baseIndex))}
      onMouseLeave={() => setHoverIndex(null)}
    />
  );
}
