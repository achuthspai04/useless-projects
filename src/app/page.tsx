import AnimatedElephant from "./animated-elephant";
import AppamSection from "./appam-section";
import CelebratingSection from "./celebrating-section";
import FaqSection from "./faq-section";
import HeroDots from "./hero-dots";
import SeeAllSection from "./see-all-section";
import Title from "./title";
import TetrisSkyline from "./tetris-skyline";
import WhySection from "./why-section";

// ele4e.webp doesn't exist in public/ - the transition skips from d straight to f.
const ELE4_FRAMES = ["/ele4a.webp", "/ele4b.webp", "/ele4c.webp", "/ele4d.webp", "/ele4f.webp"];

const REF_WIDTH = 1920;
const REF_HEIGHT = 1080;

export default function Home() {
  return (
    <>
      <div className="relative flex min-h-screen shrink-0 snap-start items-center justify-center overflow-hidden">
        <div
          className="absolute"
          style={{
            width: `${REF_WIDTH}px`,
            height: `${REF_HEIGHT}px`,
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(min(1, calc(100vw / ${REF_WIDTH}px), calc(100vh / ${REF_HEIGHT}px)))`,
            transformOrigin: "center center",
          }}
        >
          {/* Center of the original 90px-wide static box (192px + 90/2 = 237px), shifted 8% of
              REF_WIDTH left (237 - 153.6 = 83.4px) and 13% of REF_HEIGHT down total (280.8 + 54 +
              86.4 = 421.2px, the initial 5% plus another 8%). AnimatedElephant's "center" anchor
              takes `left` as that center point rather than a box edge. Near-continuous frame loop
              (barely any idle pause between bursts) plus a slow autonomous up/down float (not
              mouse-driven, unlike the "3.0" badge's parallax). */}
          <AnimatedElephant
            frames={ELE4_FRAMES}
            frameIntervalMs={450}
            minDelayMs={50}
            maxDelayMs={150}
            floatAnimation
            style={{ left: "83.4px", top: "421.2px", height: "100px" }}
          />
          <p
            className="font-nanum-pen absolute text-right text-black"
            style={{ top: "118.8px", right: "40px", fontSize: "27px", lineHeight: 0.9 }}
          >
            exclusive to Tinkerhub
            <br />
            campus community
          </p>
          <Title />
          <HeroDots />
        </div>
        <TetrisSkyline />
      </div>
      <CelebratingSection />
      <WhySection />
      <AppamSection />
      <SeeAllSection />
      <FaqSection />
    </>
  );
}
