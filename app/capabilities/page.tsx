import type { Metadata } from "next";

import { CapabilitiesHero } from "@/components/CapabilitiesHero";
import { ConcreteCalculator } from "@/components/ConcreteCalculator";
import { CrossSellStrip } from "@/components/CrossSellStrip";
import { DivisionNav } from "@/components/DivisionNav";
import { DivisionSection } from "@/components/DivisionSection";
import { Footer } from "@/components/Footer";
import { HazardStripe } from "@/components/HazardStripe";
import { Nav } from "@/components/Nav";
import { QualityBand } from "@/components/QualityBand";
import { QuoteCTA } from "@/components/QuoteCTA";
import { CAPABILITIES } from "@/lib/capabilities";

export const metadata: Metadata = {
  title:
    "Capabilities — Concrete, Precast, Aggregates | Dunham Price Group",
  description:
    "Four divisions, ~25 product lines. Ready Mix, Precast, Aggregates, and South Coast Materials — engineered to ACI, PCI, TX DOT, and LA DOTD standards across Southwest Louisiana since 1939.",
};

export default function CapabilitiesPage() {
  return (
    <>
      <Nav />

      <main id="main" tabIndex={-1} className="outline-none">
        <CapabilitiesHero />

        <DivisionNav />

        {CAPABILITIES.map((division, i) => (
          <div key={division.slug}>
            <DivisionSection division={division} />
            {/* Hazard-stripe transition between adjacent divisions of
                differing themes — keeps the cream/dark cuts deliberate.
                Hidden from print via the global @media print rule that
                targets .hazard-stripe / .hazard-stripe-soft. */}
            {i < CAPABILITIES.length - 1 &&
              division.theme !== CAPABILITIES[i + 1]!.theme && (
                <HazardStripe
                  height={12}
                  from={i % 2 === 0 ? "right" : "left"}
                />
              )}
          </div>
        ))}

        <ConcreteCalculator />
        <QualityBand />
        <CrossSellStrip />
        <QuoteCTA />
      </main>

      <Footer />
    </>
  );
}
