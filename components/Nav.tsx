"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";

import { Logo } from "@/components/Logo";
import { NAV_LINKS, SITE } from "@/lib/content";

const SCROLLED_AT = 32;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLLED_AT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll while the mobile overlay is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-500 ${
          scrolled || open
            ? "bg-base/85 backdrop-blur-md border-b border-line/70"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between px-6 sm:h-20 sm:px-10">
          <Link
            href="/"
            aria-label={`${SITE.name} home`}
            className="relative z-10 -my-2 inline-flex items-center py-2"
          >
            <Logo />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-9 lg:flex"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-primary/80 transition hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={SITE.phoneTel}
              className="hidden items-center gap-2 -my-2 py-2 font-mono text-[0.78rem] tracking-[0.12em] text-primary/85 transition hover:text-accent md:inline-flex"
            >
              <Phone className="size-3.5" aria-hidden />
              {SITE.phone}
            </a>
            <Link
              href="/#quote"
              className="hidden whitespace-nowrap bg-accent px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink transition hover:bg-accent-hot md:inline-flex"
            >
              Request a Quote
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-10 inline-flex size-11 items-center justify-center text-primary lg:hidden"
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-base lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex flex-1 flex-col justify-between px-6 pb-10 pt-24 sm:px-10">
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={
                      prefersReducedMotion ? { opacity: 1 } : { y: 24, opacity: 0 }
                    }
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.08 + i * 0.07,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 font-display text-5xl font-black tracking-tight text-primary transition hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={
                  prefersReducedMotion ? { opacity: 1 } : { y: 16, opacity: 0 }
                }
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="space-y-6 border-t border-line pt-8"
              >
                <a
                  href={SITE.phoneTel}
                  className="-mx-2 flex items-center gap-3 px-2 py-3 font-mono text-base tracking-[0.14em] text-primary"
                >
                  <Phone className="size-5 text-accent" aria-hidden />
                  {SITE.phone}
                </a>
                <Link
                  href="/#quote"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center whitespace-nowrap bg-accent px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink"
                >
                  Request a Quote
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
