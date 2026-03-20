import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "About — El Gato Negro Coffee",
  description:
    "El Gato Negro is a San Antonio mobile coffee cart built on specialty espresso, bold energy, and showing up where it matters. Meet the team behind the brand.",
  openGraph: {
    title: "About — El Gato Negro Coffee",
    description:
      "San Antonio mobile coffee cart built on specialty espresso, bold energy, and showing up where it matters.",
    type: "website",
    images: [
      {
        url: "/images/hero/hero-barista_roasting.webp",
        width: 1200,
        height: 630,
        alt: "El Gato Negro Coffee — barista roasting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — El Gato Negro Coffee",
    description:
      "San Antonio mobile coffee cart. Specialty espresso, bold energy, community first.",
    images: ["/images/hero/hero-barista_roasting.webp"],
  },
};

// ── Team data ────────────────────────────────────────────────────────────────

const team = [
  {
    name: "Juan",
    role: "The Coffee Guy",
    bio: "Runs the carts, pulls the shots, and sets the standard for every cup that goes out. Juan built EGN from the ground up — hands-on, no shortcuts, no compromise on the product.",
  },
  {
    name: "Phil",
    role: "The Brand Guy",
    bio: "Runs the website, the brand, and the business side. Phil brings the design eye, the tech backbone, and the strategy that keeps EGN moving forward.",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-brand-black grain-overlay overflow-hidden">
        <Image
          src="/images/hero/hero-barista_roasting.webp"
          alt="El Gato Negro barista at work"
          fill
          priority
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32">
          <p className="font-sans font-extrabold text-xs uppercase tracking-[0.3em] text-brand-orange mb-4">
            About EGN
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight text-brand-grey max-w-3xl">
            Not Your Average Coffee Cart
          </h1>
          <p className="font-sans text-lg md:text-xl text-brand-grey/70 max-w-xl mt-6 leading-relaxed">
            Bold espresso. Bolder energy. We bring specialty coffee to the
            events, communities, and moments that matter most in San Antonio.
          </p>
        </div>
      </section>

      {/* ── 2. The Story ─────────────────────────────────────────────── */}
      <section className="bg-brand-grey py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <p className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-green mb-4">
              Our Story
            </p>
            <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-brand-black tracking-tight mb-8">
              How It Started
            </h2>
            <div className="space-y-6 font-sans text-base leading-relaxed text-brand-black/80">
              <p>
                El Gato Negro started the way most good things do — two guys who
                were tired of seeing the same watered-down coffee at every event
                in town. No personality. No craft. Just brown liquid in a
                styrofoam cup and a line of people who deserved better.
              </p>
              <p>
                So we built a cart. Then we built another one. We showed up at
                pop-ups, weddings, brand activations, and conventions — anywhere
                people gathered and needed something real in their hands. Not
                just a drink. An experience that matched the energy of whatever
                was happening around it.
              </p>
              <p>
                EGN is San Antonio through and through. The name, the look, the
                attitude — it all comes from here. We pull from skate culture,
                Mexican cowboy roots, and a deep belief that coffee should hit
                different when it is made by people who actually care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Meet the Team ─────────────────────────────────────────── */}
      <section className="bg-brand-black grain-overlay py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <p className="font-sans font-extrabold text-xs uppercase tracking-[0.3em] text-brand-yellow mb-4">
            The People
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-brand-grey tracking-tight mb-12">
            Meet the Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-grey/10">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-brand-black p-8 md:p-12"
              >
                {/* Placeholder avatar */}
                <div className="w-24 h-24 bg-brand-orange/20 border-2 border-brand-orange mb-6 flex items-center justify-center">
                  <span className="font-display text-3xl font-bold uppercase text-brand-orange">
                    {member.name[0]}
                  </span>
                </div>

                <p className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-green mb-2">
                  {member.role}
                </p>
                <h3 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-tight text-brand-grey mb-4">
                  {member.name}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-brand-grey/70 max-w-md">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Our Approach ──────────────────────────────────────────── */}
      <section className="bg-brand-grey py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="border-b-2 border-brand-black pb-10 md:pb-16 mb-12">
            <p className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-green mb-4">
              What Makes Us Different
            </p>
            <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-brand-black tracking-tight">
              Our Approach
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-brand-black">
            {[
              {
                title: "Mobile First",
                description:
                  "We come to you. Weddings, conventions, pop-ups, corporate events — wherever people gather, we set up and serve specialty espresso on site.",
              },
              {
                title: "Specialty Coffee",
                description:
                  "No drip machines. No shortcuts. Every drink is pulled, poured, and made to order by someone who knows what they are doing and cares about the result.",
              },
              {
                title: "Event Service",
                description:
                  "We do not just show up with a cart. We work with organizers to match the energy, the branding, and the flow of the event. Coffee is the product. Experience is the point.",
              },
              {
                title: "Community Roots",
                description:
                  "San Antonio built us. We show up for local events, support the community, and keep the relationships that matter close. This is not a franchise play. This is home.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`p-8 md:p-10 border-brand-black ${
                  i % 2 === 0 ? "md:border-r-2" : ""
                } ${i < 2 ? "border-b-2" : ""}`}
              >
                <h3 className="font-display font-bold text-xl uppercase tracking-tight text-brand-black mb-4">
                  {item.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-brand-black/70 max-w-md">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CTA ───────────────────────────────────────────────────── */}
      <section className="bg-brand-orange py-16 md:py-20 border-t-2 border-brand-black">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black/70 mb-2">
              Like What You See?
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase text-brand-black tracking-tight">
              Let&apos;s bring the cart to your event.
            </h2>
          </div>
          <Link
            href="/inquiry"
            className="group shrink-0 inline-flex items-center gap-2 bg-brand-black text-brand-grey font-display font-bold uppercase tracking-[0.1em] text-sm px-8 py-4 border-2 border-brand-black hover:bg-transparent hover:text-brand-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-black active:scale-[0.98] whitespace-nowrap"
          >
            Start Your Inquiry
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </>
  );
}
