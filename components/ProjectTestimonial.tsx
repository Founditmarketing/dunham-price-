"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ProjectTestimonial as ProjectTestimonialData } from "@/lib/projects";

const EASE = [0.16, 1, 0.3, 1] as const;

interface ProjectTestimonialProps {
  testimonial: ProjectTestimonialData;
}

/**
 * Conditional pull quote section. The parent page should render this only
 * when `project.testimonial` is set — there's no internal null branch.
 */
export function ProjectTestimonial({ testimonial }: ProjectTestimonialProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="testimonial-heading"
      className="relative overflow-hidden bg-base py-28 text-primary sm:py-36 lg:py-44"
    >
      {/* Quiet background mark — open quote glyph in display weight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 top-10 select-none font-display text-[18rem] font-black leading-none text-elevated sm:-left-10 sm:top-12 sm:text-[24rem]"
      >
        “
      </span>

      <div className="relative mx-auto grid max-w-[1480px] gap-10 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-2">
          <p className="eyebrow text-accent">Client Voice</p>
          <span aria-hidden className="mt-5 block h-px w-12 bg-accent" />
        </div>

        <motion.blockquote
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: EASE }}
          id="testimonial-heading"
          className="lg:col-span-10"
        >
          <p className="font-display text-[clamp(1.85rem,3.6vw,3.4rem)] font-bold italic leading-[1.1] tracking-tight text-primary">
            {testimonial.quote}
          </p>

          <footer className="mt-12 flex flex-col gap-3 border-t border-line pt-6 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-muted sm:flex-row sm:items-center sm:gap-5">
            <span className="text-primary">— {testimonial.attribution}</span>
            <span aria-hidden className="hidden text-accent sm:inline">
              //
            </span>
            <span>{testimonial.role}</span>
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
