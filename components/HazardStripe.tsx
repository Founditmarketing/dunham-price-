"use client";

import { motion, useReducedMotion } from "framer-motion";

interface HazardStripeProps {
  /** Pixel height of the band. */
  height?: number;
  /** Slide-in direction on enter. */
  from?: "left" | "right";
  /** Soften (semi-transparent) variant for use on dark backgrounds. */
  soft?: boolean;
  className?: string;
}

/**
 * Diagonal yellow / black hazard band used to mark major section transitions.
 * Animates in from the side once per scroll into view.
 */
export function HazardStripe({
  height = 14,
  from = "left",
  soft = false,
  className = "",
}: HazardStripeProps) {
  const prefersReducedMotion = useReducedMotion();
  const initialX = from === "left" ? "-100%" : "100%";

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <motion.div
        className={`absolute inset-0 ${soft ? "hazard-stripe-soft" : "hazard-stripe"}`}
        initial={prefersReducedMotion ? { x: 0 } : { x: initialX }}
        whileInView={{ x: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
