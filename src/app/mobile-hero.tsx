import Image from "next/image";
import AnimatedElephant from "./animated-elephant";
import { HoverDot } from "./hover-dot";
import { SpeechBubbleCreature } from "./speech-bubble-creature";
import TetrisSkyline from "./tetris-skyline";

// ele4e.webp doesn't exist in public/ - the transition skips from d straight to f (same gap the
// desktop hero works around).
const ELE4_FRAMES = ["/ele4a.webp", "/ele4b.webp", "/ele4c.webp", "/ele4d.webp", "/ele4f.webp"];
const DOT_ASSETS = ["/hero-dot-1.svg", "/hero-dot-2.svg", "/hero-dot-3.svg", "/hero-dot-4.svg"] as const;

// The mobile Figma frame (node 147:9496, "iPhone 16 & 17 Pro - 1") is 402px wide; everything
// above the "Celebrating" section (which starts at y=1098 in that frame) is this hero.
const REF_WIDTH = 402;
const REF_HEIGHT = 1098;

// Shown below the `lg` breakpoint in place of the desktop hero - a dedicated mobile layout
// (not just the desktop canvas scaled down), per the Figma mobile frame. The "click here to
// reveal!" button and "play tetris?" prompt from that frame are intentionally left out.
export default function MobileHero() {
  return (
    // A fixed h-screen (not min-h-screen) matters here: the canvas below keeps its full
    // 402x1098 layout box (shrink-0, so the transform below is the only thing scaling it), and
    // if this wrapper could grow past one screen to fit that box, TetrisSkyline - pinned to
    // this wrapper's own bottom edge - would land below the fold instead of the visual bottom.
    <div className="relative flex h-screen shrink-0 snap-start items-center justify-center overflow-hidden lg:hidden">
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
        <HoverDot assets={DOT_ASSETS} baseIndex={2} size={39.28} className="absolute" style={{ left: "13px", top: "506px" }} />

        <div className="absolute text-center" style={{ left: "326px", top: "205px", width: "76px" }}>
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
          style={{ left: "48px", top: "298px", width: "306px", fontSize: "95.245px", letterSpacing: "1.9049px", lineHeight: "normal" }}
        >
          <p>Useless</p>
          <p>Projects</p>
        </div>

        <AnimatedElephant
          frames={ELE4_FRAMES}
          frameIntervalMs={450}
          minDelayMs={50}
          maxDelayMs={150}
          floatAnimation
          anchor="left"
          style={{ left: "260px", top: "770px", height: "48px" }}
        />
        <p
          className="font-nanum-pen absolute text-center text-black"
          style={{ left: "342px", top: "786px", width: "108px", fontSize: "14.786px", lineHeight: "12px", transform: "translateX(-50%)" }}
        >
          exclusive to Tinkerhub campus community
        </p>

        <SpeechBubbleCreature
          left={20}
          top={850}
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
      <TetrisSkyline />
    </div>
  );
}
