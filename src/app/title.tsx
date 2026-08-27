import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
import ElephantBadge from "./elephant-badge";

export default function Title() {
  return (
    <div
      className="absolute"
      style={{
        top: "332px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
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
      <Floating sensitivity={0.5} easingFactor={0.06} className="pointer-events-none">
        <FloatingElement depth={1} style={{ top: "-178px", right: "-43px" }}>
          <ElephantBadge />
        </FloatingElement>
      </Floating>
    </div>
  );
}
