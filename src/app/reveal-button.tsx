const REGISTER_URL = "https://tinkerhub.org/events/1M8ORET9A1/useless-projects-3.0";

// The "Click to register" button - centered under the title in the hero.
// Directs to the official TinkerHub registration page with interactive hover and click feedback.
export default function RevealButton({
  top = 676.5,
  width = 296,
  height = 78,
  fontSize = 37.517,
  lineHeight = 30.44,
}: {
  top?: number;
  width?: number;
  height?: number;
  fontSize?: number;
  lineHeight?: number;
}) {
  return (
    <a
      href={REGISTER_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group absolute left-1/2 flex -translate-x-1/2 cursor-pointer items-center justify-center bg-black text-white shadow-md transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:bg-[#1a1a1a] hover:shadow-xl hover:shadow-black/25 active:translate-y-0.5 active:scale-[0.97] active:shadow-inner select-none"
      style={{ top: `${top}px`, width: `${width}px`, height: `${height}px` }}
    >
      <span
        className="font-nanum-pen text-center whitespace-nowrap text-white transition-transform duration-200 group-hover:scale-105"
        style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }}
      >
        Click to register
      </span>
    </a>
  );
}
