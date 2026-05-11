"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { ProjectCard } from "@/components/ProjectCard";
import { PROJECTS } from "@/lib/content";

/** Arrow keys consider these elements "owned" by the user, never our hijack. */
const TYPING_SELECTOR = 'input,textarea,select,[contenteditable="true"]';

export function ProjectsStrip() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLOListElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [inView, setInView] = useState(false);

  // Track scroll position for the progress rail + boundary state on arrows.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      const ratio = max > 0 ? el.scrollLeft / max : 0;
      setProgress(ratio);
      setAtStart(el.scrollLeft <= 4);
      setAtEnd(el.scrollLeft >= max - 4);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Track section visibility so global arrow-key listener stays scoped.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scrollBy = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("li");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  }, []);

  // Arrow-key navigation when the strip is on screen and the user isn't
  // typing into a form. Home / End jump to the boundaries.
  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(TYPING_SELECTOR)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollBy(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollBy(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
      } else if (e.key === "End") {
        e.preventDefault();
        const el = trackRef.current;
        if (el) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, scrollBy]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-labelledby="projects-heading"
      aria-keyshortcuts="ArrowLeft ArrowRight Home End"
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
          <div
            className="flex items-center gap-3"
            role="group"
            aria-label="Projects carousel controls"
          >
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={atStart}
              aria-label="Previous projects (left arrow key)"
              className="inline-flex size-12 items-center justify-center border border-line text-primary transition hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:bg-accent active:text-ink disabled:cursor-not-allowed disabled:border-line/40 disabled:text-muted/40 disabled:hover:border-line/40 disabled:hover:text-muted/40"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={atEnd}
              aria-label="More projects (right arrow key)"
              className="inline-flex size-12 items-center justify-center border border-line text-primary transition hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:bg-accent active:text-ink disabled:cursor-not-allowed disabled:border-line/40 disabled:text-muted/40 disabled:hover:border-line/40 disabled:hover:text-muted/40"
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
              Desktop (md+): drag, native scroll, AND ← / → keys all work
              once the strip is on screen. */}
          <span className="hidden md:inline">
            Drag · Scroll · ← / → keys
          </span>
          <span className="md:hidden">Swipe →</span>
        </div>
      </div>
    </section>
  );
}
