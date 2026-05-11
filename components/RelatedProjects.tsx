import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProjectCard } from "@/components/ProjectCard";
import { getRelatedProjects, type Project } from "@/lib/projects";
import type { Project as HomeProject } from "@/types";

interface RelatedProjectsProps {
  /** The current project — used to look up related slugs and exclude self. */
  project: Project;
}

/**
 * Cream "more work" section. Three project cards, sourced from
 * `project.relatedProjects`, with a same-category fallback when fewer than
 * three slugs are specified.
 */
export function RelatedProjects({ project }: RelatedProjectsProps) {
  const related = getRelatedProjects(project.slug, 3);
  if (related.length === 0) return null;

  return (
    <section
      data-print-hide
      aria-labelledby="related-heading"
      className="relative bg-cream py-16 text-ink sm:py-24 lg:py-36"
    >
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <div className="mb-12 grid gap-8 lg:mb-16 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5 text-ink/60">More Work</p>
            <h2
              id="related-heading"
              className="display-section max-w-[20ch] text-ink"
            >
              Explore similar projects.
            </h2>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 self-end font-mono text-xs uppercase tracking-[0.2em] text-ink transition hover:text-accent lg:col-span-4 lg:justify-self-end"
          >
            View all projects
            <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {related.map((p, i) => {
            // Adapt the project to the lighter shape ProjectCard expects.
            const card: HomeProject = {
              id: p.slug,
              name: p.title,
              division: p.scope[0]?.division
                ? p.scope[0].division
                    .split("-")
                    .map((w) => w[0]!.toUpperCase() + w.slice(1))
                    .join(" ")
                : "Project",
              scope: p.summary.split(". ")[0] ?? p.summary,
              image: p.hero.src,
              imageAlt: p.hero.alt,
            };
            return (
              <li key={p.slug} className="flex">
                <div className="flex w-full">
                  <ProjectCard
                    project={card}
                    index={i}
                    delay={i * 0.08}
                    href={`/projects/${p.slug}`}
                    sizes="(min-width: 1024px) 32vw, (min-width: 768px) 48vw, 92vw"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
