"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone, Play } from "lucide-react";

import { MagneticButton } from "@/components/MagneticButton";
import { HERO, SITE } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Decide whether the looping background video is appropriate for this client.
 * Defers the video on data-saver / 2g / 3g, falling back to the poster.
 */
function useVideoAllowed() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const conn = nav.connection;
    const slow =
      conn?.saveData ||
      (conn?.effectiveType && /(^|-)(2g|3g)$/.test(conn.effectiveType));
    setAllowed(!slow);
  }, []);
  return allowed;
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const videoAllowed = useVideoAllowed();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Pause the video when scrolled offscreen so it stops costing bandwidth.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="top"
      aria-label="Introduction"
      // Mobile: 78svh is plenty for headline + CTAs + proof rail without
      // pushing content off-screen at 390x844 (the dead-zone bug). Desktop
      // keeps the cinematic 92svh.
      className="relative isolate flex min-h-[78svh] w-full items-end overflow-hidden bg-base sm:min-h-[88svh] lg:min-h-[92svh]"
    >
      {/* Media layer.
          Outer: Ken Burns drift so the hero always reads as alive on first
          paint — even before the video buffers, even on slow connections.
          Inner: GSAP ScrollTrigger applies its parallax yPercent on the
          inline media element. The two transforms compound naturally. */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="ken-burns absolute inset-0">
          {videoAllowed ? (
            <video
              ref={videoRef}
              className="size-full object-cover"
              src={HERO.videoSrc}
              poster={HERO.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={HERO.poster}
              alt=""
              className="size-full object-cover"
              aria-hidden="true"
            />
          )}
        </div>
        {/* Bottom-up dark gradient + global tint to keep type legible. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-base via-base/70 to-base/30"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-base/35" aria-hidden="true" />
      </div>

      {/* Subtle grain — concrete is a textile material */}
      <span aria-hidden="true" className="grain" />

      {/* Top-left frame markers — small editorial detail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-24 z-[2] hidden items-center gap-3 sm:left-10 sm:top-28 lg:flex"
      >
        <span className="block h-px w-10 bg-accent" />
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-primary/75">
          N 30.23° / W 93.24°
        </span>
      </div>

      {/* Content.
          Mobile padding tightened from pt-28/pb-14 → pt-20/pb-10 so the
          headline anchor sits where mobile users expect (upper-center of
          the visible viewport instead of crowded against the top). */}
      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-6 pb-10 pt-20 sm:px-10 sm:pb-16 sm:pt-28 lg:pb-20 lg:pt-24">
        <motion.p
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-5 inline-flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-accent sm:mb-7 sm:text-[0.7rem]"
        >
          <span className="block h-px w-8 bg-accent" />
          {HERO.eyebrow}
        </motion.p>

        {/* Hero headline.
            Restructured from the per-word inline-block reveal-mask pattern
            to a per-line block reveal. The old structure used
            `display: inline-block; vertical-align: bottom` on each word,
            which on narrow viewports could reflow line 2 into a baseline
            that visually overlapped line 1 (the "second line never appears"
            mobile bug). Block-level masks are bulletproof: each line
            occupies its own grid row and animates independently.
            Mobile: clamp pulls down to 2rem so "THERE'S HISTORY" fits on
            one line at 320px. Desktop: 9rem cap preserved. */}
        <h1 className="mb-8 max-w-[18ch] font-display font-black uppercase leading-[0.88] tracking-tight text-primary text-[clamp(2rem,10vw,9rem)] sm:mb-9 sm:leading-[0.86]">
          <span className="block overflow-hidden">
            <span
              className="block will-change-transform"
              style={
                prefersReducedMotion
                  ? undefined
                  : {
                      transform: "translateY(110%)",
                      animation: "reveal-up 1.1s cubic-bezier(0.16,1,0.3,1) 0.1s forwards",
                    }
              }
            >
              {HERO.headlineLine1}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="block text-accent will-change-transform"
              style={
                prefersReducedMotion
                  ? undefined
                  : {
                      transform: "translateY(110%)",
                      animation: "reveal-up 1.1s cubic-bezier(0.16,1,0.3,1) 0.35s forwards",
                    }
              }
            >
              {HERO.headlineLine2}
            </span>
          </span>
        </h1>

        <motion.p
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          className="max-w-[50ch] text-[0.95rem] leading-relaxed text-primary/90 sm:text-base lg:text-lg"
        >
          {HERO.subhead}
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
          className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-4"
        >
          <MagneticButton strength={0.32}>
            <Link
              href={HERO.ctaPrimary.href}
              className="group inline-flex items-center justify-between gap-6 whitespace-nowrap bg-accent px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:bg-accent-hot"
            >
              {HERO.ctaPrimary.label}
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </MagneticButton>
          <Link
            href={HERO.ctaSecondary.href}
            className="group inline-flex items-center justify-between gap-6 whitespace-nowrap border border-primary/35 px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-primary transition hover:border-accent hover:text-accent"
          >
            {HERO.ctaSecondary.label}
            <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Proof scan-line.
            The ranked-#1 fix from the design review: answer the bouncing
            estimator's "can you do my job?" question inside the first
            viewport. Reads as a spec ticker, not marketing copy.
            Mobile: phone is hidden here (the MobileBottomBar covers that
            tap target) so the rail collapses to two compact rows of capability
            chips and the hero stops crowding past the visible viewport.
            sm and up: phone re-appears, dispatch label re-appears. */}
        <motion.ul
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: EASE }}
          aria-label="What we make and where we serve"
          className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-primary/15 pt-4 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-primary/75 sm:mt-10 sm:gap-x-7 sm:gap-y-3 sm:pt-5 sm:text-[0.7rem] sm:tracking-[0.2em]"
        >
          {HERO.proofLine.map((item, i) => (
            <li key={item.label} className="flex items-center gap-4 sm:gap-7">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="hidden h-3 w-px bg-primary/25 sm:block"
                />
              )}
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="block size-1 shrink-0 bg-accent"
                />
                {item.label}
              </span>
            </li>
          ))}
          <li className="hidden items-center gap-7 sm:ml-auto sm:flex">
            <span
              aria-hidden="true"
              className="h-3 w-px bg-primary/25"
            />
            <a
              href={SITE.phoneTel}
              className="group inline-flex items-center gap-2 text-accent transition hover:text-accent-hot"
            >
              <Phone aria-hidden className="size-3.5" />
              <span className="tabular-nums tracking-[0.18em]">
                {SITE.phone}
              </span>
              <span className="text-primary/55">Dispatch</span>
            </a>
          </li>
        </motion.ul>
      </div>

      {/* Editorial corner ornament — replaces the 2019-era vertical SCROLL.
          Animated thin yellow rule + a single live mono fact, set vertically. */}
      <div
        className="pointer-events-none absolute bottom-8 right-6 z-[2] hidden items-end gap-3 sm:right-10 lg:flex"
        aria-hidden="true"
      >
        <span className="writing-vertical font-mono text-[0.62rem] uppercase tracking-[0.32em] text-primary/55">
          Calcasieu Parish · 4 Yards · 86 Years
        </span>
        <motion.span
          initial={{ scaleY: 0.2, opacity: 0.5, originY: 0 }}
          animate={
            prefersReducedMotion
              ? undefined
              : { scaleY: [0.2, 1, 0.2], opacity: [0.4, 1, 0.4] }
          }
          transition={{
            duration: 2.4,
            ease: [0.16, 1, 0.3, 1],
            repeat: Infinity,
          }}
          className="block h-16 w-px origin-top bg-accent"
        />
      </div>
    </section>
  );
}
