"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import LegoBlock, { LEGO_SHAPES, PITCH, shapeRows } from "../lego-block";
import { buildSkyline, placeBlock } from "../tetris-field";

const TARGET_CELL = 56;
const MIN_COLUMNS = 8;
const MAX_COLUMNS = 44;

/**
 * The countdown's background: a lego skyline that fills from empty toward the ceiling as
 * `progress` (0..1) rises, reaching fully flooded right as the timer hits zero.
 *
 * The board is built once at its *final* height (see `buildSkyline`, the same deterministic
 * layout the hero's flooded reveal uses) rather than rebuilt on every tick - rebuilding per tick
 * would reseed the layout's own RNG each time and make already-placed blocks jump to different
 * spots as the fill grows, instead of the same blocks just accumulating. Progress only changes
 * which of that fixed set of blocks are revealed (their own footprint has fully landed below the
 * current fill line), which is a cheap filter rather than a resimulation.
 */
export default function TimerBoard({ progress }: { progress: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const columns =
    size && size.width > 0 && size.height > 0
      ? Math.min(MAX_COLUMNS, Math.max(MIN_COLUMNS, Math.round(size.width / TARGET_CELL)))
      : 0;
  const cell = columns ? size!.width / columns : 0;
  const rows = columns ? Math.max(1, Math.ceil(size!.height / cell)) : 0;
  const unit = cell / PITCH;

  const skyline = useMemo(() => (columns && rows ? buildSkyline(columns, rows) : null), [columns, rows]);

  const clamped = Math.min(1, Math.max(0, progress));
  const fillRows = rows * clamped;

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {skyline?.blocks
        .filter((piece) => piece.bottom + shapeRows(LEGO_SHAPES[piece.shape].rows) <= fillRows)
        .map((piece) => {
          const box = placeBlock(piece, cell, unit);
          return (
            <LegoBlock
              key={`${piece.col}-${piece.bottom}-${piece.shape}`}
              shape={piece.shape}
              color={piece.color}
              className="animate-lego-pop absolute"
              style={box}
            />
          );
        })}
    </div>
  );
}
