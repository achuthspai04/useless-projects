import VanishingImage from "./vanishing-image";

export default function ElephantBadge() {
  return (
    <span className="relative inline-block">
      <span className="font-jrk text-black" style={{ fontSize: "175.959px" }}>
        3.0
      </span>
      <VanishingImage
        src="/ele1.webp"
        alt=""
        width={90}
        height={81}
        className="absolute"
        style={{
          left: "50%",
          top: "-10px",
          width: "90px",
          height: "81px",
          maxWidth: "none",
          transform: "translateX(-50%)",
        }}
      />
    </span>
  );
}
