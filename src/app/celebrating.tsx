import Image from "next/image";

export default function Celebrating() {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-x-auto">
      <div className="relative h-[982px] w-[1512px] shrink-0">
        <div className="-translate-x-1/2 absolute flex h-[262.951px] w-[442.474px] items-center justify-center left-[calc(50%-29.76px)] top-[208px]">
          <p className="font-drowner flex-none rotate-[-17.18deg] whitespace-nowrap text-center text-[104.29px] leading-[1.4] text-[#242525] lowercase">
            celebrating
          </p>
        </div>
        <div className="-translate-x-1/2 absolute flex h-[214.377px] w-[379.906px] items-center justify-center left-[calc(50%+61.1px)] top-[314.9px]">
          <p className="font-drowner flex-none rotate-[-11.49deg] whitespace-nowrap text-center text-[104.29px] leading-[1.4] text-[#242525] lowercase">
            the joy of
          </p>
        </div>
        <div className="-translate-x-1/2 absolute flex h-[165.708px] w-[372.426px] items-center justify-center left-[calc(50%+5.58px)] top-[459.13px]">
          <p className="font-drowner flex-none rotate-[3.13deg] whitespace-nowrap text-center text-[104.29px] leading-[1.4] text-[#242525] underline decoration-wavy decoration-from-font [text-decoration-skip-ink:none] [text-underline-position:from-font] lowercase">
            why nots.
          </p>
        </div>

        <div className="absolute left-[427px] top-[433px] h-[76.061px] w-[67px]">
          <div className="absolute left-0 top-0 h-[76.061px] w-[83.582px]">
            <Image src="/ele-monster-purple.svg" alt="" fill className="max-w-none object-fill" />
          </div>
        </div>

        <div className="absolute left-[861px] top-[494px] h-[95.964px] w-[59px]">
          <div className="absolute left-0 top-0 h-[95.964px] w-[71.928px]">
            <Image src="/ele-monster-green.svg" alt="" fill className="max-w-none object-fill" />
          </div>
        </div>
      </div>
    </div>
  );
}
