import Image from "next/image";

export default function ElephantBadge() {
  return (
    <span className="relative inline-block">
      <span className="font-jrk text-black" style={{ fontSize: "168px" }}>
        3.0
      </span>
      <Image
        src="/ele1.webp"
        alt=""
        width={90}
        height={82}
        className="absolute"
        style={{
          left: "50%",
          top: "-15px",
          width: "90px",
          height: "82px",
          transform: "translateX(-50%)",
        }}
      />
    </span>
  );
}
