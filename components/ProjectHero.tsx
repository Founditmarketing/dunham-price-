"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { EASE } from "@/lib/motion";
import {
  CATEGORY_LABELS,
  DIVISION_LABELS,
  type Project,
} from "@/lib/projects";

interface ProjectHeroProps {
  project: Project;
  /** 1-based index of this project in the canonical list. */
  index: number;
  /** Total number of projects (for the `03 / 12` meta strip). */
  total: number;
}

export function ProjectHero({ project, index, total }: ProjectHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const titleWords = project.title.split(" ");
  const primaryDivision = project.scope[0]?.division;

  return (
    <section
      aria-label={`${project.title} introduction`}
      className="relative isolate flex min-h-[70vh] w-full flex-col justify-end overflow-hidden bg-base text-primary lg:min-h-[90vh]"
    >
      {/* Hero image */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src={project.hero.src}
          alt={project.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Overlays — heavier on the left where the headline sits. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-base via-base/65 to-base/15"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-base via-base/40 to-base/10"
        />
      </motion.div>

      {/* Top meta strip */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
        className="absolute inset-x-0 top-20 z-10 sm:top-24"
      >
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-6 sm:px-10">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-primary/75 transition hover:text-accent"
          >
            <ArrowLeft
              aria-hidden
              className="size-3.5 transition-transform duration-500 group-hover:-translate-x-1"
            />
            Back to Projects
          </Link>
          <div className="hidden items-center gap-4 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-primary/65 sm:flex">
            <span className="text-accent">·</span>
            <span>
              Project {String(index).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
            <span className="text-accent">·</span>
            <span>{project.year}</span>
          </div>
        </div>
      </motion.div>

      {/* Vertical slug — right edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-4 hidden items-center gap-3 sm:right-6 lg:flex"
      >
        <span className="writing-vertical font-mono text-[0.66rem] uppercase tracking-[0.32em] text-primary/45">
          {project.slug.toUpperCase()}
        </span>
        <span className="block h-12 w-px bg-accent/60" />
      </div>

      {/* Bottom content area */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1480px] gap-12 px-6 pb-16 pt-32 sm:px-10 sm:pb-20 sm:pt-40 lg:grid-cols-12 lg:items-end lg:gap-16 lg:pb-24">
        {/* Left: tag + headline + meta + summary */}
        <div className="lg:col-span-8">
          <motion.div
            initial={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
            className="mb-8 flex flex-wrap items-center gap-3"
          >
            <span className="inline-flex items-center bg-accent px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink">
              {CATEGORY_LABELS[project.category]}
            </span>
            {primaryDivision && (
              <span className="inline-flex items-center gap-2 border border-primary/25 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-primary/85">
                <span aria-hidden className="block size-1 bg-accent" />
                {DIVISION_LABELS[primaryDivision]} Project
              </span>
            )}
          </motion.div>

          <h1 className="font-display font-black uppercase leading-[0.86] tracking-tight text-primary text-[clamp(3rem,8vw,8rem)]">
            {titleWords.map((word, i) => (
              <span key={`${word}-${i}`} className="reveal-mask mr-[0.18em]">
                <span style={{ animationDelay: `${0.55 + i * 0.07}s` }}>
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.55 + titleWords.length * 0.07 + 0.15,
              ease: EASE,
            }}
            className="mt-8 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-primary/70"
          >
            {project.location} · {project.year}
            {project.duration ? ` · ${project.duration}` : ""}
          </motion.p>

          <motion.p
            initial={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.55 + titleWords.length * 0.07 + 0.3,
              ease: EASE,
            }}
            className="font-serif-narrative mt-8 max-w-[60ch] text-[1.0625rem] leading-[1.6] text-primary/90 sm:text-[1.15rem]"
          >
            {project.summary}
          </motion.p>
        </div>

        {/* Right: scope-at-a-glance card */}
        <motion.aside
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 24 }
          }
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.55 + titleWords.length * 0.07 + 0.45,
            ease: EASE,
          }}
          aria-label="Scope at a glance"
          className="lg:col-span-4 lg:justify-self-end"
        >
          <div className="relative max-w-sm border border-accent/70 bg-base/45 p-6 backdrop-blur-sm sm:p-7">
            <span
              aria-hidden
              className="absolute -left-px -top-px size-3 border-l-2 border-t-2 border-accent"
            />
            <span
              aria-hidden
              className="absolute -bottom-px -right-px size-3 border-b-2 border-r-2 border-accent"
            />

            <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-accent">
              Scope at a glance
            </p>

            <ul className="mt-5 space-y-5">
              {project.scope.map((s) => (
                <li key={s.division} className="space-y-2">
                  <p className="font-display text-lg font-bold uppercase tracking-tight text-primary">
                    {DIVISION_LABELS[s.division]}
                  </p>
                  <ul className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-primary/75">
                    {s.products.map((p) => (
                      <li
                        key={p}
                        className="flex items-center gap-2 leading-relaxed"
                      >
                        <span aria-hidden className="block size-1 bg-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
