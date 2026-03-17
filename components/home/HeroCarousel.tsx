"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const paused = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    [slides.length]
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
    [slides.length]
  );

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      if (!paused.current) next();
    }, 6500);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  // Progress bar — reset on slide change
  useEffect(() => {
    // Defer state updates to avoid synchronous setState inside effect body
    const raf = requestAnimationFrame(() => {
      setIsAnimating(false);
      setProgress(0);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [current]);

  // Progress bar — increment
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      if (!paused.current) {
        setProgress((p) => {
          if (p >= 100) return 100;
          return p + 100 / (6500 / 50);
        });
      }
    }, 50);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleMouseEnter = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    paused.current = true;
    setIsAnimating(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    paused.current = false;
    setIsAnimating(true);
  }, []);

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section
      className="relative min-h-[100svh] bg-brand-black overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background images — crossfade */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          aria-hidden
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={s.image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/50 to-transparent" />
      <div className="absolute inset-0 grain-overlay opacity-30" />

      {/* Content */}
      <div className="relative z-10 h-full min-h-[100svh] flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
          {/* Event type tag */}
          <p className="font-sans font-extrabold text-sm uppercase tracking-[0.35em] text-brand-orange mb-4">
            {slide.type === "ticketed" ? "Ticketed Event" : slide.type === "private" ? "Private Event" : slide.type === "fundraiser" ? "Fundraiser" : slide.type === "sale" ? "Sale" : slide.type === "new-swag" ? "New Swag" : "We're Serving"}
          </p>

          {/* Happening Now badge */}
          {slide.isHappeningNow && (
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse" />
              <span className="font-sans font-semibold text-sm uppercase tracking-[0.3em] text-brand-yellow">
                Happening Now
              </span>
            </div>
          )}

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

          {/* Date + time + location */}
          <div className="flex flex-col gap-1 mb-8">
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

          <Link
            href={slide.href}
            className="group inline-flex items-center gap-2 font-sans font-extrabold text-sm uppercase tracking-[0.2em] text-brand-grey border-b border-brand-grey/30 hover:border-brand-grey pb-1 transition-colors"
          >
            View Event
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* Centered dot + arrow control strip */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 z-10">
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="flex items-center justify-center"
          >
            <ArrowLeft size={13} className="text-brand-grey/70 hover:text-brand-grey transition-colors" />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={[
                  "w-2 h-2 rounded-full transition-colors duration-300",
                  i === current ? "bg-brand-orange" : "bg-brand-grey/30",
                ].join(" ")}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next slide"
            className="flex items-center justify-center"
          >
            <ArrowRight size={13} className="text-brand-grey/70 hover:text-brand-grey transition-colors" />
          </button>
        </div>
      )}

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-grey/10 z-10">
        <div
          className="h-full bg-brand-orange"
          style={{
            width: `${progress}%`,
            transition: isAnimating ? "width 50ms linear" : "none",
          }}
        />
      </div>
    </section>
  );
}
