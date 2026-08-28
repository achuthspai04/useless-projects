"use client";

import { useEffect, useState } from "react";
import { HoverDot } from "./hover-dot";

const REF_WIDTH = 1280;
const REF_HEIGHT = 832;

// The Figma file has no mobile frame for this section, so it is rebuilt for the 402px artboard the
// other mobile frames use rather than inferred: same elements in the same arrangement (dot
// top-right, countdown centred), sized for a phone.
const MOBILE_WIDTH = 402;
const MOBILE_HEIGHT = 470;
// "999 hour" measures 361px at 100px Drowner, so the widest the countdown can ever get still
// clears the frame at this size - and it matches the mobile hero's own 95px display type.
const MOBILE_COUNTDOWN_SIZE = 90;
// The same 0.04em the desktop countdown uses (4.7265 / 118.163).
const MOBILE_COUNTDOWN_TRACKING = MOBILE_COUNTDOWN_SIZE * 0.04;
const MOBILE_DOT_SIZE = 34.52;

const DOT_ASSETS = ["/why-dot.svg", "/hero-dot-1.svg", "/hero-dot-2.svg", "/hero-dot-3.svg", "/hero-dot-4.svg"] as const;

// Event kicks off 9 AM IST (UTC+5:30) on Sep 4 - the explicit offset pins the instant regardless
// of the visitor's own timezone, so the countdown is always correct against real IST.
const EVENT_START = new Date("2026-09-04T09:00:00+05:30").getTime();
const UPDATE_INTERVAL_MS = 30_000;

function remainingUntilEvent() {
  const diffMs = Math.max(0, EVENT_START - Date.now());
  const totalMinutes = Math.floor(diffMs / 60_000);
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 };
}

export default function TimerSection() {
  // Left null through the initial (server-matching) render so hydration never has to reconcile
  // a server-computed countdown against a client one computed moments later.
  const [remaining, setRemaining] = useState<{ hours: number; minutes: number } | null>(null);

  useEffect(() => {
    setRemaining(remainingUntilEvent());
    const id = setInterval(() => setRemaining(remainingUntilEvent()), UPDATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="timer-section" className="relative flex h-screen w-full snap-start snap-always items-center justify-center overflow-hidden bg-white">
      <div
        className="relative shrink-0 lg:hidden"
        style={{
          width: `${MOBILE_WIDTH}px`,
          height: `${MOBILE_HEIGHT}px`,
          transform: `scale(min(1, calc(100vw / ${MOBILE_WIDTH}px), calc(100vh / ${MOBILE_HEIGHT}px)))`,
          transformOrigin: "center center",
        }}
      >
        <div className="animate-timer-dot-pulse absolute" style={{ left: "337px", top: "44px" }}>
          <HoverDot assets={DOT_ASSETS} baseIndex={0} size={MOBILE_DOT_SIZE} />
        </div>

        {/* Subheading in cursive font (font-nanum-pen) - Centered */}
        <p
          className="font-nanum-pen absolute left-1/2 -translate-x-1/2 text-center text-[#100f0f]"
          style={{
            top: "70px",
            width: `${MOBILE_WIDTH}px`,
            fontSize: "28px",
            lineHeight: "32px",
          }}
        >
          making starts in
        </p>

        {/* Hours stacked over minutes - Centered */}
        <p
          className="font-drowner absolute left-1/2 -translate-x-1/2 text-center text-black"
          style={{
            top: "115px",
            width: `${MOBILE_WIDTH}px`,
            fontSize: `${MOBILE_COUNTDOWN_SIZE}px`,
            lineHeight: 1.05,
            letterSpacing: `${MOBILE_COUNTDOWN_TRACKING}px`,
          }}
        >
          {remaining ? (
            <>
              {remaining.hours} hour
              <br />
              {remaining.minutes} min
            </>
          ) : (
            " "
          )}
        </p>
      </div>

      <div
        className="relative hidden shrink-0 lg:block"
        style={{
          width: `${REF_WIDTH}px`,
          height: `${REF_HEIGHT}px`,
          transform: `scale(min(1, calc(100vw / ${REF_WIDTH}px), calc(100vh / ${REF_HEIGHT}px)))`,
          transformOrigin: "center center",
        }}
      >
        <div className="animate-timer-dot-pulse absolute" style={{ left: "1120px", top: "89px" }}>
          <HoverDot assets={DOT_ASSETS} baseIndex={0} size={63.73} />
        </div>

        {/* Desktop subheading in cursive font (font-nanum-pen) - Centered */}
        <p
          className="font-nanum-pen absolute left-1/2 -translate-x-1/2 text-center text-[#100f0f]"
          style={{
            top: "245px",
            fontSize: "38px",
            lineHeight: "42px",
          }}
        >
          making starts in
        </p>

        {/* Desktop timer digits - Centered */}
        <p
          className="font-drowner absolute left-1/2 -translate-x-1/2 text-center text-black"
          style={{
            top: "310px",
            width: `${REF_WIDTH}px`,
            height: "130px",
            fontSize: "118.163px",
            lineHeight: "normal",
            letterSpacing: "4.7265px",
          }}
        >
          {remaining ? `${remaining.hours} hour ${remaining.minutes} min` : " "}
        </p>
      </div>
    </section>
  );
}
