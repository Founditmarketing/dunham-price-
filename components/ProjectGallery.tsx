"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

import type { ProjectImage } from "@/lib/projects";

const EASE = [0.16, 1, 0.3, 1] as const;

interface ProjectGalleryProps {
  images: ProjectImage[];
}

const SPAN_CLASS: Record<NonNullable<ProjectImage["span"]>, string> = {
  full: "md:col-span-6",
  half: "md:col-span-3",
  third: "md:col-span-2",
};

const ASPECT_CLASS: Record<NonNullable<ProjectImage["span"]>, string> = {
  full: "aspect-[16/9]",
  half: "aspect-[5/4]",
  third: "aspect-[1/1]",
};

const SIZES: Record<NonNullable<ProjectImage["span"]>, string> = {
  full: "(min-width: 1280px) 1280px, 100vw",
  half: "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw",
  third: "(min-width: 1280px) 425px, (min-width: 768px) 33vw, 100vw",
};

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const prefersReducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const open = useCallback((i: number) => setOpenIndex(i), []);
  const close = useCallback(() => setOpenIndex(null), []);
  const navigate = useCallback(
    (delta: 1 | -1) => {
      setOpenIndex((cur) => {
        if (cur === null) return cur;
        return (cur + delta + images.length) % images.length;
      });
    },
    [images.length],
  );

  return (
    <section
      aria-labelledby="gallery-heading"
      className="relative bg-base py-16 sm:py-24 lg:py-36"
    >
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <div className="mb-12 grid gap-8 lg:mb-16 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5 text-accent">Project Gallery</p>
            <h2
              id="gallery-heading"
              className="display-section max-w-[18ch] text-primary"
            >
              Inside the build.
            </h2>
          </div>
          <p className="max-w-[44ch] font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted lg:col-span-4">
            {String(images.length).padStart(2, "0")} frames · click any image to
            open the lightbox
          </p>
        </div>

        {/* Asymmetric grid */}
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5 lg:gap-6">
          {images.map((img, i) => {
            const span = img.span ?? "half";
            return (
              <motion.li
                key={`${img.src}-${i}`}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: 24 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.85,
                  delay: prefersReducedMotion ? 0 : Math.min(i * 0.06, 0.42),
                  ease: EASE,
                }}
                className={`${SPAN_CLASS[span]}`}
                data-print-image
              >
                <button
                  type="button"
                  onClick={() => open(i)}
                  aria-label={`Open image: ${img.alt}`}
                  className={`group relative block w-full overflow-hidden bg-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base ${ASPECT_CLASS[span]}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={SIZES[span]}
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-base/85 via-base/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:opacity-0"
                  />
                  {/* Caption — always visible on mobile, on hover on desktop */}
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-base/90 to-transparent p-4 sm:p-5 md:bg-none md:from-transparent">
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-primary md:opacity-0 md:transition-opacity md:duration-500 md:group-hover:opacity-100">
                        {img.caption}
                      </span>
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-accent md:opacity-0 md:transition-opacity md:duration-500 md:group-hover:opacity-100">
                        {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                      </span>
                    </div>
                  )}
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <Lightbox
        images={images}
        openIndex={openIndex}
        onClose={close}
        onNavigate={navigate}
      />
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Lightbox                                                                   */
/* -------------------------------------------------------------------------- */

interface LightboxProps {
  images: ProjectImage[];
  openIndex: number | null;
  onClose: () => void;
  onNavigate: (delta: 1 | -1) => void;
}

const SWIPE_THRESHOLD_PX = 50;

function Lightbox({ images, openIndex, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const isOpen = openIndex !== null;
  const current = isOpen ? images[openIndex] : null;
  const touchStartX = useRef<number | null>(null);

  // Open / close the native <dialog>.
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (isOpen && !dlg.open) {
      dlg.showModal();
      // Lock body scroll behind the modal — `dialog` won't do this for us.
      document.body.style.overflow = "hidden";
    } else if (!isOpen && dlg.open) {
      dlg.close();
      document.body.style.overflow = "";
    }
    return () => {
      if (!isOpen) return;
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close events from the dialog (Escape, native close()).
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const handler = () => onClose();
    dlg.addEventListener("close", handler);
    return () => dlg.removeEventListener("close", handler);
  }, [onClose]);

  // Keyboard navigation.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onNavigate(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNavigate(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onNavigate]);

  // Touch swipe.
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    const end = e.changedTouches[0]?.clientX ?? null;
    touchStartX.current = null;
    if (start == null || end == null) return;
    const dx = end - start;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    onNavigate(dx > 0 ? -1 : 1);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Project gallery viewer"
      onClick={(e) => {
        // Close on backdrop click — `e.target === dialog` means the user
        // clicked outside the actual content area.
        if (e.target === dialogRef.current) onClose();
      }}
      className="m-0 size-full max-h-none max-w-none overflow-hidden bg-base/95 p-0 text-primary backdrop:bg-base/90 backdrop:backdrop-blur-md"
    >
      {current && openIndex !== null && (
        <div
          className="relative flex h-full w-full flex-col"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4 border-b border-line/60 px-5 py-4 sm:px-8">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-primary/80">
              {String(openIndex + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close gallery"
              autoFocus
              className="inline-flex size-10 items-center justify-center border border-line text-primary transition hover:border-accent hover:text-accent"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Image stage */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-8 lg:p-12">
            <div className="relative size-full">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                priority
                className="object-contain"
              />
            </div>

            {/* Prev / next */}
            <button
              type="button"
              onClick={() => onNavigate(-1)}
              aria-label="Previous image"
              className="group absolute left-3 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center border border-line bg-base/70 text-primary backdrop-blur-sm transition hover:border-accent hover:text-accent sm:left-6"
            >
              <ArrowLeft className="size-4 transition-transform duration-500 group-hover:-translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate(1)}
              aria-label="Next image"
              className="group absolute right-3 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center border border-line bg-base/70 text-primary backdrop-blur-sm transition hover:border-accent hover:text-accent sm:right-6"
            >
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Caption */}
          {current.caption && (
            <div className="border-t border-line/60 px-5 py-4 sm:px-8">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-primary/85">
                {current.caption}
              </p>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
