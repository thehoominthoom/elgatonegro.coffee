import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const services = [
  {
    eyebrow: "Private Events",
    label: "Weddings & Celebrations",
    description:
      "Full-service espresso bar for your ceremony, reception, or rehearsal dinner.",
    href: "/services/weddings",
    accent: "brand-orange",
  },
  {
    eyebrow: "Professional",
    label: "Corporate & Office",
    description:
      "Pop-up coffee service for team meetings, company retreats, and office perks.",
    href: "/services/corporate",
    accent: "brand-orange",
  },
  {
    eyebrow: "Large Scale",
    label: "Conventions & Production",
    description:
      "High-volume service for trade floors, film sets, and convention halls.",
    href: "/services/conventions",
    accent: "brand-orange",
  },
];

const products = [
  {
    name: "El Gato Negro Tee",
    category: "Merch",
    price: "$35",
    img: "https://placehold.co/400x500/2A201D/FAF5F4",
    href: "/shop/product/egn-tee",
  },
  {
    name: "House Blend — 12oz",
    category: "Coffee",
    price: "$22",
    img: "https://placehold.co/400x500/B43620/FAF5F4",
    href: "/shop/product/house-blend",
  },
  {
    name: "Cart Build Guide",
    category: "Digital",
    price: "$49",
    img: "https://placehold.co/400x500/7B6838/FAF5F4",
    href: "/shop/product/cart-build-guide",
  },
];

const marqueeItems = [
  "WEDDINGS",
  "CORPORATE",
  "CONVENTIONS",
  "PRODUCTION SETS",
  "APARTMENT POP-UPS",
  "PARTNERSHIPS",
  "WEDDINGS",
  "CORPORATE",
  "CONVENTIONS",
  "PRODUCTION SETS",
  "APARTMENT POP-UPS",
  "PARTNERSHIPS",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] bg-brand-black grain-overlay flex flex-col justify-end pb-16 md:pb-24 overflow-hidden">
        {/* Background image placeholder */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("https://placehold.co/1440x900/2A201D/B43620")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Radial gradient vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#B4362015_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
          {/* Eyebrow */}
          <p className="font-display text-xs uppercase tracking-[0.3em] text-brand-yellow mb-6">
            Mobile Espresso · Est. 2019
          </p>

          {/* Headline */}
          <h1 className="font-display font-bold text-brand-grey leading-none uppercase tracking-tight mb-8">
            <span className="block text-[clamp(3rem,10vw,8rem)]">El Gato</span>
            <span className="block text-[clamp(3rem,10vw,8rem)] text-brand-orange -mt-2">
              Negro.
            </span>
          </h1>

          {/* Subline + CTA */}
          <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
            <p className="max-w-md text-brand-grey/70 text-lg leading-relaxed font-sans">
              Craft espresso for weddings, corporate events, conventions, and
              production sets. We bring the bar to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/inquiry"
                className="group inline-flex items-center gap-2 bg-brand-orange text-brand-grey font-display font-bold uppercase tracking-[0.1em] text-sm px-7 py-4 border-2 border-brand-orange hover:bg-transparent hover:text-brand-orange transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow active:scale-[0.98]"
              >
                Book Your Event
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-transparent text-brand-grey font-display font-bold uppercase tracking-[0.1em] text-sm px-7 py-4 border-2 border-brand-grey/30 hover:border-brand-grey transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow active:scale-[0.98]"
              >
                View Menu
              </Link>
            </div>
          </div>
        </div>

        {/* Corner stamp */}
        <div className="absolute top-8 right-6 md:top-12 md:right-12 rotate-12 opacity-60">
          <div className="border-2 border-brand-orange/60 px-4 py-2">
            <p className="font-display text-[10px] uppercase tracking-[0.25em] text-brand-orange">
              Nashville, TN
            </p>
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────────────────── */}
      <div className="bg-brand-orange border-y-2 border-brand-black overflow-hidden py-3">
        <div
          className="flex gap-8 w-max"
          style={{
            animation: "marquee 28s linear infinite",
          }}
        >
          {marqueeItems.map((item, i) => (
            <span
              key={i}
              className="font-display text-sm font-bold uppercase tracking-[0.25em] text-brand-grey whitespace-nowrap"
            >
              {item}
              <span className="mx-8 text-brand-black/30">·</span>
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section className="bg-brand-grey py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Section header */}
          <div className="flex items-end justify-between mb-12 border-b-2 border-brand-black pb-6">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.3em] text-brand-green mb-2">
                What We Do
              </p>
              <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-brand-black tracking-tight">
                Book the Cart
              </h2>
            </div>
            <Link
              href="/services"
              className="hidden md:inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.2em] text-brand-black hover:text-brand-orange transition-colors"
            >
              All Services <ArrowRight size={14} />
            </Link>
          </div>

          {/* Service cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-brand-black">
            {services.map((service, i) => (
              <Link
                key={service.href}
                href={service.href}
                className={`group block p-8 md:p-10 border-brand-black hover:bg-brand-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange ${
                  i < services.length - 1 ? "border-b-2 md:border-b-0 md:border-r-2" : ""
                }`}
              >
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-brand-green group-hover:text-brand-yellow transition-colors mb-4">
                  {service.eyebrow}
                </p>
                <h3 className="font-display font-bold text-2xl uppercase text-brand-black group-hover:text-brand-grey tracking-tight mb-4 transition-colors">
                  {service.label}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-brand-black/60 group-hover:text-brand-grey/60 transition-colors mb-6">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.2em] text-brand-orange group-hover:text-brand-yellow transition-colors">
                  Get a Quote <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>

          <Link
            href="/services"
            className="md:hidden mt-6 inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.2em] text-brand-black hover:text-brand-orange transition-colors"
          >
            All Services <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Shop Preview ─────────────────────────────────────────────────── */}
      <section className="bg-brand-black grain-overlay py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          {/* Section header */}
          <div className="flex items-end justify-between mb-12 border-b-2 border-brand-grey/20 pb-6">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.3em] text-brand-yellow mb-2">
                The Store
              </p>
              <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-brand-grey tracking-tight">
                Shop EGN
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.2em] text-brand-grey/60 hover:text-brand-yellow transition-colors"
            >
              Full Shop <ArrowRight size={14} />
            </Link>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-brand-grey/10">
            {products.map((product) => (
              <Link
                key={product.href}
                href={product.href}
                className="group block bg-brand-black p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange"
              >
                {/* Product image */}
                <div className="relative overflow-hidden aspect-[4/5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent" />
                  {/* Category tag */}
                  <span className="absolute top-4 left-4 font-display text-[10px] uppercase tracking-[0.25em] bg-brand-orange text-brand-grey px-2 py-1">
                    {product.category}
                  </span>
                </div>

                {/* Product info */}
                <div className="p-5 border border-brand-grey/10 group-hover:border-brand-orange/40 transition-colors">
                  <h3 className="font-display font-bold uppercase tracking-tight text-brand-grey text-lg leading-tight mb-1">
                    {product.name}
                  </h3>
                  <p className="font-display text-brand-yellow font-bold text-base">
                    {product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/shop"
            className="md:hidden mt-6 inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.2em] text-brand-grey/60 hover:text-brand-yellow transition-colors"
          >
            Full Shop <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Resource Hub ─────────────────────────────────────────────────── */}
      <section className="bg-brand-grey border-t-2 border-brand-black py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
            {/* Left — heading */}
            <div>
              <p className="font-display text-xs uppercase tracking-[0.3em] text-brand-green mb-4">
                For Coffee Cart Operators
              </p>
              <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-brand-black tracking-tight leading-none mb-6">
                Built This.
                <br />
                <span className="text-brand-orange">You Can Too.</span>
              </h2>
              <p className="font-sans text-brand-black/60 leading-relaxed mb-8 max-w-sm">
                Guides, gear lists, build walkthroughs, and real talk about
                running a mobile coffee business — from someone who&apos;s doing it.
              </p>
              <Link
                href="/resources"
                className="group inline-flex items-center gap-2 bg-brand-black text-brand-grey font-display font-bold uppercase tracking-[0.1em] text-sm px-7 py-4 border-2 border-brand-black hover:bg-transparent hover:text-brand-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange active:scale-[0.98]"
              >
                Explore Resources
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Right — resource list */}
            <div className="flex flex-col border-t-2 border-brand-black">
              {[
                { category: "Guide", label: "How to start a coffee cart business in 2025" },
                { category: "Build", label: "Building your first mobile espresso setup" },
                { category: "Gear", label: "What equipment do you actually need?" },
                { category: "Business", label: "Pricing your services without underselling" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href="/resources"
                  className="group flex items-start gap-5 py-5 border-b-2 border-brand-black/10 hover:border-brand-black transition-colors"
                >
                  <span className="font-display text-[10px] uppercase tracking-[0.25em] text-brand-green mt-1 w-16 shrink-0">
                    {item.category}
                  </span>
                  <span className="font-display font-bold uppercase text-brand-black group-hover:text-brand-orange transition-colors leading-tight text-base">
                    {item.label}
                  </span>
                  <ArrowRight
                    size={14}
                    className="ml-auto shrink-0 mt-1 text-brand-black/20 group-hover:text-brand-orange transition-colors"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="bg-brand-orange py-16 md:py-20 border-t-2 border-brand-black">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-brand-black/50 mb-2">
              Ready to Book?
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
