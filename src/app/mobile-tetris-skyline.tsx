// This mobile-only skyline is a different piece arrangement from the desktop one (Figma node
// 147:9833, "Group 147" inside the mobile hero frame 147:9496) - narrower and taller, meant to
// read well in a phone-width strip rather than a wide desktop banner.
const GROUP_WIDTH = 623.0136;
const GROUP_HEIGHT = 221.9583;

interface Piece {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  /** Degrees the source art is rotated by in Figma - 90/-90 swap the pre-rotation box so the
   * rotated result still fills the given left/top/width/height. */
  rotate?: 90 | -90 | 180;
}

// left/top/width/height are local pixels within the 623.0136 x 221.9583 group box (taken
// directly from Figma metadata for node 147:9833's leaf pieces).
const PIECES: Piece[] = [
  { src: "/tetris-m-cyan-a.svg", left: 0, top: 197.267, width: 88.015, height: 24.083 },
  { src: "/tetris-m-red-a.svg", left: 88.71, top: 148.186, width: 58.543, height: 73.109 },
  { src: "/tetris-m-green-a.svg", left: 564.47, top: 99.9997, width: 58.543, height: 73.109 },
  { src: "/tetris-m-orange-a.svg", left: 148.154, top: 172.726, width: 88.028, height: 48.52 },
  { src: "/tetris-m-green-b.svg", left: 267.124, top: 172.823, width: 88.028, height: 48.519 },
  { src: "/tetris-m-yellow-a.svg", left: 0, top: 147.679, width: 58.478, height: 48.528 },
  { src: "/tetris-m-orange-b.svg", left: 474.78, top: 173.226, width: 58.478, height: 48.528 },
  { src: "/tetris-m-magenta-a.svg", left: 237.169, top: 123.643, width: 28.981, height: 97.7 },
  { src: "/tetris-m-magenta-b.svg", left: 355.152, top: 197.501, width: 117.716, height: 24.053, rotate: 90 },
  { src: "/tetris-m-purple-a.svg", left: 236.355, top: 124.148, width: 58.631, height: 72.602, rotate: 90 },
  { src: "/tetris-m-purple-b.svg", left: 593.367, top: 149.358, width: 58.631, height: 72.601, rotate: 90 },
  { src: "/tetris-m-purple-c.svg", left: 267, top: 122.602, width: 58.631, height: 72.602, rotate: -90 },
  { src: "/tetris-m-cyan-b.svg", left: 414.014, top: 98.083, width: 88.015, height: 24.083, rotate: 180 },
  { src: "/tetris-m-green-a.svg", left: 147.543, top: 147.109, width: 58.543, height: 73.109, rotate: 180 },
  { src: "/tetris-m-orange-c.svg", left: 207.028, top: 48.52, width: 88.028, height: 48.52, rotate: 180 },
  { src: "/tetris-m-green-c.svg", left: 354.942, top: 172.519, width: 87.942, height: 48.519, rotate: 180 },
  { src: "/tetris-m-orange-b.svg", left: 237.478, top: 97.528, width: 58.478, height: 48.528, rotate: 180 },
  { src: "/tetris-m-magenta-c.svg", left: 384.422, top: 74.819, width: 28.981, height: 97.7, rotate: 180 },
  { src: "/tetris-m-magenta-b.svg", left: 178, top: 123.053, width: 117.716, height: 24.053, rotate: -90 },
  { src: "/tetris-m-purple-b.svg", left: 119, top: 97.601, width: 58.631, height: 72.601, rotate: -90 },
  { src: "/tetris-m-purple-c.svg", left: 428.706, top: 25.481, width: 58.631, height: 72.602, rotate: -90 },
];

export default function MobileTetrisSkyline() {
  return (
    <div className="absolute" style={{ left: "-97px", top: "655px", width: `${GROUP_WIDTH}px`, height: `${GROUP_HEIGHT}px` }}>
      {PIECES.map((piece, i) => {
        const swapped = piece.rotate === 90 || piece.rotate === -90;
        return (
          <div
            key={i}
            className="absolute"
            style={{ left: `${piece.left}px`, top: `${piece.top}px`, width: `${piece.width}px`, height: `${piece.height}px` }}
          >
            <img
              src={piece.src}
              alt=""
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: swapped ? `${piece.height}px` : `${piece.width}px`,
                height: swapped ? `${piece.width}px` : `${piece.height}px`,
                transform: `translate(-50%, -50%)${piece.rotate ? ` rotate(${piece.rotate}deg)` : ""}`,
                maxWidth: "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
