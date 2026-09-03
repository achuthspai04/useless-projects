// Only ever imported from Route Handlers and Server Components (never a "use client" file) -
// it reads AIRTABLE_API_KEY, which must not reach the browser bundle.
const BASE_ID = "appaBOqq1WfYxlJGJ";
const SUBMISSIONS_TABLE_ID = "tblpAb9Cvzse2KhaA";

function apiKey() {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key) throw new Error("AIRTABLE_API_KEY is not set");
  return key;
}

export type SubmissionFields = {
  Name: string;
  Competition: string;
  Campus: string;
  "Submission Link": string;
  Notes?: string;
};

export async function createSubmission(fields: SubmissionFields) {
  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${SUBMISSIONS_TABLE_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: { ...fields, Status: "Pending", "Submitted At": new Date().toISOString() },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable create failed (${res.status}): ${body}`);
  }

  return res.json();
}

export type ApprovedSubmission = {
  id: string;
  name: string;
  campus: string;
  link: string;
};

// Used by /videos to show submissions that have been reviewed and approved. Fails soft (empty
// array) rather than throwing, so a missing/misconfigured API key doesn't take the page down.
export async function listApprovedSubmissions(competition: string): Promise<ApprovedSubmission[]> {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key) return [];

  const params = new URLSearchParams({
    filterByFormula: `AND({Competition} = "${competition}", {Status} = "Approved")`,
    "sort[0][field]": "Submitted At",
    "sort[0][direction]": "desc",
  });

  try {
    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${SUBMISSIONS_TABLE_ID}?${params}`, {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    return (data.records ?? []).map((record: { id: string; fields: Record<string, string> }) => ({
      id: record.id,
      name: record.fields.Name ?? "",
      campus: record.fields.Campus ?? "",
      link: record.fields["Submission Link"] ?? "",
    }));
  } catch {
    return [];
  }
}
