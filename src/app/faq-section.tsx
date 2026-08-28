"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { HoverDot } from "./hover-dot";
import { SpeechBubbleCreature } from "./speech-bubble-creature";

const REF_WIDTH = 1280;
const REF_HEIGHT = 832;

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
const MOBILE_SCALE_STYLE = {
  "--faq-scale": `min(${MOBILE_SCALE}, calc((100vw - 32px) / ${BLOCK_WIDTH}px))`,
} as CSSProperties;
const DESKTOP_SCALE_STYLE = { "--faq-scale": "1" } as CSSProperties;
// The one thing the mobile frame does differently rather than just smaller: the heading's text
// box is centred over the cards instead of running flush with their left edge.
const MOBILE_HEADER_WIDTH = 562;

const px = (value: number) => `calc(${value}px * var(--faq-scale))`;

// Same palette used for the other dot decorations across the site (see hero-dots.tsx /
// why-section.tsx) - this dot's own base color is the same red/magenta combo as why-dot.svg.
const DOT_ASSETS = ["/why-dot.svg", "/hero-dot-1.svg", "/hero-dot-2.svg", "/hero-dot-3.svg", "/hero-dot-4.svg"] as const;

// Both entries share the same placeholder copy from the source design - kept verbatim rather
// than inventing new question/answer text that wasn't part of the spec.
const FAQ_ANSWER =
  "helping us express what we do and why it matters in a simple, confident way. The new site finally feels aligned with the level of expertise we bring, and it sets the right tone from the very first impression.";

const FAQ_ITEMS = [
  { tag: "(Q1)", question: "Who is this for?", answer: FAQ_ANSWER },
  { tag: "(Q2)", question: "Who is this for?", answer: FAQ_ANSWER },
];

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
    <div className="w-full bg-white" style={{ borderRadius: px(8.43) }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between"
        style={{
          paddingLeft: px(32.58),
          paddingRight: px(16),
          paddingTop: px(16),
          paddingBottom: px(16),
        }}
      >
        <span className="flex items-center" style={{ gap: px(8) }}>
          <span className="font-helvetica text-black" style={{ fontSize: px(21.72), lineHeight: px(26.064) }}>
            {tag}
          </span>
          <span className="font-nanum-pen text-black" style={{ fontSize: px(21.72), lineHeight: px(26.064) }}>
            {question}
          </span>
        </span>
        <span
          className="flex shrink-0 items-center justify-center rounded-full bg-[#ea34df]"
          style={{
            width: px(20),
            height: px(20),
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <img src="/faq-dropdown-arrow.svg" alt="" style={{ width: px(7.5), height: px(3.75) }} />
        </span>
      </button>

      <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <p
            className="font-nanum-pen text-black"
            style={{
              fontSize: px(20),
              lineHeight: px(30),
              paddingLeft: px(32.58),
              paddingRight: px(16),
              paddingBottom: px(16),
            }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function FaqBlock({
  headerWidth = BLOCK_WIDTH,
  openItems,
  onToggle,
}: {
  headerWidth?: number;
  openItems: boolean[];
  onToggle: (index: number) => void;
}) {
  return (
    <div className="flex flex-col items-center" style={{ width: px(BLOCK_WIDTH), gap: px(11) }}>
      {/* items-center on the column is what centres the heading when it is given the narrower
          mobile box; at the full block width it lands flush left, as the desktop frame has it. */}
      <p
        className="font-drowner text-[#0e0e0d]"
        style={{
          width: px(headerWidth),
          fontSize: px(100),
          lineHeight: "normal",
          letterSpacing: px(2),
        }}
      >
        want to know more?
      </p>

      <div className="flex w-full flex-col" style={{ gap: px(12) }}>
        {FAQ_ITEMS.map((item, index) => (
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
    </div>
  );
}

export default function FaqSection() {
  const [openItems, setOpenItems] = useState<boolean[]>(() => FAQ_ITEMS.map((_, i) => i === 1));

  const toggleItem = (index: number) => {
    setOpenItems((prev) => prev.map((value, i) => (i === index ? !value : value)));
  };

  return (
    <section className="relative flex min-h-screen w-full snap-start items-center justify-center overflow-hidden bg-white">
      {/* Mobile (Figma node 147:9834). The frame carries only the heading and the two cards - no
          corner dot, and no "more details?" creature. */}
      <div className="flex w-full justify-center lg:hidden" style={MOBILE_SCALE_STYLE}>
        <FaqBlock headerWidth={MOBILE_HEADER_WIDTH} openItems={openItems} onToggle={toggleItem} />
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
        <HoverDot assets={DOT_ASSETS} baseIndex={0} size={63.73} className="absolute" style={{ left: "1120px", top: "89px" }} />

        <div className="absolute" style={{ left: "283px", top: "123px", ...DESKTOP_SCALE_STYLE }}>
          <FaqBlock openItems={openItems} onToggle={toggleItem} />
        </div>

        <SpeechBubbleCreature
          left={-50}
          top={598}
          bubbleSrc="/funfact-bubble.svg"
          bubbleWidth={223.257}
          bubbleHeight={155}
          creatureLeft={208.257}
          creatureTop={138}
          textLeft={12.6}
          textTop={40}
          textWidth={198}
          fontSize={22}
          lineHeight={18}
          href="mailto:campus@tinkerhub.org"
          ariaLabel="Email campus@tinkerhub.org for more details"
        >
          more details?
          <br />
          mail at campus@tinkerhub.org
        </SpeechBubbleCreature>
      </div>
    </section>
  );
}
