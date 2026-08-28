import type { ReactNode } from "react";

// The recurring "doggo + speech bubble" decoration used across several sections. The bubble
// asset's tail points the wrong way out of the box (an artifact of how Figma expressed the
// layer's flip as a rotate(180)+scaleY(-1) pair) - scaleX(-1) is the net effect of that pair and
// mirrors the tail back toward the creature.
export function SpeechBubbleCreature({
  left,
  top,
  bubbleSrc,
  bubbleWidth,
  bubbleHeight,
  creatureLeft,
  creatureTop,
  textLeft,
  textTop,
  textWidth,
  fontSize = 29.089,
  lineHeight = 23.602,
  children,
  href,
  ariaLabel,
}: {
  left: number;
  top: number;
  bubbleSrc: string;
  bubbleWidth: number;
  bubbleHeight: number;
  creatureLeft: number;
  creatureTop: number;
  textLeft: number;
  textTop: number;
  textWidth: number;
  fontSize?: number;
  lineHeight?: number;
  children: ReactNode;
  // When set, the whole group becomes a link (e.g. a mailto:) instead of pure decoration.
  href?: string;
  ariaLabel?: string;
}) {
  const inner = (
    <>
      {/* The group's own box has no in-flow content (every child below is itself absolutely
          positioned), so it collapses to a zero-width containing block - which would zero out the
          images too via Tailwind's `img { max-width: 100% }` preflight resolving against that 0.
          maxWidth: "none" opts these images out of that percentage-based clamp. */}
      <img
        src={bubbleSrc}
        alt=""
        className="absolute"
        style={{ left: 0, top: 0, width: `${bubbleWidth}px`, height: `${bubbleHeight}px`, maxWidth: "none", transform: "scaleX(-1)" }}
      />
      <img
        src="/timer-one.svg"
        alt=""
        className="absolute"
        style={{ left: `${creatureLeft}px`, top: `${creatureTop}px`, width: "59px", height: "95.964px", maxWidth: "none" }}
      />
      <p
        className="font-nanum-pen absolute text-center text-[#100f0f]"
        style={{ left: `${textLeft}px`, top: `${textTop}px`, width: `${textWidth}px`, fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }}
      >
        {children}
      </p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        className="absolute block cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-1"
        style={{ left: `${left}px`, top: `${top}px` }}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className="absolute" style={{ left: `${left}px`, top: `${top}px` }}>
      {inner}
    </div>
  );
}
