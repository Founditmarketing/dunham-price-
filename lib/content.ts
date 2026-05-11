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
  { label: "Careers", href: "#" },
];

export const HERO = {
  eyebrow: "EST. 1939 — SOUTHWEST LOUISIANA",
  headlineLine1: "THERE'S HISTORY",
  headlineLine2: "IN THE MIX.",
  subhead:
    "Four generations. Four divisions. One standard. Concrete, precast, and aggregates engineered for Southwest Louisiana since 1939.",
  videoSrc:
    "https://dunhamprice.com/wp-content/uploads/2025/09/dunham_price_llc_1-720p.mp4",
  // TODO: replace with real poster frame
  poster: "/hero-poster.svg",
  ctaPrimary: { label: "Request a Quote", href: "#quote" },
  ctaSecondary: { label: "Explore Capabilities", href: "#capabilities" },
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
    href: "/capabilities#ready-mix",
    image:
      "https://dunhamprice.com/wp-content/uploads/2025/08/services-_0005_Concrete-Truck.jpg",
    imageAlt: "Ready mix concrete truck on a Southwest Louisiana job site",
  },
  {
    slug: "precast",
    name: "Precast",
    productLines: 5,
    href: "/capabilities#precast",
    image:
      "https://dunhamprice.com/wp-content/uploads/2025/08/services-_0002_Precast.jpg",
    imageAlt: "Precast concrete elements staged in the Dunham Price yard",
  },
  {
    slug: "aggregates",
    name: "Aggregates",
    productLines: 12,
    href: "/capabilities#aggregates",
    image:
      "https://dunhamprice.com/wp-content/uploads/2025/08/concrete-home.jpg",
    imageAlt: "Aggregate stockpile at a Dunham Price facility",
  },
  {
    slug: "south-coast",
    name: "South Coast Materials",
    productLines: 3,
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
    image:
      "https://dunhamprice.com/wp-content/uploads/2025/08/services-_0005_Concrete-Truck.jpg",
    imageAlt: "Ready mix trucks queued for the Port of Lake Charles pour",
  },
  {
    id: "cameron-lng-facility",
    name: "Cameron LNG Facility",
    division: "Aggregates",
    scope: "Base material & rip rap",
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

export const CHAIRMAN = {
  eyebrow: "A MESSAGE FROM OUR CHAIRMAN",
  quote:
    "It all started over 80 years ago when my grandfather, Rowland Price, batched the first load of concrete. Now as we enter the fourth generation, the Price family is still as involved as we were on that first day.",
  attribution: "ROB PRICE, JR.",
  role: "CHAIRMAN OF THE BOARD",
  cta: { label: "Read the full letter", href: "#" },
} as const;

export const FOOTER_COMPANY: NavLinkItem[] = [
  { label: "About", href: "/#chairman" },
  { label: "Projects", href: "/#projects" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "/#quote" },
];
