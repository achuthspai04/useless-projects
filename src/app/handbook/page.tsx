import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Handbook · Useless Projects",
  description: "Rules, how to participate, and everything else worth knowing before you build something useless.",
};

// PLACEHOLDER COPY. The structure below is the point - every string here is sample text meant to
// be swapped for the real handbook. Sections render straight off this array, so adding, dropping
// or reordering one is a data edit; nothing in the layout is keyed to a particular section.
type Block =
  | { kind: "text"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "steps"; items: { title: string; text: string }[] }
  | { kind: "note"; text: string };

type Section = {
  id: string;
  nav: string;
  title: string;
  lead: string;
  blocks: Block[];
};

const SECTIONS: Section[] = [
  {
    id: "readme",
    nav: "readme",
    title: "start here",
    lead: "Useless Projects is a build sprint with exactly one rule about outcomes: it must not be useful.",
    blocks: [
      {
        kind: "text",
        text: "Every other hackathon asks what problem you are solving. This one asks what you have always wanted to make and never had an excuse for. Bring the idea that makes people laugh before it makes them nod.",
      },
      {
        kind: "text",
        text: "You will have a weekend, a team, and a room full of people building things nobody asked for. At the end of it you will have shipped something — which is more than most good ideas manage.",
      },
      {
        kind: "note",
        text: "New here? Read this page top to bottom once. It takes about four minutes and covers everything you need on the day.",
      },
    ],
  },
  {
    id: "participate",
    nav: "how to join",
    title: "how to participate",
    lead: "Four steps, none of which involve a pitch deck.",
    blocks: [
      {
        kind: "steps",
        items: [
          {
            title: "Register your team",
            text: "Teams are two to four people. Solo entries are allowed but you will have more fun with company. One person registers on behalf of everyone.",
          },
          {
            title: "Bring an idea, not a plan",
            text: "You do not need to know how to build it when you arrive. A single sentence describing the useless thing is enough to get started.",
          },
          {
            title: "Build on the day",
            text: "Work begins when the clock starts and not before. Anything you bring must be a component, not a head start.",
          },
          {
            title: "Show it working",
            text: "Demos are three minutes. It has to run, at least once, in front of people. Slides are not a substitute for a thing that moves.",
          },
        ],
      },
      {
        kind: "note",
        text: "Placeholder: registration link, deadline, and campus eligibility go here once confirmed.",
      },
    ],
  },
  {
    id: "rules",
    nav: "rules",
    title: "the rules",
    lead: "Short list. We would rather spend the weekend building than adjudicating.",
    blocks: [
      {
        kind: "list",
        items: [
          "It must be useless. If someone can describe a genuine use case without laughing, reconsider.",
          "Build during the event. Existing libraries, frameworks and hardware modules are fine; existing projects are not.",
          "Everything you use must be something you are allowed to use — licences, APIs, other people's work, all of it.",
          "AI tools are allowed and you should say so in your README. Nobody loses points for it.",
          "Hardware is welcome. So is anything that plugs into a wall, provided it does not set off the smoke alarm.",
          "Be decent to each other. The code of conduct applies to the whole event, online and off.",
        ],
      },
      {
        kind: "text",
        text: "Anything not covered here is decided by the organisers on the day, and we will always err towards letting you build the thing.",
      },
    ],
  },
  {
    id: "schedule",
    nav: "schedule",
    title: "how the weekend runs",
    lead: "Sample timings. Treat the shape as real and the hours as provisional.",
    blocks: [
      {
        kind: "steps",
        items: [
          { title: "Friday evening", text: "Doors, team forming, and the opening briefing. Ideas get pinned to the wall." },
          { title: "Saturday", text: "The long build. Mentors float around all day. Food happens at some point." },
          { title: "Sunday morning", text: "Freeze, then demos. Three minutes each, running order drawn at random." },
          { title: "Sunday afternoon", text: "Awards, photographs, and the traditional argument about which entry was least useful." },
        ],
      },
    ],
  },
  {
    id: "judging",
    nav: "judging",
    title: "what we look for",
    lead: "There is no scoring rubric worth defending, so here is roughly what impresses us.",
    blocks: [
      {
        kind: "list",
        items: [
          "Commitment to the bit. A fully realised silly idea beats a half-built clever one.",
          "It works. Or it fails in an entertaining and clearly deliberate way.",
          "Craft. Uselessness is not an excuse for a bad build.",
          "The demo. Three minutes, well spent, in front of a room that wants you to succeed.",
        ],
      },
      {
        kind: "note",
        text: "Placeholder: prize categories and judging panel to be confirmed.",
      },
    ],
  },
  {
    id: "help",
    nav: "need help",
    title: "if you get stuck",
    lead: "Ask early. Everyone here has been stuck on something dumber.",
    blocks: [
      {
        kind: "text",
        text: "Mentors wear a different colour lanyard and are on the floor all weekend. There is no such thing as a question too small — half of them will be about a cable.",
      },
      {
        kind: "text",
        text: "For anything before the event, or anything you would rather ask quietly, mail the campus team and someone will get back to you.",
      },
    ],
  },
];

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    // Capped in ch rather than px: at the full 786px content column the body ran to about 100
    // characters a line, well past a comfortable measure for a page meant to be read through.
    <div className="flex max-w-[68ch] flex-col gap-6">
      {blocks.map((block, i) => {
        if (block.kind === "text") {
          return (
            <p key={i} className="font-helvetica text-[16px] leading-[1.7] text-[#33322f] sm:text-[17px]">
              {block.text}
            </p>
          );
        }

        if (block.kind === "note") {
          return (
            <p
              key={i}
              className="font-nanum-pen border-l-[3px] border-[#ea34df] pl-4 text-[19px] leading-[1.45] text-[#244638] sm:text-[21px]"
            >
              {block.text}
            </p>
          );
        }

        if (block.kind === "list") {
          return (
            <ul key={i} className="flex flex-col gap-3">
              {block.items.map((item) => (
                <li
                  key={item}
                  className="font-helvetica relative pl-6 text-[16px] leading-[1.7] text-[#33322f] sm:text-[17px]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[0.62em] size-[7px] shrink-0 rounded-full bg-[#ea34df]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <ol key={i} className="flex flex-col gap-5">
            {block.items.map((step, stepIndex) => (
              <li key={step.title} className="flex gap-4">
                <span className="font-helvetica mt-[2px] w-6 shrink-0 text-[14px] leading-[1.7] text-[#ea34df] tabular-nums">
                  {String(stepIndex + 1).padStart(2, "0")}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-nanum-pen text-[21px] leading-[1.2] text-[#0e0e0d] sm:text-[23px]">
                    {step.title}
                  </span>
                  <span className="font-helvetica text-[16px] leading-[1.7] text-[#33322f] sm:text-[17px]">
                    {step.text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        );
      })}
    </div>
  );
}

export default function HandbookPage() {
  return (
    // data-page is what turns the root layout's mandatory scroll snapping off for this route - see
    // globals.css. The home page is a deck of full-screen panels; this is a document.
    <main data-page="handbook" className="w-full bg-white text-[#0e0e0d]">
      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-6 border-b border-black/10 py-14 sm:py-20">
          <Link
            href="/"
            className="font-helvetica w-fit text-[13px] tracking-[0.08em] text-[#33322f] uppercase transition-colors hover:text-[#ea34df]"
          >
            ← back to useless projects
          </Link>
          <h1
            className="font-drowner leading-[0.9] text-[#0e0e0d]"
            // Fluid rather than stepped, so the title fills the measure at every width instead of
            // jumping at breakpoints - it is the one element big enough for the difference to show.
            style={{ fontSize: "clamp(56px, 13vw, 132px)", letterSpacing: "0.02em" }}
          >
            handbook
          </h1>
          <p className="font-nanum-pen max-w-[46ch] text-[21px] leading-[1.4] text-[#244638] sm:text-[24px]">
            Everything worth knowing before you build something nobody asked for. Rules, timings, and how to take
            part.
          </p>
        </header>

        <div className="grid gap-12 py-12 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-16 lg:py-16">
          {/* Sticks alongside the content on wide screens; above it, and scrollable sideways if the
              list ever outgrows the width, on narrow ones. */}
          <nav aria-label="Handbook sections" className="lg:sticky lg:top-12 lg:self-start">
            <p className="font-helvetica mb-4 text-[12px] tracking-[0.1em] text-[#33322f]/60 uppercase">Contents</p>
            <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:gap-3 lg:overflow-visible lg:px-0">
              {SECTIONS.map((section) => (
                <li key={section.id} className="shrink-0">
                  <a
                    href={`#${section.id}`}
                    className="font-nanum-pen block rounded-full border border-black/10 px-4 py-1.5 text-[18px] whitespace-nowrap text-[#33322f] transition-colors hover:border-[#ea34df] hover:text-[#ea34df] lg:rounded-none lg:border-0 lg:px-0 lg:py-0 lg:text-[20px]"
                  >
                    {section.nav}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex min-w-0 flex-col gap-14 sm:gap-16">
            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-8 flex flex-col gap-5">
                <h2
                  className="font-drowner leading-[1] text-[#0e0e0d]"
                  style={{ fontSize: "clamp(34px, 6vw, 54px)" }}
                >
                  {section.title}
                </h2>
                <p className="font-nanum-pen max-w-[52ch] text-[20px] leading-[1.4] text-[#244638] sm:text-[22px]">
                  {section.lead}
                </p>
                <Blocks blocks={section.blocks} />
              </section>
            ))}
          </div>
        </div>

        <footer className="flex flex-col gap-4 border-t border-black/10 py-12 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <p className="font-nanum-pen text-[20px] leading-[1.4] text-[#244638]">
            Still have a question?{" "}
            <a
              href="mailto:campus@tinkerhub.org"
              className="underline decoration-[#ea34df] decoration-2 underline-offset-4 transition-colors hover:text-[#ea34df]"
            >
              campus@tinkerhub.org
            </a>
          </p>
          <Link
            href="/"
            className="font-helvetica w-fit text-[13px] tracking-[0.08em] text-[#33322f] uppercase transition-colors hover:text-[#ea34df]"
          >
            ← back to useless projects
          </Link>
        </footer>
      </div>
    </main>
  );
}
