import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getServiceConfig, ALL_SERVICES, type ServiceSlug } from "@/lib/inquiry/config";

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

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="grain-overlay relative overflow-hidden bg-brand-black px-6 py-24 md:px-12 md:py-36">
        {/* Background texture stripe */}
        <div className="absolute inset-y-0 right-0 w-1/3 bg-brand-orange/5" />

        <div className="relative mx-auto max-w-5xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 font-sans text-xs text-brand-grey/40">
            <Link href="/services" className="hover:text-brand-orange transition-colors">
              Services
            </Link>
            <span>/</span>
            <span className="text-brand-grey/60">{config.label}</span>
          </nav>

          <p className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            {config.eyebrow}
          </p>
          <h1 className="font-display text-5xl font-black uppercase leading-none tracking-tight text-brand-grey md:text-7xl">
            {config.label}
          </h1>
          <p className="mt-4 font-sans text-xl text-brand-grey/50 italic">
            {config.tagline}
          </p>
          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-brand-grey/70">
            {config.description}
          </p>

          <Link
            href={`/inquiry/${config.slug}`}
            className="mt-10 inline-flex items-center gap-3 bg-brand-orange px-8 py-4 font-sans text-sm font-bold uppercase tracking-[0.15em] text-brand-grey transition-all duration-200 hover:bg-brand-yellow hover:text-brand-black"
          >
            Request a Quote
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-brand-orange/30" />
      </section>

      {/* ── What's Included ──────────────────────────────────────────── */}
      <section className="bg-brand-grey px-6 py-20 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <div>
              <p className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
                What&rsquo;s Included
              </p>
              <h2 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-brand-black">
                Everything you need, nothing you don&rsquo;t.
              </h2>
            </div>

            <ul className="space-y-4">
              {config.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-orange" />
                  <span className="font-sans text-sm leading-relaxed text-brand-black/80">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA Bar ──────────────────────────────────────────────────── */}
      <section className="grain-overlay relative bg-brand-black px-6 py-20 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="border border-brand-orange/30 p-10 md:p-16">
            <p className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
              Ready?
            </p>
            <h2 className="font-display text-5xl font-black uppercase leading-none tracking-tight text-brand-grey md:text-6xl">
              Let&rsquo;s make it happen.
            </h2>
            <p className="mt-4 max-w-lg font-sans text-base leading-relaxed text-brand-grey/60">
              Tell us about your event and we&rsquo;ll get back to you with
              availability and a custom quote.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`/inquiry/${config.slug}`}
                className="inline-flex items-center gap-3 bg-brand-orange px-8 py-4 font-sans text-sm font-bold uppercase tracking-[0.15em] text-brand-grey transition-all duration-200 hover:bg-brand-yellow hover:text-brand-black"
              >
                Start Your Inquiry
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-3 border border-brand-grey/20 px-8 py-4 font-sans text-sm font-bold uppercase tracking-[0.15em] text-brand-grey/60 transition-colors hover:border-brand-grey/40 hover:text-brand-grey"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
