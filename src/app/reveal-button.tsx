// The "click here to reveal!" button from the Figma hero (node 143:6205) - a plain black
// rectangle (no corner radius), centered under the title. The defaults are the desktop node's
// root offset (386+110, 166+405) scaled by the site's 1.5x position factor (1920/1280 - see
// hero-dots.tsx); size and font stay at Figma's raw px values. The mobile hero passes its own
// geometry, since its canvas is a different size entirely.
export default function RevealButton({
  top = 676.5,
  width = 296,
  height = 78,
  fontSize = 37.517,
  lineHeight = 30.44,
}: {
  top?: number;
  width?: number;
  height?: number;
  fontSize?: number;
  lineHeight?: number;
}) {
  return (
    <button
      type="button"
      className="absolute left-1/2 flex -translate-x-1/2 cursor-pointer items-center justify-center bg-black hover:-translate-y-0.5 hover:bg-[#2a2a2a] hover:shadow-md active:translate-y-0"
      style={{ top: `${top}px`, width: `${width}px`, height: `${height}px` }}
    >
      <p
        className="font-nanum-pen text-center whitespace-nowrap text-white"
        style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }}
      >
        Click here to reveal!
      </p>
    </button>
  );
}
