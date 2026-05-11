"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { HazardStripe } from "@/components/HazardStripe";
import type { ProjectMetric } from "@/lib/projects";

const COUNT_DURATION_MS = 1600;

interface ProjectMetricsProps {
  metrics: ProjectMetric[];
}

function MetricNumber({
  metric,
  active,
}: {
  metric: ProjectMetric;
  active: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState<string>(
    metric.numeric == null || prefersReducedMotion ? metric.value : "0",
  );

  useEffect(() => {
    if (!active || metric.numeric == null) return;
    if (prefersReducedMotion) {
      setDisplay(metric.value);
      return;
    }
    const target = metric.numeric;
    const decimals = metric.decimals ?? 0;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 4); // ease-out-quart
      const value = target * eased;
      setDisplay(formatValue(value, decimals));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(metric.value); // snap to canonical formatting on finish
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, metric.numeric, metric.decimals, metric.value, prefersReducedMotion]);

  return (
    <span className="font-display text-[clamp(3rem,7vw,5.5rem)] font-black leading-[0.85] tracking-tight tabular-nums text-primary">
      {display}
    </span>
  );
}

function formatValue(n: number, decimals: number): string {
  if (decimals > 0) return n.toFixed(decimals);
  // Use locale grouping for big integers (e.g. 12,000)
  return Math.round(n).toLocaleString();
}

export function ProjectMetrics({ metrics }: ProjectMetricsProps) {
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
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Project metrics"
      className="relative bg-base"
    >
      <HazardStripe height={12} from="left" />

      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <ul
          className={`grid grid-cols-1 divide-y divide-line/60 sm:grid-cols-2 sm:divide-y-0 ${
            metrics.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {metrics.map((m, i) => (
            <li
              key={`${m.label}-${i}`}
              className={`relative flex flex-col items-start gap-3 px-4 py-10 sm:items-center sm:px-6 sm:py-14 lg:py-16 ${
                i > 0
                  ? "lg:before:absolute lg:before:inset-y-6 lg:before:left-0 lg:before:w-px lg:before:bg-accent/55"
                  : ""
              } ${
                i % 2 === 1
                  ? "sm:before:absolute sm:before:inset-y-6 sm:before:left-0 sm:before:w-px sm:before:bg-accent/55"
                  : ""
              }`}
            >
              <div className="flex items-baseline gap-2">
                <MetricNumber metric={m} active={active} />
                {m.unit && (
                  <span className="font-mono text-sm uppercase tracking-[0.18em] text-accent sm:text-base">
                    {m.unit}
                  </span>
                )}
              </div>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted">
                {m.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <HazardStripe height={6} from="right" soft />
    </section>
  );
}
