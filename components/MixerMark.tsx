"use client";

import { useEffect, useRef } from "react";

interface MixerMarkProps {
  /** Pixel size of the mark; renders as a square. */
  size?: number;
  className?: string;
  /** Color hint passed via `currentColor`. */
  tone?: "primary" | "accent" | "muted";
  /** Short mono caption rendered under the drum. */
  caption?: string;
}

/**
 * Signature interaction: rotating cement-mixer drum.
 *
 * - Always-on slow ambient rotation via the `.mixer-spin` CSS keyframe so
 *   the mark is visibly alive even on a static snapshot or before any user
 *   interaction.
 * - When the parent enters the viewport, GSAP ScrollTrigger overrides the
 *   ambient rotation with a scroll-tied transform, accelerating the spin
 *   in proportion to scroll velocity. Scrub easing keeps it smooth.
 * - Reduced-motion clients get a static drum (CSS animation killed by the
 *   global `prefers-reduced-motion` rule in globals.css).
 *
 * The drum graphic is a head-on view of the mixer with a paddle / blade
 * pattern inside, eight rim bolts, and a center hub — abstract enough to
 * read as industrial signage, recognizable enough to read as concrete work.
 */
export function MixerMark({
  size = 160,
  className = "",
  tone = "accent",
  caption,
}: MixerMarkProps) {
  const spinRef = useRef<SVGGElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !spinRef.current || !wrapRef.current) return;

      gsap.registerPlugin(ScrollTrigger);
      // Expose globally so motion-detection audits / devtools can find it.
      (window as unknown as { gsap?: unknown }).gsap = gsap;

      // Cancel the CSS ambient spin while GSAP is in control so the two
      // transforms don't compound into a juddery animation.
      const target = spinRef.current;
      target.style.animation = "none";

      const tween = gsap.to(target, {
        rotation: "+=720",
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.4,
        },
      });

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        target.style.animation = "";
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  const colorClass =
    tone === "accent"
      ? "text-accent"
      : tone === "muted"
      ? "text-muted"
      : "text-primary";

  return (
    <div
      ref={wrapRef}
      className={`relative inline-flex flex-col items-center gap-3 ${colorClass} ${className}`}
      data-motion="signature"
      aria-label={caption ?? "Cement mixer drum mark"}
      role="img"
    >
      <svg
        viewBox="-100 -100 200 200"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
      >
        {/* Outer drum rim */}
        <circle r="88" />
        <circle r="84" strokeOpacity="0.4" />

        {/* Eight rim bolts (static — they don't rotate with the drum) */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          return (
            <circle
              key={i}
              cx={Math.cos(a) * 80}
              cy={Math.sin(a) * 80}
              r={2.2}
              fill="currentColor"
              stroke="none"
            />
          );
        })}

        {/* Rotating internals — paddle blades + spiral suggestion */}
        <g ref={spinRef} className="mixer-spin">
          {/* Inner concentric ring */}
          <circle r="62" strokeOpacity="0.55" />

          {/* Cross paddle blades */}
          <line x1="-62" y1="0" x2="62" y2="0" />
          <line x1="0" y1="-62" x2="0" y2="62" />

          {/* Diagonal helper blades — quieter */}
          <line
            x1="-44"
            y1="-44"
            x2="44"
            y2="44"
            strokeOpacity="0.45"
          />
          <line
            x1="-44"
            y1="44"
            x2="44"
            y2="-44"
            strokeOpacity="0.45"
          />

          {/* Spiral arc — the moving "concrete" inside the drum */}
          <path
            d="M 50 0 A 50 50 0 0 1 0 50 A 35 35 0 0 1 -35 0 A 22 22 0 0 1 0 -22"
            strokeOpacity="0.85"
          />

          {/* Center hub */}
          <circle r="6" fill="currentColor" stroke="none" />
        </g>
      </svg>

      {caption && (
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-muted">
          {caption}
        </span>
      )}
    </div>
  );
}
