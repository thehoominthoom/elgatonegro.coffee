import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroImageFrame } from "@/components/shared/HeroImageFrame";

// ── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "About — El Gato Negro Coffee",
  description:
    "El Gato Negro is a Nashville mobile coffee cart built on specialty espresso, bold energy, and showing up where it matters. Meet the team behind the brand.",
  openGraph: {
    title: "About — El Gato Negro Coffee",
    description:
      "Nashville mobile coffee cart built on specialty espresso, bold energy, and showing up where it matters.",
    type: "website",
    images: [
      {
        url: "/images/about/crew_in_front_of_cart_exchange-260110.webp",
        width: 1200,
        height: 630,
        alt: "El Gato Negro Coffee crew in front of the cart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — El Gato Negro Coffee",
    description:
      "Nashville mobile coffee cart. Specialty espresso, bold energy, community first.",
    images: ["/images/about/crew_in_front_of_cart_exchange-260110.webp"],
  },
};

// ── Data ──────────────────────────────────────────────────────────────────────

const team = [
  {
    name: "Juan",
    role: "The Coffee Guy",
    bio: "Runs the carts, pulls the shots, and sets the standard for every cup that goes out. Juan built EGN from the ground up — hands-on, no shortcuts, no compromise on the product.",
    image: "/images/about/misc-founding.bts-portrait-juan-01.webp",
    imageAlt: "Portrait of Juan Martinez, co-founder of El Gato Negro",
  },
  {
    name: "Phil",
    role: "The Brand Guy",
    bio: "Runs the website, the brand, and the business side. Phil brings the design eye, the tech backbone, and the strategy that keeps EGN moving forward.",
    image: "/images/about/fait_la_force-cart-portrait.service-phil-01.webp",
    imageAlt: "Portrait of Phil Bartko at the El Gato Negro cart during a Fait La Force event",
  },
];

const approach = [
  {
    eyebrow: "We Come To You",
    title: "Mobile First",
    description:
      "We come to you. Weddings, conventions, pop-ups, corporate events — wherever people gather, we set up and serve specialty espresso on site.",
  },
  {
    eyebrow: "No Shortcuts",
    title: "Specialty Coffee",
    description:
      "No drip machines. No shortcuts. Every drink is pulled, poured, and made to order by someone who knows what they are doing and cares about the result.",
  },
  {
    eyebrow: "Beyond the Cup",
    title: "Event Service",
    description:
      "We do not just show up with a cart. We work with organizers to match the energy, the branding, and the flow of the event. Coffee is the product. Experience is the point.",
  },
  {
    eyebrow: "Nashville Built Us",
    title: "Community Roots",
    description:
      "Nashville built us. We show up for local events, support the community, and keep the relationships that matter close. This is not a franchise play. This is home.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      {/* ── 1. Hero — Full-viewport image + massive type ──────────────── */}
      <HeroImageFrame
        src="/images/about/crew_in_front_of_cart_exchange-260110.webp"
        alt="El Gato Negro crew in front of the coffee cart"
        minHeight="100svh"
        bleedTop
      >
        <div className="absolute inset-0 z-10 flex flex-col justify-end max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-orange mb-4">
            About EGN
          </p>
          <h1
            className="font-display font-bold uppercase text-brand-grey tracking-tight leading-[0.9]"
            style={{ fontSize: "var(--text-hero)" }}
          >
            Not Your
            <br />
            Average
            <br />
            Coffee
            <br />
            Cart.
          </h1>
          <p className="font-sans text-lg md:text-xl text-brand-grey/70 max-w-md leading-relaxed mt-6">
            Bold espresso. Bolder energy. We bring specialty coffee to the
            events, communities, and moments that matter most.
          </p>
        </div>
      </HeroImageFrame>

      {/* ── 2. Story — Magazine spread ─────────────────────────────────── */}
      <section className="relative bg-brand-black overflow-hidden grain-overlay-dark">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-28">
          {/* Mobile-only heading above grid */}
          <div className="md:hidden mb-8">
            <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-green mb-4">
              Our Story
            </p>
            <h2 className="font-display font-bold text-3xl uppercase text-brand-grey tracking-tight leading-[0.9]">
              How It
              <br />
              Started
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12 items-center">
            {/* Left column — text + inset image */}
            <div className="md:col-span-5 order-2 md:order-1">
              {/* Desktop heading */}
              <div className="hidden md:block mb-10">
                <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-green mb-4">
                  Our Story
                </p>
                <h2 className="font-display font-bold text-4xl lg:text-5xl xl:text-6xl uppercase text-brand-grey tracking-tight leading-[0.9]">
                  How It
                  <br />
                  Started
                </h2>
              </div>

              {/* Body text with orange left border */}
              <div className="border-l-2 border-brand-orange pl-5 md:pl-6 space-y-5 mb-10 md:mb-12">
                <p className="font-sans text-sm md:text-base leading-relaxed text-brand-grey/70">
                  El Gato Negro started the way most good things do — two guys
                  who were tired of seeing the same watered-down coffee at every
                  event in town. No personality. No craft. Just brown liquid in a
                  styrofoam cup and a line of people who deserved better.
                </p>
                <p className="font-sans text-sm md:text-base leading-relaxed text-brand-grey/70">
                  So we built a cart. Then we built another one. We showed up at
                  pop-ups, weddings, brand activations, and conventions — anywhere
                  people gathered and needed something real in their hands. Not
                  just a drink. An experience that matched the energy of whatever
                  was happening around it.
                </p>
                <p className="font-sans text-sm md:text-base leading-relaxed text-brand-grey/70">
                  EGN is Nashville through and through. The name, the look, the
                  attitude — it all comes from here. We pull from skate culture,
                  Mexican cowboy roots, and a deep belief that coffee should hit
                  different when it is made by people who actually care.
                </p>
              </div>

              {/* Inset image — hidden on tablet, visible on mobile + desktop */}
              <div className="block md:hidden lg:block relative aspect-[4/3] overflow-hidden rounded-sm grain-overlay-sm">
                <Image
                  src="/images/about/the_exchange-bts.cart-portrait-moongoat.juan-01.webp"
                  alt="Juan working the El Gato Negro cart during a Moon Goat collaboration"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover photo-treatment-sm"
                />
              </div>
            </div>

            {/* Right column — dominant tall image */}
            <div className="md:col-span-7 order-1 md:order-2">
              <div className="relative aspect-[3/4] md:aspect-[3/5] overflow-hidden rounded-sm grain-overlay-sm">
                <Image
                  src="/images/about/misc-bts.cart.founding.build-misc-none-12.webp"
                  alt="Behind-the-scenes shot of the original El Gato Negro cart being built"
                  fill
                  sizes="(max-width: 768px) 100vw, 58vw"
                  className="object-cover photo-treatment"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Hellcat Logo Breakdown ──────────────────────────────────── */}
      <section className="relative bg-brand-yellow overflow-hidden grain-overlay">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-black/60 mb-12 md:mb-16">
            The Mark
          </p>

          {/* Hellcat logo — large, centered */}
          <div className="flex justify-center mb-16 md:mb-24">
            <img
              src="/brand/hellcat-color.svg"
              alt="El Gato Negro Hellcat logo"
              className="w-full max-w-xs md:max-w-md"
            />
          </div>

          {/* Two-column: explanation + pull quote */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-brand-black tracking-tight mb-6">
                The Hellcat
              </h2>
              <div className="space-y-4 font-sans text-base leading-relaxed text-brand-black/70 max-w-lg">
                <p>
                  Born from 1980s skate graphics and the grit of Mexican cowboy
                  culture. The hellcat is not a mascot — it is an attitude. It
                  shows up on the cart, on the cups, on the merch. It is the mark
                  that tells you this is not your average coffee experience.
                </p>
                <p>
                  The name El Gato Negro — the black cat — carries superstition,
                  rebellion, and a refusal to play it safe. That energy is baked
                  into every detail of the brand.
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="font-accent text-2xl md:text-3xl text-brand-black leading-snug -rotate-2">
                &ldquo;Skate culture. Mexican cowboy roots. A black cat with an
                attitude problem.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Meet the Team — Editorial cards ─────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-20 md:py-28">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-green mb-3">
            The People
          </p>
          <h2 className="font-display font-bold text-5xl md:text-7xl uppercase text-brand-black tracking-tight leading-[0.9] mb-14 md:mb-20">
            Meet the Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
            {team.map((member) => (
              <div key={member.name}>
                {/* Team photo */}
                <div className="relative aspect-[3/4] overflow-hidden grain-overlay-sm rounded-sm">
                  <Image
                    src={member.image}
                    alt={member.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover photo-treatment"
                  />
                </div>

                <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-green mt-6 mb-2">
                  {member.role}
                </p>
                <h3 className="font-display font-bold text-4xl md:text-5xl uppercase text-brand-black tracking-tight mb-4">
                  {member.name}
                </h3>
                <p className="font-sans text-base md:text-lg leading-relaxed text-brand-black/70 max-w-md border-l-2 border-brand-orange pl-6">
                  {member.bio}
                </p>
                <p className="font-accent text-lg text-brand-orange mt-4">
                  — {member.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Our Approach — Stacked editorial strips ─────────────────── */}
      <section className="relative bg-brand-black overflow-hidden grain-overlay-dark">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-yellow mb-3">
            What Drives Us
          </p>
          <h2 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl uppercase text-brand-grey tracking-tight leading-[0.9] mb-14 md:mb-20">
            Our Approach
          </h2>

          <div>
            {approach.map((item, i) => (
              <div
                key={item.title}
                className={[
                  "relative overflow-hidden py-7 md:py-9 border-b border-dashed border-brand-grey/10",
                  i === 0
                    ? "border-t border-dashed border-brand-grey/10"
                    : "",
                ].join(" ")}
              >
                {/* Faded index number */}
                <span
                  className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6 font-display font-bold text-[15vw] md:text-[10vw] lg:text-[8vw] leading-none text-brand-grey/[0.04] select-none pointer-events-none tabular-nums text-left"
                  style={{ width: "2ch" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* Content */}
                <div className="relative z-10">
                  <p className="font-sans font-extrabold text-[10px] md:text-xs uppercase tracking-[0.2em] text-brand-green mb-3">
                    {item.eyebrow}
                  </p>
                  <h3 className="font-display font-bold text-2xl md:text-3xl uppercase text-brand-grey tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-brand-grey/60 max-w-xl">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CTA — Flat orange with grain ────────────────────────────── */}
      <section className="bg-brand-orange grain-overlay">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28 lg:py-32">
          <p className="font-sans font-extrabold text-[10px] md:text-xs uppercase tracking-[0.2em] text-brand-black/60 mb-4 md:mb-6">
            Like What You See?
          </p>
          <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl uppercase text-brand-black tracking-tight leading-[0.95] max-w-3xl mb-10 md:mb-12">
            Let&apos;s bring the cart to your event.
          </h2>
          <Link
            href="/inquiry"
            className="group inline-flex items-center gap-3 bg-brand-black text-brand-grey font-display font-bold uppercase tracking-[0.1em] text-sm px-8 py-4 md:px-10 md:py-5 rounded-sm hover:bg-brand-orange transition-colors duration-300"
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
