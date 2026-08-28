"use client";

import { useEffect, useState } from "react";
import { HoverDot } from "./hover-dot";
import { SpeechBubbleCreature } from "./speech-bubble-creature";

const REF_WIDTH = 1280;
const REF_HEIGHT = 832;

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
        <div className="animate-timer-dot-pulse absolute" style={{ left: "1120px", top: "89px" }}>
          <HoverDot assets={DOT_ASSETS} baseIndex={0} size={63.73} />
        </div>

        <p
          className="font-drowner absolute hidden text-black lg:block"
          style={{
            left: "231px",
            top: "310px",
            width: "817.327px",
            height: "130px",
            fontSize: "118.163px",
            lineHeight: "normal",
            letterSpacing: "4.7265px",
          }}
        >
          {remaining ? `${remaining.hours} hour ${remaining.minutes} min` : " "}
        </p>

        {/* Narrow screens get hours stacked over minutes instead of one long line, so it still
            reads at a glance once the whole canvas is scaled way down. */}
        <p
          className="font-drowner absolute text-center text-black lg:hidden"
          style={{
            left: "231px",
            top: "260px",
            width: "817.327px",
            fontSize: "118.163px",
            lineHeight: 1.05,
            letterSpacing: "4.7265px",
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

        <SpeechBubbleCreature
          left={1049}
          top={622}
          bubbleSrc="/timer-bubble.svg"
          bubbleWidth={157}
          bubbleHeight={109}
          creatureLeft={142}
          creatureTop={92}
          textLeft={25}
          textTop={31}
          textWidth={107}
        >
          get ready to build
        </SpeechBubbleCreature>
      </div>
    </section>
  );
}
