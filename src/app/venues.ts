// Venue rosters for the two hackathon slots (see SCHEDULE in curiosity-reveal.tsx: slot 1 runs
// Sep 3-6, slot 2 runs Sep 11-13). Images live under /public/venues/slot-{1,2}.
export const VENUES = [
  { name: "MITS", slot: 1, image: "/venues/slot-1/mits.png" },
  { name: "CE Vadakara", slot: 1, image: "/venues/slot-1/ce-vadakara.png" },
  { name: "Devagiri", slot: 1, image: "/venues/slot-1/devagiri.png" },
  { name: "FISAT", slot: 1, image: "/venues/slot-1/fisat.png" },
  { name: "Jain", slot: 1, image: "/venues/slot-1/jain.png" },
  { name: "Kalloopara", slot: 1, image: "/venues/slot-1/kalloopara.png" },
  { name: "LBS Poojapura", slot: 1, image: "/venues/slot-1/lbs-poojapura.png" },
  { name: "MEC Thrikkakara", slot: 1, image: "/venues/slot-1/mec-thrikkakara.jpeg" },
  { name: "Sahrdaya", slot: 1, image: "/venues/slot-1/sahrdaya.png" },
  { name: "Saintgits", slot: 1, image: "/venues/slot-1/saintgits.png" },
  { name: "SCMS", slot: 1, image: "/venues/slot-1/scms.png" },
  { name: "Sree Buddha Pattoor", slot: 1, image: "/venues/slot-1/sree-buddha-pattoor.png" },
  { name: "Tinkerspace", slot: 1, image: "/venues/slot-1/tinkerspace.png" },
  { name: "Viswajyothi", slot: 1, image: "/venues/slot-1/viswajyothi.png" },
  { name: "Attingal", slot: 2, image: "/venues/slot-2/attingal.png" },
  { name: "CET", slot: 2, image: "/venues/slot-2/cet.png" },
  { name: "Majlis", slot: 2, image: "/venues/slot-2/majlis.png" },
] as const;
