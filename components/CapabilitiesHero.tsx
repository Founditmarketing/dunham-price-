"use client";

import { motion, useReducedMotion } from "framer-motion";

import { HazardStripe } from "@/components/HazardStripe";
import { EASE } from "@/lib/motion";

const CERTS = ["ACI", "PCI", "TX DOT", "LA DOTD"] as const;

export function CapabilitiesHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <section
        id="top"
        aria-label="Capabilities introduction"
        className="relative isolate flex min-h-[60vh] w-full items-end overflow-hidden bg-base pb-12 pt-32 sm:pb-16 sm:pt-40 lg:min-h-[64vh] lg:pb-20 lg:pt-44"
      >
        {/* Subtle grid wash — engineering blueprint feel, very low contrast */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #f4f1ea 1px, transparent 1px), linear-gradient(to bottom, #f4f1ea 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Subtle radial wash from bottom-left */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 70% at 0% 100%, rgba(245,197,24,0.06) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 mx-auto grid w-full max-w-[1480px] gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          {/* Left: eyebrow + headline + subhead */}
          <div className="lg:col-span-8">
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-8 inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-accent"
            >
              <span className="block h-px w-8 bg-accent" />
              Capabilities
            </motion.p>

            <h1 className="font-display font-black uppercase leading-[0.86] tracking-tight text-primary text-[clamp(3.5rem,9vw,7rem)]">
              <span className="reveal-mask">
                <span style={{ animationDelay: "0.05s" }}>Every</span>
              </span>{" "}
              <span className="reveal-mask">
                <span style={{ animationDelay: "0.13s" }}>mix.</span>
              </span>{" "}
              <span className="reveal-mask">
                <span style={{ animationDelay: "0.21s" }}>Every</span>
              </span>{" "}
              <span className="reveal-mask">
                <span style={{ animationDelay: "0.29s" }}>spec.</span>
              </span>{" "}
              <span className="reveal-mask block sm:inline">
                <span
                  style={{ animationDelay: "0.4s" }}
                  className="text-accent"
                >
                  Every job.
                </span>
              </span>
            </h1>

            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
              className="mt-10 max-w-[58ch] text-base leading-relaxed text-primary/90 sm:text-lg"
            >
              From DIY pours to bridge girders — four divisions delivering
              engineered concrete, precast, and aggregates across Southwest
              Louisiana since 1939.
            </motion.p>
          </div>

          {/* Right: vertical mono callout box framed in yellow */}
          <motion.aside
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="relative lg:col-span-4 lg:justify-self-end"
            aria-label="Certifications"
          >
            <div className="relative max-w-sm border border-accent/70 bg-base/40 p-6 backdrop-blur-sm sm:p-7">
              {/* Top-left and bottom-right corner ticks */}
              <span
                aria-hidden="true"
                className="absolute -left-px -top-px size-3 border-l-2 border-t-2 border-accent"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-px -right-px size-3 border-b-2 border-r-2 border-accent"
              />

              <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-accent">
                Certified
              </p>
              <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
                {CERTS.map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-2 font-mono text-[0.78rem] tracking-[0.12em] text-primary"
                  >
                    <span className="block size-1.5 bg-accent" />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-line pt-4 font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.18em] text-muted">
                Level II &amp; III
                <br />
                PCI-certified management
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      <HazardStripe height={12} from="left" />
    </>
  );
}
