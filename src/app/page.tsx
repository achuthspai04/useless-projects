import Image from "next/image";
import AnimatedElephant from "./animated-elephant";
import Title from "./title";

export default function Home() {
  return (
    <div className="relative flex flex-1 items-center justify-center">
      <Image
        src="/ele4.webp"
        alt=""
        width={90}
        height={100}
        className="absolute"
        style={{ left: "10%", top: "26%", width: "90px", height: "100px" }}
      />
      <AnimatedElephant style={{ left: "70%", top: "35%", width: "85px", height: "113px" }} />
      <Image
        src="/ele3.webp"
        alt=""
        width={70}
        height={100}
        className="absolute"
        style={{ left: "21%", top: "74%", width: "70px", height: "100px" }}
      />
      <Title />
    </div>
  );
}
