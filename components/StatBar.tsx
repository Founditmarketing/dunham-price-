"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { HazardStripe } from "@/components/HazardStripe";
import { STATS } from "@/lib/content";
import type { Stat } from "@/types";

const COUNT_DURATION_MS = 1000;

function CountUp({ stat, active }: { stat: Stat; active: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  // Render the canonical value during SSR so JS-disabled users (and the
  // first paint) never see a placeholder "0". Animation kicks off on the
  // client when the stat enters view.
  const [display, setDisplay] = useState<string>(stat.value);

  useEffect(() => {
    if (!active || stat.numeric == null) return;
    if (prefersReducedMotion) {
      // Reduced motion: keep the final value visible, no animation.
      setDisplay(stat.value);
      return;
    }
    const target = stat.numeric;
    // Year values (e.g. 1939) don't get a count-up animation. Counting from
    // 1853 → 1939 over a second meant viewers caught the value at "1919" or
    // "1934" mid-frame and read those as the actual founding year, which
    // contradicted the brand's "since 1939" everywhere else. Years just
    // snap to their canonical value; magnitudes (4, 86) animate as before.
    if (target >= 1900) {
      setDisplay(stat.value);
      return;
    }
    const baseline = 0;
    setDisplay(`${baseline}${stat.suffix ?? ""}`);
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 4); // ease-out-quart
      const value = Math.round(baseline + (target - baseline) * eased);
      setDisplay(`${value}${stat.suffix ?? ""}`);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(stat.value); // snap to canonical formatting on finish
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, prefersReducedMotion, stat.numeric, stat.suffix, stat.value]);

  return (
    <div className="flex flex-col items-start gap-3 px-6 py-10 sm:items-center sm:py-14 lg:py-16">
      <span
        className="font-display text-[clamp(3.25rem,7vw,5.5rem)] font-black leading-[0.85] tracking-tight text-primary tabular-nums"
        data-counter
        data-counter-target={stat.value}
      >
        {display}
      </span>
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted">
        {stat.label}
      </span>
    </div>
  );
}

export function StatBar() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

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
      // Fire as soon as the band is even partially visible. Previous 0.4
      // threshold meant fast scrollers would scroll past before triggering.
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Heritage at a glance"
      data-motion="counters"
      className="relative overflow-hidden bg-base"
    >
      <HazardStripe height={10} from="left" />

      <span aria-hidden="true" className="grain" />

      <div className="relative z-[2] mx-auto max-w-[1480px] px-6 sm:px-10">
        <ul className="grid grid-cols-1 divide-y divide-line/60 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <li
              key={stat.label}
              className={`relative ${
                i > 0 ? "lg:before:absolute lg:before:inset-y-6 lg:before:left-0 lg:before:w-px lg:before:bg-accent/55" : ""
              } ${
                i % 2 === 1
                  ? "sm:before:absolute sm:before:inset-y-6 sm:before:left-0 sm:before:w-px sm:before:bg-accent/55 lg:before:bg-accent/55"
                  : ""
              }`}
            >
              <CountUp stat={stat} active={active} />
            </li>
          ))}
        </ul>
      </div>

      <HazardStripe height={10} from="right" />
    </section>
  );
}
