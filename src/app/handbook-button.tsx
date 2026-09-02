import Link from "next/link";

// Fixed to the viewport corner (not inside either hero's scaled reference canvas) so it stays put
// at any breakpoint, the same trick FloatingPet uses for its own fixed corner element. Sized and
// styled to match RevealButton (the "register here" button) rather than a small pill.
export default function HandbookButton() {
  return (
    <Link
      href="/handbook"
      className="group fixed top-3 right-3 z-50 flex h-9 w-24 cursor-pointer items-center justify-center bg-black text-white shadow-md transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:bg-[#1a1a1a] hover:shadow-xl hover:shadow-black/25 active:translate-y-0.5 active:scale-[0.97] active:shadow-inner select-none md:top-8 md:right-8 md:h-14 md:w-40"
    >
      <span className="font-nanum-pen text-sm text-white transition-transform duration-200 group-hover:scale-105 md:text-2xl">
        handbook
      </span>
    </Link>
  );
}
