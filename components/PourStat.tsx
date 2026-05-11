"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

interface PourStatProps {
  /** Pre-formatted hero number, e.g. "12,000". */
  value: string;
  /** Numeric form for the count-up. */
  numeric: number;
  /** Trailing unit, e.g. "yd³". */
  unit: string;
  /** Short claim under the number. */
  claim: string;
  /** Eyebrow label above the number. */
  eyebrow: string;
  /** Source project credit + link. */
  source: { label: string; href: string };
}

/**
 * Inter-section interstitial. Sits between two large content blocks (e.g.
 * Capabilities → Projects) and uses the gap as narrative real estate
 * instead of dead air.
 *
 * The signature touch is the vertical yellow rule on the left: it scales
 * from the top of the section down on view, settling at the bottom like
 * a slow pour of fluid concrete filling a column. The number then fades
 * up and counts to its target. The whole module reads as "here's a real
 * pour we just delivered, from one of these case studies."
 *
 * Reduced-motion clients see the static end state with no animation.
 */
export function PourStat({
  value,
  numeric,
  unit,
  claim,
  eyebrow,
  source,
}: PourStatProps) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);
  const [display, setDisplay] = useState(prefersReducedMotion ? value : "0");

  // Fire once when the section enters view. Single IO, no scrub.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Count-up tied to `active`. Snap on reduced motion.
  useEffect(() => {
    if (!active) return;
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const duration = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4); // ease-out-quart
      const v = Math.round(numeric * eased);
      setDisplay(v.toLocaleString("en-US"));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, numeric, prefersReducedMotion, value]);

  return (
    <section
      ref={sectionRef}
      aria-label="Latest delivered pour"
      className="relative overflow-hidden border-y border-line/60 bg-base"
    >
      <span aria-hidden="true" className="grain" />

      <div className="relative z-[2] mx-auto grid max-w-[1480px] grid-cols-12 items-end gap-6 px-6 py-12 sm:gap-8 sm:px-10 sm:py-16 lg:py-20">
        {/* Pour rule + number block */}
        <div className="col-span-12 md:col-span-8 lg:col-span-7">
          <div className="flex items-stretch gap-5 sm:gap-7">
            {/* The pour rule. ScaleY from top so it visually fills like a
                slow pour. Stays as a permanent accent rule afterward. */}
            <motion.span
              aria-hidden="true"
              initial={
                prefersReducedMotion
                  ? { scaleY: 1 }
                  : { scaleY: 0 }
              }
              animate={{ scaleY: active ? 1 : 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 1.6,
                ease: EASE,
              }}
              style={{ transformOrigin: "top" }}
              className="block w-px shrink-0 self-stretch bg-accent"
            />

            <div className="flex flex-col gap-3 sm:gap-4">
              <p className="eyebrow text-accent">{eyebrow}</p>
              <p
                aria-label={`${value} ${unit} ${claim}`}
                className="font-display font-black uppercase leading-[0.86] tracking-tight text-primary text-[clamp(3.5rem,11vw,8rem)]"
              >
                <span className="tabular-nums">{display}</span>
                <span className="ml-3 align-top font-mono text-[0.32em] font-medium tracking-[0.12em] text-accent sm:text-[0.28em]">
                  {unit}
                </span>
              </p>
              <p className="max-w-[34ch] text-sm leading-relaxed text-primary/85 sm:text-base">
                {claim}
              </p>
            </div>
          </div>
        </div>

        {/* Source credit + link */}
        <div className="col-span-12 flex flex-col gap-3 md:col-span-4 md:items-end md:text-right lg:col-span-5">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted">
            Pour of record
          </p>
          <Link
            href={source.href}
            className="group inline-flex items-center gap-3 font-mono text-[0.78rem] uppercase tracking-[0.18em] text-primary transition hover:text-accent"
          >
            <span>{source.label}</span>
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
