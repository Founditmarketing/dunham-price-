import type { Metadata } from "next";
import { Big_Shoulders, Inter, JetBrains_Mono } from "next/font/google";

import { MobileBottomBar } from "@/components/MobileBottomBar";
import { LOCATIONS, SITE } from "@/lib/content";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-display-src",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body-src",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = "https://dunhamprice.com";

export const metadata: Metadata = {
  title: {
    default:
      "Dunham Price Group — Concrete, Precast & Aggregates Since 1939",
    template: "%s — Dunham Price Group",
  },
  description:
    "Four generations. Four divisions. One standard. Concrete, precast, and aggregates engineered for Southwest Louisiana since 1939.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  keywords: [
    "ready mix concrete",
    "precast concrete",
    "bridge girders",
    "aggregates",
    "rip rap",
    "Southwest Louisiana",
    "Calcasieu Parish",
    "Lake Charles",
    "Westlake LA",
    "PCI certified",
    "Louisiana DOTD",
  ],
  authors: [{ name: SITE.name }],
  applicationName: SITE.name,
  openGraph: {
    title: "Dunham Price Group — Since 1939",
    description:
      "Concrete, precast, and aggregates engineered for Southwest Louisiana since 1939.",
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE.name,
    // TODO: replace with real OG image (1200×630, branded)
    images: [
      {
        url: "/hero-poster.svg",
        width: 1200,
        height: 630,
        alt: "Dunham Price Group — Concrete, Precast & Aggregates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dunham Price Group — Since 1939",
    description:
      "Concrete, precast, and aggregates engineered for Southwest Louisiana since 1939.",
    images: ["/hero-poster.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

/**
 * Postal code lookup for the four yards. Pulled from the standard USPS
 * coverage of each town; not stored on `LOCATIONS` so the homepage UI keeps
 * a leaner shape, but surfaced here so the LocalBusiness schema is complete
 * enough for Google's local pack.
 */
const POSTAL_BY_ID: Record<string, string> = {
  westlake: "70669",
  "lake-charles": "70601",
  sulphur: "70663",
  ragley: "70657",
};

/**
 * Schema.org JSON-LD: Organization + four LocalBusiness departments.
 * Half of regional B2B SEO is invisible work like this; for a concrete
 * supplier whose customers Google "ready mix near me," the local pack
 * placement is more valuable than any homepage copy change.
 */
function buildJsonLd(): string {
  const yards = LOCATIONS.map((l) => ({
    "@type": ["LocalBusiness", "GeneralContractor"],
    "@id": `${SITE_URL}/#yard-${l.id}`,
    name: `${SITE.name} — ${l.city} Yard`,
    parentOrganization: { "@id": `${SITE_URL}/#org` },
    address: {
      "@type": "PostalAddress",
      streetAddress: l.address,
      addressLocality: l.city,
      addressRegion: l.state,
      postalCode: POSTAL_BY_ID[l.id] ?? undefined,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: l.coords[1],
      longitude: l.coords[0],
    },
    telephone: `+1${(l.phone ?? SITE.phone).replace(/\D/g, "")}`,
    openingHoursSpecification: l.hours
      ? {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "06:00",
          closes: "17:00",
        }
      : undefined,
    areaServed: {
      "@type": "AdministrativeArea",
      name: SITE.region,
    },
  }));

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: SITE.name,
        alternateName: SITE.shortName,
        url: SITE_URL,
        foundingDate: String(SITE.founded),
        slogan: SITE.tagline,
        telephone: `+1${SITE.phone.replace(/\D/g, "")}`,
        areaServed: { "@type": "AdministrativeArea", name: SITE.region },
        department: yards.map((y) => ({ "@id": y["@id"] })),
        sameAs: [
          // TODO: real social profiles when available
        ],
      },
      ...yards,
    ],
  };

  return JSON.stringify(graph);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <head>
        {/*
          SSR rescue: framer-motion's `initial={{ opacity: 0, y: ... }}` ships
          inline `style="opacity:0;transform:..."` to the static HTML. With JS,
          the IntersectionObserver-driven reveals run normally. Without JS,
          those inline styles would leave content invisible. This noscript
          override forces them visible for crawlers, no-JS clients, and any
          headless tooling that snapshots before JS hydrates.
        */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        {/* Local SEO. Organization + four yards as LocalBusiness departments
            so each yard surfaces in Google's local pack with its own
            phone, hours, and geo. dangerouslySetInnerHTML is the standard
            and safe way to ship JSON-LD: the payload is built from typed
            data, never user input. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildJsonLd() }}
        />
      </head>
      <body className="bg-base text-primary font-body min-h-screen">
        {children}
        <MobileBottomBar />
      </body>
    </html>
  );
}
