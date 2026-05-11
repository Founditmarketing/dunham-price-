/**
 * Domain types for Dunham Price Group homepage.
 * Kept intentionally narrow so a CMS swap (Sanity, Contentful, etc.) can
 * map directly onto these shapes via lib/content.ts.
 */

export type DivisionSlug =
  | "ready-mix"
  | "precast"
  | "aggregates"
  | "south-coast";

export interface Division {
  slug: DivisionSlug;
  name: string;
  /** Total number of product lines this division catalogs on /capabilities. */
  productLines: number;
  /**
   * Curated short list of headline products surfaced on the homepage card.
   * Specifiers scan these to decide in seconds whether to drill in. Keep to
   * 4–5 entries; the full catalog lives on /capabilities.
   */
  lines: string[];
  href: string;
  image: string;
  imageAlt: string;
}

export interface LocationItem {
  id: string;
  city: string;
  state: string;
  address: string;
  /** [longitude, latitude] in decimal degrees, used for the stylized map. */
  coords: [number, number];
  /**
   * 2-letter abbreviation surfaced on the map for non-active yards. Lets
   * three clustered pins identify themselves without their full labels
   * colliding (e.g. "WL" for Westlake, "LC" for Lake Charles).
   */
  code: string;
  /** Optional yard-specific dispatch line. */
  phone?: string;
  /** Optional human-readable hours, e.g. "Mon–Fri · 6a–5p". */
  hours?: string;
  /** Optional rough drive-time radius copy, e.g. "~25 min from Lake Charles". */
  driveTime?: string;
}

/**
 * Compact metric used on the homepage projects strip card.
 * Pre-formatted display string keeps the rendering trivial; the canonical
 * numeric form lives in `lib/projects.ts` for use on the detail pages.
 */
export interface ProjectMetricCompact {
  value: string;
  /** Optional unit (e.g. "yd³", "LF", "MO"). */
  unit?: string;
  label: string;
}

export interface Project {
  id: string;
  name: string;
  division: string;
  scope: string;
  image: string;
  imageAlt: string;
  /** GC partner, owner, or contracting agency. Optional. */
  client?: string;
  /** Project completion year. Optional. */
  year?: string;
  /**
   * Three highest-impact metrics for the homepage card. Keep to three so the
   * card stays a card, not a spec sheet — the full metric grid lives on the
   * project detail page.
   */
  metrics?: ProjectMetricCompact[];
}

export interface Stat {
  value: string;
  /** Optional numeric form for count-up animation. */
  numeric?: number;
  suffix?: string;
  label: string;
}

export interface NavLinkItem {
  label: string;
  href: string;
}

export interface Certification {
  abbr: string;
  full: string;
}

export type TimelineCategory =
  | "founding"
  | "leadership"
  | "division"
  | "project"
  | "expansion";

export interface TimelineMilestone {
  year: number;
  /** Short editorial title rendered in display weight. */
  title: string;
  /** One- or two-sentence description. */
  description: string;
  category: TimelineCategory;
  /**
   * True when the year or story details are best-guess and should be
   * verified by the Price family before launch. Renders a small mono
   * "to confirm" tag on the card so reviewers don't mistake it for fact.
   */
  toConfirm?: boolean;
}
