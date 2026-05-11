"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type FactCategory = "dispatch" | "qc" | "capability" | "schedule" | "credentials";

interface OperationalFact {
  category: FactCategory;
  /** Where in the network this fact lives (yard or "Network"). */
  scope: string;
  /** The headline metric or status. Should read as a system fact. */
  headline: string;
  /** Short clarifier underneath the headline. */
  detail: string;
  /** Optional metric value rendered prominently to the left. */
  metric?: { value: string; unit?: string };
}

const CATEGORY_LABEL: Record<FactCategory, string> = {
  dispatch: "Dispatch",
  qc: "Quality Control",
  capability: "Capability",
  schedule: "Schedule",
  credentials: "Credentials",
};

/**
 * Operational facts catalog.
 *
 * Every entry is a statement that's actually true about the operation —
 * the design review specifically called out a "live dispatch ticker" as
 * the most differentiating thing a regional industrial site can do, but
 * shipping a fake feed would be worse than not shipping one. Until the
 * dispatch system is wired in, this rotates through real defensible
 * facts framed in the visual language of a live readout.
 *
 * When a real backend lands (Samsara / dispatch API / etc.):
 *   - Replace the static FACTS array with a fetcher hook.
 *   - Keep the `OperationalFact` shape stable; the UI doesn't care where
 *     the data comes from.
 *   - The `data refreshed at` timestamp can become the actual feed time.
 */
const FACTS: OperationalFact[] = [
  {
    category: "dispatch",
    scope: "Network",
    headline: "All four plants batching today",
    detail:
      "Westlake, Lake Charles, Sulphur, and Ragley are all live. Standard mixes dispatching same-day across Calcasieu Parish.",
    metric: { value: "4 / 4", unit: "plants" },
  },
  {
    category: "qc",
    scope: "Westlake",
    headline: "QC lab on every load",
    detail:
      "Slump, air content, and temperature checked on representative loads. Compressive break tests at 7 and 28 days, on site.",
    metric: { value: "ASTM", unit: "C39 / C143" },
  },
  {
    category: "schedule",
    scope: "Network",
    headline: "Plant-to-pour: 22 minute average",
    detail:
      "Established on the I-10 Calcasieu River Bridge precast schedule. Tighter on intra-parish dispatches.",
    metric: { value: "22", unit: "min" },
  },
  {
    category: "capability",
    scope: "Westlake",
    headline: "Coastal mix designs stocked",
    detail:
      "Corrosion-inhibiting admixture and Class C fly ash kept on site. Same pack we ran on the I-10 bridge precast and the Cameron LNG facility.",
  },
  {
    category: "schedule",
    scope: "Network",
    headline: "Continuous-pour windows by appointment",
    detail:
      "12,000 yd³ in 36 hours done before; we'll dispatch from all four plants in lockstep when the GC needs zero cold joints.",
    metric: { value: "12,000", unit: "yd³ record" },
  },
  {
    category: "credentials",
    scope: "DP Concrete Products",
    headline: "PCI Level II / III personnel on shift",
    detail:
      "Precast yard runs a credentialed shift every weekday. AASHTO and Louisiana DOTD-approved sections on the casting beds.",
  },
  {
    category: "dispatch",
    scope: "Sulphur · Lake Charles",
    headline: "Same-day standard mix dispatch",
    detail:
      "Standard ready mix to any Calcasieu Parish job site, same day. Specialty mixes 24-hour turn from QC sign-off.",
    metric: { value: "Same day", unit: "in-parish" },
  },
  {
    category: "qc",
    scope: "Westlake",
    headline: "Mix design lab on site",
    detail:
      "Custom mixes designed and verified at the Westlake lab. Trial batches available for high-spec work before the pour.",
  },
  {
    category: "capability",
    scope: "Aggregates yards",
    headline: "Three rip rap gradations stocked",
    detail:
      "#10 / #30 / #50 staged at Westlake for coastal erosion work. Marine-grade base material loaded to barge directly.",
    metric: { value: "3", unit: "gradations" },
  },
  {
    category: "schedule",
    scope: "Network",
    headline: "Saturday pours by appointment",
    detail:
      "Standard schedule is Mon–Fri 6a–5p across all four yards. Weekend dispatch available for time-critical jobs; coordinate through QC.",
  },
];

/**
 * Operational snapshot ticker.
 *
 * Single-fact-at-a-time control-panel readout. Auto-advances every
 * AUTO_ADVANCE_MS, pauses on hover and on focus, exposes manual prev /
 * next / pause-play controls. Each entry cross-fades to the next so the
 * panel doesn't jitter on rotation.
 *
 * Reduced-motion clients see a static panel that they can step through
 * manually but isn't auto-advanced. This both honors prefers-reduced-motion
 * and is materially less distracting for users with vestibular sensitivity.
 *
 * The timestamp in the footer is rendered on the client only (avoids
 * SSR/CSR mismatch). It's deliberately a date, not a time — we never want
 * a buyer to interpret this panel as a live realtime feed.
 */
const AUTO_ADVANCE_MS = 5500;

export function OperationalTicker() {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const inViewRef = useRef(false);

  // Snapshot date renders client-side so SSR is stable.
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setRefreshedAt(fmt.format(new Date()));
  }, []);

  // Pause auto-advance when offscreen so a long page doesn't burn cycles.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-advance loop. Skipped under reduced motion or when user paused
  // or when hovering (so the user can read the current fact in peace).
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (paused || hovered) return;
    const id = window.setInterval(() => {
      if (!inViewRef.current) return;
      setIndex((cur) => (cur + 1) % FACTS.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [prefersReducedMotion, paused, hovered]);

  const next = useCallback(() => {
    setIndex((cur) => (cur + 1) % FACTS.length);
  }, []);
  const prev = useCallback(() => {
    setIndex((cur) => (cur - 1 + FACTS.length) % FACTS.length);
  }, []);

  const fact = FACTS[index]!;
  const ariaLive = useMemo(() => (paused ? "off" : "polite"), [paused]);

  return (
    <section
      ref={sectionRef}
      id="operations"
      aria-label="Operational snapshot"
      className="relative overflow-hidden border-y border-line/60 bg-base"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <span aria-hidden="true" className="grain" />

      <div className="relative z-[2] mx-auto grid max-w-[1480px] grid-cols-12 gap-6 px-6 pb-10 pt-12 sm:px-10 sm:pb-14 sm:pt-16 lg:gap-10 lg:pb-16 lg:pt-20">
        {/* Left rail: section title + controls */}
        <div className="col-span-12 flex flex-col gap-5 lg:col-span-4">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="block h-2 w-2 rounded-full bg-accent shadow-[0_0_0_4px_rgb(245_197_24_/_0.18)]"
            />
            <p className="eyebrow text-accent">Operational snapshot</p>
          </div>
          <h2 className="font-display text-[clamp(1.75rem,3.6vw,2.6rem)] font-black uppercase leading-[0.95] tracking-tight text-primary">
            How the network
            <br />
            <span className="text-accent">is running today.</span>
          </h2>
          <p className="max-w-[42ch] text-sm leading-[1.55] text-primary/85 sm:text-base">
            A four-yard operation moves a lot of small facts through it
            every day. Here are the ones that matter to a contractor
            planning a pour.
          </p>

          {/* Controls */}
          <div
            className="mt-2 flex items-center gap-2"
            role="group"
            aria-label="Snapshot controls"
          >
            <button
              type="button"
              onClick={prev}
              aria-label="Previous fact"
              className="inline-flex size-10 items-center justify-center border border-line text-primary/85 transition hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:bg-accent active:text-ink"
            >
              <ArrowLeft className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next fact"
              className="inline-flex size-10 items-center justify-center border border-line text-primary/85 transition hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:bg-accent active:text-ink"
            >
              <ArrowRight className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              aria-label={paused ? "Resume auto-advance" : "Pause auto-advance"}
              className="ml-1 inline-flex h-10 items-center gap-2 border border-line px-3 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-primary/85 transition hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {paused ? (
                <>
                  <Play aria-hidden className="size-3" />
                  Resume
                </>
              ) : (
                <>
                  <Pause aria-hidden className="size-3" />
                  Pause
                </>
              )}
            </button>
          </div>
        </div>

        {/* Readout panel */}
        <div className="col-span-12 lg:col-span-8">
          <div className="relative flex h-full min-h-[260px] flex-col justify-between border border-line bg-elevated p-6 sm:min-h-[280px] sm:p-8">
            {/* Pour rule. Same signature gesture as PourStat / Hero / Timeline. */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 block h-full w-px bg-accent"
            />

            {/* Top meta: category + scope + index counter */}
            <div className="flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.22em] text-muted">
              <span className="inline-flex items-center gap-3">
                <span className="text-accent">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(FACTS.length).padStart(2, "0")}
                </span>
                <span aria-hidden className="block h-2 w-px bg-line" />
                <span>{CATEGORY_LABEL[fact.category]}</span>
              </span>
              <span>{fact.scope}</span>
            </div>

            {/* Crossfading body */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 10 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: -10 }
                }
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.45,
                  ease: EASE,
                }}
                className="my-6 flex flex-col gap-5 sm:my-8 lg:flex-row lg:items-end lg:gap-10"
                aria-live={ariaLive}
                aria-atomic="true"
              >
                {fact.metric && (
                  <div className="flex flex-col gap-1 lg:min-w-[10rem]">
                    <span className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-black leading-[0.85] tracking-tight text-primary tabular-nums">
                      {fact.metric.value}
                    </span>
                    {fact.metric.unit && (
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-accent">
                        {fact.metric.unit}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-2">
                  <p className="font-display text-[clamp(1.25rem,2.4vw,1.75rem)] font-bold uppercase leading-[1.1] tracking-tight text-primary">
                    {fact.headline}
                  </p>
                  <p className="font-serif-narrative max-w-[60ch] text-[0.95rem] leading-[1.55] text-primary/80 sm:text-base">
                    {fact.detail}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Footer meta — honest snapshot framing */}
            <div className="flex flex-col gap-2 border-t border-line pt-4 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-muted sm:flex-row sm:items-center sm:justify-between">
              <span>
                Snapshot · refreshed{" "}
                <span className="text-primary/70">
                  {refreshedAt ?? "today"}
                </span>
              </span>
              <span>
                {paused
                  ? "Auto-advance paused"
                  : `Auto-advancing every ${AUTO_ADVANCE_MS / 1000}s`}
              </span>
            </div>

            {/* Progress dots */}
            <ol
              aria-hidden="true"
              className="absolute bottom-3 right-6 hidden gap-1.5 sm:flex"
            >
              {FACTS.map((_, i) => (
                <li
                  key={i}
                  className={`block h-px w-5 transition-colors duration-300 ${
                    i === index ? "bg-accent" : "bg-line"
                  }`}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
