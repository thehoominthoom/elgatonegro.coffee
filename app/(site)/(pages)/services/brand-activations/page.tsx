import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getServiceConfig } from "@/lib/inquiry/config";
import { SERVICE_LANDING_CONTENT } from "@/lib/services/landing-content";
import { SERVICE_FAQS } from "@/lib/services/faqs";
import { SIGNATURE_MOMENTS } from "@/lib/services/signature-moments";
import { BY_THE_NUMBERS } from "@/lib/services/by-the-numbers";
import { RECENT_ACTIVATIONS } from "@/lib/services/recent-activations";
import { buildServiceGraph } from "@/lib/seo/service-graph";
import { InclusionsList } from "@/components/services/InclusionsList";
import { SignatureMoment } from "@/components/services/SignatureMoment";
import { ByTheNumbers } from "@/components/services/ByTheNumbers";
import { RecentActivations } from "@/components/services/RecentActivations";
import { ServicesFAQ } from "@/components/services/ServicesFAQ";
import { HowBookingWorks } from "@/components/services/HowBookingWorks";
import { ServiceSocialProof } from "@/components/services/ServiceSocialProof";
import { AlsoSee } from "@/components/services/AlsoSee";
import { FinalCTA } from "@/components/services/FinalCTA";
import { HeroBreadcrumb } from "@/components/services/HeroBreadcrumb";
import { JsonLd } from "@/components/services/JsonLd";

const SLUG = "brand-activations" as const;

export const metadata: Metadata = {
  title: "Brand Activations — Corporate Coffee Cart | El Gato Negro",
  description:
    "Lobbies, production sets, shoe drops, apartment pop-ups in Nashville. Cart in your colors, our baristas, setup in under 30 minutes. Get a quote in 24 hours.",
  alternates: { canonical: `/services/${SLUG}` },
  openGraph: {
    title: "Brand Activations — El Gato Negro",
    description:
      "Different room. Same bar. Nashville brand activations with the cart in your colors.",
    url: `/services/${SLUG}`,
    type: "website",
    images: [
      {
        url: "/og/services-brand-activations.png",
        width: 1200,
        height: 630,
        alt: "El Gato Negro cart branded for a corporate activation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Activations — El Gato Negro",
    description: "Cart in your colors. Setup in under 30 minutes.",
    images: ["/og/services-brand-activations.png"],
  },
};

export default function BrandActivationsPage() {
  const config = getServiceConfig(SLUG)!;
  const content = SERVICE_LANDING_CONTENT[SLUG];
  const faq = SERVICE_FAQS[SLUG];
  const signature = SIGNATURE_MOMENTS[SLUG]!;
  const numbers = BY_THE_NUMBERS[SLUG]!;
  const recent = RECENT_ACTIVATIONS[SLUG]!;

  const graph = buildServiceGraph({
    slug: SLUG,
    name: "Brand Activations — Mobile Coffee Cart",
    serviceType: "Corporate Coffee Catering",
    description:
      "Mobile coffee cart brand activations in Nashville. Lobbies, production sets, shoe drops, apartment pop-ups. Cart branded to your event, baristas on our payroll, setup in under 30 minutes.",
    breadcrumbName: "Brand Activations",
    faqs: faq.items,
  });

  return (
    <>
      <JsonLd data={graph} />

      {/* ── 1. Hero — full-viewport, About §1 pattern ──────────────── */}
      <section className="relative w-full min-h-[85svh] overflow-hidden -mt-44 md:-mt-36 bg-brand-black grain-overlay-dark">
        <Image
          src="/images/services/brand-activations-hero.webp"
          alt="El Gato Negro coffee cart set up in the 1111 Church leasing office lobby, Juan pulling shots"
          fill
          priority
          sizes="100vw"
          className="object-cover photo-treatment"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/85 via-brand-black/40 to-brand-black/20" />

        <div className="absolute inset-0 z-10 flex flex-col justify-end max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20 pt-32 md:pt-36">
          <div className="mb-8 md:mb-12">
            <HeroBreadcrumb currentLabel="Brand Activations" variant="onImage" />
          </div>

          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-orange mb-4">
            {config.eyebrow}
          </p>
          <h1
            className="font-display font-bold uppercase text-brand-grey tracking-tight leading-[0.9]"
            style={{ fontSize: "var(--text-hero)" }}
          >
            Brand
            <br />
            Activations.
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

      {/* ── 2. Social Proof — logos, light ─────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-10 md:py-14">
        <ServiceSocialProof eyebrow="BRANDS WE'VE SERVED" />
      </section>

      {/* ── 3. Inclusions — bullets, light ─────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-16 md:py-24">
        <InclusionsList
          eyebrow={content.inclusions.eyebrow}
          heading={content.inclusions.heading}
          items={config.features}
          surface="light"
        />
      </section>

      {/* ── 4. Signature Moment — dark, image right ────────────────── */}
      <section className="bg-brand-black grain-overlay-dark py-20 md:py-28">
        <SignatureMoment {...signature} />
      </section>

      {/* ── 5. By the Numbers — light ──────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-16 md:py-24">
        <ByTheNumbers
          eyebrow={numbers.eyebrow}
          items={numbers.items}
          surface="light"
        />
      </section>

      {/* ── 6. How Booking Works — dark ───────────────────────────── */}
      <section className="bg-brand-black grain-overlay-dark py-16 md:py-24">
        <HowBookingWorks
          eyebrow={content.processEyebrow}
          heading={content.processHeading}
          steps={content.steps}
          surface="dark"
        />
      </section>

      {/* ── 7. FAQ — light ────────────────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-16 md:py-24">
        <ServicesFAQ
          eyebrow={faq.eyebrow}
          heading={faq.heading}
          items={faq.items}
          surface="light"
        />
      </section>

      {/* ── 8. Recent Activations — dark marquee ───────────────────── */}
      <RecentActivations eyebrow={recent.eyebrow} items={recent.items} />

      {/* ── 9. Also See — light cross-links ────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-10 md:py-14">
        <AlsoSee
          links={[
            {
              href: "/services/community-conventions",
              label: "multi-day activations",
            },
            { href: "/about", label: "who runs the cart" },
          ]}
        />
      </section>

      {/* ── 10. Final CTA — flat orange ────────────────────────────── */}
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
