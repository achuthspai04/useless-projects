import type { Metadata } from "next";
import { listProjects } from "@/lib/metabase";

export const metadata: Metadata = {
  title: "Projects · Useless Projects",
  description: "Every project submitted for Useless Projects 3.0.",
};

const STATUS_STYLE: Record<string, string> = {
  Valid: "bg-[#244638]/10 text-[#244638]",
  "Send for Voting": "bg-[#ea34df]/10 text-[#ea34df]",
  "Review Pending": "bg-black/5 text-[#33322f]/70",
};

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <main data-page="handbook" className="w-full overflow-x-hidden bg-white text-[#0e0e0d]">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-5 py-14 sm:px-8 sm:py-20">
        <header className="flex flex-col gap-3">
          <h1 className="font-drowner leading-[0.95] text-[#0e0e0d]" style={{ fontSize: "clamp(36px, 6vw, 56px)" }}>
            projects
          </h1>
          <p className="font-nanum-pen max-w-[52ch] text-[21px] leading-[1.4] text-[#244638] sm:text-[23px]">
            Every project submitted for Useless Projects 3.0, straight from the Hub app.
          </p>
          <p className="font-helvetica text-[12px] tracking-[0.04em] text-[#33322f]/60 uppercase">
            {projects.length} project{projects.length === 1 ? "" : "s"}
          </p>
        </header>

        {projects.length === 0 ? (
          <p className="font-helvetica max-w-[60ch] text-[16px] leading-[1.7] text-[#33322f]">
            Nothing here yet - check back once teams start submitting.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => {
              const link = project.projectUrl || project.sourceCodeUrl;
              const categories = project.categories
                ? project.categories.split(",").map((c) => c.trim()).filter(Boolean)
                : [];

              const card = (
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-black/10 p-3 transition-transform hover:scale-[1.02]">
                  <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-black/5 bg-[#f5f4f0]">
                    {project.coverImage ? (
                      // Cover images are user-submitted, hosted on whatever bucket the Hub app's
                      // upload happened to use - there's no fixed set of hostnames to allow through
                      // next/image's remotePatterns, so a plain <img> is the only thing that works
                      // for arbitrary external sources like this.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={project.coverImage} alt="" loading="lazy" className="size-full object-cover" />
                    ) : (
                      <span className="font-helvetica px-4 text-center text-[12px] text-[#33322f]/40 uppercase">
                        no image
                      </span>
                    )}
                    {project.status && (
                      <span
                        className={`font-helvetica absolute top-2 right-2 rounded-full px-2 py-0.5 text-[9px] tracking-[0.05em] uppercase ${
                          STATUS_STYLE[project.status] ?? "bg-black/5 text-[#33322f]/70"
                        }`}
                      >
                        {project.status}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-1.5 px-1">
                    <span className="font-nanum-pen truncate text-[19px] leading-[1.2] text-[#0e0e0d]">
                      {project.name}
                    </span>
                    {project.tagline && (
                      <span className="font-helvetica line-clamp-2 text-[13px] leading-[1.4] text-[#33322f]">
                        {project.tagline}
                      </span>
                    )}
                    <span className="font-helvetica text-[11px] leading-[1.4] text-[#33322f]/60">
                      {[project.teamName, project.venueName ?? project.campusName].filter(Boolean).join(" — ")}
                    </span>
                    {categories.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {categories.map((c) => (
                          <span
                            key={c}
                            className="font-helvetica rounded-full border border-black/10 px-2 py-0.5 text-[9px] tracking-[0.04em] text-[#33322f]/70 uppercase"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );

              return (
                <li key={project.id}>
                  {link ? (
                    <a href={link} target="_blank" rel="noreferrer" className="block h-full">
                      {card}
                    </a>
                  ) : (
                    card
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
