"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { ProjectCard } from "@/components/ProjectCard";
import { PROJECTS } from "@/lib/content";

export function ProjectsStrip() {
  const trackRef = useRef<HTMLOListElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("li");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative bg-base py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <div className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-5 text-accent">02 — Projects</p>
            <h2
              id="projects-heading"
              className="display-section max-w-[16ch] text-primary"
            >
              Heavy work. Done right.
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Previous projects"
              className="inline-flex size-12 items-center justify-center border border-line text-primary transition hover:border-accent hover:text-accent"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="More projects"
              className="inline-flex size-12 items-center justify-center border border-line text-primary transition hover:border-accent hover:text-accent"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <ol
        ref={trackRef}
        className="scroll-snap-x scrollbar-thin cursor-grab flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 active:cursor-grabbing sm:px-10 lg:gap-8 lg:px-[max(2.5rem,calc((100vw-1480px)/2+2.5rem))]"
      >
        {PROJECTS.map((p, i) => (
          <li
            key={p.id}
            className="flex w-[78vw] shrink-0 snap-start flex-col sm:w-[58vw] md:w-[44vw] lg:w-[32vw] xl:w-[28vw]"
          >
            <ProjectCard
              project={p}
              index={i}
              delay={i * 0.1}
              href={`/projects/${p.id}`}
            />
          </li>
        ))}
        {/* Trailing spacer so last card can fully snap */}
        <li aria-hidden="true" className="w-6 shrink-0 sm:w-10" />
      </ol>

      {/* Progress bar */}
      <div className="mx-auto mt-10 max-w-[1480px] px-6 sm:px-10">
        <div className="relative h-px w-full bg-line">
          <span
            className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-300"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted">
          <span>
            {String(Math.round(progress * (PROJECTS.length - 1)) + 1).padStart(
              2,
              "0",
            )}{" "}
            / {String(PROJECTS.length).padStart(2, "0")}
          </span>
          {/* Affordance language tracks the input device.
              Mobile + tablet: native swipe is the primary gesture.
              Desktop (md+): drag-to-scroll is non-obvious, label sells it. */}
          <span className="hidden md:inline">Drag · Scroll · Snap</span>
          <span className="md:hidden">Swipe →</span>
        </div>
      </div>
    </section>
  );
}
