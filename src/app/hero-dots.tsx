"use client";

import { useState } from "react";

// 25% bigger than the previous resting size (47.8px -> 59.75px).
const DOT_SIZE_PX = 59.75;
const HOVER_SCALE = 1.8;
// Figma has each pair essentially touching (a ~0.3px gap at full scale), so a small explicit gap
// keeps that same tight, adjacent look at this size instead of drifting apart.
const PAIR_GAP_PX = 5;

// Anchors are each pair's outer edge - the left pair's left edge, the right pair's right edge -
// matching where the corner clusters sit in the Figma hero (node 143:6182). The second dot in
// each pair is derived from DOT_SIZE_PX/PAIR_GAP_PX so the pair stays adjacent if either changes.
const LEFT_PAIR_LEFT_PX = 51;
const LEFT_PAIR_TOP_PX = 46.5;
const RIGHT_PAIR_RIGHT_PX = 1931.6;
const RIGHT_PAIR_TOP_PX = 0;

const DOT_ASSETS = ["/hero-dot-1.svg", "/hero-dot-2.svg", "/hero-dot-3.svg", "/hero-dot-4.svg"] as const;

const DOTS = [
  { baseIndex: 1, left: `${LEFT_PAIR_LEFT_PX}px`, top: `${LEFT_PAIR_TOP_PX}px` },
  {
    baseIndex: 0,
    left: `${LEFT_PAIR_LEFT_PX + DOT_SIZE_PX + PAIR_GAP_PX}px`,
    top: `${LEFT_PAIR_TOP_PX - 1.5}px`,
  },
  {
    baseIndex: 3,
    left: `${RIGHT_PAIR_RIGHT_PX - 2 * DOT_SIZE_PX - PAIR_GAP_PX}px`,
    top: `${RIGHT_PAIR_TOP_PX}px`,
  },
  { baseIndex: 2, left: `${RIGHT_PAIR_RIGHT_PX - DOT_SIZE_PX}px`, top: `${RIGHT_PAIR_TOP_PX}px` },
] as const;

function pickDifferentIndex(excludeIndex: number) {
  const others = DOT_ASSETS.map((_, i) => i).filter((i) => i !== excludeIndex);
  return others[Math.floor(Math.random() * others.length)];
}

function HeroDot({ baseIndex, left, top }: { baseIndex: number; left: string; top: string }) {
  // null = at rest, showing its own base color. Set (to a different index) on hover, so
  // "become a random big of a different color" is re-rolled fresh on every hover-in.
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const isHovered = hoverIndex !== null;

  return (
    <img
      src={DOT_ASSETS[isHovered ? hoverIndex : baseIndex]}
      alt=""
      className="absolute cursor-pointer transition-transform duration-300 ease-out"
      style={{
        left,
        top,
        width: DOT_SIZE_PX,
        height: DOT_SIZE_PX,
        transform: isHovered ? `scale(${HOVER_SCALE})` : "scale(1)",
      }}
      onMouseEnter={() => setHoverIndex(pickDifferentIndex(baseIndex))}
      onMouseLeave={() => setHoverIndex(null)}
    />
  );
}

export default function HeroDots() {
  return (
    <>
      {DOTS.map((dot) => (
        <HeroDot key={dot.baseIndex} baseIndex={dot.baseIndex} left={dot.left} top={dot.top} />
      ))}
    </>
  );
}
