import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";

import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Careers",
  description: `Hiring inquiries for ${SITE.name}. Reach out to dispatch and we'll route your application to the right yard.`,
  alternates: { canonical: "/careers" },
};

/**
 * Placeholder careers page.
 *
 * The full careers experience needs employee photography, real tenure data,
 * and copy direction from the Price family before it can ship the way the
 * design review called for. Until then this page exists so the Careers nav
 * link resolves to a real page (not a dead `href="#"`) and gives a serious
 * applicant a direct way to reach hiring without bouncing.
 *
 * When the real page lands, replace this whole module with the proper
 * editorial careers experience.
 */
export default function CareersPage() {
  return (
    <>
      <Nav />

      <main
        id="main"
        tabIndex={-1}
        className="bg-base text-primary outline-none"
      >
        <section
          aria-labelledby="careers-heading"
          className="relative isolate overflow-hidden pb-24 pt-32 sm:pb-32 sm:pt-40 lg:pb-40 lg:pt-44"
        >
          <span aria-hidden="true" className="grain" />

          <div className="relative z-[2] mx-auto grid max-w-[1480px] gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-6 text-accent">
                Careers · Family Built. Customer Focused.
              </p>
              <h1
                id="careers-heading"
                className="display-fluid text-balance text-primary"
              >
                Join the
                <br />
                <span className="text-accent">fourth generation.</span>
              </h1>

              <p className="mt-10 max-w-[58ch] text-base leading-relaxed text-primary/85 sm:text-lg">
                We&rsquo;re building the full careers experience: tenure
                stats, employee portraits, the line of work each yard runs.
                Until that lands, the fastest path to a real conversation is
                a phone call to dispatch. Mention you&rsquo;re asking about
                hiring and they&rsquo;ll route you to the right person.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <a
                  href={SITE.phoneTel}
                  className="group inline-flex items-center justify-between gap-6 whitespace-nowrap bg-accent px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:bg-accent-hot"
                >
                  <span className="inline-flex items-center gap-3">
                    <Phone aria-hidden className="size-4" />
                    Call dispatch · {SITE.phone}
                  </span>
                  <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                </a>
                {/* mailto stub: a real careers inbox will replace this when
                    the family lands on a permanent address. */}
                <a
                  href={`mailto:dispatch@dunhamprice.com?subject=${encodeURIComponent(
                    "Careers inquiry",
                  )}`}
                  className="group inline-flex items-center justify-between gap-6 whitespace-nowrap border border-primary/35 px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-primary transition hover:border-accent hover:text-accent"
                >
                  <span className="inline-flex items-center gap-3">
                    <Mail aria-hidden className="size-4" />
                    Email a resume
                  </span>
                  <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="border border-line bg-elevated p-6 sm:p-8">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-accent">
                  Roles we&rsquo;re typically hiring for
                </p>
                <ul className="mt-6 space-y-4 font-mono text-[0.78rem] uppercase tracking-[0.16em] text-primary/85">
                  {[
                    "Mixer truck drivers (CDL Class B)",
                    "Plant operators",
                    "QC lab technicians",
                    "Precast yard crew",
                    "Aggregate haulers",
                    "Dispatch & logistics",
                  ].map((role) => (
                    <li key={role} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-2 block size-1 shrink-0 bg-accent"
                      />
                      <span>{role}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-8 border-t border-line pt-6 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
                  Hiring is rolling. Roles open across all four yards.
                </p>
              </div>

              <Link
                href="/#chairman"
                className="group mt-6 inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-accent transition hover:text-accent-hot"
              >
                Read the chairman&rsquo;s letter
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-500 group-hover:translate-x-1"
                />
              </Link>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
