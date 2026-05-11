"use client";

import { useEffect, useRef, useState } from "react";
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
 * Illustrated regional map: Calcasieu + Beauregard Parish, with the four
 * Dunham Price yards plotted, major highways drawn, the river / lake /
 * Gulf-bound corridor labeled, and a soft drive-time ring around each yard.
 *
 * Designed to read as a real engineer's site map, not decoration. Mono
 * labels, hairline grid, scale bar, north arrow, and a "→ Cameron LNG · Gulf"
 * affordance off the south edge so the map stays connected to the bigger
 * regional context the company actually serves.
 *
 * Coordinate projection is a simple linear lon/lat → SVG mapping. At ~30°N
 * one degree of longitude is ~60 mi and one degree of latitude is ~69 mi,
 * so the chosen viewBox of 800×600 over a 0.70°×0.45° window keeps the
 * geographic distortion under ~2%.
 *
 * TODO: Mapbox / MapLibre dark style swap. Keep the same marker contract
 * (highlight by id) and the same external classNames.
 */
const BOUNDS = {
  minLon: -93.65,
  maxLon: -92.95,
  minLat: 30.1,
  maxLat: 30.55,
} as const;

const VIEW = { w: 800, h: 600 } as const;

function project(lon: number, lat: number): { x: number; y: number } {
  const x = ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * VIEW.w;
  const y = (1 - (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * VIEW.h;
  return { x, y };
}

/** ~5 mi at this projection, used for soft drive-time rings around yards. */
const FIVE_MI_PX = (5 / 60) * (VIEW.w / (BOUNDS.maxLon - BOUNDS.minLon));

/** Roughly: WSW–ENE diagonal across the parish. Real I-10 follows this line. */
const I10_PATH = "M 0 415 C 200 412, 380 408, 540 415 S 760 422, 800 420";

/** US-171: Ragley → Lake Charles, north-south on the east side. */
const US171_PATH = "M 470 0 C 472 130, 478 260, 482 415 S 488 560, 492 600";

/** LA-27: Sulphur ↑ toward Ragley, gentle dogleg through low country. */
const LA27_PATH = "M 308 600 C 312 500, 305 380, 330 280 S 380 140, 470 50";

/** Calcasieu River: drains south from north of Ragley through the lake. */
const RIVER_PATH =
  "M 460 0 C 470 100, 430 200, 470 300 S 510 460, 480 600";

/** Calcasieu Lake suggestion: oval just south-east of the LC yard. */
const LAKE_PATH = "M 510 560 C 540 555, 580 575, 590 600 L 470 600 C 470 580, 490 565, 510 560 Z";

function LabeledRoad({
  d,
  label,
  labelPos,
  emphasis = "med",
}: {
  d: string;
  label: string;
  labelPos: { x: number; y: number; rotate?: number };
  emphasis?: "high" | "med" | "low";
}) {
  const stroke =
    emphasis === "high" ? "#f5c518" : emphasis === "med" ? "#5a5a5e" : "#3a3a3c";
  const opacity = emphasis === "high" ? 0.55 : emphasis === "med" ? 0.7 : 0.6;
  const width = emphasis === "high" ? 2.4 : emphasis === "med" ? 1.6 : 1.2;
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeOpacity={opacity}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={emphasis === "high" ? undefined : "1 6"}
      />
      <text
        x={labelPos.x}
        y={labelPos.y}
        transform={
          labelPos.rotate
            ? `rotate(${labelPos.rotate} ${labelPos.x} ${labelPos.y})`
            : undefined
        }
        fontSize="9"
        letterSpacing="2"
        fill={emphasis === "high" ? "#f5c518" : "#7a7a7d"}
        fontFamily="var(--font-mono)"
        style={{ textTransform: "uppercase" }}
      >
        {label}
      </text>
    </g>
  );
}

function IllustratedMap({
  activeId,
  onActivate,
}: {
  activeId: string;
  onActivate: (id: string) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawables = useRef<SVGPathElement[]>([]);

  // Trigger draw-on-view: river, highways, parish boundary all stroke in
  // when the map first enters the viewport.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          drawables.current.forEach((p) => p.classList.add("is-drawn"));
          io.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const active = LOCATIONS.find((l) => l.id === activeId);
  const activePos = active ? project(active.coords[0], active.coords[1]) : null;

  /** Stable closure to push refs into the drawables array. */
  const pushDraw = (el: SVGPathElement | null) => {
    if (el && !drawables.current.includes(el)) drawables.current.push(el);
  };

  return (
    <div
      ref={wrapRef}
      className="relative aspect-[4/3] w-full overflow-hidden bg-elevated ring-1 ring-line"
    >
      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="absolute inset-0 size-full"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Map of four Dunham Price yards across Calcasieu Parish, with major highways and the regional industrial corridor labeled"
      >
        <defs>
          <pattern
            id="lm-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#23232550"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="lm-vignette" cx="50%" cy="55%" r="65%">
            <stop offset="0%" stopColor="#1a1a1c" />
            <stop offset="100%" stopColor="#0e0e0f" />
          </radialGradient>
          <linearGradient id="lm-water" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#15151850" />
            <stop offset="100%" stopColor="#0a0a0b" />
          </linearGradient>
          <pattern
            id="lm-industrial"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="6" stroke="#f5c518" strokeOpacity="0.18" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Layer 0: ambient ground tone + grid */}
        <rect width={VIEW.w} height={VIEW.h} fill="url(#lm-vignette)" />
        <rect width={VIEW.w} height={VIEW.h} fill="url(#lm-grid)" />

        {/* Layer 1: parish boundary (Calcasieu) — soft enclosing shape */}
        <path
          ref={pushDraw}
          className="draw-path"
          d="M 70 540 C 80 380, 95 220, 110 80 L 720 60 C 730 200, 745 360, 740 540 Z"
          fill="none"
          stroke="#f5c518"
          strokeOpacity="0.18"
          strokeWidth="1.5"
          strokeDasharray="3 6"
        />
        <text
          x={84}
          y={92}
          fontSize="9"
          letterSpacing="3"
          fill="#7a7a7d"
          fontFamily="var(--font-mono)"
          style={{ textTransform: "uppercase" }}
        >
          Calcasieu Parish
        </text>
        <text
          x={84}
          y={108}
          fontSize="8"
          letterSpacing="2"
          fill="#5a5a5e"
          fontFamily="var(--font-mono)"
          style={{ textTransform: "uppercase" }}
        >
          Beauregard ↑ N
        </text>

        {/* Layer 2: water — Calcasieu River + Lake */}
        <path
          ref={pushDraw}
          className="draw-path"
          d={RIVER_PATH}
          fill="none"
          stroke="#3a3a3c"
          strokeOpacity="0.85"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path d={LAKE_PATH} fill="url(#lm-water)" stroke="#3a3a3c" strokeOpacity="0.7" strokeWidth="1" />
        <text
          x={520}
          y={585}
          fontSize="8"
          letterSpacing="2"
          fill="#5a5a5e"
          fontFamily="var(--font-mono)"
          style={{ textTransform: "uppercase" }}
        >
          Calcasieu Lake
        </text>

        {/* Layer 3: highways. I-10 is yellow + bold (it's the corridor that
            powers most of our deliveries). US-171 + LA-27 ride underneath
            in muted dashed strokes. */}
        <LabeledRoad
          d={I10_PATH}
          label="I-10 · East ↔ West"
          labelPos={{ x: 30, y: 405 }}
          emphasis="high"
        />
        <LabeledRoad
          d={US171_PATH}
          label="US-171"
          labelPos={{ x: 498, y: 195, rotate: 88 }}
          emphasis="med"
        />
        <LabeledRoad
          d={LA27_PATH}
          label="LA-27"
          labelPos={{ x: 320, y: 540, rotate: -78 }}
          emphasis="low"
        />

        {/* Layer 4: industrial corridor wash near the port */}
        <ellipse
          cx={520}
          cy={465}
          rx={70}
          ry={28}
          fill="url(#lm-industrial)"
          opacity="0.7"
        />
        <text
          x={520}
          y={500}
          textAnchor="middle"
          fontSize="8"
          letterSpacing="2.5"
          fill="#f5c51890"
          fontFamily="var(--font-mono)"
          style={{ textTransform: "uppercase" }}
        >
          Port of Lake Charles
        </text>

        {/* Layer 5: drive-time rings around each yard. Three concentric
            soft rings (≈5, 15, 25 mi) so the "one short drive" claim is
            visually obvious instead of just asserted. */}
        {LOCATIONS.map((l) => {
          const p = project(l.coords[0], l.coords[1]);
          const isActive = l.id === activeId;
          return (
            <g key={`ring-${l.id}`} transform={`translate(${p.x} ${p.y})`}>
              {[1, 3, 5].map((mult) => (
                <circle
                  key={mult}
                  r={FIVE_MI_PX * mult}
                  fill="none"
                  stroke={isActive ? "#f5c518" : "#3a3a3c"}
                  strokeOpacity={isActive ? 0.18 : 0.08}
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
              ))}
            </g>
          );
        })}

        {/* Layer 6: connecting lines from active to others. Subtle, just
            enough to reinforce that the four yards function as one network. */}
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
                strokeOpacity="0.22"
                strokeDasharray="1 5"
                strokeWidth="1"
              />
            );
          })}

        {/* Layer 7: yard markers. Each is a focusable button with a real
            crosshair sight + cardinal label so a contractor scanning the
            map can identify yards without depending on color. */}
        {LOCATIONS.map((l) => {
          const p = project(l.coords[0], l.coords[1]);
          const isActive = l.id === activeId;
          // Right-side labels for west-side yards, left-side for east yards
          // so labels never collide with the right margin.
          const labelOnRight = p.x < VIEW.w * 0.55;
          return (
            <g
              key={l.id}
              transform={`translate(${p.x} ${p.y})`}
              role="button"
              tabIndex={0}
              aria-label={`${l.city} yard, ${l.address}, ${l.driveTime ?? ""}`}
              aria-pressed={isActive}
              onClick={() => onActivate(l.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onActivate(l.id);
                }
              }}
              style={{ cursor: "pointer", outline: "none" }}
            >
              {/* Pulsing halo on active */}
              {isActive && (
                <circle
                  r="20"
                  fill="none"
                  stroke="#f5c518"
                  strokeOpacity="0.55"
                >
                  <animate
                    attributeName="r"
                    values="8;28;8"
                    dur="2.6s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-opacity"
                    values="0.6;0;0.6"
                    dur="2.6s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              {/* Hit target */}
              <circle r="22" fill="transparent" />
              {/* Crosshair sight ring */}
              <circle
                r={isActive ? 9 : 7}
                fill="none"
                stroke={isActive ? "#f5c518" : "#9a9a9d"}
                strokeWidth={isActive ? 1.4 : 1}
              />
              <line
                x1={isActive ? -13 : -10}
                y1="0"
                x2={isActive ? 13 : 10}
                y2="0"
                stroke={isActive ? "#f5c518" : "#9a9a9d"}
                strokeWidth="1"
              />
              <line
                x1="0"
                y1={isActive ? -13 : -10}
                x2="0"
                y2={isActive ? 13 : 10}
                stroke={isActive ? "#f5c518" : "#9a9a9d"}
                strokeWidth="1"
              />
              {/* Center dot */}
              <circle r={isActive ? 3 : 2} fill={isActive ? "#f5c518" : "#9a9a9d"} />
              {/* Label */}
              <g transform={`translate(${labelOnRight ? 18 : -18} -10)`}>
                <text
                  x="0"
                  y="0"
                  textAnchor={labelOnRight ? "start" : "end"}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="var(--font-mono)"
                  letterSpacing="2"
                  fill={isActive ? "#f4f1ea" : "#bfbfc1"}
                  style={{ textTransform: "uppercase", pointerEvents: "none" }}
                >
                  {l.city}
                </text>
                <text
                  x="0"
                  y="13"
                  textAnchor={labelOnRight ? "start" : "end"}
                  fontSize="8"
                  fontFamily="var(--font-mono)"
                  letterSpacing="1.5"
                  fill={isActive ? "#f5c518" : "#7a7a7d"}
                  style={{ textTransform: "uppercase", pointerEvents: "none" }}
                >
                  {l.driveTime?.replace(/^~/, "") ?? ""}
                </text>
              </g>
            </g>
          );
        })}

        {/* North arrow + scale bar — bottom corners */}
        <g transform="translate(56 540)" opacity="0.7">
          <line x1="0" y1="0" x2="0" y2="-26" stroke="#9a9a9d" strokeWidth="1.2" />
          <polygon points="-4,-22 0,-30 4,-22" fill="#9a9a9d" />
          <text
            x="0"
            y="10"
            textAnchor="middle"
            fontSize="9"
            letterSpacing="2"
            fill="#9a9a9d"
            fontFamily="var(--font-mono)"
            style={{ textTransform: "uppercase" }}
          >
            N
          </text>
        </g>

        {/* Scale bar = 5 mi reference. */}
        <g transform={`translate(${VIEW.w - 140} 552)`} opacity="0.7">
          <line x1="0" y1="0" x2={FIVE_MI_PX} y2="0" stroke="#9a9a9d" strokeWidth="1.4" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#9a9a9d" strokeWidth="1" />
          <line
            x1={FIVE_MI_PX}
            y1="-3"
            x2={FIVE_MI_PX}
            y2="3"
            stroke="#9a9a9d"
            strokeWidth="1"
          />
          <text
            x={FIVE_MI_PX / 2}
            y="14"
            textAnchor="middle"
            fontSize="8"
            letterSpacing="2"
            fill="#9a9a9d"
            fontFamily="var(--font-mono)"
            style={{ textTransform: "uppercase" }}
          >
            5 mi
          </text>
        </g>

        {/* Off-edge affordance: Cameron LNG / Gulf is south of frame. The
            company's largest project lives there, so we acknowledge it. */}
        <g transform="translate(680 590)" opacity="0.7">
          <text
            x="0"
            y="0"
            textAnchor="end"
            fontSize="8"
            letterSpacing="2"
            fill="#7a7a7d"
            fontFamily="var(--font-mono)"
            style={{ textTransform: "uppercase" }}
          >
            ↓ Cameron LNG · Gulf · 35 mi
          </text>
        </g>
      </svg>

      {/* Active yard popover. Sits in the upper-left so it never overlaps
          the largest cluster of pins (south-center of the map). */}
      {active && (
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="absolute left-3 top-3 max-w-[14rem] border border-accent/70 bg-base/92 p-3 backdrop-blur-md sm:left-6 sm:top-6 sm:max-w-[17rem] sm:p-4"
          role="status"
          aria-live="polite"
        >
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-accent">
            Active yard · {active.id === "westlake" ? "HQ" : "Branch"}
          </p>
          <p className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-primary">
            {active.city}, {active.state}
          </p>
          <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
            {active.address}
          </p>
          <p className="mt-1 font-mono text-[0.6rem] tracking-[0.14em] text-muted/80">
            N {active.coords[1].toFixed(3)}° / W{" "}
            {Math.abs(active.coords[0]).toFixed(3)}°
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

      {/* Bottom-right legend caption */}
      <div className="absolute bottom-3 left-3 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-muted/80 sm:bottom-4 sm:left-4">
        Drive-time rings · 5 / 15 / 25 mi
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
          <IllustratedMap activeId={activeId} onActivate={setActiveId} />
          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted">
            <span>Calcasieu Parish · Beauregard ↑</span>
            <span aria-hidden className="text-primary/25">
              /
            </span>
            <span>Tap a yard for dispatch &amp; hours</span>
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
