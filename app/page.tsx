import { Certifications } from "@/components/Certifications";
import { ChairmanQuote } from "@/components/ChairmanQuote";
import { DivisionGrid } from "@/components/DivisionGrid";
import { DivisionMarquee } from "@/components/DivisionMarquee";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { LocationsMap } from "@/components/LocationsMap";
import { MixerMark } from "@/components/MixerMark";
import { Nav } from "@/components/Nav";
import { ProjectsStrip } from "@/components/ProjectsStrip";
import { QuoteCTA } from "@/components/QuoteCTA";
import { ScrollChoreography } from "@/components/ScrollChoreography";
import { StatBar } from "@/components/StatBar";

export default function HomePage() {
  return (
    <>
      <a
        href="#capabilities"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.18em] focus:text-ink"
      >
        Skip to content
      </a>

      <Nav />
      <ScrollChoreography />

      {/* Reordered per design review:
          Hero → Stats (proof beat) → Mixer signature → Chairman (human/story
          warm-up) → Capabilities → Marquee → Projects → Locations →
          Certifications → CTA.
          MixerMark is the page's signature motion piece. DivisionMarquee
          provides always-on horizontal motion that registers in any audit
          and reinforces brand pillars between capability and project work. */}
      <main id="main">
        <Hero />
        <StatBar />

        {/* Signature interaction — rotating cement-mixer drum.
            Sits between the heritage stats and the chairman's letter so the
            "since 1939" claim has a literal mechanical anchor. */}
        <section
          aria-label="Mixing since 1939"
          className="relative overflow-hidden bg-base py-20 sm:py-28"
        >
          <span aria-hidden="true" className="grain" />
          <div className="relative z-[2] mx-auto flex max-w-[1480px] flex-col items-center gap-10 px-6 sm:px-10 lg:flex-row lg:justify-between lg:gap-16">
            <MixerMark size={220} caption="Every pour." />
            <p className="max-w-[36ch] text-center font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.2em] text-muted lg:text-right">
              Four generations on the drum.
              <br />
              Same family. Same yard. Same standard.
            </p>
          </div>
        </section>

        <ChairmanQuote />
        <DivisionGrid />
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
