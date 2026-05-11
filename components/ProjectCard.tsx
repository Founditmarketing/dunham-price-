"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/types";

const EASE = [0.16, 1, 0.3, 1] as const;

interface ProjectCardProps {
  project: Project;
  /** Sequence number stamped into the top-right corner. */
  index?: number;
  /** `next/image` sizes hint. Defaults to a horizontal-strip-friendly value. */
  sizes?: string;
  /** Where the card links — defaults to `#` until project detail pages exist. */
  href?: string;
  /** Stagger delay multiplier when used inside `whileInView`. */
  delay?: number;
}

/**
 * Editorial portrait project card. Used by both the homepage projects strip
 * and the capabilities cross-sell strip — same visual language, different
 * outer shell (snap track vs grid).
 */
export function ProjectCard({
  project,
  index = 0,
  sizes = "(min-width: 1280px) 28vw, (min-width: 1024px) 32vw, (min-width: 768px) 44vw, (min-width: 640px) 58vw, 78vw",
  href = "#",
  delay = 0,
}: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className="group relative flex h-full flex-col bg-elevated"
    >
      <Link
        href={href}
        aria-label={`${project.name} — ${project.division} project`}
        className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-base/85 via-base/20 to-transparent"
          />
          <div className="absolute left-5 top-5 flex items-center gap-2">
            <span className="block size-1.5 bg-accent" />
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-accent">
              {project.division}
            </span>
          </div>
          <div className="absolute right-5 top-5 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-primary/70">
            P—{String(index + 1).padStart(2, "0")}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
          <h3 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight text-primary sm:text-3xl">
            {project.name}
          </h3>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary/70">
            {project.scope}
          </p>
          <span className="mt-auto inline-flex items-center gap-2 pt-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent transition-transform duration-500 group-hover:translate-x-1">
            View case study
            <ArrowUpRight className="size-3.5" aria-hidden />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
