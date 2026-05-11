"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { MagneticButton } from "@/components/MagneticButton";
import { HERO } from "@/lib/content";

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

  const headlineWords = [
    HERO.headlineLine1.split(" "),
    HERO.headlineLine2.split(" "),
  ];

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative isolate flex min-h-[88svh] w-full items-end overflow-hidden bg-base lg:min-h-[92svh]"
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

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-6 pb-14 pt-28 sm:px-10 sm:pb-16 lg:pb-20 lg:pt-24">
        <motion.p
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-7 inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-accent"
        >
          <span className="block h-px w-8 bg-accent" />
          {HERO.eyebrow}
        </motion.p>

        {/* Hero headline.
            Mobile: clamp pulls down to 2.25rem so "THERE'S HISTORY" still
            renders on one line at 320px. text-balance keeps any wrap pretty.
            Desktop: cap stays at 9rem for full editorial impact. */}
        <h1 className="mb-9 max-w-[18ch] text-balance font-display font-black uppercase leading-[0.86] tracking-tight text-primary text-[clamp(2.25rem,10vw,9rem)]">
          <span className="block">
            {headlineWords[0].map((word, i) => (
              <span key={`l1-${i}`} className="reveal-mask mr-[0.16em]">
                <span style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                  {word}
                </span>
              </span>
            ))}
          </span>
          <span className="block text-accent">
            {headlineWords[1].map((word, i) => (
              <span key={`l2-${i}`} className="reveal-mask mr-[0.16em]">
                <span style={{ animationDelay: `${0.45 + i * 0.08}s` }}>
                  {word}
                </span>
              </span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
          className="max-w-[50ch] text-base leading-relaxed text-primary/90 sm:text-lg"
        >
          {HERO.subhead}
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: EASE }}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
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
