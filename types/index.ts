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
  productLines: number;
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
  /** Optional yard-specific dispatch line. */
  phone?: string;
  /** Optional human-readable hours, e.g. "Mon–Fri · 6a–5p". */
  hours?: string;
  /** Optional rough drive-time radius copy, e.g. "~25 min from Lake Charles". */
  driveTime?: string;
}

export interface Project {
  id: string;
  name: string;
  division: string;
  scope: string;
  image: string;
  imageAlt: string;
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
