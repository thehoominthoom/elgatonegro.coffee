import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ALL_SERVICES } from "@/lib/inquiry/config";
import { SERVICES_INDEX_FAQ } from "@/lib/services/faqs";
import { ServicesFAQ } from "@/components/services/ServicesFAQ";
import { FinalCTA } from "@/components/services/FinalCTA";
import { JsonLd } from "@/components/services/JsonLd";
import { buildServicesIndexGraph } from "@/lib/seo/service-graph";

export const metadata: Metadata = {
  title: "Book the Cart — Nashville Coffee Cart Services | El Gato Negro",
  description:
    "Four ways we show up: brand activations, conventions, weddings, and private events. Nashville's mobile coffee cart. Get a quote in 24 hours.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Book the Cart — Nashville Coffee Cart Services",
    description: "Four ways we show up. Pick the one that sounds like your event.",
    url: "/services",
    type: "website",
    images: [
      {
        url: "/og/services-index.png",
        width: 1200,
        height: 630,
        alt: "El Gato Negro mobile coffee cart at a Nashville event",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book the Cart — El Gato Negro",
    description: "Nashville's mobile coffee cart. Four ways we show up.",
    images: ["/og/services-index.png"],
  },
};

const INDEX_FAQ_INLINE_LINKS = [
  { phrase: "twenty-person dinner parties", href: "/services/private-events" },
  {
    phrase: "three-day conventions",
    href: "/services/community-conventions",
  },
];

export default function ServicesIndexPage() {
  return (
    <>
      <JsonLd data={buildServicesIndexGraph(SERVICES_INDEX_FAQ.items)} />

      {/* ── Header ─────────────────────────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay">
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 pt-4 pb-10 md:pt-8 md:pb-16">
          <div className="border-b-2 border-brand-black pb-10 md:pb-16">
            <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-green mb-4">
              WHAT WE DO
            </p>
            <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-tight text-brand-black">
              Book the cart.
            </h1>
            <p className="font-sans text-lg md:text-xl leading-relaxed text-brand-black/70 max-w-xl mt-6">
              Four ways we show up around Nashville. Pick the one that sounds
              like your event.
            </p>
          </div>
        </div>
      </section>

      {/* ── Service Rows — stacked editorial ────────────────────── */}
      <section className="bg-brand-grey grain-overlay">
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
          {ALL_SERVICES.map((service, i) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className={`group relative block overflow-hidden py-10 md:py-14 border-b border-dashed border-brand-black/15 hover:pl-4 transition-[padding] duration-300 ${
                i === 0 ? "border-t border-dashed border-brand-black/15" : ""
              }`}
            >
              {/* Faded index number */}
              <span
                aria-hidden="true"
                className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6 font-display font-bold text-[15vw] md:text-[10vw] lg:text-[8vw] leading-none text-brand-black/[0.05] group-hover:text-brand-black/[0.08] transition-colors select-none pointer-events-none tabular-nums text-left"
                style={{ width: "2ch" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative z-10 max-w-3xl">
                <p className="font-display font-bold text-xs md:text-sm uppercase tracking-[0.25em] text-brand-green mb-3">
                  {service.eyebrow}
                </p>
                <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl uppercase tracking-tight leading-[0.95] text-brand-black">
                  {service.label}
                </h2>
                <p className="font-sans text-base md:text-lg leading-relaxed text-brand-black/70 mt-4 max-w-2xl">
                  {service.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-display font-bold text-xs md:text-sm uppercase tracking-[0.2em] text-brand-orange group-hover:text-brand-yellow transition-colors">
                  Get a quote
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-16 md:py-24">
        <ServicesFAQ
          eyebrow={SERVICES_INDEX_FAQ.eyebrow}
          heading={SERVICES_INDEX_FAQ.heading}
          items={SERVICES_INDEX_FAQ.items}
          surface="light"
          inlineLinks={INDEX_FAQ_INLINE_LINKS}
        />
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────── */}
      <FinalCTA
        eyebrow="NOT SURE WHICH FITS?"
        heading="Tell us about it. We'll figure it out."
        buttonLabel="Start your inquiry"
        buttonHref="/inquiry"
      />
    </>
  );
}
