import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
import ElephantBadge from "./elephant-badge";

export default function Title() {
  return (
    <div
      className="absolute"
      aria-label="Useless Projects 3.0"
      style={{
        top: "287px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <h1
        className="font-drowner text-center text-[#0e0e0d] animate-float-title"
        style={{
          fontSize: "185.22px",
          fontWeight: 342,
          lineHeight: 0.836,
          letterSpacing: "0.02em",
        }}
      >
        <span className="block">Useless</span>
        <span className="block">Projects</span>
      </h1>
      <Floating sensitivity={0.5} easingFactor={0.06} className="pointer-events-none">
        <FloatingElement depth={1} style={{ top: "-188px", right: "-53px" }}>
          <div className="animate-float-slow">
            <ElephantBadge />
          </div>
        </FloatingElement>
      </Floating>
    </div>
  );
}
