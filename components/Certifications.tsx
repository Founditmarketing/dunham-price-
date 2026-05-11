"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { CERTIFICATIONS } from "@/lib/content";
import { EASE } from "@/lib/motion";

/**
 * Abstract industrial mark per certification.
 *
 * NOTE: real licensed logo SVGs would be ideal here — `// TODO: replace with
 * licensed logo SVG`. These are intentionally generic monoline glyphs (cone,
 * stack, drum, chevron, frame, hex) chosen to give each tile visual variety
 * without mimicking the protected marks.
 */
const CERT_GLYPHS: Record<string, ReactNode> = {
  ACI: (
    // Slump cone — universal symbol of concrete QC.
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 4 L15 4 L18 20 L6 20 Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 20 L18 20" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  PCI: (
    // Stacked precast pieces.
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="6" width="8" height="12" stroke="currentColor" strokeWidth="1.4" />
      <rect x="13" y="6" width="8" height="12" stroke="currentColor" strokeWidth="1.4" />
      <line x1="11" y1="6" x2="13" y2="18" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  NRMCA: (
    // Mixer drum (concentric rings).
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  CAAL: (
    // Stacked aggregate chevrons.
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 19 L12 5 L21 19" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 14 L12 9 L19 14" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  AGC: (
    // Open angle / corner brace.
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 3 L21 3 L21 21" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 3 L3 21 L21 21" stroke="currentColor" strokeWidth="1.4" opacity="0.4" />
    </svg>
  ),
  ABC: (
    // Hexagon plate — credentialing motif.
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3 L20 7.5 L20 16.5 L12 21 L4 16.5 L4 7.5 Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
};

export function Certifications() {
  const prefersReducedMotion = useReducedMotion();
  const year = new Date().getFullYear();

  return (
    <section
      aria-labelledby="certs-heading"
      className="relative bg-cream py-16 text-ink sm:py-24 lg:py-36"
    >
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6 text-ink/70">Certified &amp; Accredited</p>
            <h2 id="certs-heading" className="display-section text-ink">
              Quality control that meets every standard.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="max-w-[58ch] text-base leading-relaxed text-ink/85 sm:text-lg">
              Our QC procedures and laboratories adhere to ACI, PCI, Texas DOT,
              and Louisiana DOTD guidelines. Management is Level&nbsp;II and
              Level&nbsp;III PCI-certified.
            </p>
          </div>
        </div>

        {/* Credential plate grid.
            Each tile carries an abstract mark + abbreviation + member meta.
            // TODO: replace abstract glyphs with licensed logo SVGs when
            available. */}
        <ul className="mt-16 grid grid-cols-2 gap-px bg-ink/15 sm:grid-cols-3 lg:mt-20 lg:grid-cols-6">
          {CERTIFICATIONS.map((c, i) => {
            const glyph = CERT_GLYPHS[c.abbr];
            return (
              <motion.li
                key={c.abbr}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: 12 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
                className="group relative flex aspect-[4/5] flex-col items-stretch justify-between bg-cream p-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-cream-2 sm:p-5"
              >
                {/* Top: index + member year */}
                <div className="flex items-center justify-between font-mono text-[0.55rem] uppercase tracking-[0.22em] text-ink/55">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>Mem · {year}</span>
                </div>

                {/* Center: glyph + abbreviation */}
                <div className="flex flex-col items-center justify-center gap-3">
                  {glyph && (
                    <span className="block size-9 text-ink/85 transition-colors duration-500 group-hover:text-accent sm:size-10">
                      {glyph}
                    </span>
                  )}
                  <span className="font-display text-3xl font-black leading-none tracking-tight text-ink sm:text-4xl">
                    {c.abbr}
                  </span>
                </div>

                {/* Bottom: full name caption */}
                <div className="text-center font-mono text-[0.55rem] uppercase leading-tight tracking-[0.16em] text-ink/55">
                  {c.full}
                </div>

                {/* Hover hairline */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink/55">
          <span>QC Lab — Westlake</span>
          <span aria-hidden>·</span>
          <span>Level II / III PCI Personnel</span>
          <span aria-hidden>·</span>
          <span>ASTM Compliant</span>
        </div>
      </div>
    </section>
  );
}
