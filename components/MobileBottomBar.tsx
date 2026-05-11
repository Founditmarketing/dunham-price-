"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

import { SITE } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Sticky mobile-only conversion bar.
 *
 * Behavior:
 *   - Hidden until the user has scrolled ~60% of the first viewport
 *     (i.e. they're past the hero and engaged).
 *   - Auto-hides when the page's primary `#quote` CTA section enters view,
 *     so we never duplicate the same conversion in two places.
 *   - 64px tall plus iOS safe-area inset.
 *   - Hidden at `lg:` breakpoint and above — desktop has the nav CTA already.
 */
export function MobileBottomBar() {
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);

  // Watch scroll position vs first viewport height.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide when the page's #quote section is on screen — avoids redundancy.
  useEffect(() => {
    const el = document.getElementById("quote");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setQuoteVisible(entry?.isIntersecting ?? false),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const visible = scrolled && !quoteVisible;

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          key="mobile-bottom-bar"
          aria-label="Quick contact"
          initial={prefersReducedMotion ? { opacity: 0 } : { y: "100%" }}
          animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { y: "100%" }}
          transition={{ duration: 0.45, ease: EASE }}
          // z-30 keeps it below the mobile menu overlay (z-40), so opening
          // the hamburger always blankets the bar.
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-base/95 backdrop-blur-md lg:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          data-print-hide
        >
          <div className="grid grid-cols-2">
            <a
              href={SITE.phoneTel}
              className="group flex h-16 items-center justify-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-primary transition-colors hover:text-accent active:bg-elevated"
            >
              <Phone
                aria-hidden
                className="size-4 text-accent transition-transform duration-300 group-hover:-translate-y-0.5"
              />
              <span className="whitespace-nowrap">Call {SITE.phone}</span>
            </a>
            <Link
              href="/#quote"
              className="group flex h-16 items-center justify-center gap-3 bg-accent font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-accent-hot active:bg-accent-hot"
            >
              <span className="whitespace-nowrap">Request a Quote</span>
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
