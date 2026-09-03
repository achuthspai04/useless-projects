import { NextResponse } from "next/server";
import { createSubmission } from "@/lib/airtable";
import { CAMPUSES, getCompetition } from "@/lib/competitions";

function isValidSubmissionLink(link: string) {
  try {
    const url = new URL(link);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    const host = url.hostname.replace(/^www\./, "");
    return ["instagram.com", "youtube.com", "youtu.be"].includes(host);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { slug, name, campus, link, notes } = body as Record<string, unknown>;

  if (typeof slug !== "string" || !getCompetition(slug)) {
    return NextResponse.json({ error: "Unknown competition." }, { status: 400 });
  }
  const competition = getCompetition(slug)!;

  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
    return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  }
  if (typeof campus !== "string" || !CAMPUSES.includes(campus as (typeof CAMPUSES)[number])) {
    return NextResponse.json({ error: "Select your campus." }, { status: 400 });
  }
  if (typeof link !== "string" || !isValidSubmissionLink(link)) {
    return NextResponse.json({ error: "Enter a valid Instagram or YouTube link." }, { status: 400 });
  }
  if (notes !== undefined && (typeof notes !== "string" || notes.length > 500)) {
    return NextResponse.json({ error: "Notes are too long." }, { status: 400 });
  }

  try {
    await createSubmission({
      Name: name.trim(),
      Competition: competition.airtableChoice,
      Campus: campus,
      "Submission Link": link,
      ...(notes ? { Notes: notes } : {}),
    });
  } catch (error) {
    console.error("Competition submission failed:", error);
    return NextResponse.json({ error: "Couldn't save your submission. Try again in a bit." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
