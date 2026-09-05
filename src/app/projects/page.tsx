import type { Metadata } from "next";
import { listProjects } from "@/lib/metabase";
import ProjectsGrid from "./projects-grid";

export const metadata: Metadata = {
  title: "Projects · Useless Projects",
  description: "Every project submitted for Useless Projects 3.0.",
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
        </header>

        {projects.length === 0 ? (
          <p className="font-helvetica max-w-[60ch] text-[16px] leading-[1.7] text-[#33322f]">
            Nothing here yet - check back once teams start submitting.
          </p>
        ) : (
          <ProjectsGrid projects={projects} />
        )}
      </div>
    </main>
  );
}
