import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getServiceConfig } from "@/lib/inquiry/config";
import { SERVICE_LANDING_CONTENT } from "@/lib/services/landing-content";
import { SERVICE_FAQS } from "@/lib/services/faqs";
import { SIGNATURE_MOMENTS } from "@/lib/services/signature-moments";
import { BY_THE_NUMBERS } from "@/lib/services/by-the-numbers";
import { RECENT_ACTIVATIONS } from "@/lib/services/recent-activations";
import { IMAGE_ROWS } from "@/lib/services/image-rows";
import { buildServiceGraph } from "@/lib/seo/service-graph";
import { HeroImageFrame } from "@/components/shared/HeroImageFrame";
import { InclusionsList } from "@/components/services/InclusionsList";
import { SignatureMoment } from "@/components/services/SignatureMoment";
import { ByTheNumbers } from "@/components/services/ByTheNumbers";
import { ImageTriptych } from "@/components/services/ImageTriptych";
import { RecentActivations } from "@/components/services/RecentActivations";
import { ServicesFAQ } from "@/components/services/ServicesFAQ";
import { HowBookingWorks } from "@/components/services/HowBookingWorks";
import { ServiceSocialProof } from "@/components/services/ServiceSocialProof";
import { AlsoSee } from "@/components/services/AlsoSee";
import { FinalCTA } from "@/components/services/FinalCTA";
import { HeroBreadcrumb } from "@/components/services/HeroBreadcrumb";
import { InlineCTA } from "@/components/services/InlineCTA";
import { StickyMobileCTA } from "@/components/services/StickyMobileCTA";
import { JsonLd } from "@/components/services/JsonLd";

const SLUG = "brand-activations" as const;

export const metadata: Metadata = {
  title: { absolute: "Corporate Events & Brand Activations | El Gato Negro Nashville" },
  description:
    "Corporate events, product launches, brand activations. Lobbies, production sets, apartment pop-ups in Nashville. Cart in your colors. Quote in 24 hours.",
  alternates: { canonical: `/services/${SLUG}` },
  openGraph: {
    title: "Brand Activations — El Gato Negro",
    description:
      "Corporate events, product launches, brand activations. Different room. Same bar.",
    url: `/services/${SLUG}`,
    type: "website",
    images: [
      {
        url: "/images/services/brand-activations-hero.webp",
        width: 2400,
        height: 3200,
        alt: "El Gato Negro cart branded for a corporate activation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Activations — El Gato Negro",
    description: "Cart in your colors. Setup in under 30 minutes.",
    images: ["/images/services/brand-activations-hero.webp"],
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
    name: "Corporate Events & Brand Activations — Mobile Coffee Cart",
    serviceType: "Corporate Coffee Catering",
    description:
      "Mobile coffee cart for corporate events, product launches, and brand activations in Nashville. Lobbies, production sets, apartment pop-ups. Cart branded to your event, baristas on our payroll, setup in under 30 minutes.",
    breadcrumbName: "Brand Activations",
    faqs: faq.items,
  });

  return (
    <>
      <JsonLd data={graph} />

      {/* ── 1. Hero — full-viewport, shared HeroImageFrame ─────────── */}
      <HeroImageFrame
        src="/images/services/brand-activations-hero.webp"
        alt="Nike Stampede activation drink with El Gato Negro branded cup and event signage"
        minHeight="85svh"
        bleedTop
      >
        <div className="relative z-10 flex min-h-[85svh] flex-col justify-end max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20 pt-32 md:pt-36">
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
          <p className="font-display text-xl md:text-2xl text-brand-grey mt-6">
            {config.tagline}
          </p>
          <p className="font-sans text-base md:text-lg leading-relaxed text-brand-grey mt-6 max-w-2xl border-l-2 border-brand-orange pl-5 md:pl-6">
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
      </HeroImageFrame>

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
      <section className="bg-brand-black grain-overlay-dark py-12 md:py-16">
        <SignatureMoment {...signature} />
      </section>

      {/* ── 4b. Inline CTA — quiet mid-page moment (dark, matches §4) ─ */}
      <InlineCTA
        eyebrow="READY WHEN YOU ARE"
        linkText="Tell us about it"
        href={`/inquiry?service=${SLUG}`}
        surface="dark"
      />

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

      {/* ── 7b. Image Triptych — wordless visual reset before closing rhythm */}
      <ImageTriptych images={IMAGE_ROWS[SLUG]!} />

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

      {/* ── Sticky mobile CTA — fades in past hero, out before Final CTA */}
      <StickyMobileCTA href={`/inquiry?service=${SLUG}`} />
    </>
  );
}
