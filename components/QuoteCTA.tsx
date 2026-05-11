"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

import { HazardStripe } from "@/components/HazardStripe";
import { MagneticButton } from "@/components/MagneticButton";
import { SITE } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

interface QuoteCTAProps {
  /** Override the headline (defaults to "Ready to build?"). */
  headline?: ReactNode;
  /** Override the subhead body copy. */
  subhead?: ReactNode;
  /**
   * If set, pre-fills the request form with this division slug
   * (e.g. `ready-mix`, `precast`).
   */
  service?: string;
  /** Override the section's `id`. Defaults to `quote`. */
  id?: string;
}

export function QuoteCTA({
  headline,
  subhead,
  service,
  id = "quote",
}: QuoteCTAProps = {}) {
  const prefersReducedMotion = useReducedMotion();

  const quoteHref = service
    ? `/#quote?service=${encodeURIComponent(service)}`
    : "#";

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="relative bg-accent text-ink"
    >
      <HazardStripe height={16} from="left" />

      <div className="mx-auto grid max-w-[1480px] gap-12 px-6 py-24 sm:px-10 sm:py-28 lg:grid-cols-12 lg:gap-16 lg:py-36">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-6 text-ink/70">Get a quote</p>
          <motion.h2
            id={`${id}-heading`}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.0, ease: EASE }}
            className="font-display text-[clamp(3.5rem,9vw,7.5rem)] font-black uppercase leading-[0.86] tracking-tight text-ink"
          >
            {headline ?? (
              <>
                Ready <br className="sm:hidden" /> to&nbsp;build?
              </>
            )}
          </motion.h2>
        </div>

        <div className="flex flex-col justify-end gap-8 lg:col-span-5">
          <p className="max-w-[44ch] text-base leading-relaxed text-ink/85 sm:text-lg">
            {subhead ??
              `Get a quote from the Southwest Louisiana team that's been mixing it right since ${SITE.founded}.`}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <MagneticButton strength={0.3}>
              <Link
                href={quoteHref}
                className="group inline-flex items-center justify-between gap-5 whitespace-nowrap bg-ink px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-cream transition-colors hover:bg-base"
              >
                Request a Quote
                <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <a
              href={SITE.phoneTel}
              className="group inline-flex items-center justify-between gap-5 whitespace-nowrap border border-ink px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-cream"
            >
              <span className="inline-flex items-center gap-3">
                <Phone className="size-4" aria-hidden />
                Call {SITE.phone}
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
