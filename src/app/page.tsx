import Image from "next/image";
import AnimatedElephant from "./animated-elephant";
import Title from "./title";

const REF_WIDTH = 1920;
const REF_HEIGHT = 1080;

export default function Home() {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden">
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
        <Image
          src="/ele4.webp"
          alt=""
          width={90}
          height={100}
          className="absolute"
          style={{ left: "192px", top: "280.8px", width: "90px", height: "100px" }}
        />
        <AnimatedElephant style={{ left: "1344px", top: "378px", width: "85px", height: "113px" }} />
        <p
          className="font-nanum-pen absolute text-right text-black"
          style={{ top: "118.8px", right: "40px", fontSize: "27px", lineHeight: 0.9 }}
        >
          exclusive to Tinkerhub
          <br />
          campus community
        </p>
        <Image
          src="/ele3.webp"
          alt=""
          width={70}
          height={100}
          className="absolute"
          style={{ left: "403.2px", top: "799.2px", width: "70px", height: "100px" }}
        />
        <Title />
      </div>
    </div>
  );
}
