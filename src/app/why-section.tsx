"use client";

import { useEffect, useRef, useState } from "react";
import { armAudioUnlock, playScribbleSound } from "@/lib/scribble-sound";

const REF_WIDTH = 1280;
const REF_HEIGHT = 832;

// Single gap value shared by both the heading->paragraph and paragraph->image gaps, so the
// vertical rhythm reads as even instead of the two gaps having independently-tuned sizes.
const STACK_GAP_PX = 48;

const ARROW_DRAW_DURATION_S = 0.9;
const VIDEO_WIDTH_PX = 413.915;
const VIDEO_HEIGHT_PX = 233.006;
// Figma has the arrow's left edge 202px left of the video's left edge, both top-aligned
// (arrow left 216 vs video left 418, both top 468.548) - kept relative to the video here so the
// pair can move together as one flex item instead of both needing independent absolute offsets.
const ARROW_OFFSET_LEFT_PX = 216 - 418;

export default function WhySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [arrowDrawn, setArrowDrawn] = useState(false);

  useEffect(() => {
    armAudioUnlock();
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setArrowDrawn(true);
        playScribbleSound(ARROW_DRAW_DURATION_S);
        observer.disconnect();
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full snap-start items-center justify-center overflow-hidden bg-white"
    >
      <div
        className="relative"
        style={{
          width: `${REF_WIDTH}px`,
          height: `${REF_HEIGHT}px`,
          transform: `scale(min(1, calc(100vw / ${REF_WIDTH}px), calc(100vh / ${REF_HEIGHT}px)))`,
          transformOrigin: "center center",
        }}
      >
        <img
          src="/why-dot.svg"
          alt=""
          className="absolute size-[63.73px]"
          style={{ left: "1120px", top: "89px" }}
        />

        <div className="flex h-full flex-col items-center justify-center" style={{ gap: `${STACK_GAP_PX}px` }}>
          <div className="flex items-center justify-center" style={{ width: "132.286px", height: "88.865px" }}>
            <p
              className="font-drowner relative flex-none rotate-[3.13deg] text-center text-[58.602px] leading-[1.4] lowercase whitespace-nowrap text-[#242525] underline decoration-wavy decoration-from-font"
              style={{ wordBreak: "break-word", textUnderlinePosition: "from-font" }}
            >
              why ?
            </p>
          </div>

          <p
            className="font-nanum-pen text-center text-[36px] leading-[1.4] text-[#244638]"
            style={{ width: "756px" }}
          >
            Our movement is all about making — building random things, learning new skills, and expressing
            creativity and curiosity
          </p>

          <div className="relative" style={{ width: `${VIDEO_WIDTH_PX}px`, height: `${VIDEO_HEIGHT_PX}px` }}>
            {/* Hand-drawn arrow, scribbled in when the section scrolls into view (see the
                IntersectionObserver above), paired with a synthesized scribble sound. A clip-path
                wipe (rather than the stroke-dasharray trick used for the underline elsewhere) is
                used here because this artwork is an inked/filled shape, not a single stroked
                line. */}
            <img
              src="/why-arrow.svg"
              alt=""
              className="absolute"
              style={{
                left: `${ARROW_OFFSET_LEFT_PX}px`,
                top: "0px",
                width: "102.33px",
                height: "100.258px",
                clipPath: arrowDrawn ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
                transition: `clip-path ${ARROW_DRAW_DURATION_S}s ease-out`,
              }}
            />

            <div className="absolute inset-0 overflow-hidden rounded-[5.934px] bg-[#d2800f]">
              <img
                src="/holderyt.webp"
                alt="Coming soon"
                className="absolute inset-0 size-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
