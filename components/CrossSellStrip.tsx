import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProjectCard } from "@/components/ProjectCard";
import { PROJECTS } from "@/lib/content";

/**
 * Cross-sell strip: a static three-up grid of project cards on the dark
 * surface. Same `ProjectCard` component the homepage strip uses, just
 * inside a grid instead of a snap-x track.
 */
export function CrossSellStrip() {
  // TODO: filter to projects that span multiple divisions when the
  // project records carry that metadata.
  const projects = PROJECTS.slice(0, 3);

  return (
    <section
      aria-labelledby="crosssell-heading"
      className="relative bg-base py-16 sm:py-24 lg:py-36"
    >
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <div className="mb-12 grid gap-8 lg:mb-16 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5 text-accent">Project examples</p>
            <h2
              id="crosssell-heading"
              className="display-section max-w-[22ch] text-primary"
            >
              Looking for a specific project example?
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="max-w-[44ch] text-base leading-relaxed text-primary/85">
              See how we delivered these capabilities at scale, from bridge
              girders to a 12,000&nbsp;yd³ structural pour.
            </p>
            <Link
              href="/#projects"
              className="group mt-6 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent transition hover:text-accent-hot"
            >
              View all projects
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {projects.map((p, i) => (
            <li key={p.id} className="flex">
              <div className="flex w-full">
                <ProjectCard
                  project={p}
                  index={i}
                  delay={i * 0.08}
                  href={`/projects/${p.id}`}
                  sizes="(min-width: 1024px) 32vw, (min-width: 768px) 48vw, 92vw"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
