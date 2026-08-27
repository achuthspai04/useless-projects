import AnimatedElephant from "./animated-elephant";

const ELE3_FRAMES = ["/ele3a.webp", "/ele3b.webp", "/ele3c.webp", "/ele3d.webp"];
const ELE5_SECONDARY_FRAMES = ["/ele5f.webp", "/ele5g.webp", "/ele5h.webp", "/ele5i.webp", "/ele5j.webp"];

interface Piece {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

// Positions are percentages of the skyline's own bounding box (1279 x 251.00025939941406),
// taken from the Figma "Character Container" frame (node 143:6207). For the pieces that are
// rotated 90deg in Figma, the rotation is baked directly into the SVG file (viewBox + a
// `rotate(90)` transform on the root group), and Figma's metadata x for those is the box's
// right edge rather than the left, so left = metadataX - width.
const PIECES: Piece[] = [
  { src: "/tetris-cyan.svg", left: 0, top: 79.82, width: 14.12, height: 19.68 },
  { src: "/tetris-red.svg", left: 14.23, top: 39.7, width: 9.39, height: 59.75 },
  { src: "/tetris-green-a.svg", left: 90.54, top: 0.32, width: 9.39, height: 59.75 },
  { src: "/tetris-orange-a.svg", left: 23.76, top: 59.76, width: 14.12, height: 39.66 },
  { src: "/tetris-green-b.svg", left: 42.85, top: 59.84, width: 14.12, height: 39.66 },
  { src: "/tetris-yellow.svg", left: 0, top: 39.29, width: 9.38, height: 39.66 },
  { src: "/tetris-orange-b.svg", left: 76.15, top: 60.17, width: 9.38, height: 39.66 },
  { src: "/tetris-magenta-a.svg", left: 38.04, top: 19.65, width: 4.65, height: 79.85 },
  { src: "/tetris-magenta-b.svg", left: 57.08, top: 80.01, width: 18.88, height: 19.66 },
  { src: "/tetris-purple-a.svg", left: 28.51, top: 20.06, width: 9.4, height: 59.34 },
  { src: "/tetris-purple-b.svg", left: 85.77, top: 40.66, width: 9.4, height: 59.34 },
];

export default function TetrisSkyline() {
  return (
    <div
      className="absolute bottom-0 left-0 w-full"
      style={{ aspectRatio: "1279 / 251.00025939941406" }}
    >
      {PIECES.map((piece) => (
        <img
          key={piece.src}
          src={piece.src}
          alt=""
          className="absolute"
          style={{
            left: `${piece.left}%`,
            top: `${piece.top}%`,
            width: `${piece.width}%`,
            height: `${piece.height}%`,
          }}
        />
      ))}
      {/* Perched on the purple-b piece: 4% in from its left edge (85.77% + 0.04*9.4% = 86.15%),
          shifted 2% left then 1.5% back right, landing at 85.65%. Standing on its top edge
          (100% - 40.66% = 59.34% up from the container's bottom). Height is a percentage of the
          container, trimmed down a bit from the original 113px reference size; width is
          intrinsic per frame (see AnimatedElephant) and grows/shrinks rightward from the fixed
          left edge as the pose changes, height held constant. A few seconds after the a-e burst
          finishes, a second burst plays through f-j (k skipped, so it rests back on ele5a
          sooner) before resting again, 23% taller than the first loop (grows upward from the
          same standing baseline) - both loops share this same left anchor, so shifting it moves
          both together. */}
      <AnimatedElephant
        secondaryFrames={ELE5_SECONDARY_FRAMES}
        secondaryScale={1.23}
        anchor="left"
        style={{ left: "85.65%", bottom: "59.34%", height: "24%" }}
      />
      {/* Perched on the right side of the red piece (right edge 14.23% + 9.39% = 23.62%, base
          frame right-aligned with a small margin), standing on its top edge (100% - 39.7% =
          60.3% up from the container's bottom). Frames have different intrinsic widths at a
          fixed height (a fire breath), so it grows rightward from a fixed left edge rather
          than staying centered. */}
      <AnimatedElephant
        frames={ELE3_FRAMES}
        anchor="left"
        frameIntervalMs={350}
        repeatCount={2}
        style={{ left: "19.52%", bottom: "60.3%", height: "26.54%" }}
      />
    </div>
  );
}
