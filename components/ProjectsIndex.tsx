"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { ProjectCard } from "@/components/ProjectCard";
import {
  CATEGORY_LABELS,
  DIVISION_LABELS,
  type Project,
  type ProjectCategory,
} from "@/lib/projects";
import type { DivisionSlug } from "@/lib/capabilities";
import type { Project as HomeProject } from "@/types";

const EASE = [0.16, 1, 0.3, 1] as const;

interface ProjectsIndexProps {
  projects: Project[];
}

type CategoryFilter = ProjectCategory | "all";
type DivisionFilter = DivisionSlug | "all";

/**
 * Filterable project index. Two filter dimensions — category + division —
 * each rendered as pill buttons. Filters AND together.
 *
 * Stays useful even with three seed projects, since both filters are
 * a single click and the result re-flows live.
 */
export function ProjectsIndex({ projects }: ProjectsIndexProps) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [division, setDivision] = useState<DivisionFilter>("all");
  const prefersReducedMotion = useReducedMotion();

  // Derive the available filter values from the actual data so the bar
  // never offers an empty filter.
  const availableCategories = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.category))).sort();
  }, [projects]);
  const availableDivisions = useMemo(() => {
    const set = new Set<DivisionSlug>();
    projects.forEach((p) => p.scope.forEach((s) => set.add(s.division)));
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (
        division !== "all" &&
        !p.scope.some((s) => s.division === division)
      )
        return false;
      return true;
    });
  }, [projects, category, division]);

  return (
    <section
      aria-labelledby="projects-index-heading"
      className="relative bg-base py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <h2 id="projects-index-heading" className="sr-only">
          Project list
        </h2>

        {/* Filter bar */}
        <div className="mb-10 flex flex-col gap-6 border-y border-line py-6 sm:py-7 lg:mb-14">
          <FilterRow label="Category">
            <FilterPill
              active={category === "all"}
              onClick={() => setCategory("all")}
            >
              All
            </FilterPill>
            {availableCategories.map((c) => (
              <FilterPill
                key={c}
                active={category === c}
                onClick={() => setCategory(c)}
              >
                {CATEGORY_LABELS[c]}
              </FilterPill>
            ))}
          </FilterRow>

          <FilterRow label="Division">
            <FilterPill
              active={division === "all"}
              onClick={() => setDivision("all")}
            >
              All
            </FilterPill>
            {availableDivisions.map((d) => (
              <FilterPill
                key={d}
                active={division === d}
                onClick={() => setDivision(d)}
              >
                {DIVISION_LABELS[d]}
              </FilterPill>
            ))}
          </FilterRow>
        </div>

        {/* Result count */}
        <p
          aria-live="polite"
          className="mb-8 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted"
        >
          {String(filtered.length).padStart(2, "0")} /{" "}
          {String(projects.length).padStart(2, "0")} projects
          {(category !== "all" || division !== "all") && (
            <>
              <span aria-hidden className="mx-3 text-accent">
                ·
              </span>
              <button
                type="button"
                onClick={() => {
                  setCategory("all");
                  setDivision("all");
                }}
                className="text-primary/80 underline-offset-4 transition hover:text-accent hover:underline"
              >
                Clear filters
              </button>
            </>
          )}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex min-h-[24rem] flex-col items-center justify-center gap-4 border border-line bg-elevated text-center">
            <p className="font-display text-3xl font-bold uppercase tracking-tight text-primary">
              Nothing matches.
            </p>
            <p className="max-w-[40ch] text-sm text-primary/65">
              Try clearing one of the filters above to see more of our work.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {filtered.map((p, i) => {
              const card: HomeProject = {
                id: p.slug,
                name: p.title,
                division: p.scope[0]?.division
                  ? DIVISION_LABELS[p.scope[0].division]
                  : "Project",
                scope: p.summary.split(". ")[0] ?? p.summary,
                image: p.hero.src,
                imageAlt: p.hero.alt,
              };
              return (
                <motion.li
                  key={p.slug}
                  layout={!prefersReducedMotion}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 16 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.05,
                    ease: EASE,
                  }}
                  className="flex"
                >
                  <div className="flex w-full">
                    <ProjectCard
                      project={card}
                      index={i}
                      delay={0}
                      href={`/projects/${p.slug}`}
                      sizes="(min-width: 1024px) 32vw, (min-width: 768px) 48vw, 92vw"
                    />
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
      <span className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-accent sm:w-24 sm:shrink-0">
        {label}
      </span>
      <div className="scrollbar-thin flex flex-wrap gap-2 overflow-x-auto sm:flex-1">
        {children}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center gap-2 border px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] transition focus:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent ${
        active
          ? "border-accent bg-accent text-ink"
          : "border-line text-primary/75 hover:border-accent hover:text-primary"
      }`}
    >
      {active && <span aria-hidden className="block size-1 bg-ink" />}
      {children}
    </button>
  );
}
