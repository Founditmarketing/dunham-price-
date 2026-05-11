"use client";

import { motion, useReducedMotion } from "framer-motion";

import { CertMark } from "@/components/CertMark";
import { CERTIFICATIONS } from "@/lib/content";
import { QC_CHECKPOINTS } from "@/lib/capabilities";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Quality control + certifications band, cream theme.
 *
 * Two-column editorial layout: copy + checkpoint list on the left, 3x2 cert
 * grid on the right. Cert tiles are bordered mono boxes with a yellow-border
 * + slight lift on hover.
 */
export function QualityBand() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="quality-heading"
      className="relative bg-cream py-24 text-ink sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Copy column */}
          <div className="lg:col-span-6">
            <p className="eyebrow mb-5 text-ink/60">Quality Control</p>
            <h2
              id="quality-heading"
              className="display-section max-w-[16ch] text-ink"
            >
              Spec&rsquo;d to standard. <br className="hidden sm:block" />
              Tested to certainty.
            </h2>
            <p className="mt-8 max-w-[58ch] text-base leading-relaxed text-ink/75 sm:text-lg">
              Our quality control procedures and laboratories adhere to ACI,
              PCI, Texas DOT, and Louisiana DOTD guidelines. Several members of
              our management team are Level&nbsp;II and Level&nbsp;III certified
              by PCI.
            </p>

            {/* QC checkpoint mono list */}
            <ul
              aria-label="Quality control checkpoints"
              className="mt-10 flex flex-wrap gap-x-3 gap-y-3"
            >
              {QC_CHECKPOINTS.map((c, i) => (
                <li
                  key={c}
                  className="inline-flex items-center gap-2 border border-ink/15 bg-cream-2 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink"
                >
                  <span aria-hidden="true" className="block size-1 bg-accent" />
                  {c}
                  {i < QC_CHECKPOINTS.length - 1 && (
                    <span aria-hidden className="sr-only">
                      ,
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Cert grid */}
          <div className="lg:col-span-6">
            <p className="eyebrow mb-6 text-ink/55">
              Certifications &amp; Memberships
            </p>
            <ul
              aria-label="Industry certifications"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
            >
              {CERTIFICATIONS.map((c, i) => (
                <motion.li
                  key={c.abbr}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 12 }
                  }
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.06,
                    ease: EASE,
                  }}
                >
                  {/* Credential plate.
                      Was an <a href="#"> previously, but the cert plates
                      aren't navigation: they're decorative trust marks. The
                      `aria-label` and meaningful content live on the plate
                      itself; converting from a dead anchor to a non-link
                      <div> removes the deceptive "click does nothing"
                      affordance while keeping the hover lift as a tactile
                      detail. When real cert URLs land, restore the anchor
                      with the actual href. */}
                  <div
                    role="img"
                    aria-label={`${c.full} (${c.abbr})`}
                    className="group relative flex aspect-[5/3] flex-col items-stretch justify-between border border-ink/15 bg-cream p-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-accent hover:shadow-[0_12px_24px_-12px_rgba(10,10,11,0.18)] sm:p-4"
                  >
                    <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-ink/55">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Per-cert SVG mark — distinct typographic device per
                        accreditation. Drop-in shape for licensed logo SVGs.
                        // TODO: replace with logo SVG */}
                    <CertMark
                      abbr={c.abbr}
                      className="text-ink/85 transition-colors duration-500 group-hover:text-accent"
                    />
                    <span className="block text-center font-mono text-[0.5rem] uppercase leading-tight tracking-[0.16em] text-ink/55">
                      {c.full}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>
            <p className="mt-6 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink/55">
              ACI · PCI · NRMCA · CAAL · AGC · ABC
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
