"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { CHAIRMAN } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ChairmanQuote() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="chairman"
      aria-labelledby="chairman-heading"
      className="relative overflow-hidden bg-base py-28 sm:py-36 lg:py-44"
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
          <motion.blockquote
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, ease: EASE }}
            id="chairman-heading"
            className="font-display text-[clamp(1.5rem,3.6vw,3.4rem)] font-bold italic leading-[1.18] tracking-tight text-primary sm:leading-[1.1]"
          >
            <span className="block text-accent text-3xl sm:text-inherit" aria-hidden>
              &ldquo;
            </span>
            {CHAIRMAN.quote}
          </motion.blockquote>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="mt-12 flex flex-col items-start gap-8 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-muted">
              <span className="text-primary">— {CHAIRMAN.attribution}</span>
              <span className="mx-2 text-accent">//</span>
              <span>{CHAIRMAN.role}</span>
            </div>

            <Link
              href={CHAIRMAN.cta.href}
              className="group -mx-3 inline-flex min-h-[44px] items-center gap-3 px-3 py-3 font-mono text-xs uppercase tracking-[0.2em] text-accent transition hover:text-accent-hot"
            >
              {CHAIRMAN.cta.label}
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
