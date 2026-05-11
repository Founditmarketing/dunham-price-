"use client";

import Link from "next/link";
import { useDeferredValue, useId, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone, Sliders } from "lucide-react";

import { SITE } from "@/lib/content";
import { EASE } from "@/lib/motion";
import {
  APPLICATIONS,
  CONDITIONS,
  getMixRecommendation,
  quoteHrefForSpec,
  type SpecApplication,
  type SpecCondition,
  type SpecInputs,
} from "@/lib/spec";

const PSI_VALUES = [2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000] as const;
const SLUMP_MIN = 2;
const SLUMP_MAX = 8;
const SLUMP_STEP = 0.5;

/**
 * Mix-spec selector. The page-owning component for /spec.
 *
 * UX contract:
 *   - Inputs and recommendation share one screen. Changing any input updates
 *     the recommendation live; there is no submit button (engineers don't
 *     want forms, they want immediate feedback).
 *   - Inputs are deferred via useDeferredValue so panel re-renders are
 *     batched and the UI stays smooth on slower devices.
 *   - The recommendation is grounded in real products from
 *     lib/capabilities.ts via the recommendation engine in lib/spec.ts.
 *     This component does no recommendation logic of its own.
 *   - When the inputs land outside the standard matrix (custom application,
 *     PSI < 2500 or > 6000), the recommendation flags itself custom: true
 *     and we surface a stronger "Talk to QC" CTA.
 */
export function SpecBuilder() {
  const prefersReducedMotion = useReducedMotion();
  const headingId = useId();

  const [application, setApplication] = useState<SpecApplication>("slab");
  const [psi, setPsi] = useState<number>(4000);
  const [slump, setSlump] = useState<number>(5);
  const [conditions, setConditions] = useState<SpecCondition[]>([]);

  // Defer the inputs so the recommendation renders smoothly during rapid
  // input changes (esp. dragging the slump slider).
  const dApp = useDeferredValue(application);
  const dPsi = useDeferredValue(psi);
  const dSlump = useDeferredValue(slump);
  const dCond = useDeferredValue(conditions);

  const inputs: SpecInputs = useMemo(
    () => ({
      application: dApp,
      psi: dPsi,
      slump: dSlump,
      conditions: dCond,
    }),
    [dApp, dPsi, dSlump, dCond],
  );

  const rec = useMemo(() => getMixRecommendation(inputs), [inputs]);
  const quoteHref = useMemo(() => quoteHrefForSpec(inputs), [inputs]);

  const toggleCondition = (c: SpecCondition) => {
    setConditions((cur) =>
      cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c],
    );
  };

  return (
    <section
      id="spec"
      aria-labelledby={headingId}
      className="relative bg-base text-primary"
    >
      {/* Header. The eyebrow is mono and the heading is direct so the page
          reads as an engineering tool, not a marketing page. */}
      <div className="mx-auto max-w-[1480px] px-6 pb-10 pt-32 sm:px-10 sm:pb-14 sm:pt-40 lg:pb-16 lg:pt-44">
        <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5 inline-flex items-center gap-3 text-accent">
              <Sliders className="size-3.5" aria-hidden /> Mix selector
            </p>
            <h1
              id={headingId}
              className="display-fluid max-w-[18ch] text-balance text-primary"
            >
              Find your spec.
            </h1>
          </div>
          <p className="font-serif-narrative max-w-[52ch] text-[1.0625rem] leading-[1.6] text-primary/85 sm:text-[1.15rem] lg:col-span-4">
            Tell us the application, target strength, and conditions. We&rsquo;ll
            match it to the right product from our catalog and surface the
            mix design as a starting point. QC will tune to your job before
            the pour.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1480px] grid-cols-12 gap-x-6 gap-y-10 px-6 pb-20 sm:px-10 sm:pb-28 lg:gap-x-10 lg:pb-32">
        {/* Inputs column */}
        <form
          className="col-span-12 flex flex-col gap-10 lg:col-span-5"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Mix inputs"
        >
          {/* Application */}
          <Field label="Application" hint="What are you pouring?">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
              {APPLICATIONS.map((a) => {
                const active = a.id === application;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setApplication(a.id)}
                    aria-pressed={active}
                    className={`group flex min-h-[64px] flex-col items-start gap-1 border px-3 py-3 text-left transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      active
                        ? "border-accent bg-accent/10 text-primary"
                        : "border-line bg-base text-primary/80 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em]">
                      {a.label}
                    </span>
                    <span className="text-[0.65rem] leading-snug text-muted">
                      {a.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </Field>

          {/* PSI */}
          <Field
            label="Compressive strength"
            hint="28-day cylinder break, ASTM C39"
          >
            <PsiStepper value={psi} onChange={setPsi} />
          </Field>

          {/* Slump */}
          <Field label="Slump" hint="ASTM C143 cone test">
            <SlumpSlider value={slump} onChange={setSlump} />
          </Field>

          {/* Conditions */}
          <Field
            label="Pour conditions"
            hint="Select any that apply, none required"
          >
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => {
                const active = conditions.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCondition(c.id)}
                    aria-pressed={active}
                    title={c.hint}
                    className={`min-h-[40px] border px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      active
                        ? "border-accent bg-accent text-ink"
                        : "border-line bg-base text-primary/80 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </Field>
        </form>

        {/* Recommendation column */}
        <div className="col-span-12 lg:col-span-7">
          <motion.div
            key={`${rec.primary.productId}-${rec.additions.map((a) => a.productId).join(",")}-${rec.custom}`}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative flex flex-col gap-8 border border-line bg-elevated p-6 sm:p-8 lg:p-10"
          >
            {/* Pour rule. Same signature motion as PourStat / Hero / Timeline.
                Stays as a permanent left-edge accent on the recommendation
                panel. */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 block h-full w-px bg-accent"
            />

            {/* Header */}
            <div className="flex flex-col gap-3">
              <p className="eyebrow text-accent">
                {rec.custom ? "Starting point · custom mix" : "Recommended mix"}
              </p>
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-black uppercase leading-[0.95] tracking-tight text-primary">
                {rec.primary.productName}
              </h2>
              <p className="font-serif-narrative max-w-[60ch] text-[1.0625rem] leading-[1.55] text-primary/85">
                {rec.primary.reason}
              </p>
            </div>

            {/* Mix design readout. Tabular, mono, like a real spec sheet. */}
            <div className="border-t border-line pt-6">
              <p className="eyebrow mb-4 text-muted">Mix design</p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-[0.78rem] sm:grid-cols-4">
                <SpecField label="Strength" value={`${rec.mixDesign.psi.toLocaleString()} PSI`} />
                <SpecField label="Slump" value={rec.mixDesign.slumpLabel} />
                <SpecField label="Aggregate" value={rec.mixDesign.aggregate} />
                <SpecField label="W/C ratio" value={rec.mixDesign.wcRatio} />
                <SpecField
                  label="Cement"
                  value={`${rec.mixDesign.sacksPerYd3} sacks/yd³`}
                />
                <SpecField label="Air" value="4–6%" />
              </dl>

              {rec.mixDesign.notes.length > 0 && (
                <ul className="mt-5 space-y-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                  {rec.mixDesign.notes.map((n) => (
                    <li key={n} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-1.5 block size-1 shrink-0 bg-accent/70"
                      />
                      <span className="normal-case tracking-normal text-primary/70">
                        {n}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Additions, if any. Each has its own reason. */}
            {rec.additions.length > 0 && (
              <div className="border-t border-line pt-6">
                <p className="eyebrow mb-4 text-muted">
                  Add to your spec · {rec.additions.length}
                </p>
                <ul className="flex flex-col divide-y divide-line/70">
                  {rec.additions.map((a, i) => (
                    <li
                      key={`${a.productId}-${i}`}
                      className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0"
                    >
                      <p className="font-display text-base font-bold uppercase tracking-tight text-primary sm:text-lg">
                        {a.productName}
                      </p>
                      <p className="text-sm leading-relaxed text-primary/75">
                        {a.reason}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTAs. The custom flag swaps the primary affordance from
                "Request this quote" to "Talk to QC", because the
                recommendation isn't ready to send to dispatch yet. */}
            <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:flex-wrap">
              {rec.custom ? (
                <>
                  <a
                    href={SITE.phoneTel}
                    className="group inline-flex items-center justify-between gap-5 whitespace-nowrap bg-accent px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:bg-accent-hot"
                  >
                    <span className="inline-flex items-center gap-3">
                      <Phone aria-hidden className="size-4" />
                      Talk to QC · {SITE.phone}
                    </span>
                    <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </a>
                  <Link
                    href={quoteHref}
                    className="group inline-flex items-center justify-between gap-5 whitespace-nowrap border border-primary/35 px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-primary transition hover:border-accent hover:text-accent"
                  >
                    Send this as a starting point
                    <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={quoteHref}
                    className="group inline-flex items-center justify-between gap-5 whitespace-nowrap bg-accent px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:bg-accent-hot"
                  >
                    Request this quote
                    <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </Link>
                  <a
                    href={SITE.phoneTel}
                    className="group inline-flex items-center justify-between gap-5 whitespace-nowrap border border-primary/35 px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-primary transition hover:border-accent hover:text-accent"
                  >
                    <span className="inline-flex items-center gap-3">
                      <Phone aria-hidden className="size-4" />
                      Talk to QC · {SITE.phone}
                    </span>
                  </a>
                </>
              )}
            </div>

            {/* Footer disclaimer. Honest about what this tool is for. */}
            <p className="border-t border-line pt-5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
              Starting-point recommendation. QC will confirm the final mix
              design, slump tolerance, and admixture pack against your
              project specs before the pour.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Field shells                                                                */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-display text-[0.95rem] font-bold uppercase tracking-tight text-primary sm:text-base">
          {label}
        </span>
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
          {hint}
        </span>
      </div>
      {children}
    </div>
  );
}

function SpecField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-muted">
        {label}
      </dt>
      <dd className="font-display text-base font-bold tracking-tight text-primary tabular-nums sm:text-lg">
        {value}
      </dd>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PSI stepper — segmented control over the standard PSI bands                 */
/* -------------------------------------------------------------------------- */

function PsiStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Compressive strength in PSI"
      className="grid grid-cols-4 gap-1 sm:grid-cols-8"
    >
      {PSI_VALUES.map((v) => {
        const active = v === value;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v)}
            className={`flex h-12 items-center justify-center border font-mono text-[0.7rem] tracking-[0.12em] tabular-nums transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              active
                ? "border-accent bg-accent text-ink"
                : "border-line bg-base text-primary/80 hover:border-primary/40 hover:text-primary"
            }`}
          >
            {v.toLocaleString()}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Slump slider — native range with a custom track + value readout             */
/* -------------------------------------------------------------------------- */

function SlumpSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const id = useId();
  const pct = ((value - SLUMP_MIN) / (SLUMP_MAX - SLUMP_MIN)) * 100;

  return (
    <div className="flex flex-col gap-3">
      {/* Track + value readout */}
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-display text-3xl font-black tracking-tight text-primary tabular-nums sm:text-4xl">
          {value.toFixed(value % 1 === 0 ? 0 : 1)}
          <span className="ml-2 font-mono text-xs font-medium tracking-[0.16em] text-accent">
            in
          </span>
        </span>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
          {SLUMP_MIN} – {SLUMP_MAX} in
        </span>
      </div>

      <div className="relative">
        {/* Visual track — under the native input. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 h-px -translate-y-1/2 bg-accent"
          style={{ width: `${pct}%` }}
        />
        <input
          id={id}
          type="range"
          min={SLUMP_MIN}
          max={SLUMP_MAX}
          step={SLUMP_STEP}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          aria-label="Slump in inches"
          className="spec-slump-range relative block h-10 w-full cursor-pointer appearance-none bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </div>

      {/* Reference labels: stiff / workable / fluid */}
      <div className="flex justify-between font-mono text-[0.55rem] uppercase tracking-[0.18em] text-muted">
        <span>2&quot; · Stiff</span>
        <span>5&quot; · Workable</span>
        <span>8&quot; · Fluid</span>
      </div>
    </div>
  );
}
