"use client";

import type { CSSProperties, ReactNode } from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import { HoverDot } from "./hover-dot";
import { SpeechBubbleCreature } from "./speech-bubble-creature";

const REF_WIDTH = 1280;
const REF_HEIGHT = 832;

// Mobile is its own Figma frame on the 402px artboard (text/button block 147:9699, plus the two
// photo boards 147:9722 / 147:9728) rather than the desktop canvas scaled down - the headline
// breaks over three lines instead of two, and the dot and "cool right?" creature are dropped.
const MOBILE_WIDTH = 402;
// The composition runs from the top of the text block (artboard y 2233) to the bottom of the
// lower photo board (y 2651.379).
const MOBILE_HEIGHT = 418.379;
// The text block is authored wider than the artboard and bleeds off both edges; the stage's
// overflow-hidden is what trims it, exactly as the frame does.
const MOBILE_TEXT_LEFT = -32;
const MOBILE_TEXT_WIDTH = 454.928;

// Same palette used for the other dot decorations across the site (see hero-dots.tsx /
// why-section.tsx) - this dot's own base color is the same red/magenta combo as why-dot.svg.
const DOT_ASSETS = ["/why-dot.svg", "/hero-dot-1.svg", "/hero-dot-2.svg", "/hero-dot-3.svg", "/hero-dot-4.svg"] as const;

const ENTRANCE_DISTANCE_PX = 70;

// The easels the project photos are propped on. These are the slots - fixed geometry, authored
// once at the desktop size; the mobile frame reuses the same artwork uniformly scaled (109/160 and
// 139.193/164.402), so a breakpoint only contributes a position plus, on mobile, that scale. The
// photos that fill them come from PROJECTS below and change as you scroll from one to the next.
const BOARDS = [
  {
    stand: "/appam-stand-1.svg",
    width: 160,
    height: 224.006,
    photoHeight: 139.123,
    standLeft: 5,
    standTop: 135,
    standWidth: 149.5,
    standHeight: 89.006,
    desktop: { left: 163, top: 48 },
    mobile: { left: 30, top: 6.701, scale: 0.68125 },
  },
  {
    stand: "/appam-stand-2.svg",
    width: 164.402,
    height: 241.393,
    photoHeight: 145.188,
    standLeft: 11.279,
    standTop: 125.393,
    standWidth: 149.5,
    standHeight: 116,
    desktop: { left: 872.721, top: 538.607 },
    mobile: { left: 287, top: 214, scale: 0.84667 },
  },
] as const;

type Board = (typeof BOARDS)[number];

type Project = {
  credit: string;
  quote: string;
  // The same headline, broken to suit each frame's width; `english` is the whole line, used as the
  // accessible label for both.
  english: string;
  linesDesktop: string[];
  linesMobile: string[];
  // Optional - only the appam project has a Malayalam rendering. Without one the headline simply
  // stays in English rather than looping between languages.
  malayalam?: string;
};

// One entry per project. The section is as many viewports tall as there are entries, and scrolling
// through it carries each set of boards up and out while the next rises into its place - so adding
// a project is adding a row here, plus its two photos below.
const PROJECTS: Project[] = [
  {
    credit: "Made by: Adithya & Team · TinkerHub RIT",
    english: "appam thinna mathi, kuzhiyennanda",
    linesDesktop: ["appam thinna", "mathi, kuzhiyennanda"],
    linesMobile: ["appam", "thinna mathi,", "kuzhiyennanda"],
    malayalam: "അപ്പം തിന്നാൽ മതി, കുഴിയെണ്ണണ്ട",
    quote:
      "“We didn’t really need this. We just wanted to see if we could make a machine that knew when an appam was in front of it...”",
  },
  // SAMPLE ENTRY - placeholder copy, here to exercise the handover. Swap in the real project.
  {
    credit: "Made by: Meera & Team · TinkerHub CET",
    english: "a mirror that only lies",
    linesDesktop: ["a mirror that", "only lies"],
    linesMobile: ["a mirror", "that only", "lies"],
    quote:
      "“It compliments you regardless of the evidence. We taught it to be honest for one afternoon and nobody stood in front of it again.”",
  },
];

// Paired with BOARDS by position. Only two photos exist in the project, so the sample entry reuses
// them in the opposite order - enough to see the sets change hands while scrolling.
const PROJECT_PHOTOS: string[][] = [
  ["/pic1.webp", "/pic2.webp"],
  ["/pic2.webp", "/pic1.webp"],
];

// Driven by the scroll handler below: 0 while a project sits at rest, running to 1 as the next one
// takes over. The board sets and the copy both read off it, so they stay locked to the scrollbar.
const PROGRESS = "var(--drift-progress, 0)";
// The outgoing copy is gone by the halfway point and the incoming copy arrives after it, so the two
// never overlap mid-fade. Values outside 0-1 clamp, which is what holds each end steady.
const OUTGOING_OPACITY = `calc(1 - ${PROGRESS} * 2)`;
const INCOMING_OPACITY = `calc(${PROGRESS} * 2 - 1)`;

// The set travels as one piece, so the path runs from "the topmost board is just below the frame"
// to "the lowest board has just cleared the top". Both ends are derived from the board geometry, so
// moving or adding a board keeps the travel correct.
function driftBounds(canvasHeight: number, tops: number[], bottoms: number[]): CSSProperties {
  return {
    "--board-drift-from": `${canvasHeight - Math.min(...tops)}px`,
    "--board-drift-to": `${-Math.max(...bottoms)}px`,
  } as CSSProperties;
}

const DESKTOP_DRIFT = driftBounds(
  REF_HEIGHT,
  BOARDS.map((b) => b.desktop.top),
  BOARDS.map((b) => b.desktop.top + b.height)
);
const MOBILE_DRIFT = driftBounds(
  MOBILE_HEIGHT,
  BOARDS.map((b) => b.mobile.top),
  BOARDS.map((b) => b.mobile.top + b.height * b.mobile.scale)
);

// Time between each letter appearing, so the headline reads as being typed out rather than
// fading in all at once.
const TYPE_STEP_S = 0.09;
const TYPE_CHAR_FADE_S = 0.08;
// How long the finished headline sits before the loop swaps to the other language.
const LANGUAGE_HOLD_S = 1.8;

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

// Both languages sit on screen for the same total duration - however long typing the longest of
// them takes, across every project - so the loop reads as an even back-and-forth instead of one
// side lingering, and every project stays in step with the others.
const PHASE_DURATION_S =
  Math.max(
    ...PROJECTS.flatMap((project) => [
      typeDurationS(...project.linesDesktop),
      typeDurationS(...project.linesMobile),
      project.malayalam ? typeDurationS(project.malayalam) : 0,
    ])
  ) + LANGUAGE_HOLD_S;

// The Malayalam layer needs a box of its own rather than inheriting the English one. Two reasons
// it can't ride along: the English box is deliberately authored wider than its frame (it only
// stays inside because its longest Latin line happens to be narrower), and this text renders in
// whatever Malayalam face the device supplies - Helvetica carries none - so its width is not
// something the layout can assume. Left on the English box it wrapped to lines wider than the
// 402px mobile artboard and bled off both edges. Sized to the frame it can only ever wrap, on any
// device; the mobile size is set so that even a wrap to four lines still clears the box height.
const MALAYALAM_DESKTOP = { fontSize: 80, width: 1180 };
const MALAYALAM_MOBILE = { fontSize: 38, width: 360 };

// Renders `text` as one span per grapheme, each shown once `entered`. Kept out of the
// accessibility tree - the parent supplies the real text via aria-label.
function TypedText({ text, entered }: { text: string; entered: boolean }) {
  return (
    <>
      {splitGraphemes(text).map((char, i) => (
        <span key={i} style={{ opacity: entered ? 1 : 0 }}>
          {char}
        </span>
      ))}
    </>
  );
}

function ProjectBoard({
  board,
  photo,
  left,
  top,
  scale = 1,
  entrance,
}: {
  board: Board;
  photo: string;
  left: number;
  top: number;
  scale?: number;
  entrance: CSSProperties;
}) {
  // scale() sits left of the entrance translate so the rise distance shrinks with the board
  // rather than staying a desktop-sized 70px on a two-thirds-scale mobile photo.
  const entranceTransform = entrance.transform ?? "";
  return (
    <div
      className="absolute"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${board.width}px`,
        height: `${board.height}px`,
        ...entrance,
        transform: `scale(${scale}) ${entranceTransform}`.trim(),
        transformOrigin: "top left",
      }}
    >
      <img
        src={board.stand}
        alt=""
        className="absolute"
        style={{
          left: `${board.standLeft}px`,
          top: `${board.standTop}px`,
          width: `${board.standWidth}px`,
          height: `${board.standHeight}px`,
        }}
      />
      <div
        className="absolute overflow-hidden"
        style={{ left: 0, top: 0, width: `${board.width}px`, height: `${board.photoHeight}px` }}
      >
        <img src={photo} alt="" className="absolute inset-0 size-full object-cover" />
      </div>
    </div>
  );
}

export default function AppamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [headlineLanguage, setHeadlineLanguage] = useState<"english" | "malayalam">("english");
  const [index, setIndex] = useState(0);

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

  // How far the page has scrolled through this section is the only thing driving the handover -
  // nothing moves on its own. The fractional part is written straight to a custom property on the
  // stage rather than through React state, so a scroll frame costs one style write instead of a
  // re-render; only the whole part, which changes once per project, goes through state.
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const travel = section.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-section.getBoundingClientRect().top, 0), Math.max(travel, 0));
      const position = travel > 0 ? (scrolled / travel) * (PROJECTS.length - 1) : 0;
      const current = Math.min(Math.floor(position), PROJECTS.length - 1);
      stage.style.setProperty("--drift-progress", String(position - current));
      setIndex(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const outgoing = PROJECTS[index];
  const incoming = PROJECTS[index + 1];

  useEffect(() => {
    // No reset when a project has no Malayalam - `showMalayalam` already falls back to English on
    // its own, so the loop just stops rather than the state needing to be driven back.
    if (!entered || !outgoing.malayalam) return;
    const id = setInterval(() => {
      setHeadlineLanguage((prev) => (prev === "english" ? "malayalam" : "english"));
    }, PHASE_DURATION_S * 1000);
    return () => clearInterval(id);
  }, [entered, outgoing.malayalam]);

  const entrance: CSSProperties = {
    transform: entered ? "translateY(0)" : `translateY(${ENTRANCE_DISTANCE_PX}px)`,
    opacity: entered ? 1 : 0,
  };

  // The set that is leaving runs from its designed position up until the lower board clears the
  // frame; the set arriving runs the same path from below up into that position. Both read the one
  // progress value, so at rest the incoming set is parked just out of sight under the frame.
  const boardSet = (
    project: number,
    transform: string,
    place: (board: Board) => { left: number; top: number; scale?: number }
  ) => (
    // pointer-events-none because this is a full-canvas overlay carrying nothing interactive, and
    // it would otherwise sit over the hover dot rendered beneath it.
    <div className="pointer-events-none absolute inset-0" style={{ transform }}>
      {BOARDS.map((board, slot) => (
        <ProjectBoard
          key={board.stand}
          board={board}
          photo={PROJECT_PHOTOS[project % PROJECT_PHOTOS.length][slot]}
          entrance={entrance}
          {...place(board)}
        />
      ))}
    </div>
  );

  const headline = (
    project: Project,
    lines: string[],
    {
      fontSize,
      letterSpacing,
      malayalam,
    }: { fontSize: number; letterSpacing: number; malayalam: { fontSize: number; width: number } }
  ) => {
    const showMalayalam = Boolean(project.malayalam) && headlineLanguage === "malayalam";
    return (
      <>
        <p
          aria-label={project.english}
          aria-hidden={showMalayalam}
          className="font-helvetica absolute inset-0 w-full font-normal text-[#121211]"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: 0.9,
            letterSpacing: `${letterSpacing}px`,
            WebkitTextStroke: "0.6px #121211",
            opacity: showMalayalam ? 0 : 1,
          }}
        >
          {lines.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && <br />}
              <span aria-hidden="true" style={{ whiteSpace: "nowrap" }}>
                <TypedText text={line} entered={entered && !showMalayalam} />
              </span>
            </Fragment>
          ))}
        </p>

        {project.malayalam && (
          <p
            aria-label={project.malayalam}
            aria-hidden={!showMalayalam}
            className="absolute font-bold text-[#121211]"
            style={{
              left: "50%",
              top: 0,
              width: `${malayalam.width}px`,
              transform: "translateX(-50%)",
              fontSize: `${malayalam.fontSize}px`,
              lineHeight: 1.15,
              WebkitTextStroke: "0.6px #121211",
              opacity: showMalayalam ? 1 : 0,
            }}
          >
            <span aria-hidden="true">
              <TypedText text={project.malayalam} entered={entered && showMalayalam} />
            </span>
          </p>
        )}
      </>
    );
  };

  const mobileText = (project: Project, opacity: string) => (
    <div
      className="absolute flex flex-col items-center"
      style={{ left: `${MOBILE_TEXT_LEFT}px`, top: 0, width: `${MOBILE_TEXT_WIDTH}px`, gap: "12.971px", opacity }}
    >
      <div className="flex w-full flex-col items-center text-center" style={{ gap: "3.706px" }}>
        <p
          className="font-nanum-pen text-black uppercase"
          style={{ width: "197.818px", fontSize: "12.071px", lineHeight: "16.899px" }}
        >
          {project.credit}
        </p>
        {/* Authored wider than the text block it sits in, so the headline overhangs it evenly
            either side - the same relationship the desktop frame uses (1180 inside 982). */}
        <div className="relative" style={{ width: "530.356px", height: "180.321px" }}>
          {headline(project, project.linesMobile, {
            fontSize: 61.628,
            letterSpacing: -4.9303,
            malayalam: MALAYALAM_MOBILE,
          })}
        </div>
        <p
          className="font-nanum-pen text-black uppercase"
          style={{ width: "338px", fontSize: "14.201px", lineHeight: "19.882px" }}
        >
          {project.quote}
        </p>
      </div>

      <button
        type="button"
        className="flex cursor-pointer items-center justify-center rounded-[2.215px] bg-[#d9d9d9] hover:-translate-y-0.5 hover:bg-[#cfcfcf] hover:shadow-md active:translate-y-0"
        style={{ width: "160.29px", height: "46.327px" }}
      >
        <span className="font-drowner text-[#0e0e0d]" style={{ fontSize: "29.45px", letterSpacing: "0.589px" }}>
          see project
        </span>
      </button>
    </div>
  );

  const desktopText = (project: Project, opacity: string) => (
    <div
      className="absolute flex flex-col items-center"
      style={{ left: "149px", top: "255px", width: "982px", gap: "28px", opacity }}
    >
      <div className="flex w-full flex-col items-center gap-2 text-center">
        <p className="font-nanum-pen w-full text-[18.21px] text-black uppercase">{project.credit}</p>
        <div className="relative" style={{ height: "206px", width: "1180px" }}>
          {headline(project, project.linesDesktop, {
            fontSize: 114.257,
            letterSpacing: -9.1405,
            malayalam: MALAYALAM_DESKTOP,
          })}
        </div>
        <p className="font-nanum-pen w-full text-[18.21px] text-black uppercase">{project.quote}</p>
      </div>

      <button
        type="button"
        className="flex cursor-pointer items-center justify-center rounded-[4.782px] bg-[#d9d9d9] hover:-translate-y-0.5 hover:bg-[#cfcfcf] hover:shadow-md active:translate-y-0"
        style={{ width: "346px", height: "100px" }}
      >
        <span className="font-drowner text-[#0e0e0d]" style={{ fontSize: "63.57px", letterSpacing: "1.2714px" }}>
          see project
        </span>
      </button>
    </div>
  );

  const leaving = `translateY(calc(var(--board-drift-to) * ${PROGRESS}))`;
  const arriving = `translateY(calc(var(--board-drift-from) * (1 - ${PROGRESS})))`;

  const stage = (
    slot: (project: number, transform: string, place: (board: Board) => { left: number; top: number; scale?: number }) => ReactNode,
    place: (board: Board) => { left: number; top: number; scale?: number },
    text: (project: Project, opacity: string) => ReactNode
  ) => (
    <>
      {slot(index, leaving, place)}
      {incoming && slot(index + 1, arriving, place)}
      {text(outgoing, OUTGOING_OPACITY)}
      {incoming && text(incoming, INCOMING_OPACITY)}
    </>
  );

  return (
    // As many viewports tall as there are projects, with a snap stop at each one, so the mandatory
    // snapping settles on a project rather than mid-handover. The composition itself is pinned to
    // the viewport by the sticky stage while that height scrolls past underneath.
    <section ref={sectionRef} className="relative w-full bg-white" style={{ height: `${PROJECTS.length * 100}vh` }}>
      {PROJECTS.map((_, i) => (
        <div
          key={i}
          className="pointer-events-none absolute left-0 h-screen w-px snap-start"
          style={{ top: `${i * 100}vh` }}
          aria-hidden="true"
        />
      ))}

      <div
        ref={stageRef}
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-white"
      >
        {/* Mobile (Figma nodes 147:9699 + 147:9722 + 147:9728). */}
        <div
          className="relative shrink-0 lg:hidden"
          style={{
            ...MOBILE_DRIFT,
            width: `${MOBILE_WIDTH}px`,
            height: `${MOBILE_HEIGHT}px`,
            transform: `scale(min(1, calc(100vw / ${MOBILE_WIDTH}px)))`,
            transformOrigin: "center center",
          }}
        >
          {/* The boards go behind the copy at this size: the frame packs them in tight enough that
              the upper one crosses the headline and the lower one the tail of the quote. */}
          {stage(boardSet, (board) => board.mobile, mobileText)}
        </div>

        <div
          className="relative hidden shrink-0 lg:block"
          style={{
            ...DESKTOP_DRIFT,
            width: `${REF_WIDTH}px`,
            height: `${REF_HEIGHT}px`,
            transform: `scale(min(1, calc(100vw / ${REF_WIDTH}px), calc(100vh / ${REF_HEIGHT}px)))`,
            transformOrigin: "center center",
          }}
        >
          <HoverDot assets={DOT_ASSETS} baseIndex={0} size={63.73} className="absolute" style={{ left: "80px", top: "694.548px" }} />

          {stage(boardSet, (board) => board.desktop, desktopText)}

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
      </div>
    </section>
  );
}
