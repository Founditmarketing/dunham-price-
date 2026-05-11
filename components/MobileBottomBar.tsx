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

  // Hide when EITHER the page's #quote section OR the footer is on screen.
  //   - #quote: never duplicate the same conversion ask in two places.
  //   - footer: keep the bottom of the page reachable; otherwise the bar
  //     permanently obscures the last ~80px of the footer.
  useEffect(() => {
    const targets: HTMLElement[] = [];
    const quote = document.getElementById("quote");
    if (quote) targets.push(quote);
    const footer = document.querySelector("footer");
    if (footer instanceof HTMLElement) targets.push(footer);
    if (targets.length === 0) return;

    // A single observer + Set tracks "is any of them currently visible?"
    // so we hide the bar whenever the user is in either danger zone.
    const seen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target);
          else seen.delete(e.target);
        }
        setQuoteVisible(seen.size > 0);
      },
      { threshold: 0.15 },
    );
    targets.forEach((t) => io.observe(t));
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
          // md:hidden (was lg:hidden) so the bar truly stays mobile-only.
          // From the md breakpoint up the desktop nav already exposes the
          // phone + Request a Quote CTA, and the sticky bar was visually
          // competing with content on tablet / narrow desktop widths.
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-base/95 backdrop-blur-md md:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          data-print-hide
        >
          {/* Two-column conversion bar.
              Sized as a 1fr / 1.4fr grid so the yellow CTA gets the bigger
              share of the bar (matches its visual hierarchy) without
              squeezing the phone tap target below 44px. The phone column
              drops the redundant "CALL" prefix because the icon already
              sells the affordance — leaving just the number prevented the
              previous overflow that clipped the leading "C" on 360–390px
              viewports. Both columns honor whitespace-nowrap and shrink
              their tracking so the worst-case Pixel-5 width still clears. */}
          <div className="grid h-16 grid-cols-[1fr_1.4fr] items-stretch">
            <a
              href={SITE.phoneTel}
              aria-label={`Call dispatch ${SITE.phone}`}
              className="group flex items-center justify-center gap-2.5 px-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-primary transition-colors hover:text-accent active:bg-elevated"
            >
              <Phone
                aria-hidden
                className="size-4 shrink-0 text-accent transition-transform duration-300 group-hover:-translate-y-0.5"
              />
              <span className="tabular-nums whitespace-nowrap">
                {SITE.phone}
              </span>
            </a>
            <Link
              href="/#quote"
              className="group flex items-center justify-center gap-2.5 bg-accent px-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hot active:bg-accent-hot"
            >
              <span className="whitespace-nowrap">Request a Quote</span>
              <ArrowRight
                aria-hidden
                className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
