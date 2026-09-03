import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InstagramEmbed from "../../handbook/instagram-embed";
import { COMPETITIONS, getCompetition } from "@/lib/competitions";
import SubmissionForm from "../submission-form";

export function generateStaticParams() {
  return COMPETITIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const competition = getCompetition(slug);
  return {
    title: competition ? `${competition.prizeLabel} · Useless Projects` : "Competition · Useless Projects",
  };
}

export default async function CompetitionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const competition = getCompetition(slug);
  if (!competition) notFound();

  return (
    <main data-page="handbook" className="w-full overflow-x-hidden bg-white text-[#0e0e0d]">
      <div className="mx-auto flex w-full max-w-[820px] flex-col gap-10 px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/handbook#prizes"
            className="font-helvetica text-[13px] tracking-[0.08em] text-[#33322f] uppercase underline decoration-[#ea34df] decoration-2 underline-offset-4 hover:text-[#0e0e0d]"
          >
            ← back to prizes
          </Link>
          <Link href="/competitions" className="font-helvetica text-[13px] tracking-[0.08em] text-[#33322f]/60 uppercase hover:text-[#33322f]">
            all competitions
          </Link>
        </div>

        <header className="flex flex-col gap-4">
          <h1 className="font-drowner leading-[0.95] text-[#0e0e0d]" style={{ fontSize: "clamp(36px, 6vw, 56px)" }}>
            {competition.prizeLabel}
          </h1>
          <p className="font-nanum-pen max-w-[52ch] text-[21px] leading-[1.4] text-[#244638] sm:text-[23px]">
            {competition.tagline}
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="font-drowner leading-[1] text-[#0e0e0d]" style={{ fontSize: "clamp(22px, 3vw, 28px)" }}>
            what we mean
          </h2>
          <p className="font-helvetica max-w-[65ch] text-[16px] leading-[1.7] text-[#33322f]">{competition.whatWeMean}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-drowner leading-[1] text-[#0e0e0d]" style={{ fontSize: "clamp(22px, 3vw, 28px)" }}>
            how to redeem
          </h2>
          <p className="font-helvetica max-w-[65ch] text-[16px] leading-[1.7] text-[#33322f]">{competition.howToRedeem}</p>
          <ul className="mt-1 flex max-w-[65ch] flex-col gap-2">
            {competition.guidelines.map((item) => (
              <li key={item} className="font-helvetica flex gap-2 text-[15px] leading-[1.6] text-[#33322f]">
                <span className="text-[#ea34df]">—</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {competition.samples.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="font-drowner leading-[1] text-[#0e0e0d]" style={{ fontSize: "clamp(22px, 3vw, 28px)" }}>
              samples
            </h2>
            <div className="flex flex-wrap gap-6">
              {competition.samples.map((sample) =>
                sample.permalink ? (
                  <div key={sample.title} className="flex flex-col gap-2">
                    <span className="font-nanum-pen text-[15px] text-[#0e0e0d]">{sample.title}</span>
                    <InstagramEmbed permalink={sample.permalink} scale={0.55} />
                  </div>
                ) : sample.youtubeId ? (
                  <div key={sample.title} className="flex w-[280px] flex-col gap-2">
                    <span className="font-nanum-pen text-[15px] text-[#0e0e0d]">{sample.title}</span>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-black/5">
                      <iframe
                        src={`https://www.youtube.com/embed/${sample.youtubeId}`}
                        title={sample.title}
                        className="absolute inset-0 size-full"
                        frameBorder={0}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </section>
        )}

        <section className="flex flex-col gap-3">
          <h2 className="font-drowner leading-[1] text-[#0e0e0d]" style={{ fontSize: "clamp(22px, 3vw, 28px)" }}>
            submit
          </h2>
          <SubmissionForm slug={competition.slug} />
        </section>
      </div>
    </main>
  );
}
