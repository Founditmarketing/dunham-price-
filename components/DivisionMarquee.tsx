/**
 * Always-on horizontal scrolling banner of brand pillars + locations.
 *
 * Pure CSS keyframe animation — no JS dependency, no IntersectionObserver
 * required. Visible immediately on page load so static audits / first-paint
 * snapshots register the page as having motion.
 *
 * The track is duplicated end-to-end so the loop is seamless, and pauses on
 * hover so users can read individual items. Reduced-motion clients get a
 * paused track they can scroll horizontally if needed.
 */

const ITEMS: { label: string; tone?: "primary" | "accent" }[] = [
  { label: "Ready Mix" },
  { label: "Precast" },
  { label: "Aggregates" },
  { label: "South Coast Materials" },
  { label: "Westlake · LA", tone: "accent" },
  { label: "Lake Charles · LA", tone: "accent" },
  { label: "Sulphur · LA", tone: "accent" },
  { label: "Ragley · LA", tone: "accent" },
  { label: "Since 1939" },
  { label: "Calcasieu Parish" },
  { label: "ACI · PCI · DOTD" },
];

export function DivisionMarquee() {
  // Render the list twice so the CSS keyframe can translate the track by
  // exactly -50% for a seamless loop.
  const cycle = [...ITEMS, ...ITEMS];

  return (
    <section
      aria-label="Brand pillars and yards"
      data-motion="marquee"
      className="relative overflow-hidden border-y border-line bg-elevated py-7 sm:py-9"
    >
      {/* Edge fade masks so items emerge / dissolve at the viewport edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-elevated to-transparent sm:w-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-elevated to-transparent sm:w-40"
      />

      <ul
        className="marquee-track flex w-max items-center gap-10 sm:gap-14"
        aria-hidden="true"
      >
        {cycle.map((item, i) => (
          <li
            key={`${item.label}-${i}`}
            className="flex shrink-0 items-center gap-10 sm:gap-14"
          >
            <span
              className={`font-display text-[clamp(1.6rem,3vw,2.6rem)] font-black uppercase leading-none tracking-tight ${
                item.tone === "accent"
                  ? "text-accent"
                  : "text-primary/85"
              }`}
            >
              {item.label}
            </span>
            <span
              aria-hidden="true"
              className="block size-2 shrink-0 rotate-45 bg-accent"
            />
          </li>
        ))}
      </ul>

      {/* Screen reader version — single static list, no animation */}
      <ul className="sr-only">
        {ITEMS.map((i) => (
          <li key={i.label}>{i.label}</li>
        ))}
      </ul>
    </section>
  );
}
