"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AnimatedElephant from "./animated-elephant";
import LegoBlock, {
  columnBottoms,
  columnTops,
  LEGO_COLOR_NAMES,
  LEGO_DROP_SHAPES,
  LEGO_SHAPES,
  PITCH,
  shapeCols,
  shapeHeight,
  shapeRows,
  shapeWidth,
  type LegoColor,
  type LegoShapeName,
} from "./lego-block";

const ELE3_FRAMES = ["/ele3a.webp", "/ele3b.webp", "/ele3c.webp", "/ele3d.webp"];
const ELE5_SECONDARY_FRAMES = ["/ele5f.webp", "/ele5g.webp", "/ele5h.webp", "/ele5i.webp", "/ele5j.webp"];

// One square-celled grid over the whole hero. The number of columns comes from the container's
// measured width divided by a target cell size, so the cells stay roughly the same size whether
// this is a phone or a wide desktop - only the column count changes. The standing skyline fills
// the bottom SKYLINE_ROWS of it and blocks drop onto that.
const SKYLINE_ROWS = 4;
const MIN_COLUMNS = 8;
const MAX_COLUMNS = 44;

const FALL_ROWS_PER_MS = 0.0065;
const LAND_PAUSE_MS = 110;
const FLOOD_ROW_STAGGER_MS = 55;
const FLOOD_HOLD_MS = 1100;
const RESET_PAUSE_MS = 500;

interface Placed {
  col: number;
  /** Row index of the block's bottom edge, counted up from the floor. */
  bottom: number;
  shape: LegoShapeName;
  color: LegoColor;
}
interface Falling extends Placed {
  id: number;
}
interface FloodCell {
  col: number;
  row: number;
  color: LegoColor;
}

// Per-shape geometry in whole rows/columns, worked out once rather than on every spawn.
const GEOMETRY = Object.fromEntries(
  Object.keys(LEGO_SHAPES).map((name) => {
    const { rows } = LEGO_SHAPES[name as LegoShapeName];
    const height = shapeRows(rows);
    return [
      name,
      {
        cols: shapeCols(rows),
        rows: height,
        width: shapeWidth(rows),
        height: shapeHeight(rows),
        // How far above the block's own bottom edge each column's lowest filled cell sits...
        bottomLift: columnBottoms(rows).map((r) => (r === null ? null : height - 1 - r)),
        // ...and the row just above each column's highest cell, which is the surface it leaves.
        topLift: columnTops(rows).map((r) => (r === null ? null : height - r)),
      },
    ];
  })
) as Record<
  LegoShapeName,
  {
    cols: number;
    rows: number;
    width: number;
    height: number;
    bottomLift: (number | null)[];
    topLift: (number | null)[];
  }
>;

/** Every grid cell a placed block fills, as [col, row] counted up from the floor. */
function cellsOf({ col, bottom, shape }: Placed): [number, number][] {
  const { rows } = LEGO_SHAPES[shape];
  const height = rows.length;
  const out: [number, number][] = [];
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      if (rows[r][c] === "X") out.push([col + c, bottom + (height - 1 - r)]);
    }
  }
  return out;
}

/**
 * Row the block's bottom edge comes to rest at. Each of its columns has to clear whatever is
 * under that column, so the block stops as soon as its *first* column would hit - that's what
 * lets a notched shape nestle into a step rather than float above it.
 */
function landingRow(surface: number[], col: number, shape: LegoShapeName) {
  const { cols, bottomLift } = GEOMETRY[shape];
  let bottom = 0;
  for (let i = 0; i < cols; i++) {
    const lift = bottomLift[i];
    if (lift !== null) bottom = Math.max(bottom, surface[col + i] - lift);
  }
  return bottom;
}

/** True when every column of the block touches down exactly on the surface, leaving no cavity. */
function sitsFlush(surface: number[], col: number, shape: LegoShapeName, bottom: number) {
  const { cols, bottomLift } = GEOMETRY[shape];
  for (let i = 0; i < cols; i++) {
    const lift = bottomLift[i];
    if (lift !== null && bottom + lift !== surface[col + i]) return false;
  }
  return true;
}

// Laid edge to edge in this order, then repeated. Only shapes with a solid bottom row, so the
// base course always rests flat on the floor.
const BASE_COURSE: LegoShapeName[] = ["line", "brick", "line", "square", "tee", "brick", "square", "line"];
const SKYLINE_PALETTE: LegoColor[] = ["cyan", "cream", "red", "orange", "purple", "green", "magenta"];

/** Small deterministic PRNG, so a given width always builds the exact same board. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The board the visitor arrives to, built to fit whatever column count the container works out
 * to. A base course spans the full width so it rests flat on the floor; then, if `fillRows` asks
 * for more than that, it plays the board out to that height with the same landing rules the live
 * drop uses - which is what gives it the mixed shapes, colours and occasional gaps of a game
 * already in progress rather than a tidy wall. Entirely deterministic, so it's identical on every
 * render at a given size and never re-shuffles under the visitor.
 */
function buildSkyline(columns: number, fillRows: number) {
  const blocks: Placed[] = [];
  const surface: number[] = new Array(columns).fill(0);
  const segments: number[] = [];

  const put = (shape: LegoShapeName, col: number, bottom: number) => {
    blocks.push({
      shape,
      col,
      bottom,
      color: SKYLINE_PALETTE[blocks.length % SKYLINE_PALETTE.length],
    });
    const { cols, topLift } = GEOMETRY[shape];
    for (let i = 0; i < cols; i++) {
      const lift = topLift[i];
      if (lift !== null) surface[col + i] = Math.max(surface[col + i], bottom + lift);
    }
  };

  for (let col = 0, i = 0; col < columns; i++) {
    let shape = BASE_COURSE[i % BASE_COURSE.length];
    // Near the right edge, drop down to something that still fits in the gap.
    if (GEOMETRY[shape].cols > columns - col) shape = columns - col >= 2 ? "square" : "stud";
    put(shape, col, 0);
    segments.push(col);
    col += GEOMETRY[shape].cols;
  }

  if (fillRows > SKYLINE_ROWS) {
    // Play the board up to fillRows. Spots are picked from among the lowest available *plus one
    // row*, rather than strictly the lowest - that bit of slack is what leaves the overhangs and
    // trapped gaps that make it read as a game in progress instead of a solid block of colour.
    const random = mulberry32(columns * 7919 + fillRows);
    for (let guard = 0; guard < 4000; guard++) {
      const options: { col: number; shape: LegoShapeName; bottom: number }[] = [];
      for (const shape of LEGO_DROP_SHAPES) {
        const { cols, rows } = GEOMETRY[shape];
        for (let col = 0; col <= columns - cols; col++) {
          const bottom = landingRow(surface, col, shape);
          if (bottom + rows <= fillRows) options.push({ col, shape, bottom });
        }
      }
      if (options.length === 0) break;
      const lowest = Math.min(...options.map((o) => o.bottom));
      const near = options.filter((o) => o.bottom <= lowest + 1);
      const pick = near[Math.floor(random() * near.length)];
      put(pick.shape, pick.col, pick.bottom);
    }
  } else {
    // Just the base course - add a few toppers so the outline isn't a flat run.
    for (let s = 1; s < segments.length; s += 3) {
      const col = segments[s];
      for (const shape of ["ess", "square"] as LegoShapeName[]) {
        const { cols, rows } = GEOMETRY[shape];
        if (col + cols > columns) continue;
        const bottom = landingRow(surface, col, shape);
        if (bottom + rows > SKYLINE_ROWS || !sitsFlush(surface, col, shape, bottom)) continue;
        put(shape, col, bottom);
        break;
      }
    }
  }

  return { blocks, surface, cells: new Set(blocks.flatMap((b) => cellsOf(b).map(([c, r]) => `${c},${r}`))) };
}

/** Row a block starts its fall from - clear of the top of the screen. */
const spawnRow = (rows: number) => rows + 3;

export default function TetrisField({
  targetCell,
  prefill = 0,
}: {
  /** Preferred cell size in px; the column count is derived from it and the measured width. */
  targetCell: number;
  /** Fraction of the screen's height already stacked when the visitor arrives. 0 leaves just the
   *  low base course. */
  prefill?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [stack, setStack] = useState<Falling[]>([]);
  const [active, setActive] = useState<Falling | null>(null);
  const [falling, setFalling] = useState(false);
  const [flood, setFlood] = useState<FloodCell[] | null>(null);
  const surfaceRef = useRef<number[]>([]);
  // Mirrors `stack`, so the drop loop can read what has landed without a state updater. Reading
  // it through setStack would mean running the round-end logic inside an updater, and React
  // double-invokes those in StrictMode - which would start two drop loops racing each other.
  const landedRef = useRef<Falling[]>([]);
  const lastColorRef = useRef<LegoColor | null>(null);
  const idRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Zero sizes are reported too, and matter: the hero this sits in is display:none on the
    // other side of the `lg` breakpoint, and without them a field that scrolled out of use would
    // keep its last column count and go on running an invisible drop loop.
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 0 means "not laid out" - either not measured yet, or hidden by a breakpoint. The clamp below
  // would otherwise floor a zero width up to MIN_COLUMNS and start a field that's nowhere.
  const columns =
    size && size.width > 0 && size.height > 0
      ? Math.min(MAX_COLUMNS, Math.max(MIN_COLUMNS, Math.round(size.width / targetCell)))
      : 0;
  const cell = columns ? size!.width / columns : 0;
  const rows = columns ? Math.max(SKYLINE_ROWS + 1, Math.ceil(size!.height / cell)) : 0;

  const fillRows = columns ? Math.max(SKYLINE_ROWS, Math.round(rows * prefill)) : 0;
  const skyline = useMemo(
    () => (columns ? buildSkyline(columns, fillRows) : null),
    [columns, fillRows]
  );

  // Held in refs so the drop loop can read the latest values without restarting on every resize.
  const rowsRef = useRef(rows);
  const skylineRef = useRef(skyline);
  useEffect(() => {
    rowsRef.current = rows;
    skylineRef.current = skyline;
  }, [rows, skyline]);

  useEffect(() => {
    if (!columns || !skyline) return;
    const timers: number[] = [];
    const frames: number[] = [];
    let cancelled = false;
    surfaceRef.current = [...skyline.surface];
    landedRef.current = [];

    const after = (ms: number, fn: () => void) => {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) fn();
        }, ms)
      );
    };

    const reset = () => {
      setFlood(null);
      setStack([]);
      setActive(null);
      landedRef.current = [];
      surfaceRef.current = [...(skylineRef.current?.surface ?? [])];
      after(RESET_PAUSE_MS, spawn);
    };

    // The stack has reached the top: plug every cell still showing through with a single stud,
    // hold the full screen for a beat, then start the round over from a bare skyline.
    const floodAndReset = () => {
      const filled = new Set(skylineRef.current?.cells ?? []);
      for (const block of landedRef.current) {
        for (const [c, r] of cellsOf(block)) filled.add(`${c},${r}`);
      }
      const cells: FloodCell[] = [];
      for (let row = 0; row < rowsRef.current; row++) {
        for (let col = 0; col < columns; col++) {
          if (filled.has(`${col},${row}`)) continue;
          cells.push({
            col,
            row,
            color: LEGO_COLOR_NAMES[Math.floor(Math.random() * LEGO_COLOR_NAMES.length)],
          });
        }
      }
      setActive(null);
      setFlood(cells);
      after(rowsRef.current * FLOOD_ROW_STAGGER_MS + FLOOD_HOLD_MS, reset);
    };

    const spawn = () => {
      if (cancelled) return;
      const surface = surfaceRef.current;
      const limit = rowsRef.current;

      const options: { col: number; shape: LegoShapeName; bottom: number }[] = [];
      for (const shape of LEGO_DROP_SHAPES) {
        const { cols, rows: shapeH } = GEOMETRY[shape];
        for (let col = 0; col <= columns - cols; col++) {
          const bottom = landingRow(surface, col, shape);
          if (bottom + shapeH <= limit) options.push({ col, shape, bottom });
        }
      }

      if (options.length === 0) {
        floodAndReset();
        return;
      }

      // Keep the fill even: always drop into one of the lowest spots available rather than
      // anywhere at random, so the stack rises as a level layer instead of a few tall towers.
      const lowest = Math.min(...options.map((o) => o.bottom));
      const level = options.filter((o) => o.bottom === lowest);
      const spot = level[Math.floor(Math.random() * level.length)];
      // Colour is independent of shape, and never repeats the previous block's, so the stack
      // stays varied instead of running the same few colours as shapes come up again.
      const palette = LEGO_COLOR_NAMES.filter((c) => c !== lastColorRef.current);
      const color = palette[Math.floor(Math.random() * palette.length)];
      lastColorRef.current = color;
      const block = { id: idRef.current++, color, ...spot };

      setActive(block);
      setFalling(false);

      // Paint once at the spawn height before switching to the landing height - committing both
      // in the same render would give the browser nothing to interpolate.
      frames.push(
        requestAnimationFrame(() => {
          frames.push(
            requestAnimationFrame(() => {
              if (cancelled) return;
              setFalling(true);
              // Driven by a timer rather than `transitionend` so a throttled or backgrounded tab
              // that never fires the event can't strand the loop with nothing falling.
              after((spawnRow(limit) - block.bottom) / FALL_ROWS_PER_MS, () => {
                landedRef.current = [...landedRef.current, block];
                setStack(landedRef.current);
                const { cols, topLift } = GEOMETRY[block.shape];
                for (let i = 0; i < cols; i++) {
                  const lift = topLift[i];
                  if (lift !== null) surfaceRef.current[block.col + i] = block.bottom + lift;
                }
                setActive(null);
                after(LAND_PAUSE_MS, spawn);
              });
            })
          );
        })
      );
    };

    spawn();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      frames.forEach(cancelAnimationFrame);
      // StrictMode mounts effects twice in dev; drop the discarded run's blocks so they don't
      // linger as a frozen stack alongside the real run's.
      landedRef.current = [];
      setStack([]);
      setActive(null);
      setFlood(null);
    };
  }, [columns, skyline]);

  const unit = cell / PITCH;
  const place = ({ col, bottom, shape }: Placed) => ({
    left: col * cell,
    bottom: bottom * cell,
    width: GEOMETRY[shape].width * unit,
    height: GEOMETRY[shape].height * unit,
  });

  // Both creatures perch on top of whatever the skyline turned out to be under them.
  const perch = (fraction: number) => {
    const col = Math.min(columns - 2, Math.max(0, Math.round(columns * fraction)));
    return { left: col * cell, bottom: (skyline?.surface[col] ?? 0) * cell };
  };

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {skyline && (
        <>
          {skyline.blocks.map((piece) => (
            <LegoBlock
              key={`sky-${piece.col}-${piece.bottom}-${piece.shape}`}
              shape={piece.shape}
              color={piece.color}
              data-tetris-block="skyline"
              className="absolute"
              style={place(piece)}
            />
          ))}
          {stack.map((block) => (
            <LegoBlock
              key={block.id}
              shape={block.shape}
              color={block.color}
              data-tetris-block="landed"
              className="absolute"
              style={place(block)}
            />
          ))}
          {active && (
            <LegoBlock
              key={active.id}
              shape={active.shape}
              color={active.color}
              data-tetris-block="falling"
              className="absolute"
              style={{
                ...place(active),
                bottom: (falling ? active.bottom : spawnRow(rows)) * cell,
                transition: falling
                  ? `bottom ${(spawnRow(rows) - active.bottom) / FALL_ROWS_PER_MS}ms linear`
                  : "none",
              }}
            />
          )}
          {flood?.map(({ col, row, color }) => (
            <LegoBlock
              key={`${col},${row}`}
              shape="stud"
              color={color}
              data-tetris-block="flood"
              className="absolute animate-lego-pop"
              style={{
                left: col * cell,
                bottom: row * cell,
                width: (PITCH - 1) * unit,
                height: (PITCH - 1) * unit,
                animationDelay: `${row * FLOOD_ROW_STAGGER_MS}ms`,
              }}
            />
          ))}
          {/* A few seconds after the first burst finishes a second plays through f-j, 23% taller,
              growing upward from the same standing baseline. */}
          <AnimatedElephant
            secondaryFrames={ELE5_SECONDARY_FRAMES}
            secondaryScale={1.23}
            anchor="left"
            style={{ ...perch(0.8), height: cell * 0.85 }}
          />
          {/* Frames have different intrinsic widths at a fixed height (a fire breath), so this one
              grows rightward from a fixed left edge rather than staying centred. */}
          <AnimatedElephant
            frames={ELE3_FRAMES}
            anchor="left"
            frameIntervalMs={350}
            repeatCount={2}
            style={{ ...perch(0.18), height: cell * 0.9 }}
          />
        </>
      )}
    </div>
  );
}
