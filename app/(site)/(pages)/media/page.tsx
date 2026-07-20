import type { Metadata } from "next";
import Image from "next/image";
// FileText import will be needed again when the Brand Guideline PDF CTA section below is uncommented.
import { Download } from "lucide-react";

// ── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Media Resources — El Gato Negro",
  description:
    "Download El Gato Negro brand assets — logos, color palette, and brand guidelines for partners and press.",
  openGraph: {
    images: [{ url: '/images/media/the_exchange-cart-setup-none-02.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/media/the_exchange-cart-setup-none-02.webp'],
  },
};

// ── Logo variants ────────────────────────────────────────────────────────────

const LOGO_VARIANTS = [
  {
    base: "egn-logo-hellCat_text-color",
    label: "Primary Logo (Color)",
  },
  {
    base: "egn-logo-hellCat_text-bw",
    label: "Primary Logo (Black & White)",
  },
  {
    base: "egn-logo-hellCat-color",
    label: "Hellcat Mark (Color)",
  },
  {
    base: "egn-logo-hellCat-bw",
    label: "Hellcat Mark (Black & White)",
  },
  {
    base: "eng-wordmark-redish",
    label: "Wordmark (Stacked)",
  },
  {
    base: "eng-wordmark_hori-redish",
    label: "Wordmark (Horizontal)",
  },
];

const DOWNLOAD_FORMATS = [
  { ext: "svg", file: (base: string) => `${base}.svg` },
  { ext: "png", file: (base: string) => `${base}1200w.png` },
  { ext: "webp", file: (base: string) => `${base}1200w.webp` },
] as const;

// ── Brand colors ─────────────────────────────────────────────────────────────

const BRAND_COLORS = [
  { name: "Brand Orange", hex: "#B43620", token: "brand-orange", usage: "Primary CTAs, active states, prices" },
  { name: "Brand Yellow", hex: "#D09324", token: "brand-yellow", usage: "Hover states, highlights, sale badges" },
  { name: "Brand Black", hex: "#2A201D", token: "brand-black", usage: "Text, card borders, backgrounds" },
  { name: "Brand Grey", hex: "#FAF5F4", token: "brand-grey", usage: "Page background, card fill, button text" },
  { name: "Brand Green", hex: "#7B6838", token: "brand-green", usage: "Secondary accents, captions" },
  { name: "Brand Teal", hex: "#4A9B8A", token: "brand-teal", usage: "Accent highlights" },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MediaPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden -mt-44 md:-mt-36">
        {/* Background image */}
        <Image
          src="/images/media/the_exchange-cart-setup-none-02.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center photo-treatment"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/85 via-brand-black/50 to-brand-black/40" />

        {/* Grain overlay */}
        <div className="absolute inset-0 grain-overlay-dark pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-52 md:pt-40 pb-16 md:pb-20">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-orange mb-4">
            Brand Resources
          </p>
          <h1 className="font-display font-bold text-4xl md:text-6xl uppercase text-brand-grey tracking-tight">
            Media Kit
          </h1>
          <p className="font-sans text-sm text-brand-grey/60 max-w-lg mt-4 leading-relaxed">
            Logos, colors, and brand guidelines for partners, press, and collaborators.
            Download what you need.
          </p>
        </div>
      </section>

      {/* ── Logo Downloads ────────────────────────────────────────── */}
      <section className="bg-brand-black grain-overlay-dark">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <p className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-grey/30 mb-8">
            Logo Variants
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LOGO_VARIANTS.map((variant) => (
              <div
                key={variant.base}
                className="border border-brand-grey/10 bg-brand-grey/5"
              >
                {/* Preview container — 1:1 with neutral bg for logo visibility */}
                <div className="relative aspect-square bg-brand-grey/[0.08] flex items-center justify-center p-10">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static brand assets */}
                  <img
                    src={`/media-kit/${variant.base}.svg`}
                    alt={variant.label}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Info + download buttons */}
                <div className="px-4 py-4 border-t border-brand-grey/10">
                  <p className="font-display font-bold text-sm uppercase tracking-wide text-brand-grey mb-3">
                    {variant.label}
                  </p>
                  <div className="flex items-center gap-2">
                    {DOWNLOAD_FORMATS.map((fmt) => (
                      <a
                        key={fmt.ext}
                        href={`/media-kit/${fmt.file(variant.base)}`}
                        download
                        className="inline-flex items-center gap-1.5 rounded-sm border border-brand-grey/15 px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.15em] text-brand-grey/60 transition-colors hover:border-brand-orange hover:text-brand-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange active:scale-[0.98]"
                      >
                        <Download className="size-3" />
                        {fmt.ext.toUpperCase()}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Colors ──────────────────────────────────────────── */}
      <section className="bg-brand-black border-t border-brand-grey/10">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <p className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-grey/30 mb-8">
            Color Palette
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {BRAND_COLORS.map((color) => (
              <div key={color.token} className="border border-brand-grey/10 flex flex-col">
                {/* Color swatch */}
                <div
                  className="aspect-square"
                  style={{ backgroundColor: color.hex }}
                />
                {/* Info */}
                <div className="px-3 py-3 bg-brand-grey/5 flex-1">
                  <p className="font-display font-bold text-xs uppercase tracking-wide text-brand-grey">
                    {color.name}
                  </p>
                  <p className="font-mono text-[11px] text-brand-grey/50 mt-0.5">
                    {color.hex}
                  </p>
                  <p className="font-sans text-[10px] text-brand-grey/30 mt-1 leading-snug">
                    {color.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Usage Guidelines ──────────────────────────────────────── */}
      <section className="bg-brand-black border-t border-brand-grey/10 grain-overlay-dark">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <p className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-grey/30 mb-8">
            Usage Guidelines
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Do */}
            <div>
              <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-green mb-4">
                Do
              </h3>
              <ul className="space-y-3">
                {[
                  "Use the logo on a solid background with enough contrast",
                  "Maintain the original aspect ratio when resizing",
                  "Use the provided color variants on light or dark backgrounds",
                  "Leave adequate clear space around the logo",
                  "Use SVG format for web, PNG/WebP for print and social",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 font-sans text-sm leading-relaxed text-brand-grey/60"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-green" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Don't */}
            <div>
              <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-orange mb-4">
                Don&apos;t
              </h3>
              <ul className="space-y-3">
                {[
                  "Distort, stretch, or skew the logo",
                  "Change the logo colors outside of provided variants",
                  "Place the logo on busy or low-contrast backgrounds",
                  "Add effects like drop shadows, outlines, or glows",
                  "Recreate or modify the logo mark or wordmark",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 font-sans text-sm leading-relaxed text-brand-grey/60"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand Guideline PDF CTA — HIDDEN until Phil delivers the actual PDF. Markup preserved intentionally; re-enable by uncommenting. ─────────────
      <section className="bg-brand-black border-t border-brand-grey/10">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center border border-brand-grey/15 mb-6">
            <FileText className="size-6 text-brand-orange" />
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-tight text-brand-grey mb-3">
            Full Brand Guidelines
          </h2>
          <p className="font-sans text-sm text-brand-grey/50 max-w-md mb-8 leading-relaxed">
            Need the complete picture? Download our brand guideline PDF with
            detailed usage rules, typography, spacing, and tone of voice.
          </p>
          <a
            href="/media-kit/egn-brand-guideline.pdf"
            download
            className="inline-flex items-center gap-3 rounded-sm bg-brand-orange px-8 py-4 font-display font-bold text-sm uppercase tracking-[0.1em] text-brand-grey transition-colors duration-200 hover:bg-brand-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange active:scale-[0.98]"
          >
            <Download className="size-4" />
            Download PDF
          </a>
        </div>
      </section>
      */}
    </>
  );
}
