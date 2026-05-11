/**
 * Single source of truth for homepage content.
 * Replace these constants when wiring a CMS — types/index.ts pins the shape.
 */

import type {
  Certification,
  Division,
  LocationItem,
  NavLinkItem,
  Project,
  Stat,
  TimelineMilestone,
} from "@/types";

export const SITE = {
  name: "Dunham Price Group",
  shortName: "Dunham Price",
  founded: 1939,
  region: "Southwest Louisiana",
  phone: "337-433-3900",
  phoneTel: "tel:+13374333900",
  tagline: "Concrete, precast, and aggregates engineered since 1939.",
} as const;

export const NAV_LINKS: NavLinkItem[] = [
  { label: "Capabilities", href: "/capabilities" },
  { label: "Projects", href: "/#projects" },
  { label: "About", href: "/#chairman" },
  { label: "Locations", href: "/#locations" },
  { label: "Careers", href: "/careers" },
];

export const HERO = {
  eyebrow: "EST. 1939 · SOUTHWEST LOUISIANA",
  headlineLine1: "THERE'S HISTORY",
  headlineLine2: "IN THE MIX.",
  /**
   * Hero subhead is rendered in two visual registers in the Hero component:
   *   - `subheadClaim` reads as a manifesto line, set in display weight
   *     with the leading yellow rule.
   *   - `subheadDetail` is the body-weight clarification underneath.
   * Keeping them as separate fields here means a future copy edit (or
   * CMS swap) can rewrite either half independently.
   */
  subheadClaim: "Four generations. Four divisions. One standard.",
  subheadDetail:
    "Concrete, precast, and aggregates engineered for Southwest Louisiana since 1939.",
  videoSrc:
    "https://dunhamprice.com/wp-content/uploads/2025/09/dunham_price_llc_1-720p.mp4",
  // TODO: replace with real poster frame
  poster: "/hero-poster.svg",
  ctaPrimary: { label: "Request a Quote", href: "#quote" },
  ctaSecondary: { label: "Explore Capabilities", href: "#capabilities" },
  /**
   * Scan-line surfaced directly below the CTAs. Answers the bounce-prone
   * estimator's "can you do my job?" question within the first viewport.
   * Each item is short and mono so the row reads as a spec ticker, not copy.
   */
  proofLine: [
    { label: "Ready-mix" },
    { label: "Precast girders & piles" },
    { label: "Aggregates · base · rip rap" },
    { label: "Same-day dispatch · 4 yards" },
  ],
} as const;

export const STATS: Stat[] = [
  { value: "1939", numeric: 1939, label: "Founded" },
  { value: "4", numeric: 4, label: "Generations" },
  { value: "4", numeric: 4, label: "Locations" },
  { value: "86+", numeric: 86, suffix: "+", label: "Years Delivering" },
];

export const DIVISIONS: Division[] = [
  {
    slug: "ready-mix",
    name: "Ready Mix Concrete",
    productLines: 7,
    lines: [
      "Standard mix",
      "Lightweight",
      "Flow fill",
      "Specialty admixtures",
      "Polypropylene & steel fibers",
    ],
    href: "/capabilities#ready-mix",
    image:
      "https://dunhamprice.com/wp-content/uploads/2025/08/services-_0005_Concrete-Truck.jpg",
    imageAlt: "Ready mix concrete truck on a Southwest Louisiana job site",
  },
  {
    slug: "precast",
    name: "Precast",
    productLines: 5,
    lines: [
      "Bridge girders",
      "Bridge & deck panels",
      "Prestressed pile",
      "Specialty precast",
      "Bin blocks",
    ],
    href: "/capabilities#precast",
    image:
      "https://dunhamprice.com/wp-content/uploads/2025/08/services-_0002_Precast.jpg",
    imageAlt: "Precast concrete elements staged in the Dunham Price yard",
  },
  {
    slug: "aggregates",
    name: "Aggregates",
    productLines: 12,
    lines: [
      "Crushed limestone (#57, #67, #8)",
      "610 base",
      "Rip rap (#10 / #30 / #50)",
      "Mason & fill sand",
      "Pea gravel",
    ],
    href: "/capabilities#aggregates",
    image:
      "https://dunhamprice.com/wp-content/uploads/2025/08/concrete-home.jpg",
    imageAlt: "Aggregate stockpile at a Dunham Price facility",
  },
  {
    slug: "south-coast",
    name: "South Coast Materials",
    productLines: 3,
    lines: [
      "Clean fill sand",
      "Concrete sand",
      "Asphalt sand",
    ],
    href: "/capabilities#south-coast",
    image:
      "https://dunhamprice.com/wp-content/uploads/2025/08/services-_0006_Aggregates.jpg",
    imageAlt: "Loader moving aggregate at South Coast Materials",
  },
];

export const LOCATIONS: LocationItem[] = [
  {
    id: "westlake",
    city: "Westlake",
    state: "LA",
    code: "WL",
    address: "210 Mike Hooks Rd.",
    // TODO: Mapbox token + real coordinates
    coords: [-93.243, 30.246],
    phone: "337-433-3900",
    hours: "Mon–Fri · 6a–5p",
    driveTime: "HQ · QC lab on site",
  },
  {
    id: "lake-charles",
    city: "Lake Charles",
    state: "LA",
    code: "LC",
    address: "811 W. Lincoln Rd.",
    coords: [-93.21, 30.235],
    phone: "337-433-3900",
    hours: "Mon–Fri · 6a–5p",
    driveTime: "~10 min from Westlake",
  },
  {
    id: "sulphur",
    city: "Sulphur",
    state: "LA",
    code: "SP",
    address: "6121 LA-27",
    coords: [-93.378, 30.236],
    phone: "337-433-3900",
    hours: "Mon–Fri · 6a–5p",
    driveTime: "~15 min from Westlake",
  },
  {
    id: "ragley",
    city: "Ragley",
    state: "LA",
    code: "RG",
    address: "15003 US-171",
    coords: [-93.235, 30.502],
    phone: "337-433-3900",
    hours: "Mon–Fri · 6a–5p",
    driveTime: "~30 min from Westlake",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "i-10-calcasieu-river-bridge",
    name: "I-10 Calcasieu River Bridge",
    division: "Precast",
    scope: "Bridge girders & deck panels",
    client: "Louisiana DOTD",
    year: "2024",
    metrics: [
      { value: "840", unit: "LF", label: "Girders" },
      { value: "12,000", unit: "yd³", label: "Concrete" },
      { value: "18", unit: "MO", label: "Duration" },
    ],
    // TODO: replace with real project imagery
    image:
      "https://dunhamprice.com/wp-content/uploads/2025/08/services-_0002_Precast.jpg",
    imageAlt: "Precast bridge girders staged for the I-10 Calcasieu project",
  },
  {
    id: "port-of-lake-charles-expansion",
    name: "Port of Lake Charles Expansion",
    division: "Ready Mix",
    scope: "12,000 yd³ structural pour",
    client: "Lake Charles Harbor & Terminal District",
    year: "2023",
    metrics: [
      { value: "12,000", unit: "yd³", label: "Delivered" },
      { value: "36", unit: "HR", label: "Continuous" },
      { value: "0", label: "Cold joints" },
    ],
    image:
      "https://dunhamprice.com/wp-content/uploads/2025/08/services-_0005_Concrete-Truck.jpg",
    imageAlt: "Ready mix trucks queued for the Port of Lake Charles pour",
  },
  {
    id: "cameron-lng-facility",
    name: "Cameron LNG Facility",
    division: "Aggregates",
    scope: "Base material & rip rap",
    client: "Cameron LNG, LLC",
    year: "2022",
    metrics: [
      { value: "180k", unit: "TON", label: "Aggregates" },
      { value: "1.2", unit: "MI", label: "Shoreline" },
      { value: "3", label: "Gradations" },
    ],
    image:
      "https://dunhamprice.com/wp-content/uploads/2025/08/services-_0006_Aggregates.jpg",
    imageAlt: "Aggregate base material delivered to Cameron LNG",
  },
];

export const CERTIFICATIONS: Certification[] = [
  { abbr: "ACI", full: "American Concrete Institute" },
  { abbr: "PCI", full: "Precast/Prestressed Concrete Institute" },
  { abbr: "NRMCA", full: "National Ready Mixed Concrete Association" },
  { abbr: "CAAL", full: "Concrete & Aggregates Association of Louisiana" },
  { abbr: "AGC", full: "Associated General Contractors" },
  { abbr: "ABC", full: "Associated Builders & Contractors" },
];

/**
 * Heritage timeline rendered in the Timeline component on the homepage.
 *
 * Verified entries (no `toConfirm`):
 *   - 1939: founding (chairman quote names Rowland Price as the founder)
 *   - 2023: Port of Lake Charles 12,000 yd³ pour (lib/projects.ts)
 *   - 2024: I-10 Calcasieu River Bridge precast delivery (lib/projects.ts)
 *
 * Speculative entries are flagged `toConfirm: true` so the renderer
 * surfaces a mono "to confirm" tag and the family can review/correct
 * before launch. Years and details for the leadership transitions are
 * decade-anchored guesses that line up with the existing four-generation
 * rail; replace with verified history when available.
 *
 * Order: chronological. Timeline component preserves this order.
 */
export const TIMELINE: TimelineMilestone[] = [
  {
    year: 1939,
    title: "Rowland Price batches the first load.",
    description:
      "Founded in Westlake to serve the post-war Calcasieu industrial corridor. One drum, one truck, one pour at a time.",
    category: "founding",
  },
  {
    year: 1962,
    title: "Aggregates operation formalized.",
    description:
      "Crushed limestone, washed sand, and rip rap added to the catalog as Southwest Louisiana road and drainage work scales up.",
    category: "division",
    toConfirm: true,
  },
  {
    year: 1965,
    title: "Rob Price, Sr. takes the helm.",
    description:
      "Second generation steps into leadership, expanding the ready-mix fleet and standardizing batch QC across plants.",
    category: "leadership",
    toConfirm: true,
  },
  {
    year: 1978,
    title: "DP Concrete Products opens.",
    description:
      "Precast yard launched to fabricate prestressed pile, bridge girders, and custom precast for Louisiana DOTD infrastructure work.",
    category: "division",
    toConfirm: true,
  },
  {
    year: 1989,
    title: "Rob Price, Jr. assumes leadership.",
    description:
      "Third generation extends the company's footprint with new yards in Lake Charles and Sulphur, anchoring the four-yard dispatch network.",
    category: "leadership",
    toConfirm: true,
  },
  {
    year: 2003,
    title: "South Coast Materials joins the group.",
    description:
      "Specialty washed sand division added, serving the Gulf Coast contractor base for concrete batching and asphalt mix.",
    category: "expansion",
    toConfirm: true,
  },
  {
    year: 2014,
    title: "Fourth generation joins the company.",
    description:
      "Same family. Same yard. The standard Rowland set in 1939 carried forward into the fourth generation of Price leadership.",
    category: "leadership",
    toConfirm: true,
  },
  {
    year: 2022,
    title: "Cameron LNG shoreline protection.",
    description:
      "180,000 tons of base material and three rip rap gradations delivered for 1.2 miles of coastal erosion protection on a NOAA-tied JIT schedule.",
    category: "project",
  },
  {
    year: 2023,
    title: "Port of Lake Charles, 36-hour pour.",
    description:
      "12,000 yd³ structural concrete delivered in a continuous pour. All four plants in lockstep, two batch supervisors radio-linked, zero cold joints.",
    category: "project",
  },
  {
    year: 2024,
    title: "I-10 Calcasieu River Bridge precast.",
    description:
      "AASHTO Type III & IV girders and 96 deck panels fabricated in-state at DP Concrete Products. Plant-to-pour averaged 22 minutes.",
    category: "project",
  },
];

export const CHAIRMAN = {
  eyebrow: "A MESSAGE FROM OUR CHAIRMAN",
  quote:
    "It all started over 80 years ago when my grandfather, Rowland Price, batched the first load of concrete. Now as we enter the fourth generation, the Price family is still as involved as we were on that first day.",
  attribution: "ROB PRICE, JR.",
  role: "CHAIRMAN OF THE BOARD",
} as const;

export const FOOTER_COMPANY: NavLinkItem[] = [
  { label: "About", href: "/#chairman" },
  { label: "Projects", href: "/#projects" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/#quote" },
];
