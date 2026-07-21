import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * InlineCTA — quiet, editorial mid-page conversion moment.
 *
 * Not a card, not a button — a magazine-caption style eyebrow + link that
 * fits between content sections without breaking the editorial rhythm.
 *
 * Spec: copy/visual-qa-2026-07-20-spec.md Fix #6a.
 */

interface InlineCTAProps {
  eyebrow: string;
  linkText: string;
  href: string;
  surface: "light" | "dark";
}

export function InlineCTA({ eyebrow, linkText, href, surface }: InlineCTAProps) {
  const isDark = surface === "dark";
  const sectionBg = isDark
    ? "bg-brand-black grain-overlay-dark"
    : "bg-brand-grey grain-overlay";
  const dividerBorder = isDark
    ? "border-brand-grey/10"
    : "border-brand-black/15";
  const eyebrowColor = isDark ? "text-brand-orange" : "text-brand-green";
  const linkColor = isDark ? "text-brand-grey" : "text-brand-black";

  return (
    <section className={`${sectionBg} py-10 md:py-14`}>
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <div className={`border-t border-dashed ${dividerBorder} pt-8 md:pt-10`}>
          <p
            className={`font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] mb-3 ${eyebrowColor}`}
          >
            {eyebrow}
          </p>
          <Link
            href={href}
            className={`group inline-flex items-center gap-3 font-display font-bold text-2xl md:text-3xl uppercase tracking-tight hover:text-brand-orange transition-colors ${linkColor}`}
          >
            {linkText}
            <ArrowRight
              size={20}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
