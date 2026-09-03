// Data for the /competitions/[slug] pages and the Airtable submissions table behind them.
// Add a new object here to open up a new competition - the handbook prize card, the
// /competitions index, and the detail page all render straight off this array.
export type Competition = {
  slug: string;
  // Must exactly match a choice in the "Competition" singleSelect field on the
  // "Useless Projects - Competition Submissions" Airtable table, or writes will fail.
  airtableChoice: string;
  prizeLabel: string;
  tagline: string;
  howToRedeem: string;
  whatWeMean: string;
  guidelines: string[];
  samples: { title: string; permalink?: string; youtubeId?: string }[];
};

export const COMPETITIONS: Competition[] = [
  {
    slug: "best-build-video-documentary",
    airtableChoice: "Best Build Video Documentary",
    prizeLabel: "best build video documentary",
    tagline: "Document your build weekend as a short video. A reel, a short, or a proper edit - all count.",
    howToRedeem:
      "Post the video on Instagram or YouTube, then submit the link below with your name and campus. We review submissions after the hackathon and announce the winner alongside the other results.",
    whatWeMean:
      "Not a polished ad for your project - a documentary of the making of it. The chaos, the 3am debugging, the moment it finally worked (or didn't). Shot on a phone is fine.",
    guidelines: [
      "Filmed during your actual build session, not staged afterwards.",
      "Under 3 minutes for reels/shorts, no hard limit for a full YouTube edit.",
      "Shows the process, not just the finished demo.",
      "Public link (Instagram or YouTube), so we can actually watch it.",
    ],
    samples: [],
  },
];

export function getCompetition(slug: string) {
  return COMPETITIONS.find((c) => c.slug === slug);
}

// The campuses on record with TinkerHub as of this table's creation. "Other" covers anyone
// whose campus isn't in the list yet - kept as free text there rather than blocking submission.
export const CAMPUSES = [
  "Sullamussalam Science College, Areacode",
  "Farook College, Farook",
  "LBS Institute of Technology for Women, Poojappura",
  "Mar Baselios Christian College of Engineering and Technology, Peerumedu",
  "Toc H Institute of Science & Technology, Arakkunnam",
  "LBS College of Engineering, Povval",
  "Seethi Sahib Memorial Polytechnic, Tirur",
  "MES College of Engineering and Technology, Kunnukara",
  "College of Engineering, Adoor",
  "St. Josephs College Devagiri (Autonomous)",
  "College of Engineering, Munnar",
  "NSS College of Engineering, Akathethara",
  "Government Engineering College, Sreekrishnapuram",
  "College of Engineering and Management, Vadackal",
  "Adi Shankara Institute of Engineering and Technology, Mattoor",
  "College of Engineering, Attingal",
  "Mar Athanasius College of Engineering, Kothamangalam",
  "EMEA College of Arts & Science, Kondotty",
  "Mohamed Abdurahiman Memorial Orphanage College, Mukkam",
  "Sree Chitra Thirunal College of Engineering, Pappanamcode",
  "SNM Institute of Management & Technology, Maliankara",
  "Sahrdaya College of Advanced Studies, Kodakara",
  "Model Engineering College, Thrikkakara",
  "Muthoot Institute of Technology & Science (MITS), Puthencruz",
  "Marian Engineering College, Kazhakuttom",
  "Ilahia College of Engineering and Technology, Mulavoor",
  "College of Engineering, Thalassery",
  "School Of Engineering CUSAT, Kalamassery",
  "Viswajyoti College of Engineering & Technology, Vazhakulam",
  "TKM College of Engineering, Karicode",
  "Christ College of Engineering, Irinjalakuda",
  "College of Engineering, Perumon",
  "Department of Computer Science, CUSAT, Kochi",
  "Rajiv Gandhi Institute of Technology, Velloor",
  "College of Engineering, Karunagappally",
  "Sahrdaya College of Engineering & Technology, Kodakara",
  "Thejus Engineering College, Erumapetti",
  "Government Engineering College, West Hill",
  "College of Engineering, Thiruvananthapuram",
  "Jyothi Engineering College, Cheruthuruthy",
  "ICCS College of Engineering and Management",
  "College of Engineering, Chengannur",
  "Albertian Institute of Science and Technology (AISAT), Kalamassery",
  "Government Engineering College, Painavu",
  "Sree Buddha College of Engineering, Pattoor",
  "College of Engineering, Trikaripur",
  "College of Engineering, Kallooppara",
  "Vidya Academy of Science & Technology, Thalakkottukara",
  "Government Engineering College, Thrissur",
  "Kannur University Mangattuparamba Campus",
  "College of Engineering, Vadakara",
  "Sree Narayana Gurukulam College of Engineering, Kadayiruppu",
  "SCMS School of Engineering & Technology, Karukutty",
  "Unity Women's College, Manjeri",
  "MES Keveeyam College, Valanchery",
  "Cochin University College of Engineering, Kuttanad",
  "College of Engineering, Poonjar",
  "Saintgits College of Engineering, Pathamuttom",
  "Other",
] as const;
