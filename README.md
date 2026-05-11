# Dunham Price Group — Homepage Prototype (2026)

High-end editorial industrial redesign of [dunhamprice.com](https://dunhamprice.com) for Dunham Price Group, a 4th-generation concrete, precast, and aggregates supplier in Southwest Louisiana, founded 1939.

Single-page Next.js prototype. Reference content only — visual language is wholly new.

## Stack

- **Next.js 16 (App Router)** with React 19, TypeScript strict mode
- **Tailwind CSS v4** (CSS-first config via `@theme` in `app/globals.css`)
- **Framer Motion** for component-level reveals + mobile menu
- **GSAP + ScrollTrigger** for hero parallax and scroll-pinned moments
- **lucide-react** for icons
- **next/font** for self-hosted Big Shoulders Display, Inter, and JetBrains Mono
- **next/image** with remote pattern allowed for `dunhamprice.com` assets

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build && npm start
```

## File map

```
app/
  layout.tsx                   Self-hosted fonts, metadata, root chrome
  page.tsx                     Homepage — 10 sections
  globals.css                  Tailwind v4 theme tokens, hazard utility, motion vars, print
  capabilities/page.tsx        Capabilities page — 4 divisions + calculator + quality + cross-sell
  projects/page.tsx            Filterable project index
  projects/[slug]/page.tsx     Dynamic project detail (SSG via generateStaticParams)
components/
  Nav.tsx                      Fixed nav, transparent → solid on scroll, mobile overlay
  Hero.tsx                     Looping muted video, masked headline reveal, vertical scroll cue
  StatBar.tsx                  Count-up on intersect, hazard bands top + bottom
  DivisionGrid.tsx             2 × 2 image cards, corner brackets on hover
  LocationsMap.tsx             Stylized SVG map placeholder, active marker pulse
  ProjectsStrip.tsx            Homepage snap-x horizontal scroller (uses ProjectCard)
  ProjectCard.tsx              Reusable portrait project card (homepage strip + cross-sell + related)
  Certifications.tsx           Cream section, mono boxed cells
  ChairmanQuote.tsx            Editorial pulled-quote layout
  QuoteCTA.tsx                 Yellow band, hazard-stripe top, accepts contextual headline/subhead/service
  Footer.tsx                   Four-column dark footer with subtle hazard accent
  HazardStripe.tsx             Reusable diagonal yellow/black band w/ slide-in
  ScrollChoreography.tsx       GSAP + ScrollTrigger global scenes
  Logo.tsx                     Wordmark lockup placeholder (TODO: SVG logo)

  CapabilitiesHero.tsx         Compact ~60vh hero w/ vertical cert callout
  DivisionNav.tsx              Sticky scroll-spy with framer-motion layoutId underline
  DivisionSection.tsx          Repeating template — header strip + product grid/list + footer band
  ProductImageCard.tsx         Image + spec-block fallback card (aggregates + sand)
  ProductRow.tsx               Two-column text row (ready mix + precast)
  ConcreteCalculator.tsx       Functional Slab / Footing / Column calculator with live debounced math
  QualityBand.tsx              Cream section w/ QC checkpoints + 3×2 cert tile grid
  CrossSellStrip.tsx           Three-up project card grid on dark

  ProjectHero.tsx              Full-bleed hero with masked title reveal + scope card + vertical slug
  ProjectMetrics.tsx           Hazard-banded stat strip with count-up
  ProjectNarrative.tsx         Cream Challenge / Approach two-column with vertical yellow rule
  ProjectScope.tsx             Spec-sheet style scope rows + PDF stub link
  ProjectGallery.tsx           Asymmetric grid + native <dialog> lightbox (focus trap, arrow nav, swipe)
  ProjectTestimonial.tsx       Conditional pull quote, dark
  ProjectFacts.tsx             Tabular metadata, two-column on desktop
  RelatedProjects.tsx          Cream "more work" — 3 cards, fallback to same-category
  ProjectsIndex.tsx            Client-side filterable grid with category + division pills
lib/
  content.ts                   Homepage copy, nav, divisions overview, locations, projects strip
  capabilities.ts              Full division + product catalog data
  projects.ts                  Project[] data + getProject / getRelatedProjects / label maps
types/
  index.ts                     Shared domain types (Division, Location, Project strip card, Stat)
```

## Brand system

**Palette** (declared as Tailwind v4 theme tokens in `app/globals.css`):

| Token | Hex | Notes |
| --- | --- | --- |
| `bg-base` | `#0E0E0F` | Primary dark surface |
| `bg-elevated` | `#1A1A1C` | Cards, second-level surfaces |
| `accent` (yellow) | `#F5C518` | Surgical: CTAs, hazard, division markers, "Since 1939" |
| `concrete` | `#A8A29E` | Warm gray neutral |
| `cream` | `#F4F1EA` | Light section background |
| `primary` | `#F4F1EA` | Default text on dark |
| `muted` | `#8A8A8C` | Secondary text |

**Typography**

- **Big Shoulders Display** 700 / 800 / 900 — industrial editorial headlines
- **Inter** 400 / 500 / 600 — body
- **JetBrains Mono** 400 / 500 — specs, eyebrows, tech details

**Motion**

- Cinematic but disciplined. Long durations (0.7 – 1.1 s).
- Custom cubic-bezier `[0.16, 1, 0.3, 1]` for almost everything.
- No bouncy springs. Hazard-stripe transitions slide in on scroll.
- All scroll choreography respects `prefers-reduced-motion`.

## Routes

| Route | Type | Notes |
| --- | --- | --- |
| `/` | Static | Homepage with all 10 sections |
| `/capabilities` | Static | Four divisions, calculator, quality band, cross-sell, CTA |
| `/projects` | Static | Filterable index by category + division |
| `/projects/[slug]` | SSG | Three projects pre-generated via `generateStaticParams`; unknown slugs hit `notFound()` |

## Out of scope (prototype)

- CMS integration — content lives in `lib/content.ts`, `lib/capabilities.ts`, and `lib/projects.ts`. Types co-located so a CMS swap is a 1:1 mapping.
- Forms — `Request a Quote` routes to a `#` anchor with query-string context for now.
- Real Mapbox integration — stylized SVG placeholder. See `// TODO: Mapbox token + real coordinates` in `LocationsMap.tsx`.
- Real per-product / per-project photography, logo SVGs, and PDF spec-sheet generation — annotated `// TODO` everywhere they belong.

## Accessibility & performance notes

- Single `h1` (in the hero), `h2` per section, proper landmark roles.
- Skip link to main content.
- All interactive elements keyboard-accessible.
- Hero video is `playsInline muted loop autoplay` with a poster fallback, paused via `IntersectionObserver` when offscreen, and skipped entirely on data-saver / 2g / 3g connections.
- Below-fold images lazy-load via `next/image`.
- `prefers-reduced-motion` disables parallax, count-ups, and pulses.

## Conventions

- Strict TypeScript. No `any`.
- Components named after the section they own.
- Content in `lib/content.ts` is fully typed via `types/index.ts`.
