"use client";

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { HoverDot } from "./hover-dot";

const REF_WIDTH = 1280;
const REF_HEIGHT = 832;

// Mobile is its own Figma frame on the 402px artboard (text/button block 147:9699, plus the two
// photo boards 147:9722 / 147:9728) rather than the desktop canvas scaled down - the headline
// breaks over three lines instead of two, and the dot and "cool right?" creature are dropped.
const MOBILE_WIDTH = 402;
// Expanded from the original 418px Figma frame height to give the two photo boards their own
// clear zone below the text block (~343px). Both boards sit side-by-side in the bottom ~270px
// so they never collide with copy at the rest (scroll-start) position.
const MOBILE_HEIGHT = 640;
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
    // Board 1 sits left-of-center in the clear zone below the text block.
    // Anchored from bottom of the MOBILE_HEIGHT frame so boards stay in their zone
    // regardless of how tall the text block is above.
    mobile: { left: 28, top: 400, scale: 0.68125 },
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
    // Board 2 sits right-of-center, slightly lower to echo the staggered desktop arrangement.
    mobile: { left: 218, top: 420, scale: 0.84667 },
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
  url: string;
};

// One entry per project. The section is as many viewports tall as there are entries, and scrolling
// through it carries each set of boards up and out while the next rises into its place - so adding
// a project is adding a row here, plus its two photos below.
const PROJECTS: Project[] = [
  {
    credit: "Made by: Ashin & Aibel · SJCET Palai",
    english: "appam thinna mathi, kuzhiyennanda",
    linesDesktop: ["appam thinna", "mathi, kuzhiyennanda"],
    linesMobile: ["appam", "thinna mathi,", "kuzhiyennanda"],
    malayalam: "അപ്പം തിന്നാൽ മതി, കുഴിയെണ്ണണ്ട",
    quote:
      "“We didn’t really need this. We just wanted to see if we could make a machine that knew when an appam was in front of it...”",
    url: "https://github.com/aibelbin/Appam_thinnam",
  },
  {
    credit: "Made by: Noel S & Shamil · CUSAT Kuttanad",
    english: "malambambu",
    linesDesktop: ["malambambu"],
    linesMobile: ["malambambu"],
    malayalam: "മലമ്പാമ്പ്",
    quote:
      "“മലമ്പാമ്പ് is a Malayalam programming language interpreter where “ഓ. എസ്” makes variables, “പറയൂ” prints, “പറയുക” loops, and “പാടിക്കൂ” gives tea breaks. Like Python, but it speaks Malayalam and enjoys snacks. Nobody asked for it, but we made it anyway!”",
    url: "https://noel9907.github.io/uslessss/",
  },
];

// Paired with BOARDS by position. Only two photos exist in the project, so the sample entry reuses
// them in the opposite order - enough to see the sets change hands while scrolling.
const PROJECT_PHOTOS: string[][] = [
  ["/pic1.webp", "/pic2.webp"],
  ["/malambambu-1.jpg", "/malambambu-2.jpg"],
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

// Desktop only - see the mobile canvas below for why the handover doesn't run there.
const DESKTOP_DRIFT = driftBounds(
  REF_HEIGHT,
  BOARDS.map((b) => b.desktop.top),
  BOARDS.map((b) => b.desktop.top + b.height)
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
  alt,
  left,
  top,
  scale = 1,
  entrance,
}: {
  board: Board;
  photo: string;
  alt: string;
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
        {/* A real photo (unlike the sprite-style animation frames elsewhere), so it's worth
            next/image's automatic resizing/format negotiation - `fill` since this box already
            carries the board's exact pixel size. */}
        <Image src={photo} alt={alt} fill sizes={`${Math.ceil(board.width)}px`} className="object-cover" />
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

  // Mobile drift bounds must be computed at runtime because the mobile frame (MOBILE_HEIGHT ≈ 418px)
  // is shorter than the phone viewport (~850px). Using a static MOBILE_HEIGHT-based value leaves
  // the arriving/leaving board sets partially visible at rest. Instead we calculate how far the
  // boards need to travel (in the frame's unscaled coordinate space) so they start/end fully
  // outside the visible area on whatever device is rendering.
  const [mobileDrift, setMobileDrift] = useState<CSSProperties>({} as CSSProperties);

  useEffect(() => {
    const compute = () => {
      const scale = Math.min(1, window.innerWidth / MOBILE_WIDTH);
      // Viewport height expressed in the frame's unscaled coordinate units.
      const frameSpaceVh = window.innerHeight / scale;
      const tops = BOARDS.map((b) => b.mobile.top);
      // Layout bottoms use the board's full height (transform doesn't affect layout box).
      const bottoms = BOARDS.map((b) => b.mobile.top + b.height);
      // The frame is centered in the sticky stage, so frame top (in frame units) is below the
      // viewport top by (frameSpaceVh - MOBILE_HEIGHT) / 2.
      const frameOffsetY = (frameSpaceVh - MOBILE_HEIGHT) / 2;
      // Arriving set must start below the viewport bottom; leaving set must end above viewport top.
      const driftFrom = frameSpaceVh - Math.min(...tops) - frameOffsetY;
      const driftTo = -(Math.max(...bottoms) + frameOffsetY);
      setMobileDrift({
        "--board-drift-from": `${driftFrom}px`,
        "--board-drift-to": `${driftTo}px`,
      } as CSSProperties);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

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
          alt={`${PROJECTS[project % PROJECTS.length].english}, a Useless Projects showcase build by TinkerHub`}
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
      malayalamTopOffset = 0,
    }: { fontSize: number; letterSpacing: number; malayalam: { fontSize: number; width: number }; malayalamTopOffset?: number }
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
              top: malayalamTopOffset,
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
            either side - the same relationship the desktop frame uses (1180 inside 982).
            Height computed from line count so single-line projects (malamambu / മലമ്പാമ്പ്)
            don't leave a large dead gap like the old fixed 180.321px caused. */}
        <div className="relative" style={{ width: "530.356px", height: `${project.linesMobile.length * 61.628 * 0.9 + 20}px` }}>
          {headline(project, project.linesMobile, {
            fontSize: 61.628,
            letterSpacing: -4.9303,
            malayalam: MALAYALAM_MOBILE,
            malayalamTopOffset: 20,
          })}
        </div>
        <p
          className="font-nanum-pen text-black uppercase"
          style={{ width: "338px", fontSize: "14.201px", lineHeight: "19.882px" }}
        >
          {project.quote}
        </p>
      </div>

      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex cursor-pointer items-center justify-center rounded-[2.215px] bg-[#d9d9d9] text-[#0e0e0d] shadow-md transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:bg-[#cfcfcf] hover:shadow-xl hover:shadow-black/20 active:translate-y-0.5 active:scale-[0.97] active:shadow-inner select-none"
        style={{ width: "160.29px", height: "46.327px" }}
      >
        <span className="font-drowner text-[#0e0e0d] transition-transform duration-200 group-hover:scale-105" style={{ fontSize: "29.45px", letterSpacing: "0.589px" }}>
          see project
        </span>
      </a>
    </div>
  );

  const desktopText = (project: Project, opacity: string) => (
    <div
      className="absolute flex flex-col items-center"
      style={{ left: "149px", top: "255px", width: "982px", gap: "28px", opacity }}
    >
      <div className="flex w-full flex-col items-center gap-2 text-center">
        <p className="font-nanum-pen w-full text-[18.21px] text-black uppercase">{project.credit}</p>
        <div className="relative" style={{ height: `${project.linesDesktop.length * 114.257 * 0.9 + 20}px`, width: "1180px" }}>
          {headline(project, project.linesDesktop, {
            fontSize: 114.257,
            letterSpacing: -9.1405,
            malayalam: MALAYALAM_DESKTOP,
          })}
        </div>
        <p className="font-nanum-pen w-full text-[18.21px] text-black uppercase">{project.quote}</p>
      </div>

      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex cursor-pointer items-center justify-center rounded-[4.782px] bg-[#d9d9d9] text-[#0e0e0d] shadow-md transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:bg-[#cfcfcf] hover:shadow-xl hover:shadow-black/20 active:translate-y-0.5 active:scale-[0.97] active:shadow-inner select-none"
        style={{ width: "346px", height: "100px" }}
      >
        <span className="font-drowner text-[#0e0e0d] transition-transform duration-200 group-hover:scale-105" style={{ fontSize: "63.57px", letterSpacing: "1.2714px" }}>
          see project
        </span>
      </a>
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
    // Desktop is as many viewports tall as there are projects, with a snap stop at each one, so the
    // mandatory snapping settles on a project rather than mid-handover - see appam-scroll-stage in
    // globals.css for the height, which only grows past 100vh from lg up. Mobile stays a single
    // screen: the sticky stage below always shows the frame's own composition there (see the mobile
    // canvas), so there is nothing to scroll past.
    <section
      ref={sectionRef}
      id="appam-section"
      className="appam-scroll-stage relative w-full snap-start bg-white"
      style={{ "--appam-project-count": PROJECTS.length } as CSSProperties}
    >
      {PROJECTS.map(
        (_, i) =>
          i > 0 && (
            <div
              key={i}
              className="pointer-events-none absolute left-0 h-screen w-px snap-start"
              style={{ top: `${i * 100}vh` }}
              aria-hidden="true"
            />
          )
      )}

      <div
        ref={stageRef}
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-white"
      >
        {/* Mobile (Figma nodes 147:9699 + 147:9722 + 147:9728). Uses the same scroll-driven
            stage() as desktop. mobileDrift holds dynamically-computed --board-drift-from/to
            values sized to the real viewport so boards park fully off-screen at both ends
            (the mobile frame at 418px is shorter than the phone viewport, so static
            MOBILE_HEIGHT-based bounds would leave boards partially visible). */}
        <div
          className="relative shrink-0 lg:hidden"
          style={{
            ...mobileDrift,
            width: `${MOBILE_WIDTH}px`,
            height: `${MOBILE_HEIGHT}px`,
            transform: `scale(min(1, calc(100vw / ${MOBILE_WIDTH}px)))`,
            transformOrigin: "center center",
          }}
        >
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
        </div>
      </div>
    </section>
  );
}
