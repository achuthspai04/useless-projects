import type { Metadata } from "next";
import Link from "next/link";
import InstagramEmbed from "../handbook/instagram-embed";
import { listApprovedSubmissions } from "@/lib/airtable";
import { getCompetition } from "@/lib/competitions";

export const metadata: Metadata = {
  title: "Videos · Useless Projects",
  description: "Build video documentaries submitted for the Useless Projects video prize.",
};

function youtubeIdFrom(link: string) {
  try {
    const url = new URL(link);
    if (url.hostname.replace(/^www\./, "") === "youtu.be") return url.pathname.slice(1);
    if (url.hostname.includes("youtube.com")) return url.searchParams.get("v") ?? url.pathname.split("/").pop();
    return null;
  } catch {
    return null;
  }
}

export default async function VideosPage() {
  const competition = getCompetition("best-build-video-documentary")!;
  const submissions = await listApprovedSubmissions(competition.airtableChoice);

  return (
    <main data-page="handbook" className="w-full overflow-x-hidden bg-white text-[#0e0e0d]">
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-8 px-5 py-14 sm:px-8 sm:py-20">
        <Link
          href="/competitions/best-build-video-documentary"
          className="font-helvetica w-fit text-[13px] tracking-[0.08em] text-[#33322f] uppercase underline decoration-[#ea34df] decoration-2 underline-offset-4 hover:text-[#0e0e0d]"
        >
          ← submit your own
        </Link>

        <header className="flex flex-col gap-3">
          <h1 className="font-drowner leading-[0.95] text-[#0e0e0d]" style={{ fontSize: "clamp(36px, 6vw, 56px)" }}>
            videos
          </h1>
          <p className="font-nanum-pen max-w-[52ch] text-[21px] leading-[1.4] text-[#244638] sm:text-[23px]">
            Build documentaries submitted for the video prize.
          </p>
        </header>

        {submissions.length === 0 ? (
          <p className="font-helvetica max-w-[60ch] text-[16px] leading-[1.7] text-[#33322f]">
            Nothing here yet. Submissions show up here once they&apos;ve been reviewed and approved.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-8">
            {submissions.map((submission) => {
              const isInstagram = submission.link.includes("instagram.com");
              const youtubeId = isInstagram ? null : youtubeIdFrom(submission.link);
              return (
                <li key={submission.id} className="flex flex-col gap-2">
                  <span className="font-nanum-pen text-[16px] text-[#0e0e0d]">
                    {submission.name} <span className="text-[#33322f]/60">— {submission.campus}</span>
                  </span>
                  {isInstagram ? (
                    <InstagramEmbed permalink={submission.link} scale={0.6} />
                  ) : youtubeId ? (
                    <div className="relative aspect-video w-[280px] overflow-hidden rounded-xl border border-black/5">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title={submission.name}
                        className="absolute inset-0 size-full"
                        frameBorder={0}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <a
                      href={submission.link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-helvetica text-[14px] text-[#ea34df] underline decoration-[#ea34df] decoration-2 underline-offset-4"
                    >
                      watch
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
