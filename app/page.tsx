import { Certifications } from "@/components/Certifications";
import { ChairmanQuote } from "@/components/ChairmanQuote";
import { DivisionGrid } from "@/components/DivisionGrid";
import { DivisionMarquee } from "@/components/DivisionMarquee";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { LocationsMap } from "@/components/LocationsMap";
import { MixerMark } from "@/components/MixerMark";
import { Nav } from "@/components/Nav";
import { PourStat } from "@/components/PourStat";
import { ProjectsStrip } from "@/components/ProjectsStrip";
import { QuoteCTA } from "@/components/QuoteCTA";
import { ScrollChoreography } from "@/components/ScrollChoreography";
import { StatBar } from "@/components/StatBar";
import { TrustStrip } from "@/components/TrustStrip";

export default function HomePage() {
  return (
    <>
      <Nav />
      <ScrollChoreography />

      {/* Reordered per design review:
          Hero → TrustStrip (above-fold credentials) → Stats (proof beat) →
          Mixer signature → Chairman (human/story warm-up) → Capabilities →
          Marquee → Projects → Locations → Certifications → CTA.
          TrustStrip lands a condensed credentials band right under the hero
          so the technical buyer sees ACI / PCI / NRMCA / DOTD before
          scrolling past the fold; the bigger Certifications cream section
          remains the deep credential moment lower in the page. */}
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <TrustStrip />
        <StatBar />

        {/* Signature interaction — rotating cement-mixer drum.
            Sits between the heritage stats and the chairman's letter so the
            "since 1939" claim has a literal mechanical anchor.
            Layout note: vertical padding tightened from py-20/28 → py-12/16
            and the right-rail text now carries a four-generation timeline
            so the drum's rotation reads as the family's continuity made
            literal, not as decoration. */}
        <section
          aria-label="Four generations on the drum"
          className="relative overflow-hidden border-y border-line/60 bg-base py-12 sm:py-16"
        >
          <span aria-hidden="true" className="grain" />
          <div className="relative z-[2] mx-auto grid max-w-[1480px] grid-cols-1 items-center gap-8 px-6 sm:px-10 lg:grid-cols-[auto_1fr] lg:gap-14">
            <div className="flex items-center gap-6 lg:gap-8">
              <MixerMark size={140} caption="Every pour." />
              <div
                aria-hidden
                className="hidden h-28 w-px bg-gradient-to-b from-transparent via-accent/55 to-transparent lg:block"
              />
            </div>

            <div className="flex flex-col gap-4">
              <p className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold uppercase leading-[0.95] tracking-tight text-primary">
                Four generations on the drum.
                <span className="block text-muted">
                  Same family. Same yard. Same standard.
                </span>
              </p>

              {/* Generation rail: each tick is one Price-family generation
                  taking the helm, abstracted to decade-ish anchors so the
                  rotation reads as continuity, not nostalgia. */}
              <ol
                aria-label="Price family generations"
                className="-mx-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-muted"
              >
                {[
                  { year: "1939", who: "Rowland" },
                  { year: "1965", who: "Rob, Sr." },
                  { year: "1989", who: "Rob, Jr." },
                  { year: "2014", who: "Gen IV" },
                ].map((g, i) => (
                  <li key={g.year} className="flex items-center gap-3 px-1">
                    {i > 0 && (
                      <span
                        aria-hidden
                        className="block h-px w-6 bg-accent/45"
                      />
                    )}
                    <span className="tabular-nums text-primary/85">
                      {g.year}
                    </span>
                    <span aria-hidden className="text-accent/65">
                      ·
                    </span>
                    <span>{g.who}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

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
        <LocationsMap />
        <Certifications />
        <QuoteCTA />
      </main>

      <Footer />
    </>
  );
}
