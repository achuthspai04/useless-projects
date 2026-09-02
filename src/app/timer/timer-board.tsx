"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import LegoBlock, { PITCH } from "../lego-block";
import { buildSkyline, FALL_ROWS_PER_MS, placeBlock, spawnRow, type Placed } from "../tetris-field";

const TARGET_CELL = 56;
const MIN_COLUMNS = 8;
const MAX_COLUMNS = 44;
// Floor on the gap between one piece landing and the next starting to fall, so a very short
// countdown (few blocks needed per second) still reads as discrete drops rather than a blur.
const MIN_LAND_PAUSE_MS = 110;

/** The one piece currently falling: painted at `spawnRow` first, then - once the browser has
 *  actually committed that frame - transitioned down to its landing spot. `cycleMs` is this
 *  block's whole time budget (fall + the pause before the next one starts) - see TimerBoard for
 *  where that comes from. Calls `onLanded` once the full cycle (not just the fall) is done. */
function FallingBlock({
  piece,
  cell,
  unit,
  rows,
  cycleMs,
  onLanded,
}: {
  piece: Placed;
  cell: number;
  unit: number;
  rows: number;
  cycleMs: number;
  onLanded: () => void;
}) {
  const box = placeBlock(piece, cell, unit);
  const [falling, setFalling] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);

  // The fall itself stays at the hero's own natural speed - snappy - and only ever gets faster,
  // never slower, than that: what stretches to fit a longer countdown is the pause after it,
  // not the drop. A budget shorter than the natural fall (many blocks, very little time) instead
  // speeds the fall up to fit, so the queue can't permanently fall behind schedule.
  const fallRows = spawnRow(rows) - piece.bottom;
  const naturalFallMs = fallRows / FALL_ROWS_PER_MS;
  const fallMs = Math.max(1, Math.min(naturalFallMs, cycleMs - MIN_LAND_PAUSE_MS));
  const pauseMs = Math.max(MIN_LAND_PAUSE_MS, cycleMs - fallMs);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    // Reading a layout property forces the browser to actually commit/paint the spawn-position
    // frame (transition: none) before this flips to the landing position - without that flush
    // the two style changes can land in the same paint, leaving nothing for the transition to
    // interpolate from (it would just snap).
    void el.getBoundingClientRect();
    setFalling(true);
    const id = setTimeout(onLanded, fallMs + pauseMs);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per mounted piece (key'd by the caller)
  }, []);

  return (
    <div
      ref={elRef}
      className="absolute"
      style={{
        left: box.left,
        width: box.width,
        height: box.height,
        bottom: falling ? box.bottom : spawnRow(rows) * cell,
        transition: falling ? `bottom ${fallMs}ms linear` : "none",
      }}
    >
      <LegoBlock shape={piece.shape} color={piece.color} className="size-full" />
    </div>
  );
}

/**
 * The countdown's background: a lego skyline that fills in one piece at a time, paced by the
 * countdown itself so the board reaches fully flooded right as `remainingMs` hits zero.
 *
 * The board's final layout is built once (see `buildSkyline`, the same deterministic layout the
 * hero's flooded reveal uses) rather than resimulated as it fills - that would reseed the
 * layout's own RNG on every change and make already-placed blocks jump to different spots.
 */
export default function TimerBoard({ progress, remainingMs }: { progress: number; remainingMs: number | null }) {
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
  const totalBlocks = skyline?.blocks.length ?? 0;

  // How many pieces have actually landed (rendered as plain static blocks - see below), and
  // which single index (if any) is currently mid-fall. Both reset whenever the board itself is
  // rebuilt (a real resize), since they're indices into that specific block list.
  const [landed, setLanded] = useState(0);
  const [fallingAt, setFallingAt] = useState<number | null>(null);
  useEffect(() => {
    setLanded(0);
    setFallingAt(null);
  }, [skyline]);

  const clamped = Math.min(1, Math.max(0, progress));
  const target = Math.min(totalBlocks, Math.floor(totalBlocks * clamped));

  // Behind schedule and nothing currently falling - drop the next one. Re-checked whenever
  // `progress` ticks forward or a piece finishes landing, so the queue keeps draining toward
  // `target` without ever having two pieces in the air together.
  useEffect(() => {
    if (fallingAt === null && landed < target) setFallingAt(landed);
  }, [fallingAt, landed, target]);

  // Whatever's left of the countdown, split across whatever blocks are still outstanding, so a
  // freshly-mounted FallingBlock always gets the true remaining share (not one fixed per-block
  // share baked in up front) - if earlier drops ever ran a touch behind, later ones automatically
  // speed up to close the gap, guaranteeing the board reaches fully flooded right as remainingMs
  // hits zero rather than trailing off after it.
  const remainingBlocks = totalBlocks - landed;
  const cycleMs =
    remainingMs && remainingBlocks > 0
      ? Math.max(MIN_LAND_PAUSE_MS / 2, remainingMs / remainingBlocks)
      : MIN_LAND_PAUSE_MS;

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {skyline &&
        skyline.blocks.slice(0, landed).map((piece) => {
          const box = placeBlock(piece, cell, unit);
          return (
            <LegoBlock
              key={`${piece.col}-${piece.bottom}-${piece.shape}`}
              shape={piece.shape}
              color={piece.color}
              className="absolute"
              style={box}
            />
          );
        })}
      {skyline && fallingAt !== null && (
        <FallingBlock
          key={fallingAt}
          piece={skyline.blocks[fallingAt]}
          cell={cell}
          unit={unit}
          rows={rows}
          cycleMs={cycleMs}
          onLanded={() => {
            setLanded((n) => n + 1);
            setFallingAt(null);
          }}
        />
      )}
    </div>
  );
}
