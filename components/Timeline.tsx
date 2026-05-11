"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { MixerMark } from "@/components/MixerMark";
import { TIMELINE } from "@/lib/content";
import type { TimelineCategory, TimelineMilestone } from "@/types";

const EASE = [0.16, 1, 0.3, 1] as const;

const CATEGORY_LABEL: Record<TimelineCategory, string> = {
  founding: "Founding",
  leadership: "Leadership",
  division: "Division",
  project: "Project",
  expansion: "Expansion",
};

/** Arrow keys consider these elements "owned" by the user, never our hijack. */
const TYPING_SELECTOR = 'input,textarea,select,[contenteditable="true"]';

/**
 * Heritage timeline.
 *
 * Replaces the small four-row generation rail that used to sit beside the
 * MixerMark with a full horizontal-scroll timeline of company milestones —
 * founding, leadership transitions, division launches, signature projects.
 * The 1939 story finally gets its own moment instead of one line.
 *
 * Layout:
 *   - Left rail: MixerMark (signature graphic) + intro copy + arrow controls
 *   - Right side: scroll-snap-x track of milestone cards
 *
 * Motion: the active card's pour rule scales in from the top, matching the
 * page's signature pour-and-settle language (PourStat, Hero ornament).
 *
 * Keyboard: arrow keys scroll the track when the section is in view, same
 * pattern as the projects strip.
 */
export function Timeline() {
  const prefersReducedMotion = useReducedMotion();
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

  // Track section visibility so arrow-key listener stays scoped.
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

  // Arrow-key navigation when the strip is on screen and not typing.
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

  const firstYear = TIMELINE[0]?.year ?? 1939;
  const lastYear = TIMELINE[TIMELINE.length - 1]?.year ?? new Date().getFullYear();

  return (
    <section
      ref={sectionRef}
      id="heritage"
      aria-labelledby="heritage-heading"
      aria-keyshortcuts="ArrowLeft ArrowRight Home End"
      className="relative overflow-hidden border-y border-line/60 bg-base"
    >
      <span aria-hidden="true" className="grain" />

      <div className="relative z-[2] mx-auto grid max-w-[1480px] grid-cols-12 gap-8 px-6 pt-12 sm:px-10 sm:pt-16 lg:gap-12 lg:pt-20">
        {/* Left rail. MixerMark + heading + intro + controls. Sits as the
            signature anchor; on mobile it stacks on top of the track. */}
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-4 lg:gap-8">
          <div className="flex items-center gap-5">
            <MixerMark size={88} caption="Every pour." />
            <p className="eyebrow text-accent">
              {firstYear} → {lastYear}
            </p>
          </div>

          <h2
            id="heritage-heading"
            className="font-display text-[clamp(1.75rem,3.6vw,2.8rem)] font-black uppercase leading-[0.95] tracking-tight text-primary"
          >
            Four generations
            <br />
            <span className="text-accent">on the drum.</span>
          </h2>

          <p className="max-w-[40ch] text-sm leading-[1.6] text-primary/85 sm:text-base">
            Same family. Same yard. The standard Rowland Price set on the
            first pour in {firstYear} is the standard the fourth generation
            holds today.
          </p>

          <div
            className="flex items-center gap-3"
            role="group"
            aria-label="Timeline controls"
          >
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={atStart}
              aria-label="Earlier milestones (left arrow key)"
              className="inline-flex size-11 items-center justify-center border border-line text-primary transition hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:bg-accent active:text-ink disabled:cursor-not-allowed disabled:border-line/40 disabled:text-muted/40 disabled:hover:border-line/40 disabled:hover:text-muted/40"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={atEnd}
              aria-label="Later milestones (right arrow key)"
              className="inline-flex size-11 items-center justify-center border border-line text-primary transition hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:bg-accent active:text-ink disabled:cursor-not-allowed disabled:border-line/40 disabled:text-muted/40 disabled:hover:border-line/40 disabled:hover:text-muted/40"
            >
              <ArrowRight className="size-4" />
            </button>
            <span className="ml-3 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted">
              Drag · Scroll · ← / →
            </span>
          </div>
        </div>

        {/* Spacer for the track; track itself bleeds full width below. */}
        <div className="col-span-12 lg:col-span-8" aria-hidden="true" />
      </div>

      <ol
        ref={trackRef}
        className="scroll-snap-x scrollbar-thin cursor-grab mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 active:cursor-grabbing sm:gap-6 sm:px-10 lg:px-[max(2.5rem,calc((100vw-1480px)/2+2.5rem))]"
        aria-label="Heritage milestones"
      >
        {TIMELINE.map((milestone, i) => (
          <li
            key={milestone.year + milestone.title}
            className="flex w-[78vw] shrink-0 snap-start flex-col sm:w-[58vw] md:w-[42vw] lg:w-[28vw] xl:w-[22vw]"
          >
            <MilestoneCard milestone={milestone} index={i} />
          </li>
        ))}
        <li aria-hidden="true" className="w-6 shrink-0 sm:w-10" />
      </ol>

      {/* Progress rail. Same pattern as ProjectsStrip so the page has a
          consistent way of communicating "this scrolls." */}
      <div className="mx-auto mt-8 max-w-[1480px] px-6 pb-12 sm:px-10 sm:pb-16 lg:pb-20">
        <div className="relative h-px w-full bg-line">
          <motion.span
            initial={{ width: "8%" }}
            animate={{ width: `${Math.max(8, progress * 100)}%` }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              ease: EASE,
            }}
            className="absolute inset-y-0 left-0 bg-accent"
          />
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted">
          <span>
            {String(
              Math.round(progress * (TIMELINE.length - 1)) + 1,
            ).padStart(2, "0")}{" "}
            / {String(TIMELINE.length).padStart(2, "0")}
          </span>
          <span>{firstYear} → {lastYear}</span>
        </div>
      </div>
    </section>
  );
}

function MilestoneCard({
  milestone,
  index,
}: {
  milestone: TimelineMilestone;
  index: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const isLeadership = milestone.category === "leadership";

  return (
    <motion.article
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.05, 0.3), ease: EASE }}
      className="group relative flex h-full flex-col gap-5 border border-line bg-elevated p-6 sm:p-7"
    >
      {/* Pour rule. Scales in from the top of the card on view, matching
          the page's signature pour-and-settle motion (PourStat, Hero). */}
      <motion.span
        aria-hidden="true"
        initial={prefersReducedMotion ? { scaleY: 1 } : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 1.0,
          delay: prefersReducedMotion ? 0 : 0.15,
          ease: EASE,
        }}
        style={{ transformOrigin: "top" }}
        className={`absolute left-0 top-0 block h-full w-px ${
          isLeadership ? "bg-accent" : "bg-accent/55"
        }`}
      />

      {/* Top row: category + to-confirm tag. */}
      <div className="flex items-center justify-between gap-3 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-muted">
        <span className={isLeadership ? "text-accent" : "text-muted"}>
          {String(index + 1).padStart(2, "0")} ·{" "}
          {CATEGORY_LABEL[milestone.category]}
        </span>
        {milestone.toConfirm && (
          <span
            title="Year and details TBD with the family before launch"
            className="border border-muted/40 px-1.5 py-0.5 text-[0.55rem] tracking-[0.18em] text-muted/85"
          >
            To confirm
          </span>
        )}
      </div>

      {/* Year, oversized. Mono tabular-nums so the column of years feels
          stamped, not typeset. */}
      <p
        aria-hidden="true"
        className="font-display text-[clamp(3.5rem,7vw,5rem)] font-black leading-[0.85] tracking-tight text-primary tabular-nums"
      >
        {milestone.year}
      </p>

      {/* Title (display) + description (body). Description uses the
          serif-narrative register so heritage storytelling reads
          editorial rather than spec-sheet. */}
      <div className="flex flex-1 flex-col gap-3">
        <h3 className="font-display text-lg font-bold uppercase leading-[1.1] tracking-tight text-primary sm:text-xl">
          {milestone.title}
        </h3>
        <p className="font-serif-narrative text-[0.95rem] leading-[1.55] text-primary/80">
          {milestone.description}
        </p>
      </div>
    </motion.article>
  );
}
