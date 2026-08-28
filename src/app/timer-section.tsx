"use client";

import { useEffect, useState } from "react";
import CuriosityReveal from "./curiosity-reveal";
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

// Same target cell sizes the hero's own fields use, so the reveal's blocks come out the size
// visitors have already seen on the way down (see page.tsx and mobile-hero.tsx).
const DESKTOP_TARGET_CELL = 68;
const MOBILE_TARGET_CELL = 22;

// The reveal runs itself: the board fills, the dates land on it once those blocks have settled
// (animate-lego-pop is 200ms), they hold for a beat, and then the section comes back.
const CARDS_IN_MS = 320;
const CARDS_HOLD_MS = 3000;

export default function TimerSection() {
  // Left null through the initial (server-matching) render so hydration never has to reconcile
  // a server-computed countdown against a client one computed moments later.
  const [remaining, setRemaining] = useState<{ hours: number; minutes: number } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    if (!revealed) return;
    const toCards = setTimeout(() => setShowCards(true), CARDS_IN_MS);
    const toClose = setTimeout(() => {
      setRevealed(false);
      setShowCards(false);
    }, CARDS_IN_MS + CARDS_HOLD_MS);
    return () => {
      clearTimeout(toCards);
      clearTimeout(toClose);
    };
  }, [revealed]);

  // The button sits inside each breakpoint's scaled canvas so it tracks the design, while the
  // reveal itself covers the whole section - hence one shared flag rather than local state. `top`
  // is per-breakpoint because the countdown above it ends at a different height in each canvas
  // (desktop: 310 + 130; mobile: 115 + two ~95px lines).
  const curiosityButton = (top: number) => (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className={`font-nanum-pen absolute left-1/2 -translate-x-1/2 cursor-pointer items-center justify-center bg-black text-white shadow-md transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:bg-[#1a1a1a] active:translate-y-0.5 active:scale-[0.97] select-none ${
        revealed ? "pointer-events-none opacity-0" : "flex opacity-100"
      }`}
      style={{ top: `${top}px`, width: "180px", height: "48px", fontSize: "24px" }}
    >
      know when?
    </button>
  );

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

        {curiosityButton(330)}
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

        {curiosityButton(490)}
      </div>

      {/* Outside both scaled canvases so the board fills the real section rather than the design's
          reference box - the same placement the hero gives its own field. */}
      {revealed && (
        <>
          {/* Mobile's cells are a third the size of desktop's, so its cards take a proportionally
              bigger footprint (still 2:3) to come out physically similar. */}
          {/* Above FloatingPet's z-50: the section is position:relative with z-index auto, so it
              doesn't box these in - they and the fixed pet both resolve against the root, and the
              board has to cover it rather than the pet sitting on top of the reveal. */}
          <div className="absolute inset-0 z-[60] lg:hidden">
            <CuriosityReveal
              targetCell={MOBILE_TARGET_CELL}
              cardCols={4}
              cardRows={6}
              showCards={showCards}
            />
          </div>
          <div className="absolute inset-0 z-[60] hidden lg:block">
            <CuriosityReveal
              targetCell={DESKTOP_TARGET_CELL}
              cardCols={2}
              cardRows={3}
              showCards={showCards}
            />
          </div>
        </>
      )}
    </section>
  );
}
