"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { DIVISIONS } from "@/lib/content";
import type { Division } from "@/types";

const EASE = [0.16, 1, 0.3, 1] as const;

function CornerBracket({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) {
  const map: Record<typeof position, string> = {
    tl: "top-3 left-3 border-t-2 border-l-2",
    tr: "top-3 right-3 border-t-2 border-r-2",
    bl: "bottom-3 left-3 border-b-2 border-l-2",
    br: "bottom-3 right-3 border-b-2 border-r-2",
  };
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute size-5 border-accent opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:scale-110 ${map[position]}`}
    />
  );
}

function DivisionCard({ division, index }: { division: Division; index: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.85, delay: index * 0.1, ease: EASE }}
    >
      <Link
        href={division.href}
        className="group relative block aspect-[4/5] w-full overflow-hidden bg-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base lg:aspect-[5/4]"
        aria-label={`${division.name} — ${division.productLines} product lines`}
        data-parallax="0.18"
      >
        <Image
          src={division.image}
          alt={division.imageAlt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.09] group-focus-visible:scale-[1.09]"
        />

        {/* Base gradient — keeps text always legible. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-base via-base/55 to-base/15 transition-opacity duration-700 group-hover:from-base group-hover:via-base/75 group-hover:to-base/35"
        />

        {/* Yellow wash that warms the image on hover. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-accent/0 mix-blend-overlay transition-colors duration-700 group-hover:bg-accent/15"
        />

        <CornerBracket position="tl" />
        <CornerBracket position="tr" />
        <CornerBracket position="bl" />
        <CornerBracket position="br" />

        {/* Index marker + product count, top */}
        <div className="absolute inset-x-6 top-6 flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.22em] text-primary/75">
          <span>0{index + 1} / Capability</span>
          <span className="inline-flex items-center gap-2 text-accent">
            <span className="block size-1 bg-accent" />
            {division.productLines} lines
          </span>
        </div>

        {/* Bottom content slot */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-6 sm:p-8">
          <h3 className="font-display text-[clamp(2rem,3.4vw,3.4rem)] font-black uppercase leading-[0.92] tracking-tight text-primary">
            {division.name}
          </h3>

          {/* CTA bar — on hover the entire row lifts toward the user with
              the arrow translating diagonally outward. Bigger than before
              so it reads as the dominant affordance. */}
          <div className="flex items-end justify-between gap-4 border-t border-primary/15 pt-4">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-primary/65">
              Specs &amp; product lines
            </span>
            <span className="inline-flex items-center gap-3 font-mono text-[0.78rem] uppercase tracking-[0.18em] text-accent transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-accent-hot">
              View capability
              <ArrowUpRight
                className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden
              />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function DivisionGrid() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="relative bg-base py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <div className="mb-14 grid gap-10 lg:mb-20 lg:grid-cols-12 lg:items-end">
          <p className="eyebrow text-accent lg:col-span-3">01 — Capabilities</p>
          <h2
            id="capabilities-heading"
            className="display-section text-primary lg:col-span-9"
          >
            From DIY to industrial.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
          {DIVISIONS.map((d, i) => (
            <DivisionCard key={d.slug} division={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
