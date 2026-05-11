"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { Project } from "@/lib/projects";

const EASE = [0.16, 1, 0.3, 1] as const;

interface ProjectNarrativeProps {
  project: Project;
}

/**
 * Cream section. Two-column editorial: Challenge | yellow rule | Approach.
 * Stacks on mobile.
 */
export function ProjectNarrative({ project }: ProjectNarrativeProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="narrative-heading"
      className="relative bg-cream py-16 text-ink sm:py-24 lg:py-36"
    >
      <h2 id="narrative-heading" className="sr-only">
        Project narrative
      </h2>

      <div className="mx-auto grid max-w-[1480px] gap-14 px-6 sm:px-10 lg:grid-cols-12 lg:gap-0">
        {/* Challenge */}
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, ease: EASE }}
          className="lg:col-span-6 lg:pr-12 xl:pr-20"
        >
          <p className="eyebrow mb-5 text-ink/55">The Challenge</p>
          <h3 className="font-display text-[clamp(1.75rem,3.4vw,3rem)] font-black uppercase leading-[0.95] tracking-tight text-ink">
            {project.challengeTitle}
          </h3>
          {/* Narrative body in a humanist serif so the project storytelling
              passages have a different register than the spec / catalog
              copy elsewhere. Gives the eye a place to rest after the
              all-Inter body register and feels editorial rather than
              datasheet. */}
          <p className="font-serif-narrative mt-7 max-w-[60ch] text-[1.0625rem] leading-[1.65] text-ink/85 sm:text-[1.15rem]">
            {project.challenge}
          </p>
        </motion.div>

        {/* Vertical yellow rule (desktop only) */}
        <div
          aria-hidden="true"
          className="hidden lg:relative lg:col-span-0 lg:block"
        >
          <span className="absolute -left-px top-0 hidden h-full w-px bg-accent lg:block" />
        </div>

        {/* Solution */}
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, delay: 0.15, ease: EASE }}
          className="border-t border-ink/10 pt-12 lg:col-span-6 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0 xl:pl-20"
        >
          <p className="eyebrow mb-5 text-ink/55">The Approach</p>
          <h3 className="font-display text-[clamp(1.75rem,3.4vw,3rem)] font-black uppercase leading-[0.95] tracking-tight text-ink">
            {project.solutionTitle}
          </h3>
          <p className="font-serif-narrative mt-7 max-w-[60ch] text-[1.0625rem] leading-[1.65] text-ink/85 sm:text-[1.15rem]">
            {project.solution}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
