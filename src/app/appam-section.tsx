"use client";

import { useEffect, useRef, useState } from "react";
import { HoverDot } from "./hover-dot";
import { SpeechBubbleCreature } from "./speech-bubble-creature";

const REF_WIDTH = 1280;
const REF_HEIGHT = 832;

// Same palette used for the other dot decorations across the site (see hero-dots.tsx /
// why-section.tsx) - this dot's own base color is the same red/magenta combo as why-dot.svg.
const DOT_ASSETS = ["/why-dot.svg", "/hero-dot-1.svg", "/hero-dot-2.svg", "/hero-dot-3.svg", "/hero-dot-4.svg"] as const;

// Slow, deliberate rise rather than a snappy pop - a longer duration paired with an "expo out"
// curve (fast start, long gentle settle) reads as curated instead of mechanical. The second
// board is staggered slightly behind the first so they don't land in unison.
const ENTRANCE_DURATION_S = 1.4;
const ENTRANCE_DISTANCE_PX = 70;
const ENTRANCE_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
const ENTRANCE_STAGGER_S = 0.2;

const HEADLINE_LINE_1 = "appam thinna";
const HEADLINE_LINE_2 = "mathi, kuzhiyennanda";
const HEADLINE_MALAYALAM = "അപ്പം തിന്നാൽ മതി, കുഴിയെണ്ണണ്ട";
// Time between each letter appearing, so the headline reads as being typed out rather than
// fading in all at once.
const TYPE_STEP_S = 0.09;
const TYPE_CHAR_FADE_S = 0.08;
// How long the finished headline sits before the loop swaps to the other language.
const LANGUAGE_HOLD_S = 1.8;
const LANGUAGE_FADE_OUT_S = 0.4;

function typeDurationS(...texts: string[]): number {
  const totalGraphemes = texts.reduce((sum, text) => sum + splitGraphemes(text).length, 0);
  return totalGraphemes * TYPE_STEP_S + TYPE_CHAR_FADE_S;
}

// Splits into user-perceived characters rather than raw UTF-16 units, so combining marks in
// Malayalam (matras, virama conjuncts, chillu letters) stay attached to their base letter
// instead of the typewriter effect peeling them off as separate "characters".
function splitGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

// Both languages sit on screen for the same total duration - however long typing each one out
// happens to take - so the loop reads as an even back-and-forth instead of one side lingering.
const PHASE_DURATION_S =
  Math.max(typeDurationS(HEADLINE_LINE_1, HEADLINE_LINE_2), typeDurationS(HEADLINE_MALAYALAM)) + LANGUAGE_HOLD_S;

// Renders `text` as one span per grapheme, each fading in on its own delay once `entered`.
// `startIndex` offsets the delay so a second line continues the same typing rhythm as the first
// instead of restarting it. Kept out of the accessibility tree - the parent supplies the real
// text via aria-label.
function TypedText({ text, startIndex, entered }: { text: string; startIndex: number; entered: boolean }) {
  return (
    <>
      {splitGraphemes(text).map((char, i) => (
        <span
          key={i}
          style={{
            opacity: entered ? 1 : 0,
            transition: `opacity ${TYPE_CHAR_FADE_S}s linear ${(startIndex + i) * TYPE_STEP_S}s`,
          }}
        >
          {char}
        </span>
      ))}
    </>
  );
}

export default function AppamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [headlineLanguage, setHeadlineLanguage] = useState<"english" | "malayalam">("english");

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setEntered(true);
        observer.disconnect();
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!entered) return;
    const id = setInterval(() => {
      setHeadlineLanguage((prev) => (prev === "english" ? "malayalam" : "english"));
    }, PHASE_DURATION_S * 1000);
    return () => clearInterval(id);
  }, [entered]);

  const boardStyle = (delaySeconds: number): React.CSSProperties => ({
    transform: entered ? "translateY(0)" : `translateY(${ENTRANCE_DISTANCE_PX}px)`,
    opacity: entered ? 1 : 0,
    transition: `transform ${ENTRANCE_DURATION_S}s ${ENTRANCE_EASING} ${delaySeconds}s, opacity ${ENTRANCE_DURATION_S * 0.7}s ease-out ${delaySeconds}s`,
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full snap-start items-center justify-center overflow-hidden bg-white"
    >
      <div
        className="relative shrink-0"
        style={{
          width: `${REF_WIDTH}px`,
          height: `${REF_HEIGHT}px`,
          transform: `scale(min(1, calc(100vw / ${REF_WIDTH}px), calc(100vh / ${REF_HEIGHT}px)))`,
          transformOrigin: "center center",
        }}
      >
        <HoverDot assets={DOT_ASSETS} baseIndex={0} size={63.73} className="absolute" style={{ left: "80px", top: "694.548px" }} />

        {/* Top-left project photo, propped on a hand-drawn easel/tripod. Rises into place on
            scroll (see the IntersectionObserver above). */}
        <div
          className="absolute"
          style={{ left: "163px", top: "48px", width: "160px", height: "224.006px", ...boardStyle(0) }}
        >
          <img
            src="/appam-stand-1.svg"
            alt=""
            className="absolute"
            style={{ left: "5px", top: "135px", width: "149.5px", height: "89.006px" }}
          />
          <div
            className="absolute overflow-hidden"
            style={{ left: 0, top: 0, width: "160px", height: "139.123px" }}
          >
            <img src="/pic1.webp" alt="" className="absolute inset-0 size-full object-cover" />
          </div>
        </div>

        {/* Bottom-right project photo, same easel treatment, staggered slightly behind the
            first board. */}
        <div
          className="absolute"
          style={{
            left: "872.721px",
            top: "538.607px",
            width: "164.402px",
            height: "241.393px",
            ...boardStyle(ENTRANCE_STAGGER_S),
          }}
        >
          <img
            src="/appam-stand-2.svg"
            alt=""
            className="absolute"
            style={{ left: "11.279px", top: "125.393px", width: "149.5px", height: "116px" }}
          />
          <div
            className="absolute overflow-hidden"
            style={{ left: 0, top: 0, width: "164.402px", height: "145.188px" }}
          >
            <img src="/pic2.webp" alt="" className="absolute inset-0 size-full object-cover" />
          </div>
        </div>

        <div
          className="absolute flex flex-col items-center"
          style={{ left: "149px", top: "255px", width: "982px", gap: "28px" }}
        >
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <p className="font-nanum-pen w-full text-[18.21px] text-black uppercase">
              Made by: Adithya &amp; Team · TinkerHub RIT
            </p>
            <div className="relative" style={{ height: "206px", width: "1180px" }}>
              <p
                aria-label={`${HEADLINE_LINE_1} ${HEADLINE_LINE_2}`}
                aria-hidden={headlineLanguage === "malayalam"}
                className="font-helvetica absolute inset-0 w-full font-normal text-[#121211]"
                style={{
                  fontSize: "114.257px",
                  lineHeight: 0.9,
                  letterSpacing: "-9.1405px",
                  WebkitTextStroke: "0.6px #121211",
                  opacity: headlineLanguage === "malayalam" ? 0 : 1,
                  transition: `opacity ${LANGUAGE_FADE_OUT_S}s ease-out`,
                }}
              >
                <span aria-hidden="true" style={{ whiteSpace: "nowrap" }}>
                  <TypedText text={HEADLINE_LINE_1} startIndex={0} entered={entered && headlineLanguage === "english"} />
                </span>
                <br />
                <span aria-hidden="true" style={{ whiteSpace: "nowrap" }}>
                  <TypedText
                    text={HEADLINE_LINE_2}
                    startIndex={HEADLINE_LINE_1.length}
                    entered={entered && headlineLanguage === "english"}
                  />
                </span>
              </p>

              <p
                aria-label={HEADLINE_MALAYALAM}
                aria-hidden={headlineLanguage !== "malayalam"}
                className="absolute inset-0 w-full font-bold text-[#121211]"
                style={{
                  fontSize: "80px",
                  lineHeight: 1.15,
                  WebkitTextStroke: "0.6px #121211",
                  opacity: headlineLanguage === "malayalam" ? 1 : 0,
                  transition: `opacity ${LANGUAGE_FADE_OUT_S}s ease-out`,
                }}
              >
                <span aria-hidden="true">
                  <TypedText text={HEADLINE_MALAYALAM} startIndex={0} entered={entered && headlineLanguage === "malayalam"} />
                </span>
              </p>
            </div>
            <p className="font-nanum-pen w-full text-[18.21px] text-black uppercase">
              &ldquo;We didn&apos;t really need this. We just wanted to see if we could make a machine that knew
              when an appam was in front of it...&rdquo;
            </p>
          </div>

          <button
            type="button"
            className="flex cursor-pointer items-center justify-center rounded-[4.782px] bg-[#d9d9d9] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#cfcfcf] hover:shadow-md active:translate-y-0"
            style={{ width: "346px", height: "100px" }}
          >
            <span
              className="font-drowner text-[#0e0e0d]"
              style={{ fontSize: "63.57px", letterSpacing: "1.2714px" }}
            >
              see project
            </span>
          </button>
        </div>

        <SpeechBubbleCreature
          left={1190}
          top={600}
          bubbleSrc="/timer-bubble.svg"
          bubbleWidth={157}
          bubbleHeight={109}
          creatureLeft={142}
          creatureTop={92}
          textLeft={25}
          textTop={31}
          textWidth={107}
        >
          cool
          <br />
          right?
        </SpeechBubbleCreature>
      </div>
    </section>
  );
}
