/**
 * Mix-spec recommendation engine.
 *
 * Pure (non-React) module: maps a buyer's inputs (application, target
 * compressive strength, slump, environmental conditions) to a recommended
 * primary product + zero-or-more relevant admixture / additive lines from
 * the actual catalog in `lib/capabilities.ts`.
 *
 * This is a starting-point tool, not a stamped mix design. The UI surfaces
 * the recommendation alongside a "Confirm with QC" callout, and the
 * `getMixRecommendation` return carries a `custom: true` flag whenever the
 * inputs land outside the standard recommendation matrix so the UI can
 * route those buyers straight to the QC team instead of guessing.
 *
 * No external dependencies. Easy to unit test if/when we add a test runner.
 */

import { CAPABILITIES, type CapabilityProduct } from "@/lib/capabilities";

export type SpecApplication =
  | "slab"
  | "footing"
  | "column"
  | "mezzanine"
  | "pipe-bedding"
  | "pavement"
  | "structural"
  | "custom";

export type SpecCondition =
  | "hot-weather"
  | "cold-weather"
  | "coastal"
  | "decorative"
  | "pumpable"
  | "high-strength";

export interface SpecInputs {
  application: SpecApplication;
  /** Compressive strength in PSI. UI snaps to 500 increments 2500–6000. */
  psi: number;
  /** Target slump in inches. UI snaps to 0.5 increments 2–8. */
  slump: number;
  /** Environmental / pour conditions, multi-select. */
  conditions: SpecCondition[];
}

export interface SpecRecommendationLine {
  /** Product id from lib/capabilities.ts (ready-mix division). */
  productId: string;
  /** Display name (denormalized so the UI doesn't need a second lookup). */
  productName: string;
  /** One-sentence reason this line was added. */
  reason: string;
}

export interface SpecMixDesign {
  psi: number;
  slumpLabel: string;
  aggregate: string;
  /** Approximate water-cement ratio for the chosen PSI. */
  wcRatio: string;
  /** Approximate cement content in 94 lb sacks per yd³. */
  sacksPerYd3: string;
  /** Free-form mix notes (air entrainment, pour-day reminders). */
  notes: string[];
}

export interface SpecRecommendation {
  primary: SpecRecommendationLine;
  additions: SpecRecommendationLine[];
  mixDesign: SpecMixDesign;
  /**
   * True when at least one input is outside the standard matrix
   * (uncommon application, sub-2500 / 6000+ PSI, slump < 2 or > 8).
   * The UI uses this to flag the recommendation as a starting point and
   * push a stronger "Talk to QC" CTA.
   */
  custom: boolean;
}

/* -------------------------------------------------------------------------- */
/* Application catalog (UI-friendly labels + descriptions)                     */
/* -------------------------------------------------------------------------- */

export const APPLICATIONS: ReadonlyArray<{
  id: SpecApplication;
  label: string;
  hint: string;
}> = [
  { id: "slab", label: "Slab on grade", hint: "Driveways, garage floors, patios" },
  { id: "footing", label: "Footing", hint: "Strip & spread footings" },
  { id: "column", label: "Column", hint: "Round columns, piers" },
  { id: "structural", label: "Structural", hint: "Walls, beams, decks" },
  { id: "mezzanine", label: "Mezzanine deck", hint: "Elevated, dead-load sensitive" },
  { id: "pavement", label: "Pavement", hint: "Roadways, parking lots" },
  { id: "pipe-bedding", label: "Pipe bedding", hint: "Non-structural fill" },
  { id: "custom", label: "Something else", hint: "Talk to QC for a custom design" },
] as const;

export const CONDITIONS: ReadonlyArray<{
  id: SpecCondition;
  label: string;
  hint: string;
}> = [
  { id: "hot-weather", label: "Hot weather pour", hint: "Above ~85°F at the dock" },
  { id: "cold-weather", label: "Cold weather pour", hint: "Below ~50°F at the dock" },
  { id: "coastal", label: "Coastal / salt exposure", hint: "Marine, brackish, de-icing salt" },
  { id: "decorative", label: "Decorative finish", hint: "Integral color or stamped" },
  { id: "pumpable", label: "Pump placement", hint: "High-rise, hard-to-reach pours" },
  { id: "high-strength", label: "High-strength priority", hint: "5000+ PSI structural" },
] as const;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const READY_MIX = CAPABILITIES.find((d) => d.slug === "ready-mix");

/** Look up a real product by id, with a typed fallback if it's missing. */
function product(id: string): CapabilityProduct {
  const p = READY_MIX?.products.find((x) => x.id === id);
  if (!p) {
    // Should never happen at runtime; defensive so the recommendation
    // surface never crashes if the catalog drifts.
    return {
      id,
      name: id,
      description: "",
    };
  }
  return p;
}

function line(id: string, reason: string): SpecRecommendationLine {
  const p = product(id);
  return { productId: id, productName: p.name, reason };
}

/** Approximate water-cement ratio for common PSI bands. ACI 211-style. */
function wcRatioFor(psi: number): string {
  if (psi >= 6000) return "0.40";
  if (psi >= 5000) return "0.42";
  if (psi >= 4500) return "0.44";
  if (psi >= 4000) return "0.46";
  if (psi >= 3500) return "0.48";
  if (psi >= 3000) return "0.52";
  return "0.55";
}

/** Approximate cement content (94 lb sacks / yd³) for common PSI bands. */
function sacksFor(psi: number): string {
  if (psi >= 6000) return "7.5";
  if (psi >= 5000) return "6.5";
  if (psi >= 4500) return "6.2";
  if (psi >= 4000) return "5.8";
  if (psi >= 3500) return "5.5";
  if (psi >= 3000) return "5.0";
  return "4.5";
}

/** Pretty-print a slump in inches. */
function slumpLabel(slump: number): string {
  // Half-inch precision is plenty for spec readout.
  const rounded = Math.round(slump * 2) / 2;
  return `${rounded.toFixed(rounded % 1 === 0 ? 0 : 1)} in`;
}

/** Recommended aggregate gradation for the chosen application. */
function aggregateFor(app: SpecApplication): string {
  switch (app) {
    case "column":
    case "mezzanine":
      return '#67 (½" – ⅜")';
    case "pavement":
    case "structural":
      return '#57 (¾" – ½")';
    case "pipe-bedding":
      return "Flow fill (no coarse aggregate)";
    case "footing":
    case "slab":
    default:
      return '#57 (¾" – ½")';
  }
}

/* -------------------------------------------------------------------------- */
/* Core recommendation                                                         */
/* -------------------------------------------------------------------------- */

const STD_PSI_MIN = 2500;
const STD_PSI_MAX = 6000;
const STD_SLUMP_MIN = 2;
const STD_SLUMP_MAX = 8;

export function getMixRecommendation(inputs: SpecInputs): SpecRecommendation {
  const { application, psi, slump, conditions } = inputs;
  const has = (c: SpecCondition) => conditions.includes(c);

  // Primary product. The application drives the base mix; conditions stack
  // as additions, not substitutions.
  let primary: SpecRecommendationLine;

  if (application === "mezzanine") {
    primary = line(
      "lightweight-concrete",
      "Reduced dead load for elevated decks; full structural performance per ASTM C330.",
    );
  } else if (application === "pipe-bedding") {
    primary = line(
      "flow-fill",
      "Non-structural controlled low-strength material. Self-leveling, easy re-excavation.",
    );
  } else if (application === "custom") {
    primary = line(
      "ready-mix-concrete",
      "Starting from our standard mix. QC will tune the design to your spec.",
    );
  } else {
    primary = line(
      "ready-mix-concrete",
      `Standard ${psi.toLocaleString()} PSI mix at ${slumpLabel(slump)} slump, batched and dispatched from the nearest of our four yards.`,
    );
  }

  // Additions. De-duplicated by reason text so two paths to the same
  // admixture produce one line, not two.
  const additions: SpecRecommendationLine[] = [];

  if (application === "slab" || application === "pavement") {
    additions.push(
      line(
        "fibers",
        "Polypropylene fibers replace welded wire mesh in slabs. Eliminates tie crews and gets you back on schedule.",
      ),
    );
  }

  if (psi >= 5000 || has("high-strength")) {
    additions.push(
      line(
        "admixtures",
        `High-strength admixture for ${Math.max(psi, 5000).toLocaleString()} PSI mixes. Tightens the water-cement ratio without sacrificing workability.`,
      ),
    );
  }

  if (has("hot-weather")) {
    additions.push(
      line(
        "admixtures",
        "Hot-weather slump retention so the mix reaches the dock workable, even on plant-to-pour times stretched by traffic.",
      ),
    );
  }

  if (has("cold-weather")) {
    additions.push(
      line(
        "admixtures",
        "Cold-weather accelerator so set time stays predictable below 50°F.",
      ),
    );
  }

  if (has("coastal")) {
    additions.push(
      line(
        "admixtures",
        "Corrosion-inhibiting admixture, batched into every load. Same one we ran on the I-10 Calcasieu River Bridge precast.",
      ),
    );
  }

  if (has("decorative")) {
    additions.push(
      line(
        "coloring",
        "Integral pigments batched at the plant for color-fast, consistent finish across loads.",
      ),
    );
  }

  if (has("pumpable") && application !== "pipe-bedding") {
    additions.push(
      line(
        "admixtures",
        "Pump-grade admixture pack for placement at the line. Prevents segregation through the boom.",
      ),
    );
  }

  // Mix-design summary.
  const notes: string[] = [];
  if (application !== "pipe-bedding") {
    notes.push("Air-entrained for freeze-thaw durability (4–6%).");
    notes.push("ASTM C94 compliant, batched from any of our four plants.");
  }
  if (has("coastal")) {
    notes.push("Recommend Class C fly ash substitution at 20% to extend service life.");
  }
  if (has("hot-weather")) {
    notes.push("Schedule placement before 10am or after 4pm in summer when possible.");
  }
  if (psi >= 5000) {
    notes.push("Compressive break tests at 7 / 28 days; QC lab on site at Westlake.");
  }

  const mixDesign: SpecMixDesign = {
    psi,
    slumpLabel: slumpLabel(slump),
    aggregate: aggregateFor(application),
    wcRatio: wcRatioFor(psi),
    sacksPerYd3: sacksFor(psi),
    notes,
  };

  const custom =
    application === "custom" ||
    psi < STD_PSI_MIN ||
    psi > STD_PSI_MAX ||
    slump < STD_SLUMP_MIN ||
    slump > STD_SLUMP_MAX;

  return { primary, additions, mixDesign, custom };
}

/* -------------------------------------------------------------------------- */
/* URL encoding (used by the "Request this quote" CTA)                         */
/* -------------------------------------------------------------------------- */

/**
 * Build the quote URL with the current spec encoded as query params, so the
 * dispatch team picks up the load already knowing exactly what was selected.
 * Lives in this module so the encoding stays in sync with the inputs shape.
 *
 * URL structure: `/?service=...#quote`. The query lives on the URL proper
 * (so `useSearchParams()` in QuoteForm reads it cleanly) and the hash
 * scrolls the browser to the QuoteCTA section. The reverse order
 * (`/#quote?...`) puts the query inside the hash where the search params
 * API can't see it, which silently broke the pre-fill before this fix.
 */
export function quoteHrefForSpec(inputs: SpecInputs): string {
  const params = new URLSearchParams({
    service: "ready-mix",
    application: inputs.application,
    psi: String(inputs.psi),
    slump: inputs.slump.toString(),
  });
  if (inputs.conditions.length > 0) {
    params.set("conditions", inputs.conditions.join(","));
  }
  return `/?${params.toString()}#quote`;
}
