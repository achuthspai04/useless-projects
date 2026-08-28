import Image from "next/image";
import AnimatedElephant from "./animated-elephant";
import HeroTagline from "./hero-tagline";
import { HoverDot } from "./hover-dot";
import RevealButton from "./reveal-button";
import TetrisField from "./tetris-field";

// ele4e.webp doesn't exist in public/ - the transition skips from d straight to f (same gap the
// desktop hero works around).
const ELE4_FRAMES = ["/ele4a.webp", "/ele4b.webp", "/ele4c.webp", "/ele4d.webp", "/ele4f.webp"];
const DOT_ASSETS = ["/hero-dot-1.svg", "/hero-dot-2.svg", "/hero-dot-3.svg", "/hero-dot-4.svg"] as const;

// The mobile Figma frame (node 147:9496, "iPhone 16 & 17 Pro - 1") is 402px wide; everything
// above the "Celebrating" section (which starts at y=1098 in that frame) is this hero.
const REF_WIDTH = 402;
const REF_HEIGHT = 1098;

// Shown below the `lg` breakpoint in place of the desktop hero - a dedicated mobile layout
// (not just the desktop canvas scaled down), per the Figma mobile frame (see public/reference.png).
// The "click here to reveal!" button and "play tetris?" bubble from that frame are intentionally
// left out.
export default function MobileHero() {
  return (
    // A fixed h-screen (not min-h-screen) matters here: the canvas below keeps its full
    // 402x1098 layout box (shrink-0, so the transform below is the only thing scaling it), and
    // if this wrapper could grow past one screen to fit that box, TetrisSkyline - pinned to
    // this wrapper's own bottom edge - would land below the fold instead of the visual bottom.
    <div className="relative flex h-screen shrink-0 snap-start items-center justify-center overflow-hidden lg:hidden">
      {/* Sits on this wrapper rather than inside the scaled canvas below, so it fills the actual
          phone viewport and works off real pixels - the same field the desktop hero uses, just
          with a smaller target cell so a narrow screen still gets a sensible column count. It's
          rendered first, and so painted behind, the canvas that follows. */}
      <TetrisField targetCell={22} prefill={0.3} />
      <div
        className="relative shrink-0"
        style={{
          width: `${REF_WIDTH}px`,
          height: `${REF_HEIGHT}px`,
          transform: `scale(min(1, calc(100vw / ${REF_WIDTH}px), calc(100vh / ${REF_HEIGHT}px)))`,
          transformOrigin: "center center",
        }}
      >
        <HoverDot assets={DOT_ASSETS} baseIndex={1} size={34.52} className="absolute" style={{ left: "53px", top: "65px" }} />
        <HoverDot assets={DOT_ASSETS} baseIndex={0} size={34.52} className="absolute" style={{ left: "105.52px", top: "65px" }} />
        <HoverDot assets={DOT_ASSETS} baseIndex={3} size={20.16} className="absolute" style={{ left: "404.28px", top: "144px" }} />
        <HoverDot assets={DOT_ASSETS} baseIndex={2} size={39.28} className="absolute" style={{ left: "13px", top: "513.856px" }} />

        {/* Standalone creature, top-left - not paired with the tagline (which sits alone near
            the tetris further down). */}
        <AnimatedElephant
          frames={ELE4_FRAMES}
          frameIntervalMs={450}
          minDelayMs={50}
          maxDelayMs={150}
          floatAnimation
          anchor="left"
          style={{ left: "48px", top: "140px", height: "48px" }}
        />

        {/* Nudged down and in from the Figma spot (326, 205), which left it stranded up in the
            corner - it now sits just off the title's top-right, and the little creature above it
            comes along since it's positioned within this same box. */}
        <div className="absolute text-center" style={{ left: "292px", top: "250px", width: "76px" }}>
          <Image
            src="/ele1.webp"
            alt=""
            width={36}
            height={33}
            className="absolute"
            style={{ left: "50%", top: 0, width: "36px", height: "33px", transform: "translateX(-50%)" }}
          />
          <span className="font-jrk relative text-[#0e0e0d]" style={{ fontSize: "78.832px" }}>
            3.0
          </span>
        </div>

        <div
          className="font-drowner absolute text-[#0e0e0d]"
          // Same tight leading as the desktop title (see title.tsx) - the browser default of
          // ~1.2 left far too much air between "Useless" and "Projects" at this size.
          style={{ left: "48px", top: "298px", width: "306px", fontSize: "95.245px", letterSpacing: "1.9049px", lineHeight: 0.836 }}
        >
          <p>Useless</p>
          <p>Projects</p>
        </div>

        {/* Same arrangement as the desktop hero - the tagline centred on one line directly above
            the reveal button - but sized for this 402px-wide canvas, and sat high enough that
            neither is buried under the standing blocks on arrival. */}
        <HeroTagline top={480} width={402} fontSize={14.786} lineHeight={12} />
        <RevealButton top={512} width={252} height={62} fontSize={29} lineHeight={24} />
      </div>
    </div>
  );
}
