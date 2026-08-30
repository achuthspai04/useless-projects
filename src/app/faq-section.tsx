"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { FAQ_ITEMS } from "./faq-data";
import { HoverDot } from "./hover-dot";

const REF_WIDTH = 1280;

// The mobile frame (Figma node 147:9834, 367 wide on the 402px artboard) is this same composition
// uniformly reduced - the card width, the 100px heading, the 8.43px radius, the 20px chevron and
// every gap in between are all the desktop figure times 367/640. So the block is authored once at
// its desktop size and every dimension reads off --faq-scale, rather than the two breakpoints
// carrying two sets of hand-converted numbers.
const BLOCK_WIDTH = 640;
const MOBILE_BLOCK_WIDTH = 367;
const MOBILE_SCALE = MOBILE_BLOCK_WIDTH / BLOCK_WIDTH;
// On phones narrower than the artboard the block keeps shrinking past the frame's own size so a
// 16px gutter survives either side - the same floor the other mobile frames use.
// Text scale is kept higher on mobile so handwritten/script fonts remain comfortably readable.
const MOBILE_SCALE_STYLE = {
  "--faq-scale": `min(${MOBILE_SCALE}, calc((100vw - 32px) / ${BLOCK_WIDTH}px))`,
  "--faq-text-scale": `min(0.75, calc((100vw - 32px) / 480px))`,
} as CSSProperties;
const DESKTOP_SCALE_STYLE = {
  "--faq-scale": "1",
  "--faq-text-scale": "1",
} as CSSProperties;
// The one thing the mobile frame does differently rather than just smaller: the heading's text
// box is centred over the cards instead of running flush with their left edge.
const MOBILE_HEADER_WIDTH = 562;

// How many questions are up before "show more". Six is what fits a laptop viewport alongside the
// heading, so the section opens at roughly one screen and only grows once asked to.
const COLLAPSED_COUNT = 6;

const px = (value: number) => `calc(${value}px * var(--faq-scale))`;
const pxText = (value: number) => `calc(${value}px * var(--faq-text-scale, 1))`;

// Same palette used for the other dot decorations across the site (see hero-dots.tsx /
// why-section.tsx) - this dot's own base color is the same red/magenta combo as why-dot.svg.
const DOT_ASSETS = ["/why-dot.svg", "/hero-dot-1.svg", "/hero-dot-2.svg", "/hero-dot-3.svg", "/hero-dot-4.svg"] as const;

function renderAnswerText(answer: string) {
  const lines = answer.split("\n");
  return lines.map((line, lineIndex) => {
    const urlRegex = /(https?:\/\/[^\s]+|\[([^\]]+)\]\(([^)]+)\)|\[([^\]]+)\])/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }
      if (match[1].startsWith("http")) {
        const url = match[1];
        parts.push(
          <a
            key={`${lineIndex}-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[#ea34df] underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {url}
          </a>
        );
      } else if (match[2] && match[3]) {
        parts.push(
          <a
            key={`${lineIndex}-${match.index}`}
            href={match[3]}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[#ea34df] underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {match[2]}
          </a>
        );
      } else if (match[4]) {
        const text = match[4];
        parts.push(
          <a
            key={`${lineIndex}-${match.index}`}
            href="https://tinkerhub.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[#ea34df] underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {text}
          </a>
        );
      }
      lastIndex = urlRegex.lastIndex;
    }
    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    return (
      <span key={lineIndex} className="block">
        {parts.length > 0 ? parts : line}
      </span>
    );
  });
}

function FaqItem({
  tag,
  question,
  answer,
  open,
  onToggle,
}: {
  tag: string;
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="w-full bg-white border border-black/5 shadow-xs transition-shadow hover:shadow-sm" style={{ borderRadius: px(8.43) }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between text-left"
        style={{
          paddingLeft: px(24),
          paddingRight: px(16),
          paddingTop: px(16),
          paddingBottom: px(16),
        }}
      >
        <span className="flex items-center" style={{ gap: px(8) }}>
          <span className="font-helvetica font-semibold text-black shrink-0" style={{ fontSize: pxText(22), lineHeight: pxText(26) }}>
            {tag}
          </span>
          <span className="font-nanum-pen text-black text-left" style={{ fontSize: pxText(30), lineHeight: pxText(32) }}>
            {question}
          </span>
        </span>
        <span
          className="flex shrink-0 items-center justify-center rounded-full bg-[#ea34df] transition-transform duration-200"
          style={{
            width: px(24),
            height: px(24),
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <img src="/faq-dropdown-arrow.svg" alt="" style={{ width: px(9), height: px(4.5) }} />
        </span>
      </button>

      <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr" }} className="transition-[grid-template-rows] duration-200">
        <div className="overflow-hidden">
          <div
            className="font-nanum-pen text-black"
            style={{
              fontSize: pxText(24),
              lineHeight: pxText(30),
              paddingLeft: px(24),
              paddingRight: px(16),
              paddingBottom: px(18),
            }}
          >
            {renderAnswerText(answer)}
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqBlock({
  headerWidth = BLOCK_WIDTH,
  openItems,
  onToggle,
  expanded,
  onExpand,
}: {
  headerWidth?: number;
  openItems: boolean[];
  onToggle: (index: number) => void;
  expanded: boolean;
  onExpand: () => void;
}) {
  const shown = expanded ? FAQ_ITEMS : FAQ_ITEMS.slice(0, COLLAPSED_COUNT);
  return (
    <div className="flex flex-col items-center" style={{ width: px(BLOCK_WIDTH), gap: px(12) }}>
      {/* items-center on the column is what centres the heading when it is given the narrower
          mobile box; at the full block width it lands flush left, as the desktop frame has it. */}
      <p
        className="font-drowner text-[#0e0e0d]"
        style={{
          width: px(headerWidth),
          fontSize: pxText(85),
          lineHeight: "normal",
          letterSpacing: px(2),
        }}
      >
        want to know more?
      </p>

      <div className="flex w-full flex-col" style={{ gap: px(14) }}>
        {shown.map((item, index) => (
          <FaqItem
            key={index}
            tag={item.tag}
            question={item.question}
            answer={item.answer}
            open={openItems[index]}
            onToggle={() => onToggle(index)}
          />
        ))}
      </div>

      {!expanded && (
        <button
          type="button"
          onClick={onExpand}
          className="font-nanum-pen cursor-pointer text-[#0e0e0d] underline decoration-wavy underline-offset-4 transition-opacity duration-200 hover:opacity-60"
          style={{ fontSize: pxText(30), marginTop: px(6) }}
        >
          show more ({FAQ_ITEMS.length - COLLAPSED_COUNT} more)
        </button>
      )}
    </div>
  );
}

export default function FaqSection() {
  const [openItems, setOpenItems] = useState<boolean[]>(() => FAQ_ITEMS.map((_, i) => i === 0));
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  // Number of viewports this section currently spans. Expanding the questions can push it past
  // one, and under the page's mandatory y-snapping the only restable positions are snap points -
  // so anything between this section's start and the next one's would be unreachable. Extra snap
  // points every viewport keep the whole of it scrollable, the same trick appam-section uses for
  // its multi-screen stage.
  const [panels, setPanels] = useState(1);
  // The desktop canvas is laid out at a fixed 1280 and scaled down to fit, but a transform doesn't
  // shrink the layout box - so the canvas keeps reserving its full unscaled height and the section
  // ends up hundreds of pixels taller than what's actually drawn. Measuring it lets the wrapper
  // below claim the scaled height instead, which is what "the content sets the height" needs.
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const measure = () => setCanvasHeight(el.offsetHeight || null);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded, openItems]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const measure = () => {
      // A mobile browser's address bar showing/hiding can report a transient window.innerHeight
      // of 0, which would divide out to Infinity and crash the Array.from below - guard against
      // that (and any other non-finite result) by falling back to the 1-panel floor.
      const ratio = el.getBoundingClientRect().height / window.innerHeight;
      setPanels(Number.isFinite(ratio) ? Math.max(1, Math.ceil(ratio)) : 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const toggleItem = (index: number) => {
    setOpenItems((prev) => prev.map((value, i) => (i === index ? !value : value)));
  };

  return (
    // The content sets the height: min-h-screen is only a floor, and there's no inner scroller -
    // the section just grows as questions are opened or "show more" is used. overflow-hidden keeps
    // the desktop canvas below (laid out at a fixed 1280 and scaled down) from widening the page,
    // which every other full-page section here already does.
    <section
      ref={sectionRef}
      id="faq-section"
      className="relative flex min-h-screen w-full snap-start snap-always items-center justify-center overflow-hidden bg-white py-16"
    >
      {Array.from({ length: panels - 1 }, (_, i) => (
        <div
          key={i}
          className="pointer-events-none absolute left-0 h-px w-px snap-start"
          style={{ top: `${(i + 1) * 100}vh` }}
          aria-hidden="true"
        />
      ))}

      {/* Mobile (Figma node 147:9834). The frame carries only the heading and the cards - no
          corner dot, and no "more details?" creature. */}
      <div className="flex w-full justify-center lg:hidden" style={MOBILE_SCALE_STYLE}>
        <FaqBlock
          headerWidth={MOBILE_HEADER_WIDTH}
          openItems={openItems}
          onToggle={toggleItem}
          expanded={expanded}
          onExpand={() => setExpanded(true)}
        />
      </div>

      {/* Claims the canvas's scaled height so the section doesn't reserve the untransformed box. */}
      <div
        className="hidden shrink-0 lg:block"
        style={{
          width: `${REF_WIDTH}px`,
          height: canvasHeight
            ? `calc(${canvasHeight}px * min(1, calc(100vw / ${REF_WIDTH}px)))`
            : undefined,
        }}
      >
        <div
          ref={canvasRef}
          className="relative"
          style={{
            width: `${REF_WIDTH}px`,
            transform: `scale(min(1, calc(100vw / ${REF_WIDTH}px)))`,
            transformOrigin: "top center",
          }}
        >
          <HoverDot assets={DOT_ASSETS} baseIndex={0} size={63.73} className="absolute" style={{ left: "1120px", top: "89px" }} />

          {/* In flow (not the frame's absolute offsets) so the block's height carries up to the
              section instead of being pinned inside a fixed 832px box, and centred rather than at
              the frame's left:283 - that sat the block 37px left of the section's own centre. */}
          <div className="flex justify-center" style={{ paddingTop: "123px", ...DESKTOP_SCALE_STYLE }}>
            <FaqBlock
              openItems={openItems}
              onToggle={toggleItem}
              expanded={expanded}
              onExpand={() => setExpanded(true)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}


