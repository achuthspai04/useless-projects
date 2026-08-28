"use client";

import { useState } from "react";
import { HoverDot } from "./hover-dot";
import { SpeechBubbleCreature } from "./speech-bubble-creature";

const REF_WIDTH = 1280;
const REF_HEIGHT = 832;

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
    <div className="w-full rounded-[8.43px] bg-white" style={{ width: "640px" }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between"
        style={{ paddingLeft: "32.58px", paddingRight: "16px", paddingTop: "16px", paddingBottom: "16px" }}
      >
        <span className="flex items-center gap-2">
          <span className="font-helvetica text-[21.72px] text-black" style={{ lineHeight: "26.064px" }}>
            {tag}
          </span>
          <span className="font-nanum-pen text-[21.72px] text-black" style={{ lineHeight: "26.064px" }}>
            {question}
          </span>
        </span>
        <span
          className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#ea34df]"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <img src="/faq-dropdown-arrow.svg" alt="" style={{ width: "7.5px", height: "3.75px" }} />
        </span>
      </button>

      <div
        style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p
            className="font-nanum-pen text-black"
            style={{ fontSize: "20px", lineHeight: "30px", paddingLeft: "32.58px", paddingRight: "16px", paddingBottom: "16px" }}
          >
            {answer}
          </p>
        </div>
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
      <div
        className="relative shrink-0"
        style={{
          width: `${REF_WIDTH}px`,
          height: `${REF_HEIGHT}px`,
          transform: `scale(min(1, calc(100vw / ${REF_WIDTH}px), calc(100vh / ${REF_HEIGHT}px)))`,
          transformOrigin: "center center",
        }}
      >
        <HoverDot assets={DOT_ASSETS} baseIndex={0} size={63.73} className="absolute" style={{ left: "1120px", top: "89px" }} />

        <div className="absolute flex flex-col items-center" style={{ left: "283px", top: "123px", width: "640px", gap: "11px" }}>
          <p
            className="font-drowner w-full text-[#0e0e0d]"
            style={{ fontSize: "100px", lineHeight: "normal", letterSpacing: "2px" }}
          >
            want to know more?
          </p>

          <div className="flex w-full flex-col" style={{ gap: "12px" }}>
            {FAQ_ITEMS.map((item, index) => (
              <FaqItem
                key={index}
                tag={item.tag}
                question={item.question}
                answer={item.answer}
                open={openItems[index]}
                onToggle={() => toggleItem(index)}
              />
            ))}
          </div>
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
