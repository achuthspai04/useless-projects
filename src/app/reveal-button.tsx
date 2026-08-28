// The "click here to reveal!" button from the Figma hero (node 143:6205) - a plain black
// rectangle (no corner radius), centered under the title. Position is the node's root offset
// (386+110, 166+405) scaled by the site's 1.5x position factor (1920/1280 - see hero-dots.tsx);
// size and font stay at Figma's raw px values.
export default function RevealButton() {
  return (
    <button
      type="button"
      className="absolute left-1/2 flex -translate-x-1/2 cursor-pointer items-center justify-center bg-black hover:-translate-y-0.5 hover:bg-[#2a2a2a] hover:shadow-md active:translate-y-0"
      style={{ top: "676.5px", width: "296px", height: "78px", paddingTop: "24px", paddingBottom: "23px", paddingLeft: "63px", paddingRight: "63px" }}
    >
      <p className="font-nanum-pen text-center whitespace-nowrap text-white" style={{ fontSize: "37.517px", lineHeight: "30.44px" }}>
        Click here to reveal!
      </p>
    </button>
  );
}
