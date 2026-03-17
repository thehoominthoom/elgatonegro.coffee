"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroSlide {
  id: string;
  title: string;
  date: string;
  location: string;
  type: "hosting" | "attending";
  isHappeningNow: boolean;
  image: string;
  href: string;
}

// ─── Static placeholder data (replace with Sanity `Event` query) ──────────────

const slides: HeroSlide[] = [
  {
    id: "1",
    title: "Spring Markets\nNashville",
    date: "March 22–24",
    location: "The Fairgrounds",
    type: "hosting",
    isHappeningNow: false,
    image: "https://placehold.co/1440x900/2A201D/B43620",
    href: "/events/spring-markets",
  },
  {
    id: "2",
    title: "Bar Hop\nDowntown",
    date: "April 5",
    location: "Broadway District",
    type: "hosting",
    isHappeningNow: true,
    image: "https://placehold.co/1440x900/B43620/FAF5F4",
    href: "/events/bar-hop",
  },
  {
    id: "3",
    title: "Nashville SC\nKickoff Party",
    date: "April 12",
    location: "GEODIS Park",
    type: "attending",
    isHappeningNow: false,
    image: "https://placehold.co/1440x900/3D3426/FAF5F4",
    href: "/events/nashville-sc",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    []
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative min-h-[90vh] bg-brand-black overflow-hidden">
      {/* Background images — crossfade */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          aria-hidden
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: i === current ? 1 : 0,
            backgroundImage: `url("${s.image}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/50 to-transparent" />
      <div className="absolute inset-0 grain-overlay opacity-30" />

      {/* Happening Now badge */}
      {slide.isHappeningNow && (
        <div className="absolute top-6 left-6 md:left-12 z-20 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
          <span className="font-display text-[10px] uppercase tracking-[0.3em] text-brand-orange">
            Happening Now
          </span>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full min-h-[90vh] flex flex-col justify-end pb-14 md:pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl">
          {/* Event type tag */}
          <p className="font-display text-[10px] uppercase tracking-[0.35em] text-brand-orange/80 mb-4">
            {slide.type === "hosting" ? "We're Serving" : "Attending"}
          </p>

          {/* Title */}
          <h1
            className="font-display font-bold text-brand-grey leading-none uppercase tracking-tight mb-6"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
          >
            {slide.title.split("\n").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Date + location */}
          <div className="flex items-center gap-4 mb-8">
            <span className="font-display text-sm uppercase tracking-[0.15em] text-brand-grey/60">
              {slide.date}
            </span>
            <span className="text-brand-grey/20">·</span>
            <span className="font-display text-sm uppercase tracking-[0.15em] text-brand-grey/60">
              {slide.location}
            </span>
          </div>

          <Link
            href={slide.href}
            className="group inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.2em] text-brand-grey border-b border-brand-grey/30 hover:border-brand-grey pb-1 transition-colors"
          >
            View Event
            <ArrowRight
              size={12}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Slide controls */}
        <div className="absolute right-6 md:right-12 bottom-14 md:bottom-20 flex items-center gap-3">
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="w-9 h-9 border border-brand-grey/20 flex items-center justify-center hover:border-brand-grey/60 transition-colors"
          >
            <ArrowLeft size={13} className="text-brand-grey" />
          </button>
          <span className="font-display text-[11px] text-brand-grey/40 tabular-nums w-10 text-center">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
          <button
            onClick={next}
            aria-label="Next slide"
            className="w-9 h-9 border border-brand-grey/20 flex items-center justify-center hover:border-brand-grey/60 transition-colors"
          >
            <ArrowRight size={13} className="text-brand-grey" />
          </button>
        </div>
      </div>
    </section>
  );
}
