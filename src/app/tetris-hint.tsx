"use client";

import { useEffect, useRef, useState } from "react";

const APPEAR_DELAY_MS = 3000;
const VISIBLE_MS = 4000;
const HIDDEN_MS = 6000;
// Once the visitor has tapped this many times, they've clearly found the click-to-change-shape
// feature on their own - the hint stops reappearing rather than lingering over something they're
// already using.
const DISMISS_AFTER_TAPS = 3;

const isInteractive = (target: EventTarget | null) =>
  target instanceof Element && target.closest("a, button, input, textarea, select, [role='button']");

/**
 * Plain text hint for the mobile hero's tetris field, telling the visitor the falling block is
 * tappable. Pops in and out on a timer like the desktop bubble (see play-tetris-bubble.tsx) so it
 * doesn't sit on screen permanently, and once the visitor has actually tapped a few times it stops
 * reappearing for the rest of the visit - it's only needed until they've found the feature.
 */
export default function TetrisHint() {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
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
  }, [dismissed]);

  useEffect(() => {
    let taps = 0;
    const onTap = (e: MouseEvent) => {
      if (isInteractive(e.target)) return;
      taps++;
      if (taps >= DISMISS_AFTER_TAPS) {
        setDismissed(true);
        setIsVisible(false);
      }
    };
    document.addEventListener("click", onTap);
    return () => document.removeEventListener("click", onTap);
  }, []);

  if (dismissed) return null;

  return (
    <p
      className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-[#0e0e0d]/60 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{ top: "700px", fontSize: "15px", lineHeight: "20px" }}
    >
      tap to change shape
    </p>
  );
}
