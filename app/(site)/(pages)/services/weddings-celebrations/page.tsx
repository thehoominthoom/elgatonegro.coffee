import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getServiceConfig } from "@/lib/inquiry/config";
import { SERVICE_LANDING_CONTENT } from "@/lib/services/landing-content";
import { SERVICE_FAQS } from "@/lib/services/faqs";
import { SIGNATURE_MOMENTS } from "@/lib/services/signature-moments";
import { SERVICE_TESTIMONIALS } from "@/lib/services/testimonials";
import { buildServiceGraph } from "@/lib/seo/service-graph";
import { InclusionsList } from "@/components/services/InclusionsList";
import { SignatureMoment } from "@/components/services/SignatureMoment";
import { ServicesFAQ } from "@/components/services/ServicesFAQ";
import { HowBookingWorks } from "@/components/services/HowBookingWorks";
import { ServiceTestimonial } from "@/components/services/ServiceTestimonial";
import { AlsoSee } from "@/components/services/AlsoSee";
import { FinalCTA } from "@/components/services/FinalCTA";
import { HeroBreadcrumb } from "@/components/services/HeroBreadcrumb";
import { JsonLd } from "@/components/services/JsonLd";

const SLUG = "weddings-celebrations" as const;

export const metadata: Metadata = {
  title: "Wedding Coffee Cart Nashville — Espresso Bar | El Gato Negro",
  description:
    "Ceremonies, receptions, rehearsal dinners. Nashville venues and reasonable drives beyond. Signature drinks named after you, service that fits the day. Request a quote.",
  alternates: { canonical: `/services/${SLUG}` },
  openGraph: {
    title: "Weddings & Celebrations — El Gato Negro",
    description: "We do the coffee. You do the day.",
    url: `/services/${SLUG}`,
    type: "website",
    images: [
      {
        url: "/og/services-weddings.png",
        width: 1200,
        height: 630,
        alt: "El Gato Negro espresso bar set up at a wedding reception",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Coffee Bar — El Gato Negro",
    description: "Signature drinks. Full setup. Nashville weddings.",
    images: ["/og/services-weddings.png"],
  },
};

export default function WeddingsCelebrationsPage() {
  const config = getServiceConfig(SLUG)!;
  const content = SERVICE_LANDING_CONTENT[SLUG];
  const faq = SERVICE_FAQS[SLUG];
  const signature = SIGNATURE_MOMENTS[SLUG]!;
  const testimonial = SERVICE_TESTIMONIALS[SLUG]!;

  const graph = buildServiceGraph({
    slug: SLUG,
    name: "Wedding Coffee Cart & Espresso Bar",
    serviceType: "Wedding Coffee Catering",
    description:
      "Wedding and celebration coffee catering across Nashville and nearby. Signature drink menus built with each couple, full setup and breakdown, service that stretches to fit the day.",
    breadcrumbName: "Weddings & Celebrations",
    faqs: faq.items,
  });

  return (
    <>
      <JsonLd data={graph} />

      {/* ── 1. Hero — full-viewport, warmer image ─────────────────── */}
      <section className="relative w-full min-h-[85svh] overflow-hidden -mt-44 md:-mt-36 bg-brand-black grain-overlay-dark">
        <Image
          src="/images/services/weddings-celebrations-hero.webp"
          alt="Close-up of an El Gato Negro espresso drink with wedding flowers, styled for a Nashville reception"
          fill
          priority
          sizes="100vw"
          className="object-cover photo-treatment"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/85 via-brand-black/40 to-brand-black/20" />

        <div className="absolute inset-0 z-10 flex flex-col justify-end max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20 pt-32 md:pt-36">
          <div className="mb-8 md:mb-12">
            <HeroBreadcrumb
              currentLabel="Weddings & Celebrations"
              variant="onImage"
            />
          </div>

          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-orange mb-4">
            {config.eyebrow}
          </p>
          <h1
            className="font-display font-bold uppercase text-brand-grey tracking-tight leading-[0.9]"
            style={{ fontSize: "var(--text-hero)" }}
          >
            Weddings
            <br />
            &amp;
            <br />
            Celebrations.
          </h1>
          <p className="font-display text-xl md:text-2xl text-brand-grey/70 mt-6">
            {config.tagline}
          </p>
          <p className="font-sans text-base md:text-lg leading-relaxed text-brand-grey/70 mt-6 max-w-2xl">
            {config.description}
          </p>
          <Link
            href={`/inquiry?service=${SLUG}`}
            className="group mt-10 inline-flex items-center gap-3 bg-brand-orange text-brand-grey font-display font-bold text-sm uppercase tracking-[0.1em] rounded-sm px-8 py-4 md:px-10 md:py-5 hover:bg-brand-yellow transition-colors"
          >
            Request a Quote
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* ── 2. Testimonial — center-column pull quote ──────────────── */}
      <section className="bg-brand-grey grain-overlay py-16 md:py-20">
        <ServiceTestimonial
          quote={testimonial.quote}
          attribution={testimonial.attribution}
        />
      </section>

      {/* ── 3. Signature Moment — LIGHT (unique to weddings) ───────── */}
      <section className="bg-brand-grey grain-overlay py-20 md:py-28">
        <SignatureMoment {...signature} />
      </section>

      {/* ── 4. Inclusions — light ──────────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-16 md:py-24">
        <InclusionsList
          eyebrow={content.inclusions.eyebrow}
          heading={content.inclusions.heading}
          items={config.features}
          surface="light"
        />
      </section>

      {/* ── 5. How Booking Works — DARK ───────────────────────────── */}
      <section className="bg-brand-black grain-overlay-dark py-16 md:py-24">
        <HowBookingWorks
          eyebrow={content.processEyebrow}
          heading={content.processHeading}
          steps={content.steps}
          surface="dark"
        />
      </section>

      {/* ── 6. FAQ — light ────────────────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-16 md:py-24">
        <ServicesFAQ
          eyebrow={faq.eyebrow}
          heading={faq.heading}
          items={faq.items}
          surface="light"
        />
      </section>

      {/* ── 7. Also See — cross-links ─────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-10 md:py-14 border-t border-dashed border-brand-black/15">
        <AlsoSee
          links={[
            {
              href: "/services/private-events",
              label: "smaller private events",
            },
            { href: "/about", label: "meet Juan and Phil" },
          ]}
        />
      </section>

      {/* ── 8. Final CTA — flat orange ─────────────────────────────── */}
      <FinalCTA
        eyebrow={content.cta.eyebrow}
        heading={content.cta.heading}
        body={content.cta.subtext}
        buttonLabel="Start your inquiry"
        buttonHref={`/inquiry?service=${SLUG}`}
      />
    </>
  );
}
