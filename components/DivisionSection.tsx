import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductImageCard } from "@/components/ProductImageCard";
import { ProductRow } from "@/components/ProductRow";
import type { CapabilityDivision } from "@/lib/capabilities";

interface DivisionSectionProps {
  division: CapabilityDivision;
}

const PREFIX_BY_SLUG: Record<CapabilityDivision["slug"], string> = {
  "ready-mix": "R",
  precast: "P",
  aggregates: "A",
  "south-coast": "S",
};

/**
 * Repeating template for each of the four capability divisions.
 *
 * Layout & content are identical by design — this is a spec page, not a
 * marketing landing. The only deltas between divisions are the alternating
 * `theme` (dark / cream) and the `layout` (image card grid vs. text row list).
 */
export function DivisionSection({ division }: DivisionSectionProps) {
  const isDark = division.theme === "dark";
  const isImage = division.layout === "image";
  const cardTheme: "dark" | "light" = isDark ? "dark" : "light";
  const prefix = PREFIX_BY_SLUG[division.slug];

  return (
    <section
      id={division.slug}
      data-anchor-section
      aria-labelledby={`${division.slug}-heading`}
      className={`relative ${
        isDark ? "bg-base text-primary" : "bg-cream text-ink"
      }`}
    >
      {/* ============================== HEADER STRIP ============================== */}
      <header
        className={`relative ${
          isDark ? "border-line" : "border-ink/10"
        } border-b`}
      >
        <div className="mx-auto grid max-w-[1480px] gap-10 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-12 lg:items-end lg:gap-12 lg:py-28">
          {/* Massive division number */}
          <div className="lg:col-span-3">
            <span
              aria-hidden="true"
              className="block select-none font-display font-black leading-[0.78] tracking-tighter text-accent"
              style={{ fontSize: "clamp(6rem, 14vw, 14rem)" }}
            >
              {division.number}
            </span>
          </div>

          {/* Center: name, tagline, description */}
          <div className="lg:col-span-6">
            <p
              className={`eyebrow mb-5 ${
                isDark ? "text-accent" : "text-ink/60"
              }`}
            >
              {division.legalName}
            </p>
            <h2
              id={`${division.slug}-heading`}
              className={`display-section ${isDark ? "text-primary" : "text-ink"}`}
            >
              {division.name}.
            </h2>
            <p
              className={`mt-4 font-mono text-sm uppercase tracking-[0.16em] ${
                isDark ? "text-primary/65" : "text-ink/55"
              }`}
            >
              {division.tagline}
            </p>
            <p
              className={`mt-6 max-w-[58ch] text-base leading-relaxed sm:text-lg ${
                isDark ? "text-primary/90" : "text-ink/80"
              }`}
            >
              {division.description}
            </p>
          </div>

          {/* Right: mono stats block */}
          <aside
            className={`lg:col-span-3 ${
              isDark ? "border-line" : "border-ink/15"
            } border-t pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0`}
            aria-label={`${division.name} at a glance`}
          >
            <dl className="space-y-6">
              <div>
                <dt
                  className={`font-mono text-[0.62rem] uppercase tracking-[0.22em] ${
                    isDark ? "text-muted" : "text-ink/50"
                  }`}
                >
                  Products
                </dt>
                <dd
                  className={`mt-2 font-display text-5xl font-black leading-none tracking-tight ${
                    isDark ? "text-primary" : "text-ink"
                  }`}
                >
                  {String(division.products.length).padStart(2, "0")}
                </dd>
              </div>
              <div>
                <dt
                  className={`font-mono text-[0.62rem] uppercase tracking-[0.22em] ${
                    isDark ? "text-muted" : "text-ink/50"
                  }`}
                >
                  Primary Applications
                </dt>
                <dd
                  className={`mt-3 flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] ${
                    isDark ? "text-primary/85" : "text-ink/85"
                  }`}
                >
                  {division.primaryApplications.map((a, i) => (
                    <span key={a} className="inline-flex items-center gap-2">
                      {i > 0 && (
                        <span
                          aria-hidden="true"
                          className={`block size-1 ${
                            isDark ? "bg-accent" : "bg-accent"
                          }`}
                        />
                      )}
                      {a}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </header>

      {/* ============================== PRODUCT BODY ============================== */}
      <div className="mx-auto max-w-[1480px] px-6 py-16 sm:px-10 sm:py-20 lg:py-28">
        {isImage ? (
          <ul
            data-print-grid
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
          >
            {division.products.map((p, i) => (
              <li key={p.id} className="flex">
                <div className="flex w-full">
                  <ProductImageCard
                    product={p}
                    theme={cardTheme}
                    index={i}
                    prefix={prefix}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul
            data-print-grid
            className={`${isDark ? "border-line" : "border-ink/10"} border-b`}
          >
            {division.products.map((p, i) => (
              <ProductRow
                key={p.id}
                product={p}
                index={i}
                prefix={prefix}
                theme={cardTheme}
              />
            ))}
          </ul>
        )}
      </div>

      {/* ============================== SECTION FOOTER STRIP ====================== */}
      <div
        data-print-hide
        className={`${
          isDark ? "border-line bg-elevated" : "border-ink/10 bg-cream-2"
        } border-t`}
      >
        <div className="mx-auto flex max-w-[1480px] flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center sm:px-10">
          <p
            className={`font-mono text-xs uppercase tracking-[0.16em] ${
              isDark ? "text-primary/80" : "text-ink/75"
            }`}
          >
            Need this for a project?
          </p>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href={`/?service=${division.slug}#quote`}
              className={`group inline-flex items-center justify-between gap-5 whitespace-nowrap px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] transition ${
                isDark
                  ? "bg-accent text-ink hover:bg-accent-hot"
                  : "bg-ink text-cream hover:bg-base"
              }`}
            >
              Request a Quote
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <a
              href={`/?service=${division.slug}#quote`}
              className={`font-mono text-xs uppercase tracking-[0.16em] underline-offset-4 transition hover:underline ${
                isDark ? "text-primary/85" : "text-ink/80"
              }`}
            >
              Talk to a {division.name} specialist →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
