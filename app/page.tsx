import { Certifications } from "@/components/Certifications";
import { ChairmanQuote } from "@/components/ChairmanQuote";
import { DivisionGrid } from "@/components/DivisionGrid";
import { DivisionMarquee } from "@/components/DivisionMarquee";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { LocationsMap } from "@/components/LocationsMap";
import { Nav } from "@/components/Nav";
import { OperationalTicker } from "@/components/OperationalTicker";
import { PourStat } from "@/components/PourStat";
import { ProjectsStrip } from "@/components/ProjectsStrip";
import { QuoteCTA } from "@/components/QuoteCTA";
import { ScrollChoreography } from "@/components/ScrollChoreography";
import { StatBar } from "@/components/StatBar";
import { Timeline } from "@/components/Timeline";
import { TrustStrip } from "@/components/TrustStrip";

export default function HomePage() {
  return (
    <>
      <Nav />
      <ScrollChoreography />

      {/* Reordered per design review:
          Hero → TrustStrip (above-fold credentials) → Stats (proof beat) →
          Timeline (heritage moment, replaces the small mixer rail) →
          Chairman (human/story warm-up) → Capabilities → PourStat
          (interstitial proof beat) → Marquee → Projects → Locations →
          Certifications → CTA.
          The Timeline owns the heritage beat now: a real horizontal-scroll
          milestone track from the 1939 founding through the latest
          delivered pour, so the brand's #1 differentiator (4 generations,
          86 years) gets a deserved moment instead of one inline rail. */}
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <TrustStrip />
        <StatBar />
        <Timeline />
        <ChairmanQuote />
        <DivisionGrid />

        {/* Inter-section interstitial: turns the gap between capabilities
            and case studies into a single proof beat. Pulls the most
            quantifiable pour from the project catalog and lands it as a
            massive number with a pour-rule animation, giving the eye
            something to do between the brand's "what we do" and "what
            we've delivered." */}
        <PourStat
          eyebrow="Latest pour"
          value="12,000"
          numeric={12000}
          unit="yd³"
          claim="Delivered in a 36-hour continuous pour. All four plants in lockstep, two batch supervisors radio-linked to the dock, every fifth load tested. Zero cold joints."
          source={{
            label: "Port of Lake Charles · 2023",
            href: "/projects/port-of-lake-charles-expansion",
          }}
        />

        <DivisionMarquee />
        <ProjectsStrip />

        {/* Operational snapshot.
            Bridges the work shown above (case studies) with the geography
            shown below (yards on the map). The buyer's mental model goes
            "here's what they've built → here's how the system runs today
            → here's where the four yards are," which lines up with how a
            specifier evaluates a vendor: capability, then operational
            posture, then proximity. */}
        <OperationalTicker />

        <LocationsMap />
        <Certifications />
        <QuoteCTA />
      </main>

      <Footer />
    </>
  );
}
