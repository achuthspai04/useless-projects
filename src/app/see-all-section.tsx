"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const REF_WIDTH = 1280;
const REF_HEIGHT = 832;

const BUTTON_WIDTH = 837;
const BUTTON_HEIGHT = 364;

// Loosely how small a normal button on this site reads (see the "see project" button in
// AppamSection) - the oversized card shrinks toward this before it can be clicked.
const MIN_SCALE = 0.42;
const SHRINK_DURATION_S = 1.3;
const RESET_DURATION_S = 0.35;
const POP_DURATION_S = 0.25;

type Phase = "idle" | "shrinking" | "ready" | "popped";

// A "catch me if you can" button: hovering starts it shrinking, leaving before it settles snaps
// it straight back to full size, and only once it has shrunk all the way down - while still
// hovered - does it accept a click.
export default function SeeAllSection() {
  const [phase, setPhase] = useState<Phase>("idle");
  const shrinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (shrinkTimer.current) clearTimeout(shrinkTimer.current);
      if (popTimer.current) clearTimeout(popTimer.current);
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (phase === "popped") return;
    setPhase("shrinking");
    shrinkTimer.current = setTimeout(() => setPhase("ready"), SHRINK_DURATION_S * 1000);
  }, [phase]);

  const handleMouseLeave = useCallback(() => {
    if (shrinkTimer.current) {
      clearTimeout(shrinkTimer.current);
      shrinkTimer.current = null;
    }
    if (phase !== "popped") setPhase("idle");
  }, [phase]);

  const handleClick = useCallback(() => {
    if (phase !== "ready") return;
    setPhase("popped");
    popTimer.current = setTimeout(() => setPhase("idle"), POP_DURATION_S * 1000);
  }, [phase]);

  const scale = phase === "idle" ? 1 : phase === "popped" ? MIN_SCALE * 0.9 : MIN_SCALE;
  const transitionDuration =
    phase === "idle" ? RESET_DURATION_S : phase === "popped" ? POP_DURATION_S : SHRINK_DURATION_S;
  const transitionEasing = phase === "shrinking" ? "linear" : "ease-out";

  return (
    <section className="relative flex min-h-screen w-full snap-start items-center justify-center overflow-hidden bg-white">
      <div
        className="relative shrink-0"
        style={{
          width: `${REF_WIDTH}px`,
          height: `${REF_HEIGHT}px`,
          transform: `scale(min(1, calc(100vw / ${REF_WIDTH}px), calc(100vh / ${REF_HEIGHT}px)))`,
          transformOrigin: "center center",
        }}
      >
        <button
          type="button"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          aria-label={
            phase === "ready"
              ? "See all 1200 projects. Click to open."
              : "See all 1200 projects. Hover and hold until it stops shrinking, then click."
          }
          className="absolute block rounded-[17.444px] bg-[#d9d9d9] transition-colors duration-200 ease-out hover:bg-[#cfcfcf]"
          style={{
            left: "221px",
            top: "234px",
            width: `${BUTTON_WIDTH}px`,
            height: `${BUTTON_HEIGHT}px`,
            cursor: phase === "ready" ? "pointer" : "default",
            transform: `scale(${scale})`,
            transition: `transform ${transitionDuration}s ${transitionEasing}, background-color 0.2s ease-out`,
          }}
        >
          <span
            className="font-drowner absolute whitespace-nowrap text-[#0e0e0d]"
            style={{
              left: "21.03%",
              right: "21.51%",
              top: "20.05%",
              bottom: "19.78%",
              fontSize: "199.389px",
              letterSpacing: "3.9878px",
              lineHeight: "normal",
            }}
          >
            see all
          </span>
          <span
            className="font-nanum-pen absolute text-center text-[#e82803] lowercase"
            style={{
              left: "56.99%",
              right: 0,
              top: 0,
              bottom: "60.99%",
              fontSize: "101.706px",
              letterSpacing: "-9.1535px",
              lineHeight: 1.4,
            }}
          >
            (1200)
          </span>
        </button>
      </div>
    </section>
  );
}
