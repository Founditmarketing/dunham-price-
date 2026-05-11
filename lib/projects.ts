/**
 * Single source of truth for project case studies.
 *
 * All routes under /projects derive from this module:
 *   - app/projects/page.tsx (filterable index)
 *   - app/projects/[slug]/page.tsx (detail template)
 *
 * The shape mirrors the spec exactly so a CMS migration is a 1:1 mapping.
 *
 * NOTE on imagery: real per-project photography hasn't been shot yet, so
 * every gallery cycles through the existing Dunham Price gallery photos.
 *   // TODO: replace with real project photography
 */

import type { DivisionSlug } from "@/lib/capabilities";

export type ProjectCategory =
  | "bridge"
  | "commercial"
  | "industrial"
  | "infrastructure"
  | "residential";

export interface ProjectMetric {
  /** Pre-formatted display string, e.g. "12,000". */
  value: string;
  /** Trailing unit (e.g. "yd³"). Empty string allowed for unit-less stats. */
  unit: string;
  label: string;
  /** Numeric form used to drive the count-up animation. */
  numeric?: number;
  /**
   * Decimals used while interpolating the count-up. Default 0.
   * Set to 1 for fractional metrics like "1.2 mi".
   */
  decimals?: number;
}

export interface ProjectScopeEntry {
  division: DivisionSlug;
  products: string[];
}

export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
  /** Drives the asymmetric gallery grid. Defaults to `half`. */
  span?: "full" | "half" | "third";
}

export interface ProjectTestimonial {
  quote: string;
  attribution: string;
  role: string;
}

export interface Project {
  slug: string;
  title: string;
  client?: string;
  location: string;
  year: string;
  duration?: string;
  category: ProjectCategory;
  scope: ProjectScopeEntry[];
  hero: ProjectImage;
  /** Elevator-pitch summary, one paragraph. */
  summary: string;
  /** Short, punchy challenge headline rendered above the body. */
  challengeTitle: string;
  challenge: string;
  /** Short, punchy solution headline rendered above the body. */
  solutionTitle: string;
  solution: string;
  metrics: ProjectMetric[];
  gallery: ProjectImage[];
  /** Slugs of related projects. Falls back to same-category siblings. */
  relatedProjects: string[];
  testimonial?: ProjectTestimonial;
}

// Image bank — keep in one place so it's easy to retire when real
// photography lands.
const IMG = {
  precastCanal:
    "https://dunhamprice.com/wp-content/uploads/2025/08/services-_0003_Precast-on-the-Canal.jpg",
  precastCanal2:
    "https://dunhamprice.com/wp-content/uploads/2025/08/services-_0004_Precast-on-the-Canal-2.jpg",
  galleryPage04:
    "https://dunhamprice.com/wp-content/uploads/2025/08/dp-gallery-page-04.jpg",
  gallery05:
    "https://dunhamprice.com/wp-content/uploads/2025/08/dp-gallery-05.jpg",
  aggregates:
    "https://dunhamprice.com/wp-content/uploads/2025/08/services-_0006_Aggregates.jpg",
  concreteHome:
    "https://dunhamprice.com/wp-content/uploads/2025/08/concrete-home.jpg",
  concreteTruck:
    "https://dunhamprice.com/wp-content/uploads/2025/08/services-_0005_Concrete-Truck.jpg",
  precast:
    "https://dunhamprice.com/wp-content/uploads/2025/08/services-_0002_Precast.jpg",
} as const;

export const PROJECTS: Project[] = [
  /* ====================================================================== */
  {
    slug: "i-10-calcasieu-river-bridge",
    title: "I-10 Calcasieu River Bridge",
    client: "Louisiana DOTD",
    location: "Lake Charles, LA",
    year: "2024",
    duration: "18 months",
    category: "bridge",
    scope: [
      {
        division: "precast",
        products: ["Bridge Girders", "Bridge & Deck Panels", "Specialty Precast"],
      },
      {
        division: "ready-mix",
        products: ["Ready Mix Concrete", "Specialty Admixtures"],
      },
    ],
    hero: {
      src: IMG.precastCanal,
      alt: "Precast bridge girders staged on a Calcasieu River canal barge before placement",
    },
    summary:
      "Replacement of the aging I-10 Calcasieu River Bridge required AASHTO Type III & IV girders manufactured to tight tolerances, plus full-span deck panels delivered on a tidal pour schedule. Dunham Price's DP Concrete Products yard fabricated all 28 girders and 96 deck panels in-state, eliminating cross-Gulf transit risk.",
    challengeTitle: "Tidal schedule. Coastal tolerances. No room for slip.",
    challenge:
      "The replacement girders had to land during slack-water pour windows, and the prestressing pattern had to hold tolerance through the Gulf summer thermal cycle. Existing fabricators outside Louisiana would have meant 800+ miles of girder transport on flatbeds — a logistical and quality risk DOTD wasn't willing to absorb. Slump targets were tight, the salt air was unforgiving, and the bridge had to stay open to traffic the entire time.",
    solutionTitle: "Precast in-state. Mix designed for the salt air.",
    solution:
      "Our DP Concrete Products yard, eight miles from the bridge site, fabricated the AASHTO Type III & Type IV girders to spec with a corrosion-inhibiting admixture batched into every load. Loads dispatched on slack-tide windows, deck panels staged for crane sets at first light. Plant-to-pour times averaged 22 minutes. Three QC technicians ran continuous slump and air-content checks at the yard and the dock.",
    metrics: [
      {
        value: "840",
        unit: "LF",
        label: "Bridge Girders Delivered",
        numeric: 840,
      },
      {
        value: "12,000",
        unit: "yd³",
        label: "Structural Concrete",
        numeric: 12000,
      },
      {
        value: "18",
        unit: "MO",
        label: "Project Duration",
        numeric: 18,
      },
      {
        value: "0",
        unit: "",
        label: "Safety Incidents",
        numeric: 0,
      },
    ],
    gallery: [
      {
        src: IMG.precastCanal2,
        alt: "Bridge girder being transported by canal barge to the I-10 site",
        caption: "Girder transport — slack-tide window, July 2024",
        span: "full",
      },
      {
        src: IMG.precastCanal,
        alt: "Crane lifting a precast bridge girder into final position",
        caption: "First-light girder set, eastbound span",
        span: "half",
      },
      {
        src: IMG.galleryPage04,
        alt: "Deck panels staged at the DP Concrete Products yard",
        caption: "Deck panels staged, DP Concrete Products yard",
        span: "half",
      },
      {
        src: IMG.gallery05,
        alt: "Aerial view of the I-10 Calcasieu River Bridge during construction",
        caption: "Eastbound span, mid-construction",
        span: "full",
      },
      {
        src: IMG.precast,
        alt: "Reinforcement cage for a precast girder before pouring",
        caption: "Type III girder cage, pre-pour",
        span: "third",
      },
      {
        src: IMG.concreteHome,
        alt: "Bridge deck pour in progress with concrete trucks queued behind",
        caption: "Continuous deck pour, southbound",
        span: "third",
      },
      {
        src: IMG.concreteTruck,
        alt: "Ready mix truck delivering structural concrete to the bridge site",
        caption: "Plant-to-pour, 22 minute average",
        span: "third",
      },
    ],
    relatedProjects: ["port-of-lake-charles-expansion", "cameron-lng-facility"],
    testimonial: {
      quote:
        "Dunham Price was the only Louisiana fabricator we trusted to hit AASHTO tolerances on every girder, every time. They never missed a tide.",
      attribution: "Marcus Hebert",
      role: "Senior Project Engineer · Louisiana DOTD",
    },
  },

  /* ====================================================================== */
  {
    slug: "port-of-lake-charles-expansion",
    title: "Port of Lake Charles Expansion",
    client: "Lake Charles Harbor & Terminal District",
    location: "Lake Charles, LA",
    year: "2023",
    duration: "9 months",
    category: "industrial",
    scope: [
      {
        division: "ready-mix",
        products: [
          "Ready Mix Concrete",
          "Specialty Admixtures",
          "Polypropylene Fibers",
        ],
      },
    ],
    hero: {
      src: IMG.concreteTruck,
      alt: "Ready mix concrete trucks queued for a continuous structural pour at the Port of Lake Charles",
    },
    summary:
      "12,000 cubic yards of structural ready mix delivered for the Port of Lake Charles dock expansion, batched and dispatched continuously across a 36-hour pour window. All four Dunham Price plants ran in lockstep to keep the slab cold-joint free.",
    challengeTitle: "12,000 yards. 36 hours. No cold joints.",
    challenge:
      "12,000 yd³ in 36 hours is a continuous-pour problem. A break in supply meant a cold joint; a slump miss meant a rejected load. Heat of hydration on a coastal slab pour in July is not a small variable, and the dock had to be in service the following month.",
    solutionTitle: "Four plants, one dispatch radio, every fifth load tested.",
    solution:
      "All four plants ran in lockstep, with two batch supervisors radio-linked to the dock. Polypropylene fibers replaced the welded wire mesh originally specified, eliminating tie crews and saving the GC three days of the schedule. Slump and air content were checked every fifth load. The pour finished four hours ahead of schedule.",
    metrics: [
      { value: "12,000", unit: "yd³", label: "Concrete Delivered", numeric: 12000 },
      { value: "36", unit: "HR", label: "Continuous Pour", numeric: 36 },
      { value: "4", unit: "", label: "Plants Coordinated", numeric: 4 },
      { value: "0", unit: "", label: "Cold Joints", numeric: 0 },
    ],
    gallery: [
      {
        src: IMG.concreteHome,
        alt: "Wide aerial of the Port of Lake Charles dock pour at night",
        caption: "36-hour continuous pour, hour 14",
        span: "full",
      },
      {
        src: IMG.concreteTruck,
        alt: "Ready mix truck unloading at the Port of Lake Charles slab",
        caption: "Truck #6 of 412 — slump check, batch B-08",
        span: "half",
      },
      {
        src: IMG.galleryPage04,
        alt: "Crew finishing the structural slab during the continuous pour",
        caption: "Bull-float pass, shift change",
        span: "half",
      },
      {
        src: IMG.gallery05,
        alt: "Polypropylene fiber bag being added to the truck mix",
        caption: "Polypropylene fiber dose, batch supervisor watching",
        span: "third",
      },
      {
        src: IMG.precastCanal,
        alt: "Dock expansion finished slab with sea wall in the background",
        caption: "Final slab, day after pour completion",
        span: "third",
      },
      {
        src: IMG.aggregates,
        alt: "Aggregate stockpile at the Westlake plant feeding the pour",
        caption: "Westlake plant — aggregate feed",
        span: "third",
      },
    ],
    relatedProjects: ["i-10-calcasieu-river-bridge", "cameron-lng-facility"],
  },

  /* ====================================================================== */
  {
    slug: "cameron-lng-facility",
    title: "Cameron LNG Facility",
    client: "Cameron LNG, LLC",
    location: "Hackberry, LA",
    year: "2022",
    duration: "14 months",
    category: "industrial",
    scope: [
      {
        division: "aggregates",
        products: [
          "#57 Limestone",
          "610 Base Limestone",
          "#10 / #30 / #50 Rip Rap",
        ],
      },
      {
        division: "south-coast",
        products: ["Clean Fill Sand"],
      },
    ],
    hero: {
      src: IMG.aggregates,
      alt: "Loader scooping rip rap aggregate at the Cameron LNG facility",
    },
    summary:
      "Base material and graded rip rap supplied for the Cameron LNG facility expansion, including coastal erosion protection across 1.2 miles of shoreline. Three rip rap gradations were stockpiled in parallel to absorb shifting placement specs without slowing the marine crews.",
    challengeTitle: "Scale, sequencing, and the sea state.",
    challenge:
      "Coastal LNG infrastructure means three things: scale, sequencing, and sea state. Material had to land at the staging yard ahead of every weather window — a late delivery means an idle crane crew at $25,000 a day. Three gradations of rip rap were specified, and the placement specs shifted as the marine engineer's plan responded to bottom conditions.",
    solutionTitle: "JIT off NOAA forecasts. Three gradations, ready at once.",
    solution:
      "Rip rap was pre-staged at our Westlake yard and dispatched on rolling JIT schedules tied to NOAA forecasts. Base material was crushed and loaded directly to barges for marine delivery. Three rip rap gradations were stocked simultaneously to match shifting placement specs. Zero crane crews idled on a Dunham Price delay.",
    metrics: [
      {
        value: "180,000",
        unit: "TON",
        label: "Aggregates Supplied",
        numeric: 180000,
      },
      {
        value: "1.2",
        unit: "MI",
        label: "Shoreline Protected",
        numeric: 1.2,
        decimals: 1,
      },
      {
        value: "3",
        unit: "",
        label: "Rip Rap Gradations",
        numeric: 3,
      },
      {
        value: "14",
        unit: "MO",
        label: "Project Duration",
        numeric: 14,
      },
    ],
    gallery: [
      {
        src: IMG.aggregates,
        alt: "Loader moving rip rap aggregate at the Cameron LNG staging yard",
        caption: "Westlake staging yard, sunrise dispatch",
        span: "full",
      },
      {
        src: IMG.concreteHome,
        alt: "Aggregate stockpile at the Cameron LNG site with marine equipment in the background",
        caption: "Shoreline rip rap stockpile, marine staging in background",
        span: "half",
      },
      {
        src: IMG.gallery05,
        alt: "Rip rap being placed along the Cameron LNG shoreline",
        caption: "#30 rip rap placement, north shoreline segment",
        span: "half",
      },
      {
        src: IMG.galleryPage04,
        alt: "Crushed limestone base material being loaded onto a marine barge",
        caption: "610 base material → barge load, port-side conveyor",
        span: "full",
      },
      {
        src: IMG.precastCanal2,
        alt: "Aerial view of completed shoreline protection along the LNG facility",
        caption: "Shoreline complete — 1.2 miles, three gradations",
        span: "third",
      },
      {
        src: IMG.precastCanal,
        alt: "Aggregate truck with scale ticket at the Cameron LNG receiving yard",
        caption: "Scale ticket QC, receiving yard",
        span: "third",
      },
      {
        src: IMG.concreteTruck,
        alt: "Dunham Price haul truck approaching the Cameron LNG facility entrance",
        caption: "Haul cycle: 35 minutes, plant-to-yard",
        span: "third",
      },
    ],
    relatedProjects: ["i-10-calcasieu-river-bridge", "port-of-lake-charles-expansion"],
  },
];

/**
 * Look up a project by slug. Used by the dynamic detail route.
 * Returns `undefined` so callers can route to `notFound()` themselves.
 */
export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/**
 * Resolve `relatedProjects` slugs into full Project records.
 * Falls back to same-category siblings (excluding the current project)
 * when no related slugs are specified, capped at `limit`.
 */
export function getRelatedProjects(slug: string, limit = 3): Project[] {
  const current = getProject(slug);
  if (!current) return [];

  const related = current.relatedProjects
    .map((s) => getProject(s))
    .filter((p): p is Project => Boolean(p))
    .slice(0, limit);

  if (related.length >= limit) return related;

  // Backfill from same-category siblings.
  const seen = new Set([current.slug, ...related.map((r) => r.slug)]);
  const fallbacks = PROJECTS.filter(
    (p) => !seen.has(p.slug) && p.category === current.category,
  );
  return [...related, ...fallbacks].slice(0, limit);
}

/**
 * Project's index in the canonical list. Powers the hero meta strip
 * (`PROJECT 03 / 12`) and the OG image position.
 */
export function getProjectIndex(slug: string): number {
  return PROJECTS.findIndex((p) => p.slug === slug);
}

/* -------------------------------------------------------------------------- */
/* Display labels — keep adjacent to the data so swap-in stays trivial.        */
/* -------------------------------------------------------------------------- */

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  bridge: "Bridge",
  commercial: "Commercial",
  industrial: "Industrial",
  infrastructure: "Infrastructure",
  residential: "Residential",
};

export const DIVISION_LABELS: Record<DivisionSlug, string> = {
  "ready-mix": "Ready Mix",
  precast: "Precast",
  aggregates: "Aggregates",
  "south-coast": "South Coast",
};

export const DIVISION_NUMBERS: Record<DivisionSlug, string> = {
  "ready-mix": "01",
  precast: "02",
  aggregates: "03",
  "south-coast": "04",
};

export const DIVISION_LEGAL_NAMES: Record<DivisionSlug, string> = {
  "ready-mix": "Dunham Price, LLC",
  precast: "DP Concrete Products, LLC",
  aggregates: "DP Aggregates, LLC",
  "south-coast": "South Coast Materials",
};
