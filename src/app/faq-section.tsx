"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { HoverDot } from "./hover-dot";

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

const px = (value: number) => `calc(${value}px * var(--faq-scale))`;
const pxText = (value: number) => `calc(${value}px * var(--faq-text-scale, 1))`;

// Same palette used for the other dot decorations across the site (see hero-dots.tsx /
// why-section.tsx) - this dot's own base color is the same red/magenta combo as why-dot.svg.
const DOT_ASSETS = ["/why-dot.svg", "/hero-dot-1.svg", "/hero-dot-2.svg", "/hero-dot-3.svg", "/hero-dot-4.svg"] as const;

export const FAQ_ITEMS = [
  {
    tag: "(Q1)",
    question: "What is Useless Projects?",
    answer:
      "Useless Projects is TinkerHub's signature 18-hour overnight make-a-thon, where the only rule is that your project has to be delightfully useless. No pitch decks, no \"real-world impact\" talk, just a night dedicated to building whatever wonderfully pointless idea comes to mind.",
  },
  {
    tag: "(Q2)",
    question: 'Why "useless"?',
    answer:
      "Honestly, because it takes the pressure off. When you're not chasing a business case or a scalable solution, you're free to build purely for curiosity, humor, and the joy of making something just because you can. Some of the most technically impressive projects come out of this freedom.",
  },
  {
    tag: "(Q3)",
    question: "Who can participate?",
    answer:
      "Any student from a TinkerHub Campus Community can take part, regardless of your branch, year, or experience level. You don't need to be from a tech background. Designers, artists, writers, and anyone curious to build something is welcome.",
  },
  {
    tag: "(Q4)",
    question: "Do I need a team, or can I participate solo?",
    answer:
      "You can take part solo or in a team. The team size for Useless Projects is a maximum of 2.",
  },
  {
    tag: "(Q5)",
    question: "Do I need coding experience?",
    answer:
      "No. Useless Projects welcomes all skill levels and all disciplines, hardware, software, design, or anything else you can dream up. If you're new, it's actually one of the best low-pressure ways to start building.",
  },
  {
    tag: "(Q6)",
    question: "What can I build?",
    answer:
      "Anything, as long as it's not meant to solve a \"real\" problem. Software, hardware, a mix of both, or something entirely unexpected.",
  },
  {
    tag: "(Q7)",
    question: "Do I need to bring my own hardware/components?",
    answer:
      "Yes, you will have to bring your own hardware components unless otherwise specified by your venue.",
  },
  {
    tag: "(Q8)",
    question: "How long does the event run?",
    answer:
      "It's an 18-hour overnight build, from evening to the next morning. Exact timing depends on your campus, check your local campus lead for the specific schedule.",
  },
  {
    tag: "(Q9)",
    question: "Is there a cost to participate?",
    answer:
      "All TinkerHub events and initiatives are free of cost.",
  },
  {
    tag: "(Q10)",
    question: "What do I need to bring?",
    answer:
      "Your laptop (if working on software), any hardware components you're using, a charger, and enough energy to stay up building through the night.",
  },
  {
    tag: "(Q11)",
    question: "How are projects judged?",
    answer:
      "Projects are judged on creativity, execution, and how delightfully useless (yet well-built) they are.",
  },
  {
    tag: "(Q12)",
    question: "Are there prizes?",
    answer:
      "Top 25 makers get a monthly scholarship worth up-to 5 lakh rupees.\nTop 50 projects will be showcased in Maker Faire, Kerala.",
  },
  {
    tag: "(Q13)",
    question: "Do I need to submit my project afterward?",
    answer:
      "Yes, all teams are expected to submit their project (even an incomplete one counts) before the event ends. This helps us document and celebrate the builds.",
  },
  {
    tag: "(Q14)",
    question: "Can I see past projects?",
    answer:
      "Yes, check out projects from previous editions [link to project gallery/site] for inspiration, past builds have ranged from AI-powered ant traffic controllers to a Malayalam programming language.",
  },
  {
    tag: "(Q15)",
    question: "How do I register?",
    answer:
      "Registration is done through the TinkerHub App. Reach out to your campus's TinkerHub chapter for the event details.",
  },
  {
    tag: "(Q16)",
    question: "I don't see Useless Projects happening at my campus. What do I do?",
    answer:
      "Currently, Useless Projects runs as a campus-exclusive program, meaning it's organized through active TinkerHub Campus Communities. If your campus doesn't have one yet, that's the first step. If you'd like to start a TinkerHub Campus Community at your campus, check out https://tinkerhub.org/",
  },
];

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
}: {
  headerWidth?: number;
  openItems: boolean[];
  onToggle: (index: number) => void;
}) {
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
  const [openItems, setOpenItems] = useState<boolean[]>(() => FAQ_ITEMS.map((_, i) => i === 0));

  const toggleItem = (index: number) => {
    setOpenItems((prev) => prev.map((value, i) => (i === index ? !value : value)));
  };

  return (
    // h-screen (not min-h-screen) plus an inner scroller, because the answers run well past one
    // viewport - 1350px tall on a 390x844 phone. As a taller-than-viewport snap panel under the
    // page's mandatory y-snapping, its bottom half was simply unreachable: the scroll jumped from
    // its snap point straight to the timer section. overflow-hidden also matches every other
    // full-page section here, and keeps the desktop canvas below from widening the page.
    <section
      id="faq-section"
      className="relative h-screen w-full snap-start snap-always overflow-hidden bg-white"
    >
      <div className="h-full w-full overflow-y-auto">
        {/* min-h-full so the content still centres when it does fit, and grows (scrolling inside
            the parent) when it doesn't. */}
        <div className="flex min-h-full w-full items-center justify-center py-16">
          {/* Mobile (Figma node 147:9834). The frame carries only the heading and the cards - no
              corner dot, and no "more details?" creature. */}
          <div className="flex w-full justify-center lg:hidden" style={MOBILE_SCALE_STYLE}>
            <FaqBlock headerWidth={MOBILE_HEADER_WIDTH} openItems={openItems} onToggle={toggleItem} />
          </div>

          <div
            className="relative hidden shrink-0 lg:block"
            style={{
              width: `${REF_WIDTH}px`,
              minHeight: `${REF_HEIGHT}px`,
              transform: `scale(min(1, calc(100vw / ${REF_WIDTH}px)))`,
              transformOrigin: "top center",
            }}
          >
            <HoverDot assets={DOT_ASSETS} baseIndex={0} size={63.73} className="absolute" style={{ left: "1120px", top: "89px" }} />

            <div className="absolute" style={{ left: "283px", top: "123px", ...DESKTOP_SCALE_STYLE }}>
              <FaqBlock openItems={openItems} onToggle={toggleItem} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


