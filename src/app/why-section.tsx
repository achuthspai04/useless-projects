"use client";

import { useEffect, useRef, useState } from "react";
import { HoverDot } from "./hover-dot";

const REF_WIDTH = 1280;
const REF_HEIGHT = 832;

// Its own color plus the hero's 4 corner-dot colors, so hovering picks a random different one
// from this same palette instead of needing dedicated assets just for this dot.
const DOT_ASSETS = ["/why-dot.svg", "/hero-dot-1.svg", "/hero-dot-2.svg", "/hero-dot-3.svg", "/hero-dot-4.svg"] as const;

// Single gap value shared by both the heading->paragraph and paragraph->image gaps, so the
// vertical rhythm reads as even instead of the two gaps having independently-tuned sizes.
const STACK_GAP_PX = 48;

// The mobile layout is its own Figma frame (node 328:366, 347 x 463.447 on the 402px artboard),
// not the desktop composition scaled down - it drops the hand-drawn arrow and the corner dot
// entirely and sets the paragraph at 19.69px instead of 36px.
const MOBILE_WIDTH_PX = 347;
const MOBILE_HEIGHT_PX = 463.447;
// Keeps a 16px gutter each side once the viewport is narrower than the frame.
const MOBILE_SCALE = `min(1, calc((100vw - 32px) / ${MOBILE_WIDTH_PX}px))`;
const MOBILE_TEXT_TOP_PX = 113;
// The inner Figma frame starts at 113 and carries the video 162px down from its own top.
const MOBILE_VIDEO_TOP_PX = MOBILE_TEXT_TOP_PX + 162;

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
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setArrowDrawn(true);
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
      id="why-section"
      className="relative flex min-h-screen w-full snap-start snap-always items-center justify-center overflow-hidden bg-white"
    >
      {/* Mobile (Figma node 328:366). A dedicated layout rather than the desktop canvas scaled
          down, which at this width put the body copy at ~11px. */}
      <div
        className="relative shrink-0 lg:hidden"
        style={{
          width: `${MOBILE_WIDTH_PX}px`,
          height: `${MOBILE_HEIGHT_PX}px`,
          transform: `scale(${MOBILE_SCALE})`,
          transformOrigin: "center center",
        }}
      >
        <div
          className="absolute flex -translate-x-1/2 items-center justify-center"
          style={{ left: "calc(50% + 3.64px)", top: 0, width: "132.286px", height: "88.865px" }}
        >
          <p
            className="font-drowner relative flex-none rotate-[3.13deg] text-center text-[58.684px] leading-[1.4] lowercase whitespace-nowrap text-[#242525] underline decoration-wavy decoration-from-font"
            style={{ wordBreak: "break-word", textUnderlinePosition: "from-font" }}
          >
            why ?
          </p>
        </div>

        {/* Figma spaces this with a fixed-height (263px) text box pulled up by a -101px margin
            and a leading blank line, which resolves to the blurb sitting inside the 162px band
            between the title and the video. Centring it in that band rather than pinning it to
            the top keeps the rhythm if Nanum Pen wraps to one more line than Figma's render did. */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: 0,
            top: `${MOBILE_TEXT_TOP_PX}px`,
            width: `${MOBILE_WIDTH_PX}px`,
            height: `${MOBILE_VIDEO_TOP_PX - MOBILE_TEXT_TOP_PX}px`,
          }}
        >
          <p className="font-nanum-pen text-center text-[19.69px] leading-[1.4] text-[#244638]">
            Our movement is all about making — building random things, learning new skills, and expressing
            creativity and curiosity
          </p>
        </div>

        {/* holderyt.webp is the already-flattened still: the 35% dimming pass and the frosted
            "coming soon" chip that sit as separate layers in the Figma frame are baked into it,
            so re-adding them here would double both. Same asset the desktop block uses. */}
        <div
          className="absolute overflow-hidden bg-[#d2800f]"
          style={{
            left: "6.121px",
            top: `${MOBILE_VIDEO_TOP_PX}px`,
            width: "334.76px",
            height: "188.447px",
            borderRadius: "4.799px",
          }}
        >
          <img
            src="/holderyt.webp"
            alt="Coming soon"
            className="absolute inset-0 size-full object-cover object-center"
          />
        </div>
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
        <HoverDot
          assets={DOT_ASSETS}
          baseIndex={0}
          size={63.73}
          className="absolute"
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
                IntersectionObserver above). A clip-path wipe (rather than the stroke-dasharray
                trick used for the underline elsewhere) is used here because this artwork is an
                inked/filled shape, not a single stroked line. */}
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
