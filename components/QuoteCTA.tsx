"use client";

import { Suspense, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { HazardStripe } from "@/components/HazardStripe";
import { QuoteForm } from "@/components/QuoteForm";
import { EASE } from "@/lib/motion";

interface QuoteCTAProps {
  /** Override the headline (defaults to "Ready to build?"). */
  headline?: ReactNode;
  /** Override the subhead body copy. */
  subhead?: ReactNode;
  /**
   * Reserved for future use. Pre-selection of the form's service radio
   * happens through URL search params (e.g. `/?service=ready-mix#quote`),
   * which the QuoteForm reads via useSearchParams(). Kept on the props
   * type so callers passing it don't break compile.
   */
  service?: string;
  /** Override the section's `id`. Defaults to `quote`. */
  id?: string;
}

/**
 * Quote CTA section.
 *
 * Was a dramatic yellow header with two CTA buttons that linked back to
 * itself (`/#quote`), so every "Request a Quote" affordance on the site
 * terminated at a dead anchor. The headline now opens directly into a
 * working QuoteForm; the form handles validation, URL pre-fill, and the
 * mailto: handoff to dispatch. Phone fallback lives inside the form, not
 * as a sibling button — one CTA hierarchy, one conversion path.
 */
export function QuoteCTA({
  headline,
  subhead,
  id = "quote",
}: QuoteCTAProps = {}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="relative bg-accent text-ink"
    >
      <HazardStripe height={16} from="left" />

      <div className="mx-auto grid max-w-[1480px] gap-10 px-6 py-16 sm:gap-12 sm:px-10 sm:py-24 lg:grid-cols-12 lg:gap-16 lg:py-32">
        {/* Left rail: headline + subhead */}
        <div className="flex flex-col gap-8 lg:col-span-5">
          <p className="eyebrow text-ink/70">Get a quote</p>

          {/* whileInView amount: 0.05 (was 0.4 originally) so on a brisk
              mobile scroll the threshold can't be missed and the H2 never
              stays at opacity:0. The empty-yellow-rectangle bug from the
              design review never reproduces. */}
          <motion.h2
            id={`${id}-heading`}
            initial={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              amount: 0.05,
              margin: "0px 0px -10% 0px",
            }}
            transition={{ duration: 1.0, ease: EASE }}
            className="font-display text-[clamp(3rem,8vw,6.5rem)] font-black uppercase leading-[0.86] tracking-tight text-ink"
          >
            {headline ?? (
              <>
                Ready <br className="sm:hidden" /> to&nbsp;build?
              </>
            )}
          </motion.h2>

          <p className="max-w-[40ch] text-base leading-[1.55] text-ink/85 sm:text-lg">
            {subhead ?? (
              <>
                Send the spec to dispatch. Same-day quotes on standard mixes;
                custom designs come back inside one business day with QC
                signoff.
              </>
            )}
          </p>
        </div>

        {/* Right rail: the form itself */}
        <div className="lg:col-span-7">
          {/* Suspense boundary because QuoteForm uses next/navigation
              useSearchParams(), which Next 16 wants to render through a
              Suspense boundary so static generation can opt out of the
              search-param-bound subtree without dynamic-render warnings. */}
          <Suspense fallback={<QuoteFormSkeleton />}>
            <QuoteForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

/** Minimal layout skeleton for the form while it hydrates. */
function QuoteFormSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col gap-6 opacity-60"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="h-12 border-b border-ink/20" />
        <div className="h-12 border-b border-ink/20" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="h-12 border-b border-ink/20" />
        <div className="h-12 border-b border-ink/20" />
      </div>
      <div className="h-10" />
      <div className="h-32 border-b border-ink/20" />
    </div>
  );
}
