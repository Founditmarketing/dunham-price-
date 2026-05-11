import Image from "next/image";

import { SITE } from "@/lib/content";

const SOURCE = "/brand/dunham-price-yellow-logo.png";
const SOURCE_W = 236;
const SOURCE_H = 134;
const ASPECT = SOURCE_W / SOURCE_H;

interface LogoProps {
  /**
   * Rendered height in pixels. Width is derived from the source aspect
   * ratio (~1.76:1) so the lockup never distorts. Defaults to 40px, which
   * fits cleanly inside the 64px mobile / 80px desktop nav bar.
   */
  height?: number;
  /**
   * Set to true on the above-the-fold instance (Nav). Tells next/image to
   * skip lazy-loading and treats the asset as an LCP candidate.
   */
  priority?: boolean;
  className?: string;
}

/**
 * Brand lockup. Uses the official asset pulled from the live dunhamprice.com
 * (`dp` monogram + "Dunham Price GROUP" wordmark, yellow on transparent),
 * sized by height with width derived from the source aspect ratio so the
 * mark never distorts.
 *
 * Surfaces it appears on:
 *   - Nav (priority, h≈40)
 *   - Footer (h≈64)
 *   - Mobile menu overlay (inherits Nav)
 *
 * The asset is hosted locally under `/brand/` so the page never depends on
 * a third-party CDN for its primary brand mark.
 */
export function Logo({
  height = 40,
  priority = false,
  className = "",
}: LogoProps) {
  const renderedWidth = Math.round(height * ASPECT);

  return (
    <Image
      src={SOURCE}
      alt={`${SITE.name} logo`}
      // Pass the intrinsic dimensions so next/image can reserve the right
      // aspect ratio and avoid CLS. CSS below scales the rendered size.
      width={SOURCE_W}
      height={SOURCE_H}
      priority={priority}
      sizes={`${renderedWidth}px`}
      className={`select-none ${className}`}
      style={{ height: `${height}px`, width: "auto" }}
    />
  );
}
