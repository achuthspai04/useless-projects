import type { Metadata } from "next";
import Link from "next/link";
import { COMPETITIONS } from "@/lib/competitions";

export const metadata: Metadata = {
  title: "Competitions · Useless Projects",
  description: "Side-quest competitions running alongside Useless Projects, and how to submit for each.",
};

export default function CompetitionsIndexPage() {
  return (
    <main data-page="handbook" className="w-full overflow-x-hidden bg-white text-[#0e0e0d]">
      <div className="mx-auto flex w-full max-w-[820px] flex-col gap-8 px-5 py-14 sm:px-8 sm:py-20">
        <Link
          href="/handbook#prizes"
          className="font-helvetica w-fit text-[13px] tracking-[0.08em] text-[#33322f] uppercase underline decoration-[#ea34df] decoration-2 underline-offset-4 hover:text-[#0e0e0d]"
        >
          ← back to prizes
        </Link>

        <header className="flex flex-col gap-3">
          <h1 className="font-drowner leading-[0.95] text-[#0e0e0d]" style={{ fontSize: "clamp(36px, 6vw, 56px)" }}>
            competitions
          </h1>
          <p className="font-nanum-pen max-w-[52ch] text-[21px] leading-[1.4] text-[#244638] sm:text-[23px]">
            Side quests, and how to submit for each one.
          </p>
        </header>

        <ul className="flex flex-col gap-3">
          {COMPETITIONS.map((competition) => (
            <li key={competition.slug}>
              <Link
                href={`/competitions/${competition.slug}`}
                className="flex flex-col gap-1.5 rounded-2xl border border-black/5 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
              >
                <span className="font-nanum-pen text-[20px] leading-[1.2] text-[#0e0e0d]">{competition.prizeLabel}</span>
                <span className="font-helvetica text-[14px] leading-[1.5] text-[#33322f]">{competition.tagline}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
