import { SITE } from "@/lib/content";

const SOURCE = "/brand/dunham-price-yellow-logo.png";
const SOURCE_W = 236;
const SOURCE_H = 134;
const ASPECT = SOURCE_W / SOURCE_H;

type LogoTone = "currentColor" | "accent" | "primary" | "ink";

interface LogoProps {
  /**
   * Rendered height in pixels. Width is derived from the source aspect
   * ratio (~1.76:1) so the lockup never distorts. Defaults to 40px, which
   * fits cleanly inside the 64px mobile / 80px desktop nav bar.
   */
  height?: number;
  /**
   * Logo color treatment.
   *   - `currentColor` (default): mask painted with the parent's text color,
   *     so the mark blends with the surrounding type instead of fighting
   *     it. On dark surfaces (Nav, Footer, mobile menu) it inherits the
   *     site's cream `text-primary`. Theme-aware out of the box.
   *   - `accent`: yellow brand mark (the original asset color).
   *   - `primary`: cream, regardless of context.
   *   - `ink`: near-black, for placement on cream / yellow surfaces.
   */
  tone?: LogoTone;
  className?: string;
}

const TONE_STYLE: Record<LogoTone, string> = {
  currentColor: "currentColor",
  accent: "var(--color-accent)",
  primary: "var(--color-primary)",
  ink: "var(--color-ink)",
};

/**
 * Brand lockup. Uses the official asset pulled from the live dunhamprice.com
 * (`dp` monogram + "Dunham Price GROUP" wordmark) sized by height, with
 * width derived from the source aspect ratio so the mark never distorts.
 *
 * Color treatment: the source PNG ships with the brand yellow baked in, so
 * we render the asset as a CSS mask and paint it with `currentColor` (or
 * a chosen tone). That keeps the same single source of truth (`/brand/...`)
 * while letting the lockup pick up the surrounding text color, so it sits
 * harmoniously inside the page's tinted neutrals instead of always
 * shouting in safety yellow.
 *
 * Surfaces it appears on:
 *   - Nav (h≈44, inherits text-primary on dark surfaces)
 *   - Footer (h≈72, same)
 *   - Mobile menu overlay (inherits Nav)
 *
 * If you ever need the original branded yellow lockup back (e.g. on a
 * cream surface where neutrals would disappear), pass `tone="accent"`.
 *
 * The asset is hosted locally under `/brand/` so the page never depends
 * on a third-party CDN for its primary brand mark.
 */
export function Logo({
  height = 40,
  tone = "currentColor",
  className = "",
}: LogoProps) {
  const renderedWidth = Math.round(height * ASPECT);

  return (
    <span
      role="img"
      aria-label={`${SITE.name} logo`}
      className={`inline-block shrink-0 select-none ${className}`}
      style={{
        height: `${height}px`,
        width: `${renderedWidth}px`,
        backgroundColor: TONE_STYLE[tone],
        WebkitMaskImage: `url(${SOURCE})`,
        maskImage: `url(${SOURCE})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
