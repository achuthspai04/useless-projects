// The "exclusive to Tinkerhub campus community" tagline from the Figma hero (node 143:6187),
// now centered directly above the reveal button (moved there in a later Figma revision - it
// used to sit in the top-right corner near the "3.0" badge). Position is the node's root offset
// (386+149, 166+374) scaled by the site's 1.5x position factor (see hero-dots.tsx); size stays
// at Figma's raw px value.
// The mobile hero passes its own geometry, since its canvas is a different size entirely - but
// the layout is the same either way: one centred line sitting just above the reveal button.
export default function HeroTagline({
  top = 630,
  width = 600,
  fontSize = 26,
  lineHeight = 16,
}: {
  top?: number;
  width?: number;
  fontSize?: number;
  lineHeight?: number;
}) {
  return (
    <p
      className="font-nanum-pen absolute left-1/2 -translate-x-1/2 text-center whitespace-nowrap text-[#100f0f]"
      style={{
        top: `${top}px`,
        width: `${width}px`,
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}px`,
      }}
    >
      exclusive to Tinkerhub campus community &lt;3
    </p>
  );
}
