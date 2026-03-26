import { type Metadata } from "next";
import { type GeneralInquiryValues } from "@/lib/inquiry/general-schema";
import { InquiryForm } from "@/components/inquiry/InquiryForm";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Book the Cart — El Gato Negro",
  description:
    "Ready to bring El Gato Negro to your event? Fill out an inquiry and we'll be in touch within 1–2 business days.",
};

// ─── Valid service slugs ───────────────────────────────────────────────────────

const VALID_SERVICES = new Set<GeneralInquiryValues["serviceType"]>([
  "brand-activations",
  "community-conventions",
  "weddings-celebrations",
  "private-events",
]);

function toServiceSlug(raw: string | undefined): GeneralInquiryValues["serviceType"] | undefined {
  if (raw && VALID_SERVICES.has(raw as GeneralInquiryValues["serviceType"])) {
    return raw as GeneralInquiryValues["serviceType"];
  }
  return undefined;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function InquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const defaultService = toServiceSlug(service);

  return (
    <main className="min-h-screen bg-brand-black">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-0 lg:grid-cols-2">

        {/* ── Left: Context panel ─────────────────────────────────────── */}
        <div className="grain-overlay relative border-r border-brand-grey/10 bg-[#1a100d] px-8 py-16 lg:px-12 lg:py-24">
          <div className="lg:sticky lg:top-24">
            {/* Eyebrow */}
            <p className="mb-3 font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-orange">
              Book the Cart
            </p>

            {/* Headline */}
            <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-brand-grey lg:text-5xl">
              Let&apos;s bring the cart to your event.
            </h1>

            <p className="mt-5 font-sans text-sm leading-relaxed text-brand-grey/60">
              Fill out the form and we&apos;ll get back to you within 1–2
              business days with availability, custom options, and pricing.
            </p>

            {/* Divider */}
            <div className="my-8 h-px bg-brand-grey/10" />

            {/* What to expect */}
            <p className="mb-4 font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-grey/30">
              What to expect
            </p>
            <ul className="space-y-3">
              {[
                "Personal reply — not a bot",
                "Availability confirmed within 1–2 business days",
                "Custom quote based on your event details",
                "No commitment required to inquire",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 font-sans text-xs leading-relaxed text-brand-grey/50"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-orange" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="my-8 h-px bg-brand-grey/10" />

            {/* Services reminder */}
            <p className="mb-4 font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-grey/30">
              We serve
            </p>
            <ul className="space-y-2">
              {[
                "Brand Activations",
                "Community & Conventions",
                "Weddings & Celebrations",
                "Private Events",
              ].map((svc) => (
                <li
                  key={svc}
                  className="font-sans text-xs text-brand-grey/40"
                >
                  {svc}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Right: Form ─────────────────────────────────────────────── */}
        <div className="px-8 py-16 lg:px-12 lg:py-24">
          <h2 className="mb-8 font-display text-2xl font-black uppercase leading-none tracking-tight text-brand-grey">
            Tell us about your event.
          </h2>
          <InquiryForm defaultService={defaultService} />
        </div>

      </div>
    </main>
  );
}
