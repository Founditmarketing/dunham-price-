"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";

import { LOCATIONS } from "@/lib/content";
import type { LocationItem } from "@/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Build a Google Maps deep link from address parts. Works on both iOS and Android. */
function mapsHref(l: LocationItem): string {
  const q = encodeURIComponent(`${l.address}, ${l.city}, ${l.state}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function telHref(phone: string): string {
  return `tel:+1${phone.replace(/\D/g, "")}`;
}

/**
 * Stylized SVG map placeholder. Plots the four locations using a simple
 * lon/lat → svg projection so the markers are roughly positioned correctly.
 *
 * Coastline path animates on view (draw-on-scroll). Active marker shows an
 * inline popover with phone, hours, and drive-time.
 *
 * TODO: Mapbox token + real coordinates  -- swap this for a Mapbox / MapLibre
 * dark-style map. Keep the marker render contract: highlight by id.
 */
function StylizedMap({
  activeId,
  onActivate,
}: {
  activeId: string;
  onActivate: (id: string) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const coastlineRef = useRef<SVGPathElement>(null);

  // Trigger the coastline draw-on-view as soon as the map enters viewport.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          coastlineRef.current?.classList.add("is-drawn");
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Bounds chosen to comfortably contain Westlake / Lake Charles / Sulphur / Ragley.
  const bounds = useMemo(
    () => ({ minLon: -93.5, maxLon: -93.05, minLat: 30.15, maxLat: 30.6 }),
    [],
  );

  const project = (lon: number, lat: number) => {
    const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * 600;
    const y = (1 - (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 600;
    return { x, y };
  };

  const active = LOCATIONS.find((l) => l.id === activeId);
  const activePos = active ? project(active.coords[0], active.coords[1]) : null;

  return (
    <div
      ref={wrapRef}
      // Aspect drops to 4:3 on mobile so the map doesn't dominate the viewport.
      // Min-height guards against any container collapse edge cases.
      className="relative aspect-[4/3] min-h-[260px] w-full overflow-hidden bg-elevated ring-1 ring-line sm:aspect-square"
    >
      {/* Background grid + radial wash + coastline */}
      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 size-full"
        role="img"
        aria-label="Stylized map of four Dunham Price yards across Calcasieu Parish"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#2a2a2c"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="wash" cx="50%" cy="55%" r="60%">
            <stop offset="0%" stopColor="#23232550" />
            <stop offset="100%" stopColor="#0e0e0f" />
          </radialGradient>
          <linearGradient id="coast" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1c" />
            <stop offset="100%" stopColor="#0e0e0f" />
          </linearGradient>
        </defs>

        <rect width="600" height="600" fill="url(#grid)" />
        <rect width="600" height="600" fill="url(#wash)" />

        {/* Land mass abstraction — softly suggests SW Louisiana coastline */}
        <path
          d="M 0 460 C 110 430, 180 470, 260 440 S 420 420, 520 470 L 600 470 L 600 600 L 0 600 Z"
          fill="url(#coast)"
          opacity="0.95"
        />

        {/* Coastline — drawn on view */}
        <path
          ref={coastlineRef}
          className="draw-path"
          d="M 0 460 C 110 430, 180 470, 260 440 S 420 420, 520 470 L 600 470"
          fill="none"
          stroke="#f5c518"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />

        {/* Calcasieu river suggestion */}
        <path
          d="M 280 0 C 290 120, 240 200, 270 320 S 310 460, 290 600"
          fill="none"
          stroke="#2a2a2c"
          strokeWidth="2"
        />

        {/* Compass mark */}
        <g transform="translate(540 50)" opacity="0.55">
          <circle r="14" fill="none" stroke="#2a2a2c" strokeWidth="1" />
          <path d="M0 -14 L0 14 M-14 0 L14 0" stroke="#2a2a2c" strokeWidth="1" />
          <text
            x="0"
            y="-22"
            textAnchor="middle"
            fontSize="9"
            fill="#9a9a9d"
            fontFamily="var(--font-mono)"
            letterSpacing="2"
          >
            N
          </text>
        </g>

        {/* Marker connecting lines from active to others */}
        {activePos &&
          LOCATIONS.filter((l) => l.id !== activeId).map((l) => {
            const p = project(l.coords[0], l.coords[1]);
            return (
              <line
                key={`line-${l.id}`}
                x1={activePos.x}
                y1={activePos.y}
                x2={p.x}
                y2={p.y}
                stroke="#f5c518"
                strokeOpacity="0.18"
                strokeDasharray="2 4"
                strokeWidth="1"
              />
            );
          })}

        {/* Markers — full SVG buttons so they're keyboard-focusable */}
        {LOCATIONS.map((l) => {
          const p = project(l.coords[0], l.coords[1]);
          const isActive = l.id === activeId;
          return (
            <g
              key={l.id}
              transform={`translate(${p.x} ${p.y})`}
              role="button"
              tabIndex={0}
              aria-label={`${l.city} yard — ${l.address}`}
              onClick={() => onActivate(l.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onActivate(l.id);
              }}
              style={{ cursor: "pointer" }}
            >
              {isActive && (
                <circle
                  r="22"
                  fill="none"
                  stroke="#f5c518"
                  strokeOpacity="0.35"
                >
                  <animate
                    attributeName="r"
                    values="6;28;6"
                    dur="2.4s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-opacity"
                    values="0.55;0;0.55"
                    dur="2.4s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              {/* Larger hit-target circle (transparent) for click ergonomics */}
              <circle r="18" fill="transparent" />
              <circle
                r={isActive ? 6 : 4}
                fill={isActive ? "#f5c518" : "#9a9a9d"}
              />
              <text
                x="12"
                y="4"
                fontSize="10"
                fontFamily="var(--font-mono)"
                letterSpacing="1.5"
                fill={isActive ? "#f4f1ea" : "#9a9a9d"}
                style={{ textTransform: "uppercase", pointerEvents: "none" }}
              >
                {l.city}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Inline popover for the active yard — DOM, not SVG, so we get
          decent typography and easy click targets. */}
      {active && (
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="absolute right-3 top-3 max-w-[12rem] border border-accent/70 bg-base/90 p-3 backdrop-blur-md sm:right-6 sm:top-6 sm:max-w-[16rem] sm:p-4"
          role="status"
          aria-live="polite"
        >
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-accent">
            Active yard
          </p>
          <p className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-primary">
            {active.city}, {active.state}
          </p>
          <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
            {active.address}
          </p>
          <dl className="mt-4 space-y-2 border-t border-line pt-3 font-mono text-[0.65rem] uppercase tracking-[0.14em]">
            {active.phone && (
              <div className="flex items-center gap-2">
                <Phone aria-hidden className="size-3 text-accent" />
                <a
                  href={`tel:+1${active.phone.replace(/\D/g, "")}`}
                  className="text-primary/90 transition hover:text-accent"
                >
                  {active.phone}
                </a>
              </div>
            )}
            {active.hours && (
              <div className="flex items-center gap-2">
                <Clock aria-hidden className="size-3 text-accent" />
                <span className="text-primary/85">{active.hours}</span>
              </div>
            )}
            {active.driveTime && (
              <div className="flex items-center gap-2">
                <MapPin aria-hidden className="size-3 text-accent" />
                <span className="text-primary/85">{active.driveTime}</span>
              </div>
            )}
          </dl>
        </motion.div>
      )}

      {/* Bottom-left mono caption */}
      <div className="absolute bottom-4 left-4 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted">
        Calcasieu Parish &amp; Beauregard
      </div>
    </div>
  );
}

function LocationRow({
  location,
  active,
  onActivate,
  index,
}: {
  location: LocationItem;
  active: boolean;
  onActivate: () => void;
  index: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.li
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      className="border-t border-line"
    >
      <div className="grid grid-cols-[1fr_auto] items-start gap-3 py-3 sm:gap-5">
        {/* Activate button — fills the row, covers the title + address + drive time */}
        <button
          type="button"
          onClick={onActivate}
          onMouseEnter={onActivate}
          onFocus={onActivate}
          aria-pressed={active}
          className={`group flex w-full items-start gap-4 py-3 text-left transition-colors sm:gap-5 ${
            active ? "text-primary" : "text-primary/85 hover:text-primary"
          }`}
        >
          <span className="mt-2 flex size-3 shrink-0 items-center justify-center">
            <span
              className={`block size-2 rounded-full transition-all ${
                active
                  ? "bg-accent pulse-dot"
                  : "bg-muted/70 group-hover:bg-accent"
              }`}
            />
          </span>
          <span className="flex-1">
            <span className="block font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              {location.city}, {location.state}
            </span>
            <span className="mt-1 block font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              {location.address}
              {location.driveTime && (
                <>
                  <span aria-hidden className="mx-2 text-accent">
                    ·
                  </span>
                  {location.driveTime}
                </>
              )}
            </span>
          </span>
        </button>

        {/* Independent tap targets — each is 44+px on mobile so contractors
            with gloves on can hit them without zooming. */}
        <div className="mt-3 flex items-center gap-1">
          {location.phone && (
            <a
              href={telHref(location.phone)}
              aria-label={`Call ${location.city} dispatch`}
              className="inline-flex size-11 items-center justify-center text-primary/75 transition hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Phone className="size-4" aria-hidden />
            </a>
          )}
          <a
            href={mapsHref(location)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Get directions to ${location.city} yard`}
            className="inline-flex size-11 items-center justify-center text-primary/75 transition hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </motion.li>
  );
}

export function LocationsMap() {
  const [activeId, setActiveId] = useState(LOCATIONS[0]!.id);

  return (
    <section
      id="locations"
      aria-labelledby="locations-heading"
      className="relative bg-base py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto grid max-w-[1480px] gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16">
        {/* Map first on mobile, second on desktop */}
        <div className="order-1 lg:order-2 lg:col-span-7">
          <StylizedMap activeId={activeId} onActivate={setActiveId} />
          <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted">
            Stylized geography · tap a yard for dispatch &amp; hours
          </p>
        </div>

        <div className="order-2 lg:order-1 lg:col-span-5">
          <p className="eyebrow mb-6 text-accent">03 — Locations</p>
          <h2
            id="locations-heading"
            className="display-section mb-6 text-primary"
          >
            Built across <br className="hidden sm:block" />
            Southwest Louisiana.
          </h2>
          <p className="mb-10 max-w-[44ch] text-base leading-relaxed text-primary/90 sm:text-lg">
            Four yards. One short drive from any pour in Calcasieu Parish.
            Schedule a delivery from the location closest to your job.
          </p>

          <ul className="border-b border-line">
            {LOCATIONS.map((l, i) => (
              <LocationRow
                key={l.id}
                location={l}
                active={l.id === activeId}
                onActivate={() => setActiveId(l.id)}
                index={i}
              />
            ))}
          </ul>

          <a
            href="/#quote"
            className="mt-8 -mx-3 inline-flex min-h-[44px] items-center gap-3 whitespace-nowrap px-3 py-3 font-mono text-xs uppercase tracking-[0.2em] text-accent transition hover:text-accent-hot"
          >
            <MapPin className="size-4" aria-hidden /> Plan a delivery →
          </a>
        </div>
      </div>
    </section>
  );
}
