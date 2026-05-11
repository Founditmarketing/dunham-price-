"use client";

import { motion, useReducedMotion } from "framer-motion";

import { CERTIFICATIONS } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Condensed credentials band slotted directly under the hero.
 *
 * Establishes credibility above the fold without competing with the headline
 * or stealing weight from the bigger Certifications cream section lower in
 * the page. Reads as a spec rail, not a logo wall.
 *
 * Behavior:
 *   - Reveals on view with a soft stagger; respects reduced motion.
 *   - Each acronym carries a tooltip-style title attribute with the full org
 *     name for screen readers and hover.
 *   - Snaps tight to whichever section follows, so the hairline at the
 *     bottom doubles as a divider.
 */
export function TrustStrip() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-label="Industry credentials"
      className="relative border-y border-line/70 bg-base"
    >
      <div className="mx-auto flex max-w-[1480px] flex-col items-start gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-10 sm:py-6">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-muted">
          <span className="text-accent">Member</span>
          <span aria-hidden className="mx-2 text-primary/30">
            /
          </span>
          ASTM compliant. PCI Level II &amp; III personnel on staff.
        </p>

        <motion.ul
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="-mx-3 flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-7"
        >
          {CERTIFICATIONS.map((c, i) => (
            <motion.li
              key={c.abbr}
              initial={
                prefersReducedMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 6 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
              className="flex items-center gap-3 px-3"
            >
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="hidden h-3 w-px bg-primary/15 sm:block"
                />
              )}
              <span
                title={c.full}
                className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em] text-primary/55 transition-colors duration-300 hover:text-primary"
              >
                {c.abbr}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
