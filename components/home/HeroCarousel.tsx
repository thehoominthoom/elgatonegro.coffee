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
      animation: `text-out-right 250ms ease-in forwards ${OUT_DELAYS[delayKey]}ms`,
    };
  }
  return {
    animation: `text-in-right 300ms ease-out both ${IN_DELAYS[delayKey]}ms`,
  };
}

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

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 6500);
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
    <section className="relative min-h-[100svh] bg-brand-black overflow-hidden">
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
              className={[
                "object-cover object-center",
                isCurrent
                  ? "[animation:ken-burns_6.5s_cubic-bezier(0.01,0.04,0.05,0.95)_forwards]"
                  : "",
              ].join(" ")}
              priority={i === 0}
            />
          </div>
        );
      })}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/50 to-transparent" />
      <div className="absolute inset-0 grain-overlay opacity-30" />

      {/* Content */}
      <div className="relative z-10 h-full min-h-[100svh] flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Content block — per-element staggered animation, no key remount */}
        <div className="w-full [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">

          {/* Event type tag */}
          <p
            className="font-sans font-extrabold text-sm uppercase tracking-[0.35em] text-brand-orange mb-4"
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

          {/* Happening Now badge */}
          {slide.isHappeningNow && (
            <div
              className="flex items-center gap-2 mb-4"
              style={textAnim(transitioning, "happeningNow", mounted)}
            >
              <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse" />
              <span className="font-sans font-semibold text-sm uppercase tracking-[0.3em] text-brand-yellow">
                Happening Now
              </span>
            </div>
          )}

          {/* Title */}
          <h1
            className="font-display font-bold text-brand-grey leading-none uppercase tracking-tight mb-6"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 6rem)",
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
            className="flex flex-col gap-1 mb-8"
            style={textAnim(transitioning, "dateMeta", mounted)}
          >
            <span className="font-sans font-extrabold text-base uppercase tracking-[0.15em] text-brand-grey/80">
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
          </div>

          {/* View Event */}
          <Link
            href={slide.href}
            className="group inline-flex items-center gap-2 font-sans font-extrabold text-sm uppercase tracking-[0.2em] text-brand-grey border-b border-brand-grey/30 hover:border-brand-grey pb-1 transition-colors"
            style={textAnim(transitioning, "viewEvent", mounted)}
          >
            View Event
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          {/* Segmented pill indicators — outside stagger, update instantly */}
          {slides.length > 1 && (
            <div className="flex items-center gap-[3px] mt-4">
              {slides.map((_, i) => {
                const isActive = i === current;
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={[
                      "overflow-hidden transition-all duration-500 [transition-timing-function:cubic-bezier(0.35,0.15,0.02,0.99)]",
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
                          ? "[animation:pill-fill_6.5s_linear_0.46s_forwards]"
                          : "",
                      ].join(" ")}
                      style={isActive ? undefined : { transform: "scaleX(0)" }}
                    />
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
