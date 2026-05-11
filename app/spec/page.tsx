import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { QuoteCTA } from "@/components/QuoteCTA";
import { SpecBuilder } from "@/components/SpecBuilder";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Find your spec",
  description: `Match your application, target compressive strength, and pour conditions to the right ${SITE.shortName} mix design. Starting-point recommendation grounded in our actual catalog; QC tunes the design before the pour.`,
  alternates: { canonical: "/spec" },
  keywords: [
    "concrete mix design",
    "ready mix selector",
    "PSI slump aggregate",
    "concrete spec sheet",
    "Louisiana concrete supplier",
    "Calcasieu Parish ready mix",
  ],
};

/**
 * Mix-spec selector page. Hosts the SpecBuilder client component; closes
 * with a QuoteCTA so a buyer who doesn't want to use the tool can still
 * convert from the bottom of the page.
 *
 * The QuoteCTA's headline is overridden to acknowledge the spec context
 * ("Pour day on the calendar?") instead of the generic homepage prompt.
 */
export default function SpecPage() {
  return (
    <>
      <Nav />

      <main id="main" tabIndex={-1} className="outline-none">
        <SpecBuilder />

        <QuoteCTA
          id="quote"
          headline={
            <>
              Pour day <br className="sm:hidden" /> on the calendar?
            </>
          }
          subhead="Send the spec from above and dispatch will route it to the nearest yard with availability. Same-day quotes on standard mixes."
          service="ready-mix"
        />
      </main>

      <Footer />
    </>
  );
}
