import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getServiceConfig } from "@/lib/inquiry/config";
import { SERVICE_LANDING_CONTENT } from "@/lib/services/landing-content";
import { SERVICE_FAQS } from "@/lib/services/faqs";
import { SERVICE_TESTIMONIALS } from "@/lib/services/testimonials";
import { buildServiceGraph } from "@/lib/seo/service-graph";
import { InclusionsList } from "@/components/services/InclusionsList";
import { ServicesFAQ } from "@/components/services/ServicesFAQ";
import { HowBookingWorks } from "@/components/services/HowBookingWorks";
import { ServiceTestimonial } from "@/components/services/ServiceTestimonial";
import { AlsoSee } from "@/components/services/AlsoSee";
import { FinalCTA } from "@/components/services/FinalCTA";
import { HeroBreadcrumb } from "@/components/services/HeroBreadcrumb";
import { JsonLd } from "@/components/services/JsonLd";

const SLUG = "private-events" as const;

export const metadata: Metadata = {
  title: "Private Event Coffee Cart Nashville | El Gato Negro",
  description:
    "Bachelorettes, birthdays, dinner parties. Twenty people who actually know each other. Compact setup, no minimum headcount, short-notice when we can swing it.",
  alternates: { canonical: `/services/${SLUG}` },
  openGraph: {
    title: "Private Events — El Gato Negro",
    description: "The small ones count too.",
    url: `/services/${SLUG}`,
    type: "website",
    images: [
      {
        url: "/og/services-private-events.png",
        width: 1200,
        height: 630,
        alt: "El Gato Negro compact cart setup at a private home gathering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Event Coffee — El Gato Negro",
    description: "Compact setup. No minimum headcount.",
    images: ["/og/services-private-events.png"],
  },
};

export default function PrivateEventsPage() {
  const config = getServiceConfig(SLUG)!;
  const content = SERVICE_LANDING_CONTENT[SLUG];
  const faq = SERVICE_FAQS[SLUG];
  const testimonial = SERVICE_TESTIMONIALS[SLUG]!;

  const graph = buildServiceGraph({
    slug: SLUG,
    name: "Private Event Coffee Cart",
    serviceType: "Private Event Coffee Catering",
    description:
      "Private event coffee catering across Nashville — bachelorettes, birthdays, dinner parties. Compact setup for homes and rooftops, no minimum headcount, short-notice booking when the calendar allows.",
    breadcrumbName: "Private Events",
    faqs: faq.items,
  });

  return (
    <>
      <JsonLd data={graph} />

      {/* ── 1. Hero — balanced 50/50 editorial spread ──────────────── */}
      <section className="relative bg-brand-black grain-overlay-dark overflow-hidden">
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 pt-4 pb-16 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="mb-8 md:mb-10">
                <HeroBreadcrumb
                  currentLabel="Private Events"
                  variant="onDarkBg"
                />
              </div>

              <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-orange mb-4">
                {config.eyebrow}
              </p>
              <h1
                className="font-display font-bold uppercase text-brand-grey tracking-tight leading-[0.9]"
                style={{ fontSize: "var(--text-hero)" }}
              >
                Private
                <br />
                Events.
              </h1>
              <p className="font-display text-xl md:text-2xl text-brand-grey/70 mt-6">
                {config.tagline}
              </p>
              <p className="font-sans text-base md:text-lg leading-relaxed text-brand-grey/70 mt-6 max-w-md border-l-2 border-brand-orange pl-5 md:pl-6">
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

            <div className="order-1 md:order-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm grain-overlay-sm bg-brand-black">
                <Image
                  src="/images/services/private-events-hero.webp"
                  alt="Phil and Juan setting up the El Gato Negro cart in an intimate private-event setting"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover photo-treatment"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Testimonial — quieter than weddings (py-14) ─────────── */}
      <section className="bg-brand-grey grain-overlay py-14 md:py-18">
        <ServiceTestimonial
          quote={testimonial.quote}
          attribution={testimonial.attribution}
        />
      </section>

      {/* ── 3. Inclusions — light, shorter list ───────────────────── */}
      <section className="bg-brand-grey grain-overlay py-16 md:py-24">
        <InclusionsList
          eyebrow={content.inclusions.eyebrow}
          heading={content.inclusions.heading}
          items={config.features}
          surface="light"
        />
      </section>

      {/* ── 4. How Booking Works — dark ───────────────────────────── */}
      <section className="bg-brand-black grain-overlay-dark py-16 md:py-24">
        <HowBookingWorks
          eyebrow={content.processEyebrow}
          heading={content.processHeading}
          steps={content.steps}
          surface="dark"
        />
      </section>

      {/* ── 5. FAQ — light ────────────────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-16 md:py-24">
        <ServicesFAQ
          eyebrow={faq.eyebrow}
          heading={faq.heading}
          items={faq.items}
          surface="light"
        />
      </section>

      {/* ── 6. Also See — cross-links ─────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-10 md:py-14 border-t border-dashed border-brand-black/15">
        <AlsoSee
          links={[
            {
              href: "/services/weddings-celebrations",
              label: "weddings and larger milestones",
            },
            { href: "/about", label: "the two of us" },
          ]}
        />
      </section>

      {/* ── 7. Final CTA — flat orange ─────────────────────────────── */}
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
