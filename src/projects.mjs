export const projects = [
  {
    id: "chassiswire",
    name: "ChassisWire",
    category: "Software · Automotive",
    description:
      "Tools for understanding and building vehicle electrical systems.",
    status: "active",
    period: "2026 —",
    visual: "SCHEMATIC / UI / CONNECTOR",
    url: "/projects/chassiswire/",
  },
  {
    id: "house",
    name: "Redbank Plains",
    category: "House · Renovation",
    description: "Renovating a house, one questionable decision at a time.",
    status: "active",
    period: "2025 —",
    visual: "HOUSE / RENOVATION",
  },
  {
    id: "318is",
    name: "E30 318iS",
    category: "Restoration · Automotive",
    description:
      "Putting an increasingly rare little BMW back the way it should be.",
    status: "active",
    period: "2026 —",
    visual: "BMW E30 318iS",
  },
  {
    id: "m54",
    name: "E30 M54 conversion",
    category: "Engineering · Automotive",
    description:
      "An old chassis, a newer straight-six and considerably more wiring.",
    status: "planned",
    period: "Collecting parts",
    visual: "M54B30 / PARTS COLLECTION",
  },
  {
    id: "respray",
    name: "E30 sedan respray",
    category: "Bodywork · Paint",
    description:
      "Learning bodywork by doing essentially all of it the hard way.",
    status: "complete",
    period: "2023",
    visual: "FINISHED GLACIER BLUE E30",
    image: "/images/e30-respray/finished.jpg",
    url: "/writing/e30-respray/",
  },
  {
    id: "honda",
    name: "Honda CB500 Four",
    category: "Restoration · Motorcycle",
    description:
      "Bringing a 1970s Honda four back from several decades of neglect.",
    status: "archive",
    period: "2022",
    visual: "HONDA CB500 FOUR",
    image:
      "/images/honda/how-to-build-a-classic-honda-cafe-racer-1972-honda-cb500f.jpg",
    url: "/projects/honda-cb500-four/",
  },
];
export const hondaPosts = [
  [
    "how-to-build-a-classic-honda-cafe-racer-1972-honda-cb500f",
    "How to build a classic Honda cafe racer",
    "The project, the inspiration and buying the partially disassembled Honda.",
  ],
  [
    "tearing-down-the-honda-cb550",
    "Tearing down the bike",
    "Wheels, suspension, components and figuring out how a 1970s Honda comes apart.",
  ],
  [
    "cb550f-carburetor-disassembly-and-restoration",
    "Carburettor restoration",
    "Four carburettors, dozens of small parts and a very ambitious restoration.",
  ],
  [
    "cb500-cafe-racer-welding-the-frame-and-wheel-assembly",
    "Frame & wheels",
    "Cutting the frame, welding a rear hoop, powder coating and rebuilding both wheels.",
  ],
  [
    "engine-rebuild",
    "Engine rebuild",
    "Cases, bearings, transmission, clutch, pistons, head and getting the inline-four back together.",
  ],
  [
    "cb500-cafe-racer-build-rewiring-the-bike-with-m-unit",
    "Rewiring with m.unit",
    "Designing an electronics tray, drawing the loom and building a new harness.",
  ],
].map(([slug, title, description]) => ({
  slug,
  title,
  description,
  image: "/images/honda/" + slug + ".jpg",
  url: "https://haydenbwade.com/" + slug + "/",
}));
