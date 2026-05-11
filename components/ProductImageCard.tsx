"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { CapabilityProduct } from "@/lib/capabilities";
import { EASE } from "@/lib/motion";

interface ProductImageCardProps {
  product: CapabilityProduct;
  /** `light` for cream sections (dark text), `dark` for dark sections. */
  theme: "dark" | "light";
  index: number;
  /** Sequence prefix for the corner mono index (e.g. `A` → `A01`). */
  prefix: string;
}

function CornerBracket({
  position,
  theme,
}: {
  position: "tl" | "tr" | "bl" | "br";
  theme: "dark" | "light";
}) {
  const map: Record<typeof position, string> = {
    tl: "top-2 left-2 border-t-2 border-l-2",
    tr: "top-2 right-2 border-t-2 border-r-2",
    bl: "bottom-2 left-2 border-b-2 border-l-2",
    br: "bottom-2 right-2 border-b-2 border-r-2",
  };
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute size-4 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:scale-110 ${map[position]} ${
        theme === "dark" ? "border-accent" : "border-ink"
      }`}
    />
  );
}

/**
 * Editorial product card used by aggregate-style divisions.
 *
 * When `product.image` is set it renders a true image card. When it isn't
 * (the common case until per-product photography arrives), it renders a
 * spec-block fallback that's typographically rich enough to feel intentional
 * rather than placeholder.
 */
export function ProductImageCard({
  product,
  theme,
  index,
  prefix,
}: ProductImageCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const surface = theme === "dark" ? "bg-elevated" : "bg-cream-2";
  const text = theme === "dark" ? "text-primary" : "text-ink";
  const muted = theme === "dark" ? "text-primary/65" : "text-ink/65";
  const ring =
    theme === "dark"
      ? "ring-1 ring-line"
      : "ring-1 ring-ink/10";

  return (
    <motion.article
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: EASE }}
      className={`group relative ${surface} ${ring}`}
      data-print-row
    >
      {/* Card shell. Was wrapped in <Link href="#"> previously, but no
          per-product detail pages exist yet, so the click was deceptive.
          When product detail routes ship, wrap this in a Link and restore
          the trailing "View product →" affordance below. */}
      <div className="flex h-full flex-col">
        {/* Image / spec-block */}
        <div className="relative aspect-square w-full overflow-hidden">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={`${product.name} — ${product.description}`}
              loading="lazy"
              className="size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          ) : (
            // Editorial spec-block fallback. Looks intentional, prints clean.
            <div
              className={`relative flex size-full items-end justify-start overflow-hidden p-5 sm:p-6 ${
                theme === "dark"
                  ? "bg-[radial-gradient(120%_120%_at_0%_0%,#232325_0%,#0e0e0f_60%)]"
                  : "bg-[radial-gradient(120%_120%_at_0%_0%,#ebe7dd_0%,#dcd8cc_70%)]"
              }`}
            >
              {/* Background spec marker — oversized */}
              <span
                aria-hidden="true"
                className={`absolute -right-3 -top-2 select-none font-display text-[8rem] font-black leading-none tracking-tight sm:text-[10rem] ${
                  theme === "dark" ? "text-primary/[0.05]" : "text-ink/[0.06]"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={`relative z-10 max-w-[80%] font-display text-2xl font-black uppercase leading-[0.92] tracking-tight ${text}`}
              >
                {product.name.split("—")[0]?.trim() ?? product.name}
              </span>
            </div>
          )}

          {/* Top-left index */}
          <div
            className={`absolute left-3 top-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] ${
              theme === "dark" ? "text-primary/70" : "text-ink/60"
            }`}
          >
            {prefix}
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Spec badge */}
          {product.spec && (
            <div className="absolute right-3 top-3">
              <span className="inline-flex items-center bg-accent px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink">
                {product.spec}
              </span>
            </div>
          )}

          <CornerBracket position="tl" theme={theme} />
          <CornerBracket position="tr" theme={theme} />
          <CornerBracket position="bl" theme={theme} />
          <CornerBracket position="br" theme={theme} />
        </div>

        {/* Caption */}
        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <h3
            className={`font-display text-xl font-bold uppercase leading-tight tracking-tight sm:text-2xl ${text}`}
          >
            {product.name}
          </h3>
          <p className={`text-sm leading-relaxed ${muted}`}>
            {product.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
