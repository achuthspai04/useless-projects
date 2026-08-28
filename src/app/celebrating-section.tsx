"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { armAudioUnlock, playScribbleSound } from "@/lib/scribble-sound";

// At this viewport width the content renders at its authored 1:1 size (the Figma spec, and
// where the design already looks right on laptop screens). On every other width the whole
// 502x417 composition scales continuously with the viewport - up on wider monitors, down on
// narrower ones - via a single CSS transform, so every element grows/shrinks together as one
// piece instead of the layout being re-derived. Floor/ceiling keep it from ever becoming
// illegibly small or comically oversized.
const SCALE_REFERENCE_WIDTH_PX = 1440;
// The floor is what phones get, since 100vw/1440 is well below it there. At 0.45 the composition
// came out 226px wide on a 390px screen - over 40% of the width left blank either side - so it
// sits higher now. 0.62 still fits a 320px screen without overflowing (0.62 * 502 = 311px).
const MIN_SCALE = 0.62;
const MAX_SCALE = 1.6;
const CELEBRATE_SCALE_STYLE = {
  "--celebrate-scale": `clamp(${MIN_SCALE}, calc(100vw / ${SCALE_REFERENCE_WIDTH_PX}px), ${MAX_SCALE})`,
} as CSSProperties;

const UNDERLINE_DURATION_S = 1.1;

// Built in real pixels (not a stretched viewBox) so the stroke stays a uniform width instead of
// getting squashed/stretched unevenly - a fixed wavelength/amplitude reads closer to the
// browser's native `text-decoration: wavy` than a viewBox scaled to fit the text box.
const UNDERLINE_AMPLITUDE = 5;
const UNDERLINE_WAVELENGTH = 30;
const UNDERLINE_BASELINE = 8;
const UNDERLINE_HEIGHT = 16;

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

export default function CelebratingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [drawn, setDrawn] = useState(false);
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
    armAudioUnlock();
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setDrawn(true);
        playScribbleSound(UNDERLINE_DURATION_S);
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
      // min-h-screen matches every other section on the page. Without it this one was shorter
      // than the viewport, so snap-scrolling to it left the composition high on screen with the
      // next section showing underneath - `items-center` can only centre within the section, and
      // the section has to be screen-tall for that to mean screen-centred. The padding stays as a
      // floor for viewports too short for min-height to win; the 146px gutter is a desktop
      // figure, and on a phone it was 292px of padding around a 188px composition. max-h-screen +
      // overflow-hidden caps the other direction: on wide-but-not-tall desktop monitors the
      // 2xl/1920 padding plus the scaled-up composition could add up to more than one viewport,
      // pushing this section taller than 100vh and throwing off every snap point after it (the
      // next section, why-section, would land scrolled partway into itself instead of at its top).
      className="relative flex min-h-screen max-h-screen w-full snap-start snap-always items-center justify-center overflow-hidden bg-white py-[56px] lg:py-[146px] 2xl:py-[220px] min-[1920px]:py-[280px]"
    >
      <div
        className="relative shrink-0"
        style={{
          ...CELEBRATE_SCALE_STYLE,
          width: "calc(502.052px * var(--celebrate-scale))",
          height: "calc(416.841px * var(--celebrate-scale))",
        }}
      >
        <div
          className="absolute left-0 top-0 h-[416.841px] w-[502.052px]"
          style={{ transform: "scale(var(--celebrate-scale))", transformOrigin: "top left" }}
        >
          <div className="absolute inset-0">
            <div
              className="absolute flex h-[262.951px] w-[442.474px] items-center justify-center"
              style={{ left: "calc(50% - 29.79px)", top: 0, transform: "translateX(-50%)" }}
            >
              <p
                className="font-drowner relative flex-none rotate-[-17.18deg] text-center text-[104.29px] leading-[1.4] whitespace-nowrap text-[#242525] lowercase"
                style={{ wordBreak: "break-word" }}
              >
                celebrating
              </p>
            </div>
            <div
              className="absolute flex h-[214.377px] w-[379.906px] items-center justify-center"
              style={{ left: "calc(50% + 60.93px)", top: "108px", transform: "translateX(-50%)" }}
            >
              <p
                className="font-drowner relative flex-none rotate-[-11.49deg] text-center text-[104.29px] leading-[1.4] whitespace-nowrap text-[#242525] lowercase"
                style={{ wordBreak: "break-word" }}
              >
                the joy of
              </p>
            </div>
            <div
              className="absolute flex h-[165.708px] w-[372.426px] items-center justify-center"
              style={{ left: "calc(50% + 13.19px)", top: "243px", transform: "translateX(-50%)" }}
            >
              <div className="relative flex-none rotate-[3.13deg]">
                <p
                  ref={textRef}
                  className="font-drowner relative text-center text-[104.29px] leading-[1.4] whitespace-nowrap text-[#242525] lowercase"
                  style={{ wordBreak: "break-word" }}
                >
                  why nots.
                </p>
                {/* Hand-drawn wavy underline, animated as if scribbled on when the section
                    scrolls into view (see the IntersectionObserver above), paired with a
                    synthesized scribble sound timed to UNDERLINE_DURATION_S. Built in real pixels
                    (see buildSquigglePath) rather than a stretched viewBox, so the stroke stays a
                    uniform width like the browser's native wavy underline. */}
                <svg
                  width={underlineWidth}
                  height={UNDERLINE_HEIGHT}
                  viewBox={`0 0 ${underlineWidth} ${UNDERLINE_HEIGHT}`}
                  className="pointer-events-none absolute left-0"
                  style={{ top: "calc(100% - 30px)" }}
                  aria-hidden="true"
                >
                  <path
                    d={buildSquigglePath(underlineWidth)}
                    fill="none"
                    stroke="#242525"
                    strokeWidth={3}
                    strokeLinecap="round"
                    pathLength={100}
                    style={{
                      strokeDasharray: 100,
                      strokeDashoffset: drawn ? 0 : 100,
                    }}
                  />
                </svg>
              </div>
            </div>
          </div>
          <img
            src="/creature-purple.svg"
            alt=""
            className="absolute h-[76.061px] w-[67px] animate-float-slow"
            style={{ left: "44px", top: "93px" }}
          />
          <img
            src="/creature-green.svg"
            alt=""
            className="absolute h-[95.964px] w-[59px]"
            style={{ left: "367px", top: "226px" }}
          />
        </div>
      </div>
    </section>
  );
}
