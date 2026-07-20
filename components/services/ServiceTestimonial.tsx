/**
 * ServiceTestimonial — center-column pull quote on light surface.
 * Plain content only, no `Review` schema (per Phil 2026-07-20 — deferred
 * until Google Reviews integration lands).
 */

interface ServiceTestimonialProps {
  quote: string;
  attribution: string;
}

export function ServiceTestimonial({
  quote,
  attribution,
}: ServiceTestimonialProps) {
  return (
    <div className="relative z-10 mx-auto max-w-3xl px-4 md:px-6 text-center">
      <p className="font-display text-2xl md:text-3xl text-brand-black tracking-tight leading-snug">
        &ldquo;{quote}&rdquo;
      </p>
      <p className="font-sans text-sm text-brand-black/50 mt-6">
        &mdash; {attribution}
      </p>
    </div>
  );
}
