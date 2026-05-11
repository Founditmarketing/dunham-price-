"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { CapabilityProduct } from "@/lib/capabilities";
import { EASE } from "@/lib/motion";

interface ProductRowProps {
  product: CapabilityProduct;
  index: number;
  prefix: string;
  theme: "dark" | "light";
}

/**
 * Two-column text-driven product row used by ready mix and precast divisions.
 * Mono index + Big Shoulders name on the left, description on the right.
 * A thin yellow rule reveals on hover and on keyboard focus.
 */
export function ProductRow({
  product,
  index,
  prefix,
  theme,
}: ProductRowProps) {
  const prefersReducedMotion = useReducedMotion();
  const isDark = theme === "dark";

  return (
    <motion.li
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.04, ease: EASE }}
      data-print-row
      className={`group relative ${
        isDark ? "border-line" : "border-ink/10"
      } border-t`}
    >
      {/* Hover underline. Stays as a tactile detail even though the row no
          longer links anywhere — it pairs with the description's slight
          fade-in to feel responsive on hover without promising navigation. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />

      {/* Layout shell. Was wrapped in <Link href="#"> previously, but no
          per-product detail pages exist yet, so the click was deceptive.
          When product detail routes ship, wrap this grid back in a Link
          and restore the trailing arrow + "View product" affordance. */}
      <div className="grid grid-cols-1 gap-4 py-7 sm:py-9 lg:grid-cols-12 lg:gap-8 lg:py-10">
        {/* Left: mono index + product name */}
        <div className="flex items-baseline gap-4 lg:col-span-6 lg:gap-6">
          <span
            className={`shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.2em] ${
              isDark ? "text-accent" : "text-ink/55"
            }`}
          >
            {prefix}
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3
            className={`font-display text-2xl font-bold uppercase leading-[0.95] tracking-tight sm:text-3xl lg:text-4xl ${
              isDark ? "text-primary" : "text-ink"
            }`}
          >
            {product.name}
          </h3>
        </div>

        {/* Right: description */}
        <div className="lg:col-span-6">
          <p
            className={`max-w-[60ch] text-sm leading-relaxed sm:text-base ${
              isDark ? "text-primary/75" : "text-ink/75"
            }`}
          >
            {product.description}
          </p>
        </div>
      </div>
    </motion.li>
  );
}
