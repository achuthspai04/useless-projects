// The "exclusive to Tinkerhub campus community" tagline from the Figma hero (node 143:6187),
// now centered directly above the reveal button (moved there in a later Figma revision - it
// used to sit in the top-right corner near the "3.0" badge). Position is the node's root offset
// (386+149, 166+374) scaled by the site's 1.5x position factor (see hero-dots.tsx); size stays
// at Figma's raw px value.
export default function HeroTagline() {
  return (
    <p
      className="font-nanum-pen absolute left-1/2 -translate-x-1/2 text-center text-[#100f0f]"
      style={{ top: "810px", width: "219px", fontSize: "14.638px", lineHeight: "11.877px" }}
    >
      exclusive to Tinkerhub campus community
    </p>
  );
}
