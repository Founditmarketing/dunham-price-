"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Phone } from "lucide-react";

import { SITE } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

const SERVICES = [
  { id: "ready-mix", label: "Ready Mix" },
  { id: "precast", label: "Precast" },
  { id: "aggregates", label: "Aggregates" },
  { id: "south-coast", label: "South Coast Materials" },
  { id: "other", label: "Other / unsure" },
] as const;

type ServiceId = (typeof SERVICES)[number]["id"];

interface QuoteFormState {
  name: string;
  company: string;
  phone: string;
  email: string;
  service: ServiceId;
  volume: string;
  location: string;
  pourDate: string;
  notes: string;
}

interface FieldErrors {
  name?: string;
  phone?: string;
  email?: string;
}

const EMPTY: QuoteFormState = {
  name: "",
  company: "",
  phone: "",
  email: "",
  service: "ready-mix",
  volume: "",
  location: "",
  pourDate: "",
  notes: "",
};

/**
 * The dispatch inbox the mailto: form opens against. Used by /careers too.
 * When a real form-handler backend (Resend / SendGrid / Formspree) is wired
 * up, swap this module-level constant + the handleSubmit() body and the
 * UI keeps working.
 */
const DISPATCH_EMAIL = "dispatch@dunhamprice.com";

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function isPhone(s: string): boolean {
  // US-ish: at least 10 digits when stripped of formatting characters.
  return s.replace(/\D/g, "").length >= 10;
}

/**
 * Quote request form.
 *
 * Replaces the dead "Request a Quote" CTAs that previously linked to /#quote
 * and looped back to themselves. Real form, real validation, real handoff:
 * the submit handler builds a structured plain-text email body from every
 * field and opens the visitor's default email client to dispatch. Zero
 * infrastructure required to ship; ready to swap to a server-action +
 * Resend/SendGrid backend whenever one's wired up.
 *
 * URL pre-fill: reads search params so the calculator (`?volume=12.5`),
 * the spec selector (`?application=slab&psi=4000&slump=5&conditions=...`),
 * and the project pages (`?project=cameron-lng-facility`) all hand their
 * context to dispatch automatically. The buyer doesn't re-type what they
 * already told the page upstream.
 */
export function QuoteForm() {
  const prefersReducedMotion = useReducedMotion();
  const search = useSearchParams();

  const formId = useId();

  const [values, setValues] = useState<QuoteFormState>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // URL pre-fill: build a "from upstream tools" preface for the notes
  // field and select the right service radio if the upstream caller
  // told us which one. This effect runs once on mount.
  useEffect(() => {
    const service = search?.get("service") as ServiceId | null;
    const application = search?.get("application");
    const psi = search?.get("psi");
    const slump = search?.get("slump");
    const conditions = search?.get("conditions");
    const volume = search?.get("volume");
    const mode = search?.get("mode");
    const project = search?.get("project");

    const preface: string[] = [];

    if (application || psi || slump || conditions) {
      preface.push("From the spec selector:");
      if (application) preface.push(`  Application: ${application}`);
      if (psi) preface.push(`  Compressive strength: ${psi} PSI`);
      if (slump) preface.push(`  Target slump: ${slump} in`);
      if (conditions) {
        preface.push(`  Conditions: ${conditions.split(",").join(", ")}`);
      }
    }

    if (volume || mode) {
      if (preface.length > 0) preface.push("");
      preface.push("From the calculator:");
      if (mode) preface.push(`  Pour type: ${mode}`);
      if (volume) preface.push(`  Estimated volume: ${volume} yd³`);
    }

    if (project) {
      if (preface.length > 0) preface.push("");
      preface.push(`Asking about a project similar to: ${project}`);
    }

    if (preface.length > 0) {
      setValues((cur) => ({
        ...cur,
        notes: `${preface.join("\n")}\n\n`,
        service:
          service && SERVICES.some((s) => s.id === service)
            ? service
            : cur.service,
        volume: volume ?? cur.volume,
      }));
    } else if (service && SERVICES.some((s) => s.id === service)) {
      setValues((cur) => ({ ...cur, service }));
    } else if (volume) {
      setValues((cur) => ({ ...cur, volume }));
    }
    // Effect runs only on mount; URL changes after first paint shouldn't
    // wipe whatever the user is in the middle of typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = <K extends keyof QuoteFormState>(
    key: K,
    value: QuoteFormState[K],
  ) => {
    setValues((cur) => ({ ...cur, [key]: value }));
    // Clear that field's error as soon as the user starts fixing it.
    if (key in errors) {
      setErrors((cur) => {
        const next = { ...cur };
        delete next[key as keyof FieldErrors];
        return next;
      });
    }
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (values.name.trim().length < 2) {
      next.name = "Please enter your name.";
    }
    if (!isPhone(values.phone)) {
      next.phone = "10-digit phone, please.";
    }
    if (!isEmail(values.email)) {
      next.email = "We need a valid email to reply.";
    }
    return next;
  };

  /**
   * Build the mailto body. Plain text with section headers so the dispatch
   * team can scan the request top-down. Includes everything the buyer
   * supplied plus the upstream-tool preface that landed in `notes`.
   */
  const buildMailto = (): string => {
    const lines: string[] = [];
    lines.push("Quote request via dunhamprice.com", "");
    lines.push(`Name:     ${values.name}`);
    if (values.company) lines.push(`Company:  ${values.company}`);
    lines.push(`Phone:    ${values.phone}`);
    lines.push(`Email:    ${values.email}`);
    lines.push(
      `Service:  ${SERVICES.find((s) => s.id === values.service)?.label ?? values.service}`,
    );
    if (values.volume) lines.push(`Volume:   ${values.volume} yd³ (estimate)`);
    if (values.location) lines.push(`Location: ${values.location}`);
    if (values.pourDate) lines.push(`Pour day: ${values.pourDate}`);
    if (values.notes.trim()) {
      lines.push("", "Notes:", values.notes.trim());
    }

    const subject = encodeURIComponent(
      `Quote request · ${values.name}${values.company ? ` (${values.company})` : ""}`,
    );
    const body = encodeURIComponent(lines.join("\n"));
    return `mailto:${DISPATCH_EMAIL}?subject=${subject}&body=${body}`;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Focus the first invalid field for keyboard / screen-reader users.
      const firstInvalid = (Object.keys(next) as Array<keyof FieldErrors>)[0];
      if (firstInvalid) {
        const el = document.getElementById(`${formId}-${firstInvalid}`);
        el?.focus();
      }
      return;
    }
    // Open the user's default mail client. Same-tab is the right call:
    // mailto: is handled by the OS, the page itself doesn't navigate.
    window.location.href = buildMailto();
    setSubmitted(true);
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setSubmitted(false);
  };

  /* Confirmation state ------------------------------------------------- */

  if (submitted) {
    return (
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex flex-col gap-6 border border-ink bg-ink/[0.04] p-6 text-ink sm:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center bg-ink text-cream">
            <Check className="size-5" aria-hidden />
          </span>
          <p className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
            Email composed.
          </p>
        </div>
        <p className="max-w-[58ch] text-base leading-[1.55] text-ink/85">
          Your default mail app should be open with the request to{" "}
          <span className="font-mono text-[0.95rem]">{DISPATCH_EMAIL}</span>.
          Hit Send when you&rsquo;re ready and dispatch will route it to the
          nearest yard with availability.
        </p>
        <div className="flex flex-col gap-3 border-t border-ink/15 pt-5 sm:flex-row sm:items-center">
          <a
            href={SITE.phoneTel}
            className="group inline-flex items-center justify-between gap-5 whitespace-nowrap bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-cream transition-colors hover:bg-base"
          >
            <span className="inline-flex items-center gap-3">
              <Phone aria-hidden className="size-4" />
              Or call {SITE.phone}
            </span>
            <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
          </a>
          <button
            type="button"
            onClick={reset}
            className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink/70 transition hover:text-ink"
          >
            Send another →
          </button>
        </div>
      </motion.div>
    );
  }

  /* Form state --------------------------------------------------------- */

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Request a quote"
      className="flex flex-col gap-6"
    >
      {/* Name + Company */}
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-5">
        <FieldRow
          id={`${formId}-name`}
          label="Name"
          required
          error={errors.name}
        >
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${formId}-name-err` : undefined}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className="quote-input"
          />
        </FieldRow>
        <FieldRow id={`${formId}-company`} label="Company">
          <input
            id={`${formId}-company`}
            name="company"
            type="text"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => update("company", e.target.value)}
            className="quote-input"
          />
        </FieldRow>
      </div>

      {/* Phone + Email */}
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-5">
        <FieldRow
          id={`${formId}-phone`}
          label="Phone"
          required
          error={errors.phone}
        >
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="337-555-0100"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${formId}-phone-err` : undefined}
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="quote-input"
          />
        </FieldRow>
        <FieldRow
          id={`${formId}-email`}
          label="Email"
          required
          error={errors.email}
        >
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${formId}-email-err` : undefined}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className="quote-input"
          />
        </FieldRow>
      </div>

      {/* Service */}
      <fieldset className="flex flex-col gap-3">
        <legend className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-ink/65">
          Service · select one
        </legend>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => {
            const active = s.id === values.service;
            return (
              <label
                key={s.id}
                className={`inline-flex min-h-[40px] cursor-pointer items-center gap-2 border px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] transition-colors duration-300 ${
                  active
                    ? "border-ink bg-ink text-cream"
                    : "border-ink/30 bg-transparent text-ink/85 hover:border-ink/60"
                }`}
              >
                <input
                  type="radio"
                  name="service"
                  value={s.id}
                  checked={active}
                  onChange={() => update("service", s.id)}
                  className="sr-only"
                />
                {s.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Volume + Pour date + Location */}
      <div className="grid gap-6 sm:grid-cols-3 sm:gap-5">
        <FieldRow
          id={`${formId}-volume`}
          label="Volume"
          hint="Cubic yards (estimate)"
        >
          <input
            id={`${formId}-volume`}
            name="volume"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 12"
            value={values.volume}
            onChange={(e) => update("volume", e.target.value)}
            className="quote-input"
          />
        </FieldRow>
        <FieldRow
          id={`${formId}-pourDate`}
          label="Target pour day"
          hint="Best guess"
        >
          <input
            id={`${formId}-pourDate`}
            name="pourDate"
            type="date"
            value={values.pourDate}
            onChange={(e) => update("pourDate", e.target.value)}
            className="quote-input"
          />
        </FieldRow>
        <FieldRow
          id={`${formId}-location`}
          label="Job site"
          hint="City or zip"
        >
          <input
            id={`${formId}-location`}
            name="location"
            type="text"
            placeholder="e.g. Lake Charles"
            value={values.location}
            onChange={(e) => update("location", e.target.value)}
            className="quote-input"
          />
        </FieldRow>
      </div>

      {/* Notes */}
      <FieldRow
        id={`${formId}-notes`}
        label="Notes for dispatch"
        hint="Optional · spec details, access constraints, schedule"
      >
        <textarea
          id={`${formId}-notes`}
          name="notes"
          rows={5}
          placeholder="Anything else dispatch should know about the pour."
          value={values.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="quote-input resize-y"
        />
      </FieldRow>

      {/* Submit + phone fallback */}
      <div className="flex flex-col gap-4 border-t border-ink/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="group inline-flex items-center justify-between gap-5 whitespace-nowrap bg-ink px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-cream transition-colors hover:bg-base focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
        >
          Send to dispatch
          <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
        </button>
        <a
          href={SITE.phoneTel}
          className="group inline-flex min-h-[40px] items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink/70 transition hover:text-ink"
        >
          <Phone aria-hidden className="size-3.5" />
          Or call {SITE.phone}
        </a>
      </div>

      <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink/55">
        Submit opens your default mail app with the request pre-composed.
        We never store form data on this page.
      </p>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* Field shell                                                                 */
/* -------------------------------------------------------------------------- */

function FieldRow({
  id,
  label,
  hint,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-3 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-ink/65"
      >
        <span>
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-ink/85">
              *
            </span>
          )}
        </span>
        {hint && (
          <span className="text-[0.55rem] tracking-[0.18em] text-ink/45">
            {hint}
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-err`}
          role="alert"
          className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink"
        >
          {error}
        </p>
      )}
    </div>
  );
}

