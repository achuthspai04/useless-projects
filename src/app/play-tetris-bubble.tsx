// The standalone "play tetris?" bubble from the Figma hero (node 147:7775) - reuses the same
// cloud shape as TimerSection's bubble (see speech-bubble-creature.tsx), but with no creature
// icon of its own, just the bubble and its text. Position is the node's root offset (90, 497)
// scaled by the site's 1.5x position factor (see hero-dots.tsx); size stays at Figma's raw px value.
export default function PlayTetrisBubble() {
  return (
    <div className="absolute" style={{ left: "135px", top: "605.5px", width: "157px", height: "109px" }}>
      <img
        src="/timer-bubble.svg"
        alt=""
        className="absolute inset-0"
        style={{ width: "157px", height: "109px", transform: "scaleX(-1)" }}
      />
      <p
        className="font-nanum-pen absolute -translate-x-1/2 whitespace-pre-wrap text-center text-[#100f0f]"
        style={{ left: "78.5px", top: "31px", width: "107px", fontSize: "29.089px", lineHeight: "23.602px" }}
      >
        play tetris?
      </p>
    </div>
  );
}
