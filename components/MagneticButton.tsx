"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  /**
   * Strength of the cursor pull, 0–1. 0.25 is a good "felt but not noisy"
   * default. Bump toward 0.4 for hero-only signature buttons.
   */
  strength?: number;
  className?: string;
}

/**
 * Magnetic CTA wrapper. Translates the wrapped element slightly toward
 * the cursor while it's nearby. No-op on touch devices and when the user
 * prefers reduced motion.
 *
 * Renders an inline-block wrapper, so use it as a near-transparent
 * container around the actual button or anchor.
 */
export function MagneticButton({
  children,
  strength = 0.25,
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.55 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.55 });

  const prefersReducedMotion = useReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

