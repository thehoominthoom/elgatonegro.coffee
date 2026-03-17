import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ALL_SERVICES } from "@/lib/inquiry/config";

export const metadata = {
  title: "Services — El Gato Negro",
  description:
    "Mobile espresso bar for weddings, corporate events, conventions, film sets, apartment communities, and brand partnerships.",
};

export default function ServicesPage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="grain-overlay relative bg-brand-black px-6 py-24 text-brand-grey md:px-12 md:py-32">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
            What We Do
          </p>
          <h1 className="font-display text-6xl font-black uppercase leading-none tracking-tight text-brand-grey md:text-8xl">
            Services
          </h1>
          <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-brand-grey/70">
            Mobile espresso, wherever it needs to be. Four ways we show up —
            brand activations, community events, weddings, and private
            gatherings.
          </p>
        </div>

        {/* Bottom rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-brand-orange/40" />
      </section>

      {/* ── Service Grid ─────────────────────────────────────────────── */}
      <section className="bg-brand-black px-6 py-16 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-px border border-brand-grey/10 bg-brand-grey/10 md:grid-cols-2 lg:grid-cols-3">
            {ALL_SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group relative flex flex-col bg-brand-black p-8 transition-colors duration-200 hover:bg-[#1a100d]"
              >
                {/* Eyebrow */}
                <p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange">
                  {service.eyebrow}
                </p>

                {/* Title */}
                <h2 className="font-display text-2xl font-black uppercase leading-tight tracking-tight text-brand-grey">
                  {service.label}
                </h2>

                {/* Description */}
                <p className="mt-3 font-sans text-sm leading-relaxed text-brand-grey/60">
                  {service.description}
                </p>

                {/* CTA arrow */}
                <div className="mt-8 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange transition-transform duration-200 group-hover:translate-x-1">
                  Learn More
                  <ArrowRight className="size-3.5" />
                </div>

                {/* Hover border accent */}
                <div className="absolute inset-y-0 left-0 w-0.5 bg-brand-orange opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <section className="bg-brand-orange px-6 py-16 md:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-grey/60">
              Not sure which fits?
            </p>
            <h2 className="mt-1 font-display text-4xl font-black uppercase leading-none tracking-tight text-brand-grey">
              Let&rsquo;s figure it out.
            </h2>
          </div>
          <Link
            href="/inquiry/weddings-celebrations"
            className="inline-flex items-center gap-3 border border-brand-grey px-8 py-4 font-sans text-sm font-bold uppercase tracking-[0.15em] text-brand-grey transition-all duration-200 hover:bg-brand-grey hover:text-brand-orange"
          >
            Get in Touch
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
