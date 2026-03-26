import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getServiceConfig, ALL_SERVICES, type ServiceSlug } from "@/lib/inquiry/config";
import { SERVICE_LANDING_CONTENT } from "@/lib/services/landing-content";
import { clients } from "@/lib/clients";

export function generateStaticParams() {
  return ALL_SERVICES.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const config = getServiceConfig(service);
  if (!config) return {};
  return {
    title: `${config.label} — El Gato Negro`,
    description: config.description,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: ServiceSlug }>;
}) {
  const { service } = await params;
  const config = getServiceConfig(service);
  if (!config) notFound();

  const content = SERVICE_LANDING_CONTENT[config.slug];

  return (
    <>
      {/* ── Section 1: Hero (dark) ──────────────────────────────── */}
      <section className="bg-brand-black grain-overlay">
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
          {/* Mobile: media on top */}
          <div className="md:hidden mb-8">
            <ServiceHeroMedia />
          </div>

          <div className="md:grid md:grid-cols-[1.1fr_1fr] md:gap-12 lg:gap-16 md:items-center">
            {/* Content */}
            <div className="md:self-center">
              <nav className="flex items-center gap-2 font-sans text-xs text-brand-grey/40 mb-6">
                <Link href="/services" className="hover:text-brand-orange transition-colors">
                  Services
                </Link>
                <span>/</span>
                <span className="text-brand-grey/60">{config.label}</span>
              </nav>

              <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-orange mb-4">
                {config.eyebrow}
              </p>
              <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl uppercase leading-none tracking-tight text-brand-grey">
                {config.label}
              </h1>
              <p className="font-display text-lg md:text-xl text-brand-grey/50 mt-4">
                {config.tagline}
              </p>
              <p className="font-sans text-base leading-relaxed text-brand-grey/70 mt-6 max-w-lg">
                {config.description}
              </p>
              <Link
                href={`/inquiry?service=${config.slug}`}
                className="mt-10 inline-flex items-center gap-3 bg-brand-orange text-brand-grey font-display font-bold text-sm uppercase tracking-[0.1em] rounded-sm px-8 py-4 hover:bg-brand-yellow transition-colors"
              >
                Request a Quote
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Desktop: media right */}
            <div className="hidden md:block">
              <ServiceHeroMedia />
            </div>
          </div>
        </div>
        <div className="h-px bg-brand-orange/30" />
      </section>

      {/* ── Section 2: Social Proof (light) ─────────────────────── */}
      <SocialProofSection content={content} />

      {/* ── Section 3: What's Included (dark) ───────────────────── */}
      <section className="bg-brand-black grain-overlay">
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-orange mb-4">
            WHAT&apos;S INCLUDED
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight text-brand-grey">
            {content.featuresHeading}
          </h2>
          <div className="h-px bg-brand-grey/10 mt-8 mb-10" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-grey/10">
            {config.features.map((feature) => {
              const parts = feature.split(" — ");
              const hasBody = parts.length > 1;
              return (
                <div key={feature} className="bg-brand-black p-6 md:p-8">
                  <p className="font-display font-bold text-base uppercase tracking-tight text-brand-grey">
                    {hasBody ? parts[0] : feature}
                  </p>
                  {hasBody && (
                    <p className="font-sans text-sm leading-relaxed text-brand-grey/60 mt-2">
                      {parts[1]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 4: How It Works (light) ─────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-16 md:py-24">
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-green mb-4">
            THE PROCESS
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight text-brand-black">
            How booking works.
          </h2>
          <div className="h-0.5 bg-brand-black mt-6 mb-12" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {content.steps.map((step) => (
              <div key={step.number}>
                <span className="font-display text-6xl md:text-7xl font-bold text-brand-black/10">
                  {step.number}
                </span>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mt-2">
                  {step.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-brand-black/70 mt-3">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Gallery (dark, optional) ─────────────────── */}
      <GallerySection images={[]} />

      {/* ── Section 6: Final CTA (dark) ─────────────────────────── */}
      <section className="bg-brand-black grain-overlay">
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
          <div className="border border-brand-orange/30 p-8 md:p-16">
            <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-orange mb-4">
              {content.cta.eyebrow}
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase leading-none tracking-tight text-brand-grey">
              {content.cta.heading}
            </h2>
            <p className="mt-4 max-w-lg font-sans text-base leading-relaxed text-brand-grey/60">
              {content.cta.subtext}
            </p>
            <Link
              href={`/inquiry?service=${config.slug}`}
              className="mt-10 inline-flex items-center gap-3 bg-brand-orange text-brand-grey font-display font-bold text-sm uppercase tracking-[0.1em] rounded-sm px-8 py-4 hover:bg-brand-yellow transition-colors"
            >
              Start Your Inquiry
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── ServiceHeroMedia ─────────────────────────────────────────────────────────

function ServiceHeroMedia({
  videoUrl,
  imageUrl,
  posterUrl,
}: {
  videoUrl?: string;
  imageUrl?: string;
  posterUrl?: string;
} = {}) {
  if (videoUrl) {
    return (
      <div className="aspect-[16/10] md:aspect-[3/4] overflow-hidden bg-brand-black/40">
        <video
          src={videoUrl}
          poster={posterUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="aspect-[16/10] md:aspect-[3/4] overflow-hidden bg-brand-black/40">
        {/* eslint-disable-next-line @next/next/no-img-element -- placeholder until real images exist */}
        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }

  // No media — render branded placeholder
  return (
    <div className="relative aspect-[16/10] md:aspect-[3/4] bg-brand-black overflow-hidden">
      <div className="absolute inset-0 grain-overlay-dark pointer-events-none" />
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative watermark */}
      <img src="/brand/hellcat-color.svg" alt="" className="absolute inset-0 w-1/2 h-1/2 m-auto object-contain opacity-[0.04]" />
    </div>
  );
}

// ─── SocialProofSection ───────────────────────────────────────────────────────

function SocialProofSection({
  content,
}: {
  content: (typeof SERVICE_LANDING_CONTENT)[ServiceSlug];
}) {
  if (content.socialProofType === "logos") {
    return (
      <section className="bg-brand-grey grain-overlay py-10 md:py-14">
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-black/40 mb-8">
            BRANDS WE&apos;VE SERVED
          </p>

          {/* Desktop: wrapped grid */}
          <div className="hidden md:grid grid-cols-5 gap-3">
            {clients.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-center aspect-[8/5] bg-brand-black/[0.03] px-6 py-4 overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG logos, no optimization needed */}
                <img
                  src={c.src}
                  alt={c.name}
                  className="w-auto max-h-full"
                  style={{ height: c.h }}
                />
              </div>
            ))}
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="md:hidden flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {clients.map((c) => (
              <div
                key={c.name}
                className="flex-shrink-0 flex items-center justify-center w-40 aspect-[8/5] bg-brand-black/[0.03] px-4 py-3 overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG logos */}
                <img
                  src={c.src}
                  alt={c.name}
                  className="w-auto max-h-full"
                  style={{ height: Math.min(c.h, 40) }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Testimonial variant
  if (content.testimonial) {
    return (
      <section className="bg-brand-grey grain-overlay py-12 md:py-16">
        <div className="relative z-10 mx-auto max-w-3xl px-4 md:px-6 text-center">
          <p className="font-display text-2xl md:text-3xl text-brand-black tracking-tight">
            &ldquo;{content.testimonial.quote}&rdquo;
          </p>
          <p className="font-sans text-sm text-brand-black/50 mt-6">
            {content.testimonial.attribution}
          </p>
        </div>
      </section>
    );
  }

  return null;
}

// ─── GallerySection ──────────────────────────────────────────────────────────

function GallerySection({ images }: { images: string[] }) {
  if (!images.length) return null;

  return (
    <section className="bg-brand-black grain-overlay">
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
          {images.map((src) => (
            <div key={src} className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element -- gallery images, will swap to next/image when real assets exist */}
              <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
