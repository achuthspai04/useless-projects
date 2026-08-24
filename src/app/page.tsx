import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex flex-1 items-center justify-center">
      <Image
        src="/ele1.webp"
        alt=""
        width={90}
        height={82}
        className="absolute"
        style={{ left: "49%", top: "8%", width: "90px", height: "82px" }}
      />
      <Image
        src="/ele4.webp"
        alt=""
        width={90}
        height={100}
        className="absolute"
        style={{ left: "10%", top: "26%", width: "90px", height: "100px" }}
      />
      <Image
        src="/ele5.webp"
        alt=""
        width={85}
        height={113}
        className="absolute"
        style={{ left: "70%", top: "35%", width: "85px", height: "113px" }}
      />
      <Image
        src="/ele3.webp"
        alt=""
        width={70}
        height={100}
        className="absolute"
        style={{ left: "21%", top: "74%", width: "70px", height: "100px" }}
      />
      <div className="relative inline-block">
        <h1
          className="font-drowner text-center text-black"
          style={{
            fontSize: "160px",
            fontWeight: 342,
            lineHeight: 0.836,
            letterSpacing: "0.02em",
          }}
        >
          <span className="block">Useless</span>
          <span className="block">Projects</span>
        </h1>
        <span
          className="font-jrk absolute text-black"
          style={{
            top: "-133px",
            right: "-88px",
            fontSize: "168px",
          }}
        >
          3.0
        </span>
      </div>
    </div>
  );
}
