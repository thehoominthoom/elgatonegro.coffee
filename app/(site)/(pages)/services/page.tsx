import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ALL_SERVICES } from "@/lib/inquiry/config";

export const metadata = {
  title: "Services — El Gato Negro",
  description:
    "Mobile espresso bar for weddings, corporate events, conventions, and private gatherings. Four ways we show up.",
};

export default function ServicesPage() {
  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay px-4 md:px-6 pt-4 pb-10 md:pt-8 md:pb-16">
        <div className="relative z-10 mx-auto max-w-7xl border-b-2 border-brand-black pb-10 md:pb-16">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-green mb-4">
            WHAT WE DO
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight text-brand-black">
            Book the Cart
          </h1>
          <p className="font-sans text-lg text-brand-black/60 max-w-lg mt-4">
            Four ways we show up.
          </p>
        </div>
      </section>

      {/* ── Service Preview Stack ──────────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay px-4 md:px-6">
        <div className="relative z-10 mx-auto max-w-7xl">
          {ALL_SERVICES.map((service, i) => {
            const isEven = i % 2 === 0;
            const isLast = i === ALL_SERVICES.length - 1;

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className={`group block py-12 md:py-20 ${
                  !isLast ? "border-b-2 border-brand-black" : ""
                }`}
              >
                {/* Desktop: alternating grid */}
                <div
                  className={`hidden md:grid items-center gap-12 ${
                    isEven
                      ? "grid-cols-[1.2fr_1fr]"
                      : "grid-cols-[1fr_1.2fr]"
                  }`}
                >
                  {isEven ? (
                    <>
                      <div className="relative aspect-[4/3] bg-brand-black overflow-hidden">
                        <div className="absolute inset-0 grain-overlay-dark pointer-events-none" />
                        {/* eslint-disable-next-line @next/next/no-img-element -- decorative watermark */}
                        <img src="/brand/hellcat-color.svg" alt="" className="absolute inset-0 w-1/2 h-1/2 m-auto object-contain opacity-[0.04]" />
                        <div className="w-full h-full transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <ServiceBlockContent service={service} />
                    </>
                  ) : (
                    <>
                      <ServiceBlockContent service={service} />
                      <div className="relative aspect-[4/3] bg-brand-black overflow-hidden">
                        <div className="absolute inset-0 grain-overlay-dark pointer-events-none" />
                        {/* eslint-disable-next-line @next/next/no-img-element -- decorative watermark */}
                        <img src="/brand/hellcat-color.svg" alt="" className="absolute inset-0 w-1/2 h-1/2 m-auto object-contain opacity-[0.04]" />
                        <div className="w-full h-full transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile: stacked */}
                <div className="md:hidden">
                  <div className="relative aspect-[16/10] bg-brand-black overflow-hidden w-full mb-6">
                    <div className="absolute inset-0 grain-overlay-dark pointer-events-none" />
                    {/* eslint-disable-next-line @next/next/no-img-element -- decorative watermark */}
                    <img src="/brand/hellcat-color.svg" alt="" className="absolute inset-0 w-1/2 h-1/2 m-auto object-contain opacity-[0.04]" />
                    <div className="w-full h-full transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <ServiceBlockContent service={service} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <section className="bg-brand-orange py-16 md:py-20 border-t-2 border-brand-black">
        <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-black/70 mb-2">
              NOT SURE WHICH FITS?
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight text-brand-black">
              Let&apos;s figure it out.
            </h2>
          </div>
          <Link
            href="/inquiry"
            className="group shrink-0 inline-flex items-center gap-2 border border-brand-black bg-brand-black text-brand-grey px-8 py-4 font-display font-bold text-sm uppercase tracking-[0.1em] rounded-sm transition-colors hover:bg-brand-orange hover:border-brand-orange whitespace-nowrap"
          >
            Get in Touch
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}

// ─── Per-block content (shared between desktop and mobile layouts) ─────────

function ServiceBlockContent({
  service,
}: {
  service: (typeof ALL_SERVICES)[number];
}) {
  return (
    <div>
      <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-green mb-3">
        {service.eyebrow}
      </p>
      <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tight text-brand-black mb-3">
        {service.label}
      </h2>
      <p className="font-sans text-base italic text-brand-black/50 mb-4">
        {service.tagline}
      </p>
      <p className="font-sans text-sm leading-relaxed text-brand-black/70 max-w-md mb-6">
        {service.description}
      </p>
      <span className="inline-flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.2em] text-brand-orange group-hover:text-brand-yellow transition-colors">
        Get a Quote
        <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  );
}
