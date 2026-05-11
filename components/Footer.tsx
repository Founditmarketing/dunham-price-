import Link from "next/link";
import { Phone } from "lucide-react";

import { Logo } from "@/components/Logo";
import {
  DIVISIONS,
  FOOTER_COMPANY,
  LOCATIONS,
  SITE,
} from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-base text-primary">
      {/* Subtle hazard accent — short bar, top right */}
      <div className="mx-auto flex max-w-[1480px] justify-end px-6 pt-8 sm:px-10">
        <div className="hazard-stripe-soft h-2 w-32" aria-hidden="true" />
      </div>

      <div className="mx-auto grid max-w-[1480px] gap-12 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Logo height={72} />
          <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-primary/70">
            Serving {SITE.region} since {SITE.founded}. Concrete, precast, and
            aggregates engineered for the Gulf Coast.
          </p>
          <a
            href={SITE.phoneTel}
            className="mt-4 -mx-3 inline-flex min-h-[44px] items-center gap-2 px-3 py-3 font-mono text-sm tracking-[0.14em] text-primary transition hover:text-accent"
          >
            <Phone className="size-4 text-accent" aria-hidden />
            {SITE.phone}
          </a>
        </div>

        <FooterCol heading="Capabilities">
          {DIVISIONS.map((d) => (
            <FooterLink key={d.slug} href={d.href}>
              {d.name}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol heading="Company">
          {FOOTER_COMPANY.map((l) => (
            <FooterLink key={l.label} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol heading="Locations">
          {LOCATIONS.map((l) => (
            <li key={l.id} className="space-y-1 px-2 py-2.5">
              <span className="block font-mono text-[0.72rem] uppercase tracking-[0.16em] text-primary">
                {l.city}, {l.state}
              </span>
              <span className="block font-mono text-[0.7rem] tracking-[0.05em] text-muted">
                {l.address}
              </span>
            </li>
          ))}
        </FooterCol>
      </div>

      {/* Bottom bar.
          The previous SocialLink cluster (FB/IG/LI) was removed because
          dunhamprice.com doesn't have public social profiles — the buttons
          rendered with href="#" and clicking them did nothing. When real
          handles exist, re-add a SocialLink cluster with the actual URLs;
          until then, this row stays clean rather than lying to the user. */}
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1480px] flex-col items-start justify-between gap-3 px-6 py-8 sm:flex-row sm:items-center sm:px-10">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
            © {year} {SITE.name}. All rights reserved. Westlake, LA.
          </p>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
            Privacy · Terms · Accessibility
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="lg:col-span-2 lg:[&:nth-of-type(4)]:col-span-4">
      <h3 className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-accent">
        {heading}
      </h3>
      <ul className="-mx-2">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  // min-h-[44px] guarantees the rendered tap target clears WCAG 2.5.5,
  // regardless of computed line-height. inline-flex + items-center keeps
  // the label optically centered at the larger height.
  return (
    <li>
      <Link
        href={href}
        className="flex min-h-[44px] items-center px-2 font-mono text-[0.78rem] tracking-[0.05em] text-primary/80 transition hover:text-accent"
      >
        {children}
      </Link>
    </li>
  );
}

