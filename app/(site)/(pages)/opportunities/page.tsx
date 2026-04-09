import type { Metadata } from "next";
import { OpportunityForm } from "@/components/opportunities/OpportunityForm";

// ── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Opportunities — El Gato Negro",
  description:
    "Join the El Gato Negro team. We're looking for passionate baristas to help us bring the cart to Nashville and beyond.",
  openGraph: {
    images: [{ url: '/images/hero/juan-phil-serving.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/hero/juan-phil-serving.webp'],
  },
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OpportunitiesPage() {
  return (
    <main className="min-h-screen bg-brand-black">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-0 lg:grid-cols-2">

        {/* ── Left: Context panel ─────────────────────────────────── */}
        <div className="grain-overlay relative border-r border-brand-grey/10 bg-[#1a100d] px-8 py-16 lg:px-12 lg:py-24">
          <div className="lg:sticky lg:top-24">
            {/* Eyebrow */}
            <p className="mb-3 font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-orange">
              Join the Team
            </p>

            {/* Headline */}
            <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-brand-grey lg:text-5xl">
              Opportunities
            </h1>

            <p className="mt-5 font-sans text-sm leading-relaxed text-brand-grey/60">
              El Gato Negro isn&apos;t a coffee shop. It&apos;s a mobile espresso
              operation that shows up where the energy is — events, activations,
              weddings, street corners. If you&apos;re the kind of barista who
              thrives outside the four walls of a traditional cafe, keep reading.
            </p>

            {/* Divider */}
            <div className="my-8 h-px bg-brand-grey/10" />

            {/* What we look for */}
            <p className="mb-4 font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-grey/30">
              What we look for
            </p>
            <ul className="space-y-3">
              {[
                "Strong espresso fundamentals — pulls, steaming, latte art",
                "Comfortable working outdoors in all conditions",
                "Reliable, self-directed, and good with people",
                "Nashville-based or willing to travel for events",
                "Experience with mobile or high-volume service is a plus",
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

            {/* What to expect */}
            <p className="mb-4 font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-grey/30">
              What to expect
            </p>
            <ul className="space-y-3">
              {[
                "Event-based schedule — no 5 AM opens",
                "Work Nashville's best events and venues",
                "Be part of a growing brand, not a machine",
                "We review every application personally",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 font-sans text-xs leading-relaxed text-brand-grey/50"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-green" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Right: Form ─────────────────────────────────────────── */}
        <div className="px-8 py-16 lg:px-12 lg:py-24">
          <h2 className="mb-8 font-display text-2xl font-black uppercase leading-none tracking-tight text-brand-grey">
            Tell us about yourself.
          </h2>
          <OpportunityForm />
        </div>

      </div>
    </main>
  );
}
