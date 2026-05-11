"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { CAPABILITIES } from "@/lib/capabilities";
import type { DivisionSlug } from "@/lib/capabilities";

const ACTIVE_LAYOUT_ID = "division-active-underline";

/**
 * Scroll-spy tab bar that becomes sticky once the user passes the hero.
 * Click jumps via smooth-scroll; scroll position auto-selects the active tab
 * via IntersectionObserver tuned to a band ~30% from the top of the viewport.
 *
 * On mobile the bar is horizontally scrollable and auto-centers the active tab.
 */
export function DivisionNav() {
  const [active, setActive] = useState<DivisionSlug>(CAPABILITIES[0]!.slug);
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Watch each division section to determine the active tab.
  useEffect(() => {
    const sections = CAPABILITIES.map(
      (d) => document.getElementById(d.slug),
    ).filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    // Carve out a thin trigger band ~30% from the top of the viewport.
    // When a section's top edge crosses into that band it becomes active.
    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top edge of the trigger band.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top),
          );
        const top = visible[0];
        if (top) setActive(top.target.id as DivisionSlug);
      },
      {
        // Pulls the active band ~30% down from the top of the viewport.
        rootMargin: "-30% 0px -55% 0px",
        threshold: 0,
      },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Keep the active tab visible inside the horizontally scrollable bar.
  useEffect(() => {
    const el = tabRefs.current[active];
    el?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  // Smooth-scroll to a section, accounting for both nav offsets.
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, slug: DivisionSlug) => {
      e.preventDefault();
      const target = document.getElementById(slug);
      if (!target) return;
      const offset =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
        ) *
          16 +
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--div-nav-h",
          ),
        ) *
          16 +
        12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      setActive(slug);
      // Reflect anchor in the URL without re-triggering scroll.
      history.replaceState(null, "", `#${slug}`);
    },
    [],
  );

  return (
    <div
      data-print-hide
      className="sticky z-30 -mt-px border-y border-line bg-base/90 backdrop-blur-md"
      style={{ top: "var(--nav-h)" }}
    >
      <nav
        aria-label="Capability divisions"
        className="mx-auto max-w-[1480px]"
      >
        <ul
          className="scrollbar-thin flex items-stretch gap-1 overflow-x-auto px-3 sm:gap-2 sm:px-6 lg:px-10"
          role="tablist"
        >
          {CAPABILITIES.map((d) => {
            const isActive = d.slug === active;
            return (
              <li key={d.slug} className="shrink-0">
                <a
                  ref={(el) => {
                    tabRefs.current[d.slug] = el;
                  }}
                  href={`#${d.slug}`}
                  role="tab"
                  aria-selected={isActive}
                  onClick={(e) => handleClick(e, d.slug)}
                  className={`group relative flex flex-col items-start gap-1 px-4 py-4 text-left transition-colors sm:px-5 ${
                    isActive
                      ? "text-primary"
                      : "text-concrete hover:text-primary"
                  }`}
                >
                  <span
                    className={`font-mono text-[0.65rem] uppercase tracking-[0.22em] transition-colors ${
                      isActive ? "text-accent" : "text-muted"
                    }`}
                  >
                    {d.number} / Division
                  </span>
                  <span className="font-display text-lg font-bold uppercase leading-none tracking-tight sm:text-xl">
                    {d.name}
                  </span>

                  {/* Animated yellow underline. */}
                  {isActive && (
                    <motion.span
                      layoutId={ACTIVE_LAYOUT_ID}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute inset-x-3 -bottom-px h-[3px] bg-accent sm:inset-x-4"
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
