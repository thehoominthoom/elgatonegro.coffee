"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * StickyMobileCTA — persistent bottom-anchored CTA visible after the reader
 * scrolls past the hero, and hidden again when the final CTA enters view.
 *
 * Requires two markers on the page:
 *   • `data-sticky-cta="hero"`  — on the hero section
 *   • `data-sticky-cta="final"` — on the final CTA section (auto-added by FinalCTA)
 *
 * Mobile-only (`md:hidden`). No-op on desktop.
 *
 * Spec: copy/visual-qa-2026-07-20-spec.md Fix #6b.
 */

interface StickyMobileCTAProps {
  href: string;
  label?: string;
}

export function StickyMobileCTA({
  href,
  label = "Start your inquiry",
}: StickyMobileCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('[data-sticky-cta="hero"]');
    const final = document.querySelector<HTMLElement>('[data-sticky-cta="final"]');

    // No markers on the page — bail. Sticky CTA never shows.
    if (!hero && !final) return;

    // Track visibility of each marker independently, then derive `visible`.
    let heroInView = true;
    let finalInView = false;

    const update = () => setVisible(!heroInView && !finalInView);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const marker = entry.target.getAttribute("data-sticky-cta");
          if (marker === "hero") heroInView = entry.isIntersecting;
          if (marker === "final") finalInView = entry.isIntersecting;
        }
        update();
      },
      { threshold: 0 }
    );

    if (hero) observer.observe(hero);
    if (final) observer.observe(final);

    return () => observer.disconnect();
  }, []);

  return (
    <Link
      href={href}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-3 min-h-[52px] px-5 py-3 bg-brand-black border-t border-brand-orange/40 font-display font-bold text-sm uppercase tracking-[0.1em] text-brand-grey md:hidden transition-opacity duration-300 ${
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <span>{label}</span>
      <ArrowRight size={16} />
    </Link>
  );
}
