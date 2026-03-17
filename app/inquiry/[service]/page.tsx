import { notFound } from "next/navigation";
import Link from "next/link";
import { getServiceConfig, ALL_SERVICES, type ServiceSlug } from "@/lib/inquiry/config";
import { InquiryForm } from "./inquiry-form";

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
    title: `Book ${config.label} — El Gato Negro`,
    description: `Request a quote for ${config.label.toLowerCase()} coffee service.`,
  };
}

export default async function InquiryPage({
  params,
}: {
  params: Promise<{ service: ServiceSlug }>;
}) {
  const { service } = await params;
  const config = getServiceConfig(service);
  if (!config) notFound();

  return (
    <main className="min-h-screen bg-brand-black">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-0 lg:grid-cols-2">
        {/* ── Left: Context panel ──────────────────────────────────── */}
        <div className="grain-overlay relative border-r border-brand-grey/10 bg-[#1a100d] px-8 py-16 lg:px-12 lg:py-24">
          <div className="sticky top-24">
            <nav className="mb-10 flex items-center gap-2 font-sans text-xs text-brand-grey/30">
              <Link href="/services" className="hover:text-brand-orange transition-colors">
                Services
              </Link>
              <span>/</span>
              <span className="text-brand-grey/50">{config.label}</span>
            </nav>

            <p className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
              {config.eyebrow}
            </p>
            <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-brand-grey lg:text-5xl">
              {config.label}
            </h1>
            <p className="mt-4 font-sans text-sm italic text-brand-grey/50">
              {config.tagline}
            </p>
            <p className="mt-5 font-sans text-sm leading-relaxed text-brand-grey/60">
              {config.description}
            </p>

            {/* Divider */}
            <div className="my-8 h-px bg-brand-grey/10" />

            <p className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.15em] text-brand-grey/30">
              What&rsquo;s included
            </p>
            <ul className="space-y-2">
              {config.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 font-sans text-xs leading-relaxed text-brand-grey/50"
                >
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-brand-orange" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Right: Form ──────────────────────────────────────────── */}
        <div className="px-8 py-16 lg:px-12 lg:py-24">
          <InquiryForm config={config} />
        </div>
      </div>
    </main>
  );
}
