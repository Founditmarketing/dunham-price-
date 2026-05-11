/**
 * Shared motion tokens.
 *
 * The site uses one motion curve everywhere on purpose: a cinematic
 * ease-out cubic bezier that lets values arrive heavily and settle
 * quietly, matching the "concrete pour" metaphor that runs through the
 * pour-rule animations on Hero / PourStat / Timeline / SpecBuilder /
 * OperationalTicker / QuoteCTA. Keeping the curve in one constant means
 * components stay visually consistent without each redeclaring its own
 * literal cubic-bezier tuple.
 *
 * The same curve is also exposed as the CSS variable `--ease-cinematic`
 * in app/globals.css; use that one for plain CSS animations / transitions
 * and this one for framer-motion `transition.ease`.
 *
 * If a component genuinely needs a different curve (e.g. a UI control
 * that wants tighter snap), import a new named constant from this module
 * rather than inlining a tuple at the call site.
 */
export const EASE = [0.16, 1, 0.3, 1] as const;
