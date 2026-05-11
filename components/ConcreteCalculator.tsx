"use client";

import Link from "next/link";
import {
  useDeferredValue,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Calculator } from "lucide-react";

type Mode = "slab" | "footing" | "column";

interface NumberFieldProps {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  /** A short hint shown under the field. */
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const TABS: { id: Mode; label: string; sub: string }[] = [
  { id: "slab", label: "Slab", sub: "Patios, driveways, floors" },
  { id: "footing", label: "Footing", sub: "Strip & spread footings" },
  { id: "column", label: "Column", sub: "Round columns & piers" },
];

const BAGS_PER_YD3 = 60; // 60 lb bags ≈ 0.45 ft³ each → 60 / yd³
const M3_PER_YD3 = 0.764555;

/**
 * Functional concrete calculator. Replaces the embarrassing calculator.net
 * outbound link the legacy site used.
 *
 * Math:
 *   Slab / Footing : (L_ft × W_ft × T_in/12) / 27   = yd³
 *   Column         : π × (D_in/24)² × H_ft   / 27   = yd³
 *
 * Inputs are stored as strings so partial typing ("12.") doesn't snap to NaN.
 * Live results are debounced via React's `useDeferredValue` so display
 * doesn't flicker while the user is mid-keystroke.
 */
export function ConcreteCalculator() {
  const prefersReducedMotion = useReducedMotion();
  const [mode, setMode] = useState<Mode>("slab");

  // Slab / Footing
  const [length, setLength] = useState("20");
  const [width, setWidth] = useState("10");
  const [thickness, setThickness] = useState("4");

  // Column
  const [diameter, setDiameter] = useState("12");
  const [height, setHeight] = useState("10");

  // Defer the calc inputs so live updates feel smooth, not jittery.
  const dLen = useDeferredValue(length);
  const dWid = useDeferredValue(width);
  const dThk = useDeferredValue(thickness);
  const dDia = useDeferredValue(diameter);
  const dHt = useDeferredValue(height);

  const yd3 = useMemo(() => {
    const num = (s: string) => {
      const v = parseFloat(s);
      return Number.isFinite(v) && v > 0 ? v : 0;
    };
    if (mode === "column") {
      const r = num(dDia) / 24; // diameter (in) → radius (ft)
      const h = num(dHt);
      return (Math.PI * r * r * h) / 27;
    }
    const L = num(dLen);
    const W = num(dWid);
    const T = num(dThk) / 12; // inches → feet
    return (L * W * T) / 27;
  }, [mode, dLen, dWid, dThk, dDia, dHt]);

  const m3 = yd3 * M3_PER_YD3;
  const bags = Math.ceil(yd3 * BAGS_PER_YD3);
  const hasResult = yd3 > 0;

  // Pre-fill the quote form with the current calculation so dispatch can
  // pick up the load without re-asking. // TODO: wire to real quote route.
  const quoteHref = useMemo(() => {
    const v = hasResult ? yd3.toFixed(2) : "0";
    return `/#quote?service=ready-mix&volume=${v}&mode=${mode}`;
  }, [hasResult, yd3, mode]);

  return (
    <section
      id="calculator"
      aria-labelledby="calc-heading"
      className="relative bg-base py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        {/* Header */}
        <div className="mb-12 grid gap-8 lg:mb-16 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5 inline-flex items-center gap-3 text-accent">
              <Calculator className="size-3.5" aria-hidden /> Tools
            </p>
            <h2
              id="calc-heading"
              className="display-section max-w-[14ch] text-primary"
            >
              Calculate your pour.
            </h2>
          </div>
          <p className="max-w-[44ch] text-base leading-relaxed text-primary/85 sm:text-lg lg:col-span-5">
            Live volume estimate in cubic yards, cubic meters, and 60&nbsp;lb
            bags. Round up roughly 5 – 10% for waste, then send the spec to
            dispatch.
          </p>
        </div>

        {/* Calculator surface */}
        <div className="grid gap-px overflow-hidden bg-line ring-1 ring-line lg:grid-cols-2">
          {/* INPUTS PANE */}
          <div className="bg-base p-6 sm:p-10">
            {/* Tabs */}
            <div
              role="tablist"
              aria-label="Calculation mode"
              className="mb-10 grid grid-cols-3 gap-px bg-line"
            >
              {TABS.map((t) => {
                const selected = t.id === mode;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    onClick={() => setMode(t.id)}
                    className={`group relative flex flex-col items-start gap-1 px-4 py-3 text-left transition-colors ${
                      selected
                        ? "bg-elevated text-primary"
                        : "bg-base text-concrete hover:text-primary"
                    }`}
                  >
                    <span
                      className={`font-display text-base font-bold uppercase tracking-tight sm:text-lg ${
                        selected ? "text-primary" : ""
                      }`}
                    >
                      {t.label}
                    </span>
                    <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted sm:block">
                      {t.sub}
                    </span>
                    {selected && (
                      <motion.span
                        layoutId="calc-tab-underline"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                        className="absolute inset-x-0 -bottom-px h-[2px] bg-accent"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Inputs */}
            {mode !== "column" ? (
              <div className="grid gap-7 sm:grid-cols-3">
                <NumberField
                  label="Length"
                  unit="ft"
                  value={length}
                  onChange={setLength}
                />
                <NumberField
                  label="Width"
                  unit="ft"
                  value={width}
                  onChange={setWidth}
                />
                <NumberField
                  label="Thickness"
                  unit="in"
                  value={thickness}
                  onChange={setThickness}
                  hint="Most slabs: 4 – 6 in"
                />
              </div>
            ) : (
              <div className="grid gap-7 sm:grid-cols-2">
                <NumberField
                  label="Diameter"
                  unit="in"
                  value={diameter}
                  onChange={setDiameter}
                />
                <NumberField
                  label="Height"
                  unit="ft"
                  value={height}
                  onChange={setHeight}
                />
              </div>
            )}

            {/* Note */}
            <p className="mt-10 border-t border-line pt-5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
              Estimates only. Confirm with dispatch before scheduling.
            </p>
          </div>

          {/* OUTPUT PANE */}
          <div className="relative bg-elevated p-6 sm:p-10">
            <p className="eyebrow mb-8 text-accent">Live estimate</p>

            {!hasResult ? (
              <div className="flex h-48 items-center justify-center font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
                Enter dimensions to estimate
              </div>
            ) : (
              <motion.dl
                initial={
                  prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="grid grid-cols-1 gap-8 sm:grid-cols-3"
              >
                <Result
                  value={formatYd(yd3)}
                  unit="yd³"
                  label="Cubic yards"
                  primary
                />
                <Result value={formatM3(m3)} unit="m³" label="Cubic meters" />
                <Result
                  value={formatBags(bags)}
                  unit="bags"
                  label="60 lb bags"
                />
              </motion.dl>
            )}

            <div className="mt-12 border-t border-line pt-8">
              <Link
                aria-disabled={!hasResult}
                tabIndex={hasResult ? 0 : -1}
                href={quoteHref}
                className={`group inline-flex items-center justify-between gap-6 px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] transition ${
                  hasResult
                    ? "bg-accent text-ink hover:bg-accent-hot"
                    : "bg-line text-muted pointer-events-none"
                }`}
              >
                Request a Quote with these specs
                <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <p className="mt-4 max-w-[44ch] font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                Pre-fills the quote form with mode &amp; volume. Dispatch
                confirms within one business day.
              </p>
            </div>

            {/* Background spec marker — quiet editorial flourish */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -top-4 select-none font-display text-[10rem] font-black leading-none tracking-tight text-primary/[0.03] sm:text-[12rem]"
            >
              {mode === "slab" ? "S" : mode === "footing" ? "F" : "C"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function NumberField({
  label,
  unit,
  value,
  onChange,
  hint,
  min = 0,
  max = 9999,
  step = 0.1,
}: NumberFieldProps) {
  const id = useId();
  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    // Sanitize input rather than silently reject. Pasting "12 ft" → "12",
    // "1,200" → "1200", "abc12.5xyz" → "12.5". Collapses any second decimal
    // point so the value stays parseable as a finite float.
    const cleaned = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
    onChange(cleaned);
  };
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-2 flex items-baseline justify-between font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted"
      >
        <span>{label}</span>
        <span className="text-accent">{unit}</span>
      </label>
      <input
        id={id}
        inputMode="decimal"
        type="text"
        value={value}
        onChange={handle}
        min={min}
        max={max}
        step={step}
        className="w-full border-b-2 border-line bg-transparent px-0 py-3 font-mono text-2xl tabular-nums text-primary outline-none transition-colors placeholder:text-muted/50 focus:border-accent focus:caret-accent sm:text-3xl"
        placeholder="0"
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      {hint && (
        <span
          id={`${id}-hint`}
          className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted"
        >
          {hint}
        </span>
      )}
    </div>
  );
}

function Result({
  value,
  unit,
  label,
  primary = false,
}: {
  value: string;
  unit: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <span
          className={`font-display font-black leading-[0.85] tracking-tight tabular-nums ${
            primary ? "text-accent" : "text-primary"
          } text-[clamp(2.75rem,5vw,4rem)]`}
        >
          {value}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          {unit}
        </span>
      </div>
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-muted">
        {label}
      </span>
    </div>
  );
}

function formatYd(n: number): string {
  if (n >= 100) return n.toFixed(0);
  if (n >= 10) return n.toFixed(1);
  return n.toFixed(2);
}
function formatM3(n: number): string {
  if (n >= 100) return n.toFixed(0);
  if (n >= 10) return n.toFixed(1);
  return n.toFixed(2);
}
function formatBags(n: number): string {
  return n.toLocaleString();
}
