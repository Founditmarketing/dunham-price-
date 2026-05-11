import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { HazardStripe } from "@/components/HazardStripe";
import { Nav } from "@/components/Nav";
import { ProjectsIndex } from "@/components/ProjectsIndex";
import { QuoteCTA } from "@/components/QuoteCTA";
import { PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects — Dunham Price Group",
  description:
    "Bridges, ports, LNG facilities, and slabs. Selected case studies of concrete, precast, and aggregates work delivered across Southwest Louisiana since 1939.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsIndexPage() {
  return (
    <>
      <a
        href="#projects-index-heading"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.18em] focus:text-ink"
      >
        Skip to projects
      </a>

      <Nav />

      <main id="main">
        {/* Compact header — single column, no media. Lets the grid breathe. */}
        <section
          aria-label="Projects header"
          className="relative bg-base pb-12 pt-32 text-primary sm:pb-16 sm:pt-40 lg:pb-20"
        >
          <div className="mx-auto grid max-w-[1480px] gap-10 px-6 sm:px-10 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-8">
              <p className="eyebrow mb-6 inline-flex items-center gap-3 text-accent">
                <span aria-hidden className="block h-px w-8 bg-accent" />
                Selected Work
              </p>
              <h1 className="font-display text-[clamp(3.5rem,9vw,7rem)] font-black uppercase leading-[0.86] tracking-tight text-primary">
                Heavy work. <br />
                <span className="text-accent">Done right.</span>
              </h1>
            </div>

            <div className="lg:col-span-4 lg:pb-2">
              <p className="max-w-[44ch] text-base leading-relaxed text-primary/80 sm:text-lg">
                Bridges, ports, LNG facilities. Selected case studies of
                concrete, precast, and aggregate work delivered across
                Southwest Louisiana since 1939.
              </p>
            </div>
          </div>
        </section>

        <HazardStripe height={10} from="left" />

        <ProjectsIndex projects={PROJECTS} />

        <QuoteCTA />
      </main>

      <Footer />
    </>
  );
}
