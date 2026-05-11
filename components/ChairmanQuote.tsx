"use client";

import { motion, useReducedMotion } from "framer-motion";

import { CHAIRMAN } from "@/lib/content";
import { EASE } from "@/lib/motion";

export function ChairmanQuote() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="chairman"
      aria-labelledby="chairman-heading"
      className="relative overflow-hidden bg-base py-20 sm:py-28 lg:py-40"
    >
      {/* Subtle grain — tactile depth on dark concrete-ish surface */}
      <span aria-hidden="true" className="grain" />

      {/* Faint background numerals — editorial flourish */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 top-1/2 hidden -translate-y-1/2 select-none font-display text-[28rem] font-black leading-none text-elevated lg:block"
      >
        04
      </div>

      <div className="relative mx-auto grid max-w-[1480px] gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-3">
          <p className="eyebrow text-accent">{CHAIRMAN.eyebrow}</p>
          <div className="mt-6 hidden h-px w-16 bg-accent lg:block" />
          <p className="mt-6 hidden font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.18em] text-muted lg:block">
            Letter / 04 <br /> Family Built. <br /> Customer Focused.
          </p>
        </div>

        <div className="lg:col-span-9">
          {/* Reveal threshold lowered (was 0.4) so the quote never stays
              at opacity:0 on a brisk mobile scroll. The quote is the
              homepage's most-cited copy; failure mode here is silent and
              expensive. amount: 0.15 + a -10% bottom rootMargin makes the
              IO fire as soon as the block is even partially in view. */}
          <motion.blockquote
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              amount: 0.15,
              margin: "0px 0px -10% 0px",
            }}
            transition={{ duration: 1.1, ease: EASE }}
            id="chairman-heading"
            className="font-display text-[clamp(1.5rem,3.6vw,3.4rem)] font-bold italic leading-[1.18] tracking-tight text-primary sm:leading-[1.1]"
          >
            <span className="block text-accent text-3xl sm:text-inherit" aria-hidden>
              &ldquo;
            </span>
            {CHAIRMAN.quote}
          </motion.blockquote>

          {/* Attribution row.
              The previous "Read the full letter →" CTA was removed because
              the quote on this page IS the chairman's letter; there was no
              fuller letter to link to and href="#" was deceptive. When a
              proper /about page lands with the full letter, restore the CTA
              there. */}
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              amount: 0.2,
              margin: "0px 0px -10% 0px",
            }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="mt-12 border-t border-line pt-8 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-muted"
          >
            <span className="text-primary">— {CHAIRMAN.attribution}</span>
            <span className="mx-2 text-accent">//</span>
            <span>{CHAIRMAN.role}</span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
