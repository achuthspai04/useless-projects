import QRCode from "qrcode";

// Hardcoded to the production domain (same convention as layout.tsx's metadataBase) rather than
// derived from the request - this gets scanned by a phone on a totally different network than
// whatever is serving the page (a display at the venue), so it always has to point at the real
// site regardless of where the gallery itself happens to be running.
const DRAW_URL = "https://useless.tinkerhub.org/creatures";

// Rendered server-side into plain SVG markup - no external image request at runtime, so this
// keeps working even if the venue's wifi is bad, and it's generated once per page load rather
// than re-fetched from a QR API on every visitor.
export default async function DrawHereBanner() {
  const qrSvg = await QRCode.toString(DRAW_URL, {
    type: "svg",
    margin: 1,
    color: { dark: "#0e0e0d", light: "#ffffff" },
  });

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-4 border-t border-black/10 bg-white/95 px-5 py-3 backdrop-blur sm:gap-6 sm:py-4">
      <div
        className="size-16 shrink-0 overflow-hidden rounded-md sm:size-20 [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: qrSvg }}
      />
      <p className="font-nanum-pen text-[18px] leading-[1.25] text-[#0e0e0d] sm:text-[24px]">
        draw yours - scan the QR
        <br className="sm:hidden" /> or go to{" "}
        <span className="font-helvetica font-bold whitespace-nowrap">useless.tinkerhub.org/creatures</span>
      </p>
    </div>
  );
}
