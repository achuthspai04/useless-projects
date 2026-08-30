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
  | { kind: "note"; text: string }
  | { kind: "links"; items: { label: string; href: string; text: string; tag?: string }[] }
  | { kind: "cards"; items: { tag?: string; title: string; text: string }[] }
  | { kind: "gallery"; items: { title: string; text: string; image?: string }[] }
  | { kind: "prizes"; items: { label: string; text?: string }[] };

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
        text: "You will have a weekend, a team, and a room full of people building things nobody asked for. At the end of it you will have shipped something, which is more than most good ideas manage.",
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
          "Everything you use must be something you are allowed to use: licences, APIs, other people's work, all of it.",
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
    id: "submit",
    nav: "submit",
    title: "how to submit your project",
    lead: "Submission is a form and a working demo, not a pitch deck.",
    blocks: [
      {
        kind: "cards",
        items: [
          {
            tag: "form",
            title: "Fill in the submission form",
            text: "One submission per team, before the freeze. It asks for your team name, a one-line description of the useless thing, and a link to your repo.",
          },
          {
            tag: "docs",
            title: "Write a README",
            text: "What it does, how to run it, and who was on the team. Say if you used AI tools; that's a rule, not a suggestion, and it costs you nothing.",
          },
          {
            tag: "extras",
            title: "Link anything that isn't code",
            text: "Hardware builds, physical props, or anything that can't live in a repo should get a photo or short clip linked from the README.",
          },
          {
            tag: "demo",
            title: "Be ready to demo live",
            text: "Submission gets you on the schedule. The build still has to run in front of the judges; a submitted link with a broken demo doesn't place.",
          },
        ],
      },
      {
        kind: "note",
        text: "Placeholder: submission form link and the exact freeze time go here once confirmed.",
      },
    ],
  },
  {
    id: "inspiration",
    nav: "inspiration",
    title: "projects to inspire you",
    lead: "Stuck on an idea? Here's what past uselessness has looked like.",
    blocks: [
      {
        kind: "gallery",
        items: [
          { title: "the angry keyboard", text: "Types slower the angrier you sound." },
          { title: "the picky doorbell", text: "Only rings for people it likes." },
          { title: "the corporate roundtrip", text: "Translates any sentence into jargon and back, losing meaning both ways." },
          { title: "the noisy plant", text: "Live-tweets its own watering schedule, badly." },
          { title: "the judgmental shoes", text: "Judge your walking posture out loud." },
        ],
      },
      {
        kind: "text",
        text: "None of these are up for grabs; the point isn't to copy the bit, it's to see the shape of a good one. Small, working, and clearly not trying to solve anything.",
      },
      {
        kind: "note",
        text: "Placeholder: swap these tiles for real photos from past editions once picked, and link a full gallery here.",
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
    nav: "evaluation & prizes",
    title: "evaluation, prizes, and how to claim them",
    lead: "There is no scoring rubric worth defending, so here is roughly what impresses us, and what happens if it impresses us enough.",
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
        kind: "prizes",
        items: [
          { label: "grand prize", text: "Most useless, best executed." },
          { label: "judges' pick", text: "The one the judges couldn't stop talking about." },
          { label: "crowd favourite", text: "Voted on by everyone in the room." },
          { label: "best build", text: "Real craft, useless or not." },
        ],
      },
      {
        kind: "note",
        text: "Placeholder: final prize names and the judging panel to be confirmed; badges above are illustrative.",
      },
      {
        kind: "cards",
        items: [
          {
            tag: "announce",
            title: "Winners are announced at awards",
            text: "Straight after demos, on the schedule above. You need to be in the room; prizes aren't couriered after the fact.",
          },
          {
            tag: "collect",
            title: "One team member collects, on behalf of the team",
            text: "Bring the ID you registered with. Splitting a prize between teammates afterwards is on you, not on us.",
          },
          {
            tag: "sign off",
            title: "Sign for it before you leave",
            text: "Unclaimed prizes are held with the campus team for a short window after the event, then they're reallocated.",
          },
        ],
      },
      {
        kind: "note",
        text: "Placeholder: exact claim window and how to collect if you can't be there in person, to be confirmed.",
      },
    ],
  },
  {
    id: "resources",
    nav: "resources",
    title: "policies & good practice",
    lead: "The rules above are the short version. The full text lives elsewhere; read it once, it's not long.",
    blocks: [
      {
        kind: "links",
        items: [
          { tag: "conduct", label: "Code of conduct", href: "#", text: "How we expect everyone (participants, mentors, organisers) to treat each other, on site and online." },
          { tag: "privacy", label: "Privacy policy", href: "#", text: "What we collect when you register, and what we do with it." },
          { tag: "practice", label: "Best practices", href: "#", text: "Guidance on licensing, attribution, and using AI tools honestly in your submission." },
        ],
      },
    ],
  },
  {
    id: "help",
    nav: "contact points",
    title: "who to talk to",
    lead: "Ask early. Everyone here has been stuck on something dumber.",
    blocks: [
      {
        kind: "text",
        text: "Mentors wear a different colour lanyard and are on the floor all weekend. There is no such thing as a question too small; half of them will be about a cable.",
      },
      {
        kind: "text",
        text: "For anything before the event, or anything you would rather ask quietly, mail the campus team and someone will get back to you.",
      },
      {
        kind: "cards",
        items: [
          { tag: "general", title: "Campus team", text: "General questions, before or during the event." },
          { tag: "your campus", title: "Campus lead", text: "Registration, eligibility, and local logistics specific to your campus." },
          { tag: "escalation", title: "Foundation team", text: "Anything about the event overall, or if your campus lead is unreachable." },
        ],
      },
      {
        kind: "note",
        text: "A note on venue issues: the venue and its facilities (power, seating, wifi, food, air conditioning) are the venue's responsibility, not the organisers'. Flag a venue problem to your on-site point of contact and it'll get relayed, but we don't control the building.",
      },
    ],
  },
];

// Card chrome shared by the "cards" block and the enriched "links" block - same recipe the FAQ
// section's question cards use (see faq-section.tsx), so a handbook card and an FAQ card read as
// the same object even though they're built independently.
const CARD_CLASS = "rounded-2xl border border-black/5 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm";

// Small caps label used for a card or link's category word (e.g. "form", "docs") - plain text,
// not a chip, so it doesn't compete with the actual prize medals below.
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-helvetica text-[11px] tracking-[0.08em] text-[#33322f]/50 uppercase">{children}</span>
  );
}

// A twelve-point scalloped seal, like a certificate stamp, computed once at module load rather
// than hand-typed as an SVG path - the only thing that differs per size is the viewBox scale.
function buildSealPath(cx: number, cy: number, outerR: number, innerR: number, points: number) {
  const step = Math.PI / points;
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)} `;
  }
  return `${d}Z`;
}
const SEAL_PATH = buildSealPath(50, 42, 42, 36, 12);

// The actual "badge" the user meant: a collectible medal, one per prize, not a UI chip. Ribbon
// tails sit behind the seal so the seal's bottom scallops read as pinned on top of them.
function PrizeMedal({ label, text }: { label: string; text?: string }) {
  return (
    <li className="flex flex-col items-center gap-2 text-center" style={{ width: "140px" }}>
      <svg viewBox="0 0 100 108" width="112" height="121" aria-hidden="true">
        <path d="M38,72 L28,104 L50,90 Z" fill="#1b352a" />
        <path d="M62,72 L72,104 L50,90 Z" fill="#244638" />
        <path d={SEAL_PATH} fill="#ea34df" />
        <circle cx="50" cy="42" r="28" fill="#fff" />
        <circle cx="50" cy="42" r="28" fill="none" stroke="#ea34df" strokeWidth="2" strokeDasharray="3 3.5" />
        <text
          x="50"
          y="53"
          textAnchor="middle"
          fontSize="30"
          fill="#ea34df"
          style={{ fontFamily: "var(--font-drowner)" }}
        >
          ★
        </text>
      </svg>
      <span className="font-nanum-pen text-[20px] leading-[1.1] text-[#0e0e0d]">{label}</span>
      {text && <span className="font-helvetica text-[13px] leading-[1.4] text-[#33322f]">{text}</span>}
    </li>
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, i) => {
        // Text-shaped blocks stay capped in ch rather than px: at the full 786px content column
        // the body ran to about 100 characters a line, well past a comfortable measure for a page
        // meant to be read through. Grid-shaped blocks (badges/cards/gallery) below skip the cap
        // so they can use the whole column width.

        if (block.kind === "text") {
          return (
            <p key={i} className="font-helvetica max-w-[68ch] text-[16px] leading-[1.7] text-[#33322f] sm:text-[17px]">
              {block.text}
            </p>
          );
        }

        if (block.kind === "note") {
          return (
            <p
              key={i}
              className="font-nanum-pen max-w-[68ch] border-l-[3px] border-[#ea34df] pl-4 text-[19px] leading-[1.45] text-[#244638] sm:text-[21px]"
            >
              {block.text}
            </p>
          );
        }

        if (block.kind === "prizes") {
          return (
            <ul key={i} className="flex flex-wrap justify-center gap-x-6 gap-y-8 py-2 sm:justify-start">
              {block.items.map((item) => (
                <PrizeMedal key={item.label} label={item.label} text={item.text} />
              ))}
            </ul>
          );
        }

        if (block.kind === "cards") {
          return (
            <ol key={i} className="grid gap-4 sm:grid-cols-2">
              {block.items.map((card, cardIndex) => (
                <li key={card.title} className={`flex flex-col gap-2 ${CARD_CLASS}`}>
                  <span className="flex items-center gap-2">
                    <span className="font-helvetica flex size-6 shrink-0 items-center justify-center rounded-full bg-[#ea34df] text-[11px] text-white tabular-nums">
                      {String(cardIndex + 1).padStart(2, "0")}
                    </span>
                    {card.tag && <Eyebrow>{card.tag}</Eyebrow>}
                  </span>
                  <span className="font-nanum-pen text-[21px] leading-[1.2] text-[#0e0e0d] sm:text-[23px]">
                    {card.title}
                  </span>
                  <span className="font-helvetica text-[15px] leading-[1.6] text-[#33322f]">{card.text}</span>
                </li>
              ))}
            </ol>
          );
        }

        if (block.kind === "gallery") {
          return (
            <ul key={i} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {block.items.map((item) => (
                <li key={item.title} className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-3 shadow-xs">
                  {/* Placeholder tile until real photos land - swap `image` in on the data item
                      and this renders it in place of the "coming soon" note, no markup changes. */}
                  <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-black/10 bg-[#f5f4f0]">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.title} className="size-full object-cover" />
                    ) : (
                      <span className="font-nanum-pen px-4 text-center text-[15px] leading-[1.3] text-[#33322f]/40">
                        image coming soon
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 px-1 pb-1">
                    <span className="font-nanum-pen text-[19px] leading-[1.2] text-[#0e0e0d] sm:text-[21px]">
                      {item.title}
                    </span>
                    <span className="font-helvetica text-[15px] leading-[1.6] text-[#33322f]">{item.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          );
        }

        if (block.kind === "links") {
          return (
            <ul key={i} className="flex max-w-[68ch] flex-col gap-3">
              {block.items.map((item) => (
                <li key={item.label} className={`flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4 ${CARD_CLASS}`}>
                  {item.tag && (
                    <span className="pt-[2px] sm:pt-0">
                      <Eyebrow>{item.tag}</Eyebrow>
                    </span>
                  )}
                  <span className="flex flex-col gap-1">
                    <a
                      href={item.href}
                      className="font-nanum-pen text-[19px] leading-[1.2] text-[#0e0e0d] underline decoration-[#ea34df] decoration-2 underline-offset-4 transition-colors hover:text-[#ea34df] sm:text-[21px]"
                    >
                      {item.label}
                    </a>
                    <span className="font-helvetica text-[15px] leading-[1.6] text-[#33322f]">{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.kind === "list") {
          return (
            <ul key={i} className="flex max-w-[68ch] flex-col gap-3">
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
          <ol key={i} className="flex max-w-[68ch] flex-col gap-5">
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
