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
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, delay: index * 0.1, ease: EASE }}
      className="flex h-full"
    >
      <Link
        href={division.href}
        className="group relative flex w-full flex-col overflow-hidden bg-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
        aria-label={`${division.name}, ${division.productLines} product lines: ${division.lines.join(", ")}`}
      >
        {/* Image area. Owns its own aspect ratio so the card is reliably
            tall enough on every screen. The previous "image fills card with
            text overlay at bottom" pattern collapsed on short mobile
            aspect ratios: when the bottom slot's product list grew past
            the card's mobile height, the eyebrow row and the first product
            line ended up sitting on top of each other. Splitting the card
            into image-on-top + text-flowing-below makes overlap
            structurally impossible. */}
        <div
          className="relative aspect-[4/3] w-full overflow-hidden"
          data-parallax="0.18"
        >
          <Image
            src={division.image}
            alt={division.imageAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.09] group-focus-visible:scale-[1.09]"
          />

          {/* Top scrim so the eyebrow chips always have guaranteed dark
              behind them, regardless of the photo's local contrast. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-base/85 via-base/45 to-transparent"
          />

          {/* Bottom scrim. Bleeds the image into the elevated text panel
              below so there's no hard seam at the boundary. Color matches
              the panel's bg-elevated (#1a1a1c). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%]"
            style={{
              backgroundImage:
                "linear-gradient(to top, rgb(26 26 28) 0%, rgba(26 26 28 / 0) 100%)",
            }}
          />

          {/* Yellow wash that warms the image on hover. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-accent/0 mix-blend-overlay transition-colors duration-700 group-hover:bg-accent/12 group-focus-visible:bg-accent/12"
          />

          <CornerBracket position="tl" />
          <CornerBracket position="tr" />
          <CornerBracket position="bl" />
          <CornerBracket position="br" />

          {/* Eyebrow row pinned to the top of the image. */}
          <div className="absolute inset-x-5 top-5 flex items-center justify-between font-mono text-[0.66rem] uppercase tracking-[0.22em] text-primary/85 sm:inset-x-6 sm:top-6 sm:text-[0.68rem]">
            <span>0{index + 1} / Capability</span>
            <span className="inline-flex items-center gap-2 text-accent">
              <span className="block size-1 bg-accent" />
              {division.productLines} lines
            </span>
          </div>
        </div>

        {/* Text content. Flows naturally below the image with no absolute
            positioning, so it cannot overlap the eyebrow no matter how
            long the product line list grows or how narrow the viewport.
            On the lg breakpoint we constrain the gap so the four cards
            in the 2x2 grid stay visually balanced. */}
        <div className="flex flex-1 flex-col gap-4 bg-elevated p-6 sm:gap-5 sm:p-8">
          <h3 className="font-display text-[clamp(1.75rem,3.4vw,3rem)] font-black uppercase leading-[0.95] tracking-tight text-primary">
            {division.name}
          </h3>

          {/* Product lines, real names. Comma-separated mono so it reads
              as a spec rail. Always visible (mobile + reduced-motion safe);
              text color amplifies on hover/focus. */}
          <ul
            aria-label={`${division.name} product lines`}
            className="-mx-1 flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-primary/65 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-primary/95 group-focus-visible:text-primary/95"
          >
            {division.lines.map((line, i) => (
              <li
                key={line}
                className="inline-flex items-center gap-2 px-1"
              >
                {i > 0 && (
                  <span
                    aria-hidden
                    className="block size-[3px] rounded-full bg-accent/60"
                  />
                )}
                {line}
              </li>
            ))}
          </ul>

          {/* CTA bar. mt-auto pushes it to the bottom so cards in the
              same grid row keep their CTAs vertically aligned. */}
          <div className="mt-auto flex items-end justify-between gap-4 border-t border-primary/15 pt-4">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted">
              Open full catalog
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
      className="relative bg-base py-16 sm:py-24 lg:py-36"
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
