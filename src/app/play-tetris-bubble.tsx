"use client";

import { useEffect, useState } from "react";

const APPEAR_DELAY_MS = 3000;
const VISIBLE_MS = 4000;
const HIDDEN_MS = 6000;

// The standalone "play tetris?" bubble from the Figma hero (node 147:7775) - reuses the same
// cloud shape as TimerSection's bubble (see speech-bubble-creature.tsx), but with no creature
// icon of its own, just the bubble and its text. Nudged up next to ele4's head in the hero
// overlay (see page.tsx) rather than sitting at the Figma-original offset. Pops in and out on a
// timer instead of staying on screen permanently.
export default function PlayTetrisBubble() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const showThenHide = () => {
      setIsVisible(true);
      timer = setTimeout(() => {
        setIsVisible(false);
        timer = setTimeout(showThenHide, HIDDEN_MS);
      }, VISIBLE_MS);
    };

    timer = setTimeout(showThenHide, APPEAR_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`absolute transition-all duration-300 ease-out ${
        isVisible ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-90"
      }`}
      style={{ left: "-20px", top: "300px", width: "157px", height: "109px" }}
    >
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
