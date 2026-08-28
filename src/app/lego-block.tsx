// The lego blocks the site is built from. Everything derives from one fundamental cell - a 60x60
// square - with a 1-unit gap between neighbouring cells, so a multi-cell block reads as separate
// studs rather than one solid slab. Blocks are drawn as SVG rather than laid out with real DOM
// boxes so the gap scales with the block instead of staying a fixed 1px as the block resizes.
export const CELL = 60;
export const GAP = 1;
export const PITCH = CELL + GAP;

export const LEGO_COLORS = {
  red: "#E82803",
  purple: "#5C3095",
  cyan: "#06C3FB",
  green: "#14B73E",
  cream: "#FCFBB9",
  orange: "#F68729",
  magenta: "#EA34DF",
} as const;

export type LegoColor = keyof typeof LEGO_COLORS;

// Each shape is a small bitmap - "X" is a filled cell, "." is a hole. Rows must all be the same
// length; `shapeCols` reads the width off the first one. The `color` here is only a fallback -
// shape and colour are independent, and callers pass whichever colour they want.
export const LEGO_SHAPES = {
  ess: { color: "purple", rows: ["X.", "XX", ".X"] },
  brick: { color: "red", rows: ["XX", "XX", "XX"] },
  line: { color: "cyan", rows: ["XXX"] },
  square: { color: "cream", rows: ["XX", "XX"] },
  tee: { color: "green", rows: [".X.", "XXX"] },
  // A bare single cell. Not one of the five designed pieces, so it never drops - it exists to
  // plug the leftover one-cell gaps when the board floods at the end of a round.
  stud: { color: "cyan", rows: ["X"] },
} as const;

export type LegoShapeName = keyof typeof LEGO_SHAPES;
export const LEGO_SHAPE_NAMES = Object.keys(LEGO_SHAPES) as LegoShapeName[];
// The five pieces that actually fall.
export const LEGO_DROP_SHAPES: LegoShapeName[] = ["ess", "brick", "line", "square", "tee"];
export const LEGO_COLOR_NAMES = Object.keys(LEGO_COLORS) as LegoColor[];

type Rows = readonly string[];

export const shapeCols = (rows: Rows) => rows[0].length;
export const shapeRows = (rows: Rows) => rows.length;
// Outer size in cell units: n cells plus the n-1 gaps between them.
export const shapeWidth = (rows: Rows) => shapeCols(rows) * PITCH - GAP;
export const shapeHeight = (rows: Rows) => shapeRows(rows) * PITCH - GAP;

// Index of the lowest filled cell in each column, or null for a column that's all holes. This is
// the underside a block comes to rest on, which is what a stacking drop needs - the "ess" shape,
// for instance, ends lower in its right column than its left.
export function columnBottoms(rows: Rows): (number | null)[] {
  return Array.from({ length: shapeCols(rows) }, (_, col) => {
    for (let row = rows.length - 1; row >= 0; row--) if (rows[row][col] === "X") return row;
    return null;
  });
}

// ...and the highest filled cell per column, which becomes the new surface once it has landed.
export function columnTops(rows: Rows): (number | null)[] {
  return Array.from({ length: shapeCols(rows) }, (_, col) => {
    for (let row = 0; row < rows.length; row++) if (rows[row][col] === "X") return row;
    return null;
  });
}

export default function LegoBlock({
  shape,
  color,
  className,
  style,
  ...rest
}: {
  shape: LegoShapeName;
  /** Overrides the shape's own colour. Used by the end-of-round flood fill. */
  color?: LegoColor;
  className?: string;
  style?: React.CSSProperties;
} & Omit<React.SVGProps<SVGSVGElement>, "color">) {
  const { color: defaultColor, rows } = LEGO_SHAPES[shape];
  const fill = LEGO_COLORS[color ?? defaultColor];

  return (
    <svg
      viewBox={`0 0 ${shapeWidth(rows)} ${shapeHeight(rows)}`}
      // Matches the other skyline art: the block is stretched to whatever box it's given rather
      // than letter-boxed inside it. Both axes share the same pitch, so cells stay square.
      preserveAspectRatio="none"
      className={className}
      style={style}
      aria-hidden="true"
      {...rest}
    >
      {rows.flatMap((row, r) =>
        [...row].map((filled, c) =>
          filled === "X" ? (
            <rect
              key={`${r}-${c}`}
              x={c * PITCH}
              y={r * PITCH}
              width={CELL}
              height={CELL}
              fill={fill}
            />
          ) : null
        )
      )}
    </svg>
  );
}
