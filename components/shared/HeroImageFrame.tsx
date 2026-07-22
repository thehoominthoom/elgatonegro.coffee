import Image from "next/image";

/**
 * HeroImageFrame — shared full-viewport hero primitive.
 *
 * Extracted from `HeroCarousel` (homepage) so services subpages, /about, and
 * /media can share the exact same "double-gradient scrim" legibility pattern:
 *
 *   • vertical scrim  — from-brand-black via /50 to transparent (bottom fade)
 *   • horizontal scrim — from-brand-black/50 to transparent      (left fade)
 *
 * Both gradients required — the horizontal one is what keeps the H1 legible
 * on wide monitors where the image can otherwise show through at full
 * strength behind the type.
 *
 * Content overlay is passed via `children`. Pages provide their own content
 * wrapper (typically `absolute inset-0 z-10 flex flex-col justify-end …` for
 * full-viewport heroes or `relative z-10 …` for shorter content-driven heroes).
 *
 * The `data-sticky-cta="hero"` attribute is consumed by `StickyMobileCTA` to
 * decide when to fade in. Harmless when no sticky CTA is mounted.
 *
 * Spec: `copy/visual-qa-2026-07-20-spec.md` Fix #1.
 */

interface HeroImageFrameProps {
  src: string;
  alt: string;
  /** `85svh` — services landing pages. `100svh` — homepage / about. Omit for content-driven height (e.g. /media). */
  minHeight?: "85svh" | "100svh";
  /** Adds `-mt-44 md:-mt-36` so the hero bleeds under the fixed header. */
  bleedTop?: boolean;
  /** CSS `object-position` value for the hero image. Defaults to `center`. Use to shift the crop (e.g. `center 75%` to expose more of the lower portion). */
  objectPosition?: string;
  children: React.ReactNode;
}

export function HeroImageFrame({
  src,
  alt,
  minHeight,
  bleedTop = false,
  objectPosition,
  children,
}: HeroImageFrameProps) {
  const heightClass =
    minHeight === "100svh"
      ? "min-h-[100svh]"
      : minHeight === "85svh"
        ? "min-h-[85svh]"
        : "";
  const bleedClass = bleedTop ? "-mt-44 md:-mt-36" : "";

  return (
    <section
      data-sticky-cta="hero"
      className={`relative w-full overflow-hidden bg-brand-black grain-overlay-dark ${heightClass} ${bleedClass}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover photo-treatment"
        style={{ objectPosition: objectPosition ?? "center" }}
      />
      {/* Double-gradient scrim — vertical + horizontal. Both required. */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-brand-black/50 to-transparent" />
      {children}
    </section>
  );
}
