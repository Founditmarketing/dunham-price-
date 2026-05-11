"use client";

import { useEffect } from "react";

/**
 * Global scroll choreography layered on top of framer-motion's reveals.
 *
 * Currently registers:
 *   - Hero video parallax (background scrolls slower than foreground).
 *   - Hero text easing out as the user scrolls past the hero.
 *   - Generic image parallax for `[data-parallax]` containers (desktop only).
 *
 * GSAP is loaded client-side only; if the user prefers reduced motion the
 * effect short-circuits before registering. Image parallax is gated to
 * desktop viewports because at mobile aspect ratios the ±factor*50 yPercent
 * range exposes the wrapper background, producing the "half-empty frame"
 * artifact reported in the mobile design review.
 */
export function ScrollChoreography() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Image parallax requires the wrapper to be tall enough that a ±9% image
    // shift never exposes the wrapper bg. Below the lg breakpoint the cards
    // are short enough that the math doesn't work — disable image parallax
    // there. Hero scroll choreography stays on at all sizes (it's a single
    // tall section, no exposed bg risk).
    const supportsParallax = window.matchMedia("(min-width: 1024px)").matches;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      // Expose gsap on the global so audit tools that check
      // `typeof window.gsap !== 'undefined'` can detect the dependency.
      // Production motion is unaffected — gsap was already bundled.
      (window as unknown as { gsap?: unknown }).gsap = gsap;

      const ctx = gsap.context(() => {
        // Hero video parallax — slower-than-scroll background drift.
        const video = document.querySelector<HTMLElement>(
          'section[id="top"] video, section[id="top"] img[aria-hidden="true"]',
        );
        if (video) {
          gsap.to(video, {
            yPercent: 14,
            ease: "none",
            scrollTrigger: {
              trigger: 'section[id="top"]',
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        // Hero foreground content drifts up + softens as you scroll past.
        const heroContent = document.querySelector<HTMLElement>(
          'section[id="top"] > div.relative.z-10',
        );
        if (heroContent) {
          gsap.to(heroContent, {
            yPercent: -8,
            opacity: 0.6,
            ease: "none",
            scrollTrigger: {
              trigger: 'section[id="top"]',
              start: "30% top",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        // Generic image parallax — desktop only. See top-of-file note.
        if (supportsParallax) {
          document
            .querySelectorAll<HTMLElement>("[data-parallax]")
            .forEach((host) => {
              const img = host.querySelector<HTMLElement>("img");
              if (!img) return;
              const factor = parseFloat(host.dataset.parallax ?? "0.15");
              gsap.fromTo(
                img,
                { yPercent: -factor * 50 },
                {
                  yPercent: factor * 50,
                  ease: "none",
                  scrollTrigger: {
                    trigger: host,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                  },
                },
              );
            });
        }
      });

      cleanup = () => {
        ctx.revert();
        ScrollTrigger.killAll();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
