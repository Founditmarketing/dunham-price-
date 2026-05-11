/**
 * Single source of truth for the /capabilities page.
 *
 * Shape matches the spec — swap `CAPABILITIES` for a CMS query and the
 * page should keep working without component changes.
 *
 * NOTE on imagery: the WordPress origin only has a partial set of per-product
 * photos under /wp-content/uploads/2026/03/. Where a clean photo isn't
 * available we leave `image` undefined and let the card fall back to its
 * editorial spec-block treatment. Marked `// TODO: real product photo` below.
 */

export interface CapabilityProduct {
  id: string;
  name: string;
  description: string;
  /** Sizing or technical spec, rendered in mono yellow (e.g. `¾" – ½"`). */
  spec?: string;
  image?: string;
  applications?: string[];
}

export type DivisionSlug =
  | "ready-mix"
  | "precast"
  | "aggregates"
  | "south-coast";

export interface CapabilityDivision {
  slug: DivisionSlug;
  /** Display number (`01`–`04`). */
  number: string;
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  products: CapabilityProduct[];
  primaryApplications: string[];
  /** Drives card vs. row presentation. */
  layout: "image" | "text";
  /** Section background. Alternates dark / cream per spec. */
  theme: "dark" | "cream";
}

// TODO: real product photo — every entry below uses an editorial
// fallback card. Drop in real per-product photography on `image` when
// available.

export const CAPABILITIES: CapabilityDivision[] = [
  {
    slug: "ready-mix",
    number: "01",
    name: "Ready Mix",
    legalName: "Dunham Price, LLC",
    tagline: "Standard and specialty concrete mixes.",
    description:
      "Standard mixes batched and delivered from our Westlake plant. Specialty mixes engineered for slabs, decks, structural pours, and pre-stressed work across Southwest Louisiana.",
    layout: "text",
    theme: "dark",
    primaryApplications: [
      "Slabs & foundations",
      "Roadways",
      "Mezzanine decks",
      "Structural pours",
    ],
    products: [
      {
        id: "ready-mix-concrete",
        name: "Ready Mix Concrete",
        description:
          "Standard mix for slabs, patios, driveways, foundations, and roadways. Batched to ASTM C94, delivered hot from any of our four plants.",
      },
      {
        id: "flow-fill",
        name: "Flow Fill",
        description:
          "Non-structural controlled low-strength material for pipe bedding and void filling. Self-leveling, low compressive strength, easy re-excavation.",
      },
      {
        id: "grout",
        name: "Grout",
        description:
          "Bonding agent for auger cast installations and specialty applications. Custom flowable grouts available on request.",
      },
      {
        id: "lightweight-concrete",
        name: "Lightweight Concrete",
        description:
          "Engineered for mezzanine decks and elevated deck systems. Reduced dead load with full structural performance.",
      },
      {
        id: "fibers",
        name: "Polypropylene / Steel Fibers",
        description:
          "Structural fiber reinforcements that replace welded wire mesh in slabs and pavements. Improved crack control, faster pour cycles.",
      },
      {
        id: "admixtures",
        name: "Specialty Admixtures",
        description:
          "Modify setting times, improve workability, enhance slump. Hot-weather, cold-weather, and high-strength admixtures stocked on site.",
      },
      {
        id: "coloring",
        name: "Concrete Coloring",
        description:
          "Integral pigments batched at the plant for consistent, color-fast aesthetic applications. Custom blends available.",
      },
    ],
  },
  {
    slug: "precast",
    number: "02",
    name: "Precast",
    legalName: "DP Concrete Products, LLC",
    tagline: "Engineered precast for infrastructure.",
    description:
      "Bridge girders, prestressed pile, and custom precast manufactured at our DP Concrete Products facility. Engineered to ACI and PCI standards for Louisiana DOTD infrastructure work.",
    layout: "text",
    theme: "cream",
    primaryApplications: [
      "Bridge infrastructure",
      "Pile foundations",
      "Storage walls",
      "Custom contractor specs",
    ],
    products: [
      {
        id: "prestressed-pile",
        name: "Prestressed Pile",
        description:
          "Pre-cast square piles driven to grade, transferring loads deep into the ground. Sized to project bearing requirements.",
      },
      {
        id: "specialty-precast",
        name: "Specialty Precast",
        description:
          "Custom precast solutions tailored to contractor specs. Shop drawings, mix design, and stripping schedules handled in-house.",
      },
      {
        id: "bridge-girders",
        name: "Bridge Girders",
        description:
          "Pre-stressed concrete beams for bridge construction across Louisiana. AASHTO and DOTD-approved sections fabricated to project length.",
      },
      {
        id: "deck-panels",
        name: "Bridge & Deck Panels",
        description:
          "Complete precast components for bridge infrastructure. Reduces field forming, accelerates the construction schedule.",
      },
      {
        id: "bin-blocks",
        name: "Concrete Bin Blocks",
        description:
          "2'×2'×6' modular blocks for retaining walls, storage bins, and material separation. Inventory available for immediate pickup.",
      },
    ],
  },
  {
    slug: "aggregates",
    number: "03",
    name: "Aggregates",
    legalName: "DP Aggregates, LLC",
    tagline: "Crushed stone, sand, and rip rap.",
    description:
      "Crushed limestone, washed sand, and rip rap quarried and stockpiled across our four yards. Sized and graded for road base, drainage, paver bedding, and erosion control.",
    layout: "image",
    theme: "dark",
    primaryApplications: [
      "Road base",
      "Drainage",
      "Erosion control",
      "Paver bedding",
    ],
    products: [
      {
        id: "limestone-57",
        name: "#57 Limestone",
        description: "Ground cover, pipe bedding.",
        spec: '¾" – ½"',
      },
      {
        id: "limestone-610",
        name: "610 Base Limestone Gray",
        description: "Roads, parking lots.",
        spec: "road base",
      },
      {
        id: "limestone-67",
        name: "#67 Limestone Gray",
        description: "Top dressing for driveways, paths.",
        spec: '⅜" – ½"',
      },
      {
        id: "limestone-3x15",
        name: "3 × 1½ Limestone Gray",
        description:
          "Erosion control, mud mats, construction entrances.",
        spec: "large",
      },
      {
        id: "limestone-quarter",
        name: "¼ × 0 Limestone Gray",
        description: "Paver bedding, compacted walking paths.",
        spec: '⅛" – ¼"',
      },
      {
        id: "limestone-8",
        name: "#8 Limestone Gray",
        description: "Drainage fill, pipe bedding.",
        spec: "small",
      },
      {
        id: "rip-rap",
        name: "#10 / #30 / #50 Rip Rap Gray",
        description:
          "Coastal and shoreline erosion control. Three sizes graded by application.",
        spec: "erosion control",
      },
      {
        id: "fill-sand",
        name: "Fill Sand",
        description: "Backfill, surface leveling.",
        spec: "fill",
      },
      {
        id: "mason-sand",
        name: "Mason Sand",
        description: "Masonry mortar, fine surface leveling.",
        spec: "fine",
      },
      {
        id: "pea-gravel",
        name: "Pea Gravel",
        description: "Drainage layers, decorative landscaping.",
        spec: "rounded",
      },
    ],
  },
  {
    slug: "south-coast",
    number: "04",
    name: "South Coast",
    legalName: "South Coast Materials",
    tagline: "Specialty sand for construction and asphalt.",
    description:
      "Specialty washed sand for concrete batching, asphalt mixing, and clean fill. Hauled from our South Coast facility serving the Gulf Coast contractor base.",
    layout: "image",
    theme: "cream",
    primaryApplications: [
      "Concrete batching",
      "Asphalt mix",
      "Backfill",
      "Grading",
    ],
    products: [
      {
        id: "clean-fill-sand",
        name: "Clean Fill Sand (Flume)",
        description:
          "Washed, free-draining sand for backfill, grading, and fill applications.",
        spec: "washed",
      },
      {
        id: "concrete-sand",
        name: "Concrete Sand",
        description:
          "Coarse sand for slabs, sidewalks, pavers, and masonry mixes.",
        spec: "coarse",
      },
      {
        id: "asphalt-sand",
        name: "Asphalt Sand",
        description:
          "Fine sand for asphalt mixes, smooth finishes, and consistent compaction.",
        spec: "fine",
      },
    ],
  },
];

/**
 * Quality control checkpoints rendered in the QualityBand mono list.
 * Each is a checkpoint our QC lab verifies on representative loads.
 */
export const QC_CHECKPOINTS = [
  "Temperature",
  "Slump",
  "Permeability",
  "Finish",
  "Compression",
  "Air Content",
] as const;
