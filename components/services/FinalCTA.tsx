import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * FinalCTA — flat brand-orange band, About §6 pattern verbatim.
 * No border, no gradient, no inset card. This block is a full section
 * (includes its own `<section>`) because it's identical across all 5 pages.
 */

interface FinalCTAProps {
  eyebrow: string;
  heading: string;
  body?: string;
  buttonLabel: string;
  buttonHref: string;
}

export function FinalCTA({
  eyebrow,
  heading,
  body,
  buttonLabel,
  buttonHref,
}: FinalCTAProps) {
  return (
    <section data-sticky-cta="final" className="bg-brand-orange grain-overlay">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28 lg:py-32">
        <p className="font-sans font-extrabold text-[10px] md:text-xs uppercase tracking-[0.2em] text-brand-black/60 mb-4 md:mb-6">
          {eyebrow}
        </p>
        <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl uppercase text-brand-black tracking-tight leading-[0.95] max-w-3xl">
          {heading}
        </h2>
        {body ? (
          <p className="font-sans text-base md:text-lg leading-relaxed text-brand-black/75 max-w-2xl mt-6">
            {body}
          </p>
        ) : null}
        <Link
          href={buttonHref}
          className="group inline-flex items-center gap-3 bg-brand-black text-brand-grey font-display font-bold uppercase tracking-[0.1em] text-sm px-8 py-4 md:px-10 md:py-5 rounded-sm hover:bg-brand-orange transition-colors duration-300 mt-10 md:mt-12"
        >
          {buttonLabel}
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}
