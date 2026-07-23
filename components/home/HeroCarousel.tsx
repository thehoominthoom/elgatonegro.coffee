"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeroSlide {
  id: string;
  title: string;
  dateRange: string;
  timeContext: string | null;
  location: string;
  type: "open" | "ticketed" | "private" | "fundraiser" | "sale" | "new-swag";
  isHappeningNow: boolean;
  recurrenceLabel: string | null;
  note: string | null;
  image: string;
  href: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

// ─── Animation helpers ─────────────────────────────────────────────────────────

// Delays for text-out (top to bottom, 0-based from transition start)
const OUT_DELAYS = {
  typeTag:      0,
  happeningNow: 30,
  title:        60,
  dateMeta:     100,
  viewEvent:    140,
};

// Delays for text-in (top to bottom, relative to transition start)
const IN_DELAYS = {
  typeTag:      650,
  happeningNow: 700,
  title:        750,
  dateMeta:     820,
  viewEvent:    890,
};

function textAnim(transitioning: boolean, delayKey: keyof typeof OUT_DELAYS, mounted: boolean): React.CSSProperties {
  if (!mounted) return {}; // first render — show text immediately, no animation
  if (transitioning) {
    return {
      animation: `text-out-left 250ms ease-in forwards ${OUT_DELAYS[delayKey]}ms`,
    };
  }
  return {
    animation: `text-in-left 300ms ease-out both ${IN_DELAYS[delayKey]}ms`,
  };
}

const HERO_BUTTON_TEXT: Record<HeroSlide["type"], string> = {
  open: "View Details",
  ticketed: "Get Tickets",
  private: "View Details",
  fundraiser: "Donate",
  sale: "Shop Now",
  "new-swag": "Shop Now",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [current, setCurrent]       = useState(0);
  const [prev, setPrev]             = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [mounted, setMounted]       = useState(false);
  // pillKey forces pill animation to restart when the same slide is navigated to again
  const [pillKey, setPillKey]       = useState(0);

  useEffect(() => { Promise.resolve().then(() => setMounted(true)); }, []);

  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (index === current) return;

      // Cancel any in-flight transition
      if (transitionRef.current) clearTimeout(transitionRef.current);

      // Phase 1 — text out
      setTransitioning(true);
      setPrev(current);
      setPillKey((k) => k + 1);

      // Phase 2 — image crossfade + text in begin (after text-out completes at ~400ms)
      transitionRef.current = setTimeout(() => {
        setCurrent(index);
        setTransitioning(false);

        // Phase 3 — clean up prev after text-in + crossfade settle (~700ms)
        transitionRef.current = setTimeout(() => {
          setPrev(null);
        }, 700);
      }, 400);
    },
    [current]
  );

  const next = useCallback(
    () => goTo((current + 1) % slides.length),
    [current, slides.length, goTo]
  );

  const previous = useCallback(
    () => goTo((current - 1 + slides.length) % slides.length),
    [current, slides.length, goTo]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null || transitionRef.current) return;
      const delta = touchStartX.current - e.changedTouches[0].clientX;
      touchStartX.current = null;
      if (Math.abs(delta) < 50) return;
      if (delta > 0) next();
      else previous();
    },
    [next, previous]
  );

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  // Clean up transition timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, []);

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section
      className="relative min-h-[100svh] bg-brand-black overflow-hidden grain-overlay-dark"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background images — 3-phase crossfade */}
      {slides.map((s, i) => {
        const isCurrent  = i === current;
        const isOutgoing = i === prev;

        let opacity: number;
        let zIndex: number;
        let transition: string;

        if (isCurrent) {
          // Incoming: fades in on top after a short delay (0.3s into transition)
          opacity    = 1;
          zIndex     = 1;
          transition = "opacity 0.4s ease-in-out 0.3s";
        } else if (isOutgoing) {
          // Outgoing: stays fully visible underneath — no transition, stays put
          opacity    = 1;
          zIndex     = 0;
          transition = "none";
        } else {
          // Inactive: hidden behind everything
          opacity    = 0;
          zIndex     = -10;
          transition = "none";
        }

        return (
          <div
            key={s.id}
            aria-hidden
            className="absolute inset-0 [transform-origin:center_right]"
            style={{ opacity, zIndex, transition }}
          >
            <Image
              src={s.image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center photo-treatment"
              priority={i === 0}
              loading={i === 0 ? undefined : "lazy"}
            />
          </div>
        );
      })}

      {/* Overlays — z-[2] sits above images (max z:1) and below content (z-10) */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-brand-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full min-h-[100svh] flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto w-full">
        {/* Content block — per-element staggered animation, no key remount */}
        <div className="w-full">

          {/* Happening Now badge */}
          {slide.isHappeningNow && (
            <span
              className="bg-brand-yellow text-brand-grey px-3 py-1 rounded-sm font-accent text-sm md:text-base -rotate-2 inline-block mb-3"
              style={textAnim(transitioning, "happeningNow", mounted)}
            >
              Happening Now
            </span>
          )}

          {/* Event type tag */}
          <p
            className="font-accent text-base md:text-lg uppercase tracking-[0.1em] text-brand-orange mb-3"
            style={textAnim(transitioning, "typeTag", mounted)}
          >
            {slide.type === "ticketed"
              ? "Ticketed Event"
              : slide.type === "private"
                ? "Private Event"
                : slide.type === "fundraiser"
                  ? "Fundraiser"
                  : slide.type === "sale"
                    ? "Sale"
                    : slide.type === "new-swag"
                      ? "New Swag"
                      : "We're Serving"}
          </p>

          {/* Title */}
          <h1
            className="font-display font-bold text-brand-grey leading-none uppercase tracking-[-0.03em] mb-6"
            style={{
              fontSize: "var(--text-hero)",
              ...textAnim(transitioning, "title", mounted),
            }}
          >
            {slide.title.split("\n").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Date + time + location */}
          <div
            className="flex flex-col gap-1 mb-8 pl-3 border-l-2 border-brand-orange/40"
            style={textAnim(transitioning, "dateMeta", mounted)}
          >
            <span className="font-sans font-extrabold text-base md:text-lg uppercase tracking-[0.15em] text-brand-grey/80">
              {slide.recurrenceLabel
                ? `${slide.recurrenceLabel} · ${slide.dateRange}`
                : slide.dateRange}
            </span>
            {slide.timeContext && (
              <span className="font-sans font-semibold text-sm text-brand-grey/70 tracking-[0.05em] uppercase">
                {slide.timeContext}
              </span>
            )}
            {slide.location && (
              <span className="font-sans font-semibold text-sm text-brand-grey/60 uppercase tracking-[0.1em]">
                {slide.location}
              </span>
            )}
            {slide.note && (
              <span className="font-sans text-sm text-brand-grey/50 italic">
                {slide.note}
              </span>
            )}
          </div>

          {/* View Event */}
          <Link
            href={slide.href}
            className="group inline-flex items-center gap-3 bg-brand-orange text-brand-grey px-8 py-3.5 rounded-sm font-display font-bold text-sm uppercase tracking-[0.1em] hover:bg-brand-yellow transition-colors"
            style={textAnim(transitioning, "viewEvent", mounted)}
          >
            {HERO_BUTTON_TEXT[slide.type] || "View Details"}
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          {/* Segmented pill indicators */}
          {slides.length > 1 && (
            <div className="flex items-center gap-[2px] mt-2">
              {slides.map((_, i) => {
                const isActive = i === current;
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className="min-h-[32px] min-w-[32px] flex items-center justify-center"
                  >
                    <span
                      className={[
                        "block overflow-hidden transition-[width,background-color] duration-500 [transition-timing-function:cubic-bezier(0.35,0.15,0.02,0.99)]",
                        isActive
                          ? "w-8 h-2 rounded-full bg-brand-grey/30"
                          : "w-2 h-2 rounded-full bg-brand-grey/20",
                      ].join(" ")}
                    >
                      <span
                        key={isActive ? pillKey : i}
                        className={[
                          "block h-full w-full bg-brand-orange [transform-origin:left]",
                          isActive
                            ? "[animation:pill-fill_6s_linear_0.46s_forwards]"
                            : "",
                        ].join(" ")}
                        style={isActive ? undefined : { transform: "scaleX(0)" }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </section>
  );
}
