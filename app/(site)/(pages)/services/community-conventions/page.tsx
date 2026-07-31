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

const SLUG = "community-conventions" as const;

export const metadata: Metadata = {
  title: { absolute: "Convention & Community Coffee Catering | El Gato Negro Nashville" },
  description:
    "Seventy drinks an hour when the line demands it. Multi-day conventions, club meetups, community events. Nashville and out. Multi-station setup. Request a quote.",
  alternates: { canonical: `/services/${SLUG}` },
  openGraph: {
    title: "Community & Conventions — El Gato Negro",
    description: "Three days. One line. Keeps moving.",
    url: `/services/${SLUG}`,
    type: "website",
    images: [
      {
        url: "/images/services/community-conventions-hero.webp",
        width: 2400,
        height: 3200,
        alt: "El Gato Negro multi-station setup serving a convention crowd",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convention Coffee Catering — El Gato Negro",
    description: "Multi-day. Multi-station. Line keeps moving.",
    images: ["/images/services/community-conventions-hero.webp"],
  },
};

export default function CommunityConventionsPage() {
  const config = getServiceConfig(SLUG)!;
  const content = SERVICE_LANDING_CONTENT[SLUG];
  const faq = SERVICE_FAQS[SLUG];
  const signature = SIGNATURE_MOMENTS[SLUG]!;
  const numbers = BY_THE_NUMBERS[SLUG]!;
  const recent = RECENT_ACTIVATIONS[SLUG]!;

  const graph = buildServiceGraph({
    slug: SLUG,
    name: "Community & Convention Coffee Catering",
    serviceType: "Event Coffee Catering",
    description:
      "Multi-day convention and community event coffee catering across Nashville. Multi-station setup, non-coffee options, and a crew that keeps the line moving from day one through day three.",
    breadcrumbName: "Community & Conventions",
    faqs: faq.items,
  });

  return (
    <>
      <JsonLd data={graph} />

      {/* ── 1. Hero — full-viewport, shared HeroImageFrame ─────────── */}
      <HeroImageFrame
        src="/images/services/community-conventions-hero.webp"
        alt="Phil Bartko working the El Gato Negro cart at Nashville Production Week"
        minHeight="85svh"
        bleedTop
        objectPosition="center 25%"
      >
        <div className="relative z-10 flex min-h-[85svh] flex-col justify-end max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20 pt-32 md:pt-36">
          <div className="mb-8 md:mb-12">
            <HeroBreadcrumb
              currentLabel="Community & Conventions"
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
            Community &amp;
            <br />
            Conventions.
          </h1>

          <div className="font-display text-xl md:text-2xl text-brand-grey mt-6 leading-tight">
            <p>Three days.</p>
            <p>One line.</p>
            <p>Keeps moving.</p>
          </div>

          <p className="font-sans text-base md:text-lg leading-relaxed text-brand-grey mt-8 max-w-2xl border-l-2 border-brand-orange pl-5 md:pl-6">
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

      {/* ── 2. By the Numbers — light, moved up on this page ────────── */}
      <section className="bg-brand-grey grain-overlay py-20 md:py-28">
        <ByTheNumbers
          eyebrow={numbers.eyebrow}
          items={numbers.items}
          surface="light"
        />
      </section>

      {/* ── 2b. Inline CTA — quiet mid-page moment (light, matches §2) ─ */}
      <InlineCTA
        eyebrow="WHEN THE DAY IS BIG"
        linkText="Get the quote"
        href={`/inquiry?service=${SLUG}`}
        surface="light"
      />

      {/* ── 3. Social Proof — logos ────────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-10 md:py-14 border-t border-dashed border-brand-black/15">
        <ServiceSocialProof eyebrow="GROUPS WE'VE WORKED WITH" />
      </section>

      {/* ── 4. Inclusions — DARK variant ───────────────────────────── */}
      <section className="bg-brand-black grain-overlay-dark py-16 md:py-24">
        <InclusionsList
          eyebrow={content.inclusions.eyebrow}
          heading={content.inclusions.heading}
          items={config.features}
          surface="dark"
        />
      </section>

      {/* ── 5. Signature Moment — dark, image LEFT (mirror) ────────── */}
      <section className="bg-brand-black grain-overlay-dark py-12 md:py-16 border-t border-dashed border-brand-grey/10">
        <SignatureMoment {...signature} />
      </section>

      {/* ── 6. How Booking Works — LIGHT (rhythm flip) ─────────────── */}
      <section className="bg-brand-grey grain-overlay py-16 md:py-24">
        <HowBookingWorks
          eyebrow={content.processEyebrow}
          heading={content.processHeading}
          steps={content.steps}
          surface="light"
        />
      </section>

      {/* ── 6b. Image Triptych — wordless visual reset before the FAQ */}
      <ImageTriptych images={IMAGE_ROWS[SLUG]!} />

      {/* ── 7. FAQ — DARK (paired flip) ───────────────────────────── */}
      <section className="bg-brand-black grain-overlay-dark py-16 md:py-24">
        <ServicesFAQ
          eyebrow={faq.eyebrow}
          heading={faq.heading}
          items={faq.items}
          surface="dark"
        />
      </section>

      {/* ── 8. Recent Events — dark marquee ────────────────────────── */}
      <RecentActivations eyebrow={recent.eyebrow} items={recent.items} />

      {/* ── 9. Also See — light cross-links ────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-10 md:py-14">
        <AlsoSee
          links={[
            { href: "/services/brand-activations", label: "brand activations" },
            { href: "/about", label: "how we operate" },
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
