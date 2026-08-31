"use client";

import { useEffect, useRef, useState } from "react";
import { HoverDot } from "./hover-dot";

const WHY_VIDEO_YOUTUBE_ID = "Q59AWr_RRiA";

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
// Bumped ~25% over the Figma spec (413.915 x 233.006) at the user's request, kept at 16:9.
const VIDEO_WIDTH_PX = 520;
const VIDEO_HEIGHT_PX = 292.5;
// rel=0/modestbranding=1 strip the end-of-video suggestions and the YouTube watermark;
// iv_load_policy=3 drops annotations; the youtube-nocookie host also skips the share/"watch on
// YouTube" overlay that the plain youtube.com embed shows on the paused thumbnail.
const WHY_VIDEO_EMBED_SRC = `https://www.youtube-nocookie.com/embed/${WHY_VIDEO_YOUTUBE_ID}?rel=0&modestbranding=1&iv_load_policy=3`;
// Figma has the arrow's left edge 202px left of the video's left edge, both top-aligned
// (arrow left 216 vs video left 418, both top 468.548) - kept relative to the video here so the
// pair can move together as one flex item instead of both needing independent absolute offsets.
const ARROW_OFFSET_LEFT_PX = 216 - 418;

// Same hand-drawn squiggle underline as CelebratingSection's "why nots.", built in real pixels
// (not a stretched viewBox) so the stroke stays a uniform width - kept local rather than shared
// since the two sections tune the wave slightly differently.
const UNDERLINE_AMPLITUDE = 4;
const UNDERLINE_WAVELENGTH = 24;
const UNDERLINE_BASELINE = 6;
const UNDERLINE_HEIGHT = 12;

// A click-to-play facade instead of an always-live iframe: YouTube's paused-embed cover shows a
// title bar, a share icon and a "Watch on YouTube" link that no embed parameter can suppress -
// swapping in the real iframe (with autoplay) only once someone actually clicks avoids all of it,
// as a bonus this also means the section doesn't load YouTube's player JS until requested.
function WhyVideoFacade() {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`${WHY_VIDEO_EMBED_SRC}&autoplay=1`}
        title="why useless projects"
        className="absolute inset-0 size-full"
        frameBorder={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label="Play video: why useless projects"
      className="group absolute inset-0 flex size-full items-center justify-center"
    >
      <img
        src={`https://img.youtube.com/vi/${WHY_VIDEO_YOUTUBE_ID}/hqdefault.jpg`}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10" />
      <span className="relative flex size-14 items-center justify-center rounded-full bg-[#ea34df] shadow-lg transition-transform group-hover:scale-110">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  );
}

function buildSquigglePath(width: number) {
  if (width <= 0) return "";
  let d = `M0,${UNDERLINE_BASELINE}`;
  let x = 0;
  let crestUp = true;
  const halfWave = UNDERLINE_WAVELENGTH / 2;
  while (x < width) {
    const nextX = Math.min(x + halfWave, width);
    const midX = (x + nextX) / 2;
    const midY = UNDERLINE_BASELINE + (crestUp ? -UNDERLINE_AMPLITUDE : UNDERLINE_AMPLITUDE);
    d += ` Q${midX},${midY} ${nextX},${UNDERLINE_BASELINE}`;
    x = nextX;
    crestUp = !crestUp;
  }
  return d;
}

export default function WhySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [arrowDrawn, setArrowDrawn] = useState(false);
  const [underlineWidth, setUnderlineWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (textRef.current) setUnderlineWidth(textRef.current.offsetWidth);
    };
    measure();
    // The Drowner font swaps in after first paint, which can shift the text's rendered width.
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

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
            Our movement is all about making: building random things, learning new skills, and expressing
            creativity and curiosity
          </p>
        </div>

        <div
          className="absolute overflow-hidden bg-black"
          style={{
            left: "6.121px",
            top: `${MOBILE_VIDEO_TOP_PX}px`,
            width: "334.76px",
            height: "188.447px",
            borderRadius: "4.799px",
          }}
        >
          <WhyVideoFacade />
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
            <div className="relative flex-none rotate-[3.13deg]">
              <p
                ref={textRef}
                className="font-drowner relative text-center text-[58.602px] leading-[1.4] lowercase whitespace-nowrap text-[#242525]"
                style={{ wordBreak: "break-word" }}
              >
                why ?
              </p>
              {/* Hand-drawn wavy underline, scribbled in alongside the arrow below when the
                  section scrolls into view (see the IntersectionObserver above). */}
              <svg
                width={underlineWidth}
                height={UNDERLINE_HEIGHT}
                viewBox={`0 0 ${underlineWidth} ${UNDERLINE_HEIGHT}`}
                className="pointer-events-none absolute left-0"
                style={{ top: "calc(100% - 10px)" }}
                aria-hidden="true"
              >
                <path
                  d={buildSquigglePath(underlineWidth)}
                  fill="none"
                  stroke="#242525"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  pathLength={100}
                  style={{
                    strokeDasharray: 100,
                    strokeDashoffset: arrowDrawn ? 0 : 100,
                    transition: `stroke-dashoffset ${ARROW_DRAW_DURATION_S}s ease-out`,
                  }}
                />
              </svg>
            </div>
          </div>

          <p
            className="font-nanum-pen text-center text-[36px] leading-[1.4] text-[#244638]"
            style={{ width: "756px" }}
          >
            Our movement is all about making: building random things, learning new skills, and expressing
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
                transition: `clip-path ${ARROW_DRAW_DURATION_S}s ease-out`,
              }}
            />

            <div className="absolute inset-0 overflow-hidden rounded-[5.934px] bg-black">
              <WhyVideoFacade />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
