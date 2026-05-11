"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Download } from "lucide-react";

import {
  DIVISION_LABELS,
  DIVISION_LEGAL_NAMES,
  DIVISION_NUMBERS,
  type Project,
} from "@/lib/projects";

const EASE = [0.16, 1, 0.3, 1] as const;

interface ProjectScopeProps {
  project: Project;
}

/**
 * Spec-sheet style scope detail block, dark theme.
 *
 * Each scope entry renders as a row: division number + name on the left,
 * vertical mono product list on the right. Bottom of the section has a
 * download-spec-sheet stub link.
 *   // TODO: generate PDF
 */
export function ProjectScope({ project }: ProjectScopeProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="scope-heading"
      className="relative bg-base py-16 text-primary sm:py-24 lg:py-36"
    >
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <div className="mb-14 grid gap-8 lg:mb-20 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5 text-accent">
              What Dunham Price Supplied
            </p>
            <h2
              id="scope-heading"
              className="display-section max-w-[18ch] text-primary"
            >
              The full scope. Itemized.
            </h2>
          </div>
          <p className="max-w-[44ch] text-base leading-relaxed text-primary/85 lg:col-span-4">
            Every product line we contributed to {project.title}, organized by
            division.
          </p>
        </div>

        {/* Spec sheet */}
        <div className="border-y border-line">
          {project.scope.map((entry, i) => {
            const num = DIVISION_NUMBERS[entry.division];
            const name = DIVISION_LABELS[entry.division];
            const legal = DIVISION_LEGAL_NAMES[entry.division];
            return (
              <motion.div
                key={`${entry.division}-${i}`}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: 16 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.08,
                  ease: EASE,
                }}
                className={`grid grid-cols-1 gap-8 py-10 sm:py-14 lg:grid-cols-12 lg:gap-12 lg:py-16 ${
                  i > 0 ? "border-t border-line" : ""
                }`}
                data-print-row
              >
                {/* Left: division marker */}
                <div className="lg:col-span-5">
                  <div className="flex items-baseline gap-5">
                    <span
                      aria-hidden="true"
                      className="font-display text-[clamp(3rem,5vw,4.5rem)] font-black leading-[0.85] tracking-tight text-accent"
                    >
                      {num}
                    </span>
                    <div>
                      <h3 className="font-display text-3xl font-bold uppercase leading-tight tracking-tight text-primary sm:text-4xl">
                        {name}
                      </h3>
                      <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                        {legal}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: product checklist */}
                <div className="lg:col-span-7">
                  <p className="mb-4 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted">
                    Products supplied
                  </p>
                  <ul className="space-y-3">
                    {entry.products.map((p) => (
                      <li
                        key={p}
                        className="flex items-baseline gap-4 border-b border-line/60 pb-3"
                      >
                        <Check
                          aria-hidden
                          className="size-3.5 shrink-0 translate-y-0.5 text-accent"
                          strokeWidth={3}
                        />
                        <span className="flex-1 font-display text-lg font-bold uppercase leading-tight tracking-tight text-primary sm:text-xl">
                          {p}
                        </span>
                        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
                          Supplied
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer: PDF download stub */}
        <div
          data-print-hide
          className="mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
            Document ID — {project.slug.toUpperCase()}-{project.year}
          </p>
          {/* PDF download.
              The PDF generation pipeline isn't built yet, but a dead
              `<a href="#">` was lying to the user about a working
              download. Disabled <button> with explanatory mono caption
              keeps the design intent (here is where the spec sheet will
              live) without faking the affordance.
              // TODO: wire to /api/projects/[slug]/spec.pdf when the
              renderer ships. */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Spec sheet PDF coming soon"
            className="group inline-flex cursor-not-allowed items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted/70"
          >
            <Download aria-hidden className="size-3.5" />
            Spec sheet (PDF) · coming soon
          </button>
        </div>
      </div>
    </section>
  );
}
